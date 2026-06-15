from typing import List, Dict, Any
from rank_bm25 import BM25Okapi
import numpy as np
import os
from src.embedder import LegalTextEmbedder
from src.vector_db import LegalVectorStore

class LegalHybridSearch:
    """
    Implements Hybrid Search (BM25 lexical search + vector semantic search)
    with reranking functionality using Cohere or FlashRank.
    """
    
    def __init__(self, vector_store: LegalVectorStore, embedder: LegalTextEmbedder):
        self.vector_store = vector_store
        self.embedder = embedder
        self.bm25 = None
        self.corpus_chunks = []

    def fit_bm25(self, chunks: List[Dict[str, Any]]):
        """
        Initializes the BM25 lexical index with text chunks.
        """
        self.corpus_chunks = chunks
        tokenized_corpus = [doc["text"].lower().split(" ") for doc in chunks]
        self.bm25 = BM25Okapi(tokenized_corpus)
        print(f"BM25 index fitted with {len(chunks)} chunks.")

    def keyword_search(self, query: str, top_n: int = 10) -> List[Dict[str, Any]]:
        """
        Runs BM25 lexical keyword matching.
        """
        if not self.bm25 or not self.corpus_chunks:
            print("BM25 index is not fitted.")
            return []
            
        tokenized_query = query.lower().split(" ")
        scores = self.bm25.get_scores(tokenized_query)
        top_indices = np.argsort(scores)[::-1][:top_n]
        
        results = []
        for idx in top_indices:
            if scores[idx] > 0:
                results.append({
                    **self.corpus_chunks[idx],
                    "bm25_score": float(scores[idx]),
                    "search_type": "lexical"
                })
        return results

    def hybrid_search(self, query: str, n_results: int = 5, weights: tuple = (0.5, 0.5)) -> List[Dict[str, Any]]:
        """
        Combines results from BM25 lexical search and Vector store search using Reciprocal Rank Fusion (RRF).
        """
        # 1. Lexical Search
        lexical_results = self.keyword_search(query, top_n=n_results * 3)
        
        # 2. Semantic Search
        query_emb = self.embedder.get_query_embedding(query)
        semantic_results = self.vector_store.query(query_emb, n_results=n_results * 3)
        
        # 3. Reciprocal Rank Fusion (RRF) scoring
        rrf_scores = {}
        rrf_constant = 60  # Standard hyperparameter
        
        for rank, doc in enumerate(lexical_results):
            cid = doc["chunk_id"]
            rrf_scores[cid] = rrf_scores.get(cid, 0.0) + weights[0] * (1.0 / (rank + rrf_constant))
            
        for rank, doc in enumerate(semantic_results):
            cid = doc["chunk_id"]
            rrf_scores[cid] = rrf_scores.get(cid, 0.0) + weights[1] * (1.0 / (rank + rrf_constant))
            
        # Compile unique documents with RRF scores
        all_docs = {doc["chunk_id"]: doc for doc in lexical_results + semantic_results}
        sorted_cids = sorted(rrf_scores.keys(), key=lambda x: rrf_scores[x], reverse=True)[:n_results]
        
        final_results = []
        for cid in sorted_cids:
            doc = all_docs[cid]
            doc["rrf_score"] = rrf_scores[cid]
            final_results.append(doc)
            
        return final_results

    def rerank_nvidia(self, query: str, results: List[Dict[str, Any]], api_key: str, top_n: int = 3) -> List[Dict[str, Any]]:
        """
        Reranks retrieved document chunks using NVIDIA NIM API (e.g. nv-embed-qa-4).
        """
        import requests
        
        url = "https://integrate.api.nvidia.com/v1/retrieval/nvidia/reranking-nv-embed-qa-4"
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "nvidia/reranking-nv-embed-qa-4",
            "query": { "text": query },
            "passages": [{ "text": doc["text"] } for doc in results]
        }
        
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        data = response.json()
        
        rankings = data.get("rankings", [])
        # Sort by logit score descending
        sorted_rankings = sorted(rankings, key=lambda x: x.get("logit", -9999.0), reverse=True)[:top_n]
        
        reranked_results = []
        for r in sorted_rankings:
            original_idx = r["index"]
            original_doc = results[original_idx]
            original_doc["rerank_score"] = float(r.get("logit", 0.0))
            reranked_results.append(original_doc)
            
        return reranked_results

    def rerank_results(self, query: str, results: List[Dict[str, Any]], top_n: int = 3) -> List[Dict[str, Any]]:
        """
        Reranks retrieved document chunks using NVIDIA NIM or Cohere client based on configured key.
        Falls back to Cohere if NVIDIA fails, and then to default order.
        """
        nvidia_api_key = os.getenv("NVIDIA_API_KEY")
        cohere_api_key = os.getenv("COHERE_API_KEY")
        
        # 1. Try NVIDIA Rerank first if configured
        if nvidia_api_key and nvidia_api_key != "your_nvidia_api_key_here":
            print("Running Rerank using NVIDIA NIM (nv-embed-qa-4)...")
            try:
                return self.rerank_nvidia(query, results, nvidia_api_key, top_n)
            except Exception as e:
                print(f"NVIDIA Reranking failed: {e}. Trying Cohere fallback...")
            
        # 2. Try Cohere Rerank if configured
        if cohere_api_key and cohere_api_key != "your_cohere_api_key_here":
            print("Running Rerank using Cohere Rerank client...")
            try:
                import cohere
                co = cohere.Client(cohere_api_key)
                
                documents = [doc["text"] for doc in results]
                rerank_response = co.rerank(
                    query=query,
                    documents=documents,
                    top_n=top_n,
                    model="rerank-english-v3.0" # Use v3.0 which is active
                )
                
                reranked_results = []
                for hit in rerank_response.results:
                    original_doc = results[hit.index]
                    original_doc["rerank_score"] = float(hit.relevance_score)
                    reranked_results.append(original_doc)
                    
                return reranked_results
                
            except Exception as e:
                print(f"Cohere Reranking failed: {e}. Falling back to default order.")
                
        print("No successful Rerank provider. Returning raw hybrid search matches.")
        return results[:top_n]

if __name__ == "__main__":
    print("LegalHybridSearch loaded successfully.")
