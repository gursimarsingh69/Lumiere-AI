import os
from typing import List, Dict, Any, Tuple
import chromadb
from chromadb.config import Settings

class LegalVectorStore:
    """
    Manages vector databases (ChromaDB and FAISS indices) for storing and querying legal clauses.
    """
    
    def __init__(self, db_type: str = "chroma", persist_directory: str = "./chroma_db"):
        self.db_type = db_type.lower()
        self.persist_directory = persist_directory
        
        if self.db_type == "chroma":
            os.makedirs(persist_directory, exist_ok=True)
            self.client = chromadb.PersistentClient(path=persist_directory)
            self.collection = self.client.get_or_create_collection(
                name="legal_clauses",
                metadata={"hnsw:space": "cosine"}
            )
        elif self.db_type == "faiss":
            self.index = None
            self.metadata_store = {}
            print("FAISS index initialized. Run add_documents to populate.")

    def add_documents(self, documents: List[Dict[str, Any]], embeddings: List[List[float]]):
        """
        Adds text chunks, embeddings, and metadata into the vector store.
        """
        if not documents or not embeddings:
            return
            
        if self.db_type == "chroma":
            ids = [doc["chunk_id"] for doc in documents]
            texts = [doc["text"] for doc in documents]
            # Convert nested metadata dicts to flat key-value pairs for ChromaDB support
            metadatas = []
            for doc in documents:
                flat_meta = {}
                for k, v in doc["metadata"].items():
                    if isinstance(v, (str, int, float, bool)):
                        flat_meta[k] = v
                metadatas.append(flat_meta)
                
            self.collection.add(
                ids=ids,
                embeddings=embeddings,
                documents=texts,
                metadatas=metadatas
            )
            print(f"Added {len(documents)} chunks to ChromaDB.")
            
        elif self.db_type == "faiss":
            import faiss
            import numpy as np
            
            embeddings_np = np.array(embeddings).astype("float32")
            dimension = embeddings_np.shape[1]
            
            if self.index is None:
                # L2 distance or Inner Product for cosine similarity
                self.index = faiss.IndexFlatIP(dimension)
                
            self.index.add(embeddings_np)
            
            # Store metadata locally mapping index position to document details
            start_pos = len(self.metadata_store)
            for idx, doc in enumerate(documents):
                self.metadata_store[start_pos + idx] = doc
            print(f"Added {len(documents)} chunks to FAISS index.")

    def query(self, query_embedding: List[float], n_results: int = 5, filters: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        """
        Retrieves the top N closest document chunks matching the query embedding.
        """
        results_list = []
        
        if self.db_type == "chroma":
            # Apply ChromaDB metadata filters if provided
            where_clause = {}
            if filters:
                # Simple filter matching (e.g. {"document_name": "Mutual NDA.pdf"})
                where_clause = {k: v for k, v in filters.items() if isinstance(v, (str, int, float, bool))}
                
            results = self.collection.query(
                query_embeddings=[query_embedding],
                n_results=n_results,
                where=where_clause if where_clause else None
            )
            
            if results and results["documents"]:
                for idx in range(len(results["documents"][0])):
                    results_list.append({
                        "chunk_id": results["ids"][0][idx],
                        "text": results["documents"][0][idx],
                        "metadata": results["metadatas"][0][idx],
                        "distance": results["distances"][0][idx] if results["distances"] else None
                    })
                    
        elif self.db_type == "faiss":
            import faiss
            import numpy as np
            
            if self.index is None:
                print("FAISS index is empty. Cannot query.")
                return []
                
            query_np = np.array([query_embedding]).astype("float32")
            distances, indices = self.index.search(query_np, n_results)
            
            for idx, position in enumerate(indices[0]):
                if position != -1 and position in self.metadata_store:
                    doc = self.metadata_store[position]
                    # Filter matching for FAISS (post-retrieval filtering)
                    match = True
                    if filters:
                        for k, v in filters.items():
                            if doc["metadata"].get(k) != v:
                                match = False
                                break
                    if match:
                        results_list.append({
                            **doc,
                            "distance": float(distances[0][idx])
                        })
                        
        return results_list

if __name__ == "__main__":
    store = LegalVectorStore()
    print("LegalVectorStore loaded successfully.")
