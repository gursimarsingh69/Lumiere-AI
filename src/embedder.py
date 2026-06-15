import os
from typing import List
from dotenv import load_dotenv

load_dotenv()

class LegalTextEmbedder:
    """
    Utility wrapper to generate embeddings using OpenAI or Cohere APIs.
    """
    
    def __init__(self, provider: str = "openai", model_name: str = None):
        self.provider = provider.lower()
        
        if self.provider == "openai":
            self.model_name = model_name or "text-embedding-3-small"
            self.api_key = os.getenv("OPENAI_API_KEY")
            if not self.api_key:
                print("[WARNING] OPENAI_API_KEY not found in environment variables.")
        elif self.provider == "cohere":
            self.model_name = model_name or "embed-english-v3.0"
            self.api_key = os.getenv("COHERE_API_KEY")
            if not self.api_key:
                print("[WARNING] COHERE_API_KEY not found in environment variables.")
        elif self.provider == "gemini":
            self.model_name = model_name or "models/text-embedding-004"
            self.api_key = os.getenv("GEMINI_API_KEY")
            if not self.api_key:
                print("[WARNING] GEMINI_API_KEY not found in environment variables.")
        else:
            raise ValueError(f"Unsupported provider: {provider}. Use 'openai', 'cohere', or 'gemini'.")

    def get_embeddings(self, texts: List[str]) -> List[List[float]]:
        """
        Generates vector embeddings for a list of input strings in batches.
        """
        if not texts:
            return []

        # Batching to avoid rate limits and request payload constraints
        batch_size = 32
        all_embeddings = []

        for i in range(0, len(texts), batch_size):
            batch_texts = texts[i:i + batch_size]
            
            if self.provider == "openai":
                from openai import OpenAI
                client = OpenAI(api_key=self.api_key)
                response = client.embeddings.create(
                    input=batch_texts,
                    model=self.model_name
                )
                all_embeddings.extend([data.embedding for data in response.data])
                
            elif self.provider == "cohere":
                import cohere
                co = cohere.Client(self.api_key)
                response = co.embed(
                    texts=batch_texts,
                    model=self.model_name,
                    input_type="search_document"
                )
                all_embeddings.extend([list(map(float, emb)) for emb in response.embeddings])
                
            elif self.provider == "gemini":
                import google.generativeai as genai
                genai.configure(api_key=self.api_key)
                response = genai.embed_content(
                    model=self.model_name,
                    content=batch_texts,
                    task_type="retrieval_document"
                )
                all_embeddings.extend(response['embedding'])
                
        return all_embeddings

    def get_query_embedding(self, query: str) -> List[float]:
        """
        Generates a vector embedding for a single user search query.
        """
        if self.provider == "cohere":
            import cohere
            co = cohere.Client(self.api_key)
            response = co.embed(
                texts=[query],
                model=self.model_name,
                input_type="search_query"
            )
            return list(map(float, response.embeddings[0]))
        elif self.provider == "gemini":
            import google.generativeai as genai
            genai.configure(api_key=self.api_key)
            response = genai.embed_content(
                model=self.model_name,
                content=query,
                task_type="retrieval_query"
            )
            return response['embedding']
        else:
            return self.get_embeddings([query])[0]

    def embed_and_store_chunks(self, chunks: List[dict], vector_store) -> None:
        """
        Embeds a list of chunks and stores them into the provided vector store.
        """
        if not chunks:
            print("No chunks provided to embed and store.")
            return

        print(f"Embedding {len(chunks)} chunks using provider: {self.provider} ({self.model_name})...")
        texts = [chunk["text"] for chunk in chunks]
        embeddings = self.get_embeddings(texts)
        
        print(f"Storing embedded chunks in {vector_store.db_type} database...")
        vector_store.add_documents(chunks, embeddings)
        print("Successfully embedded and stored all chunks!")

if __name__ == "__main__":
    import json
    from src.vector_db import LegalVectorStore
    
    # 1. Determine provider based on EMBEDDING_PROVIDER variable or available keys
    provider = os.getenv("EMBEDDING_PROVIDER", "").lower()
    if not provider:
        provider = "openai"
        if not os.getenv("OPENAI_API_KEY") and os.getenv("GEMINI_API_KEY"):
            provider = "gemini"
        elif not os.getenv("OPENAI_API_KEY") and os.getenv("COHERE_API_KEY"):
            provider = "cohere"
        
    print(f"Initializing embedding pipeline with provider: {provider}")
    embedder = LegalTextEmbedder(provider=provider)
    
    # 2. Initialize Chroma Vector DB
    vector_store = LegalVectorStore(db_type="chroma", persist_directory="./chroma_db")
    
    # 3. Read preprocessed contract chunks from data/processed
    processed_dir = os.path.join("data", "processed")
    if os.path.exists(processed_dir):
        json_files = [f for f in os.listdir(processed_dir) if f.endswith(".json")]
        all_chunks = []
        for jf in json_files:
            file_path = os.path.join(processed_dir, jf)
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    chunks = json.load(f)
                    all_chunks.extend(chunks)
                print(f"Loaded {len(chunks)} chunks from {jf}")
            except Exception as e:
                print(f"Error reading {file_path}: {e}")
                
        if all_chunks:
            embedder.embed_and_store_chunks(all_chunks, vector_store)
        else:
            print("No chunks found in data/processed/. Please run test_parser.py first.")
    else:
        print("data/processed/ directory does not exist. Please run test_parser.py first.")
