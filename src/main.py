import os
import json
import uuid
import tempfile
from typing import List, Optional
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

from src.embedder import LegalTextEmbedder
from src.vector_db import LegalVectorStore
from src.search import LegalHybridSearch
from src.agent import LegalDueDiligenceAgent

app = FastAPI(title="LumièreAI India API", description="FastAPI Backend for AI Legal Due Diligence")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow React frontend to communicate
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global instances
embedder = None
vector_store = None
hybrid_search = None
agent = None
supabase_client = None

@app.on_event("startup")
def startup_event():
    global embedder, vector_store, hybrid_search, agent, supabase_client
    provider = os.getenv("EMBEDDING_PROVIDER", "openai").lower()
    
    # Fallback checks if API keys are missing/incorrect
    if provider == "openai" and not os.getenv("OPENAI_API_KEY"):
        if os.getenv("GEMINI_API_KEY"):
            provider = "gemini"
        elif os.getenv("COHERE_API_KEY"):
            provider = "cohere"
            
    print(f"[Startup] Initializing embedding provider: {provider}")
    embedder = LegalTextEmbedder(provider=provider)
    vector_store = LegalVectorStore(db_type="chroma", persist_directory="./chroma_db")
    hybrid_search = LegalHybridSearch(vector_store=vector_store, embedder=embedder)
    agent = LegalDueDiligenceAgent()
    
    # Initialize Supabase client
    supabase_url = os.getenv("SUPABASE_URL") or os.getenv("NEXT_PUBLIC_SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_KEY") or os.getenv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY") or os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
    if supabase_url and supabase_key:
        try:
            from supabase import create_client
            supabase_client = create_client(supabase_url, supabase_key)
            print(f"[Startup] Supabase client initialized: {supabase_url}")
        except Exception as e:
            print(f"[Startup] Supabase initialization failed: {e}")
    else:
        print("[Startup] Supabase credentials not found. Chat history will not persist.")
    
    # Pre-load all preprocessed chunks into BM25 index
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
            except Exception as e:
                print(f"[Startup] Error reading {file_path}: {e}")
        
        if all_chunks:
            hybrid_search.fit_bm25(all_chunks)
            print(f"[Startup] Fitted BM25 index with {len(all_chunks)} chunks.")
        else:
            print("[Startup] No processed chunks found to fit BM25.")
    else:
        print("[Startup] Processed chunks directory does not exist.")


# ─── Pydantic Models ───────────────────────────────────────────────

class QueryRequest(BaseModel):
    query: str
    session_id: Optional[str] = None

class QueryResponse(BaseModel):
    answer: str
    steps: List[str]
    retrieved_chunks: List[dict]
    session_id: Optional[str] = None

class AuditRequest(BaseModel):
    document_paths: Optional[List[str]] = None

class SessionCreate(BaseModel):
    title: str


# ─── Supabase Helper Functions ─────────────────────────────────────

def get_session_history(session_id: str, limit: int = 20) -> list:
    """Fetch last N messages from a session for LLM context."""
    if not supabase_client:
        return []
    try:
        result = supabase_client.table("chat_messages") \
            .select("role, content") \
            .eq("session_id", session_id) \
            .order("created_at", desc=False) \
            .limit(limit) \
            .execute()
        return result.data or []
    except Exception as e:
        print(f"[Supabase] Error fetching session history: {e}")
        return []


def save_message(session_id: str, role: str, content: str, steps: list = None):
    """Save a message to Supabase chat_messages table."""
    if not supabase_client:
        return
    try:
        supabase_client.table("chat_messages").insert({
            "session_id": session_id,
            "role": role,
            "content": content,
            "steps": json.dumps(steps or [])
        }).execute()
    except Exception as e:
        print(f"[Supabase] Error saving message: {e}")


# ─── Session Endpoints ─────────────────────────────────────────────

@app.post("/api/sessions")
def create_session(request: SessionCreate):
    """Create a new chat session and return its ID."""
    if not supabase_client:
        raise HTTPException(status_code=503, detail="Supabase not configured")
    try:
        result = supabase_client.table("chat_sessions").insert({
            "title": request.title
        }).execute()
        return result.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/sessions")
def list_sessions():
    """List all chat sessions, newest first."""
    if not supabase_client:
        return []
    try:
        result = supabase_client.table("chat_sessions") \
            .select("*") \
            .order("created_at", desc=True) \
            .execute()
        return result.data or []
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/sessions/{session_id}")
def get_session_messages(session_id: str):
    """Get all messages for a specific session."""
    if not supabase_client:
        return []
    try:
        result = supabase_client.table("chat_messages") \
            .select("*") \
            .eq("session_id", session_id) \
            .order("created_at", desc=False) \
            .execute()
        return result.data or []
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/api/sessions/{session_id}")
def delete_session(session_id: str):
    """Delete a session and all its messages (cascade)."""
    if not supabase_client:
        raise HTTPException(status_code=503, detail="Supabase not configured")
    try:
        supabase_client.table("chat_sessions") \
            .delete() \
            .eq("id", session_id) \
            .execute()
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─── Document Upload Endpoint ──────────────────────────────────────

@app.post("/api/upload")
async def upload_document(file: UploadFile = File(...)):
    """
    Upload a PDF to Supabase Storage, save metadata to DB,
    parse it with PyMuPDF, chunk it, and index into ChromaDB.
    """
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted")
    
    file_bytes = await file.read()
    storage_path = f"uploads/{uuid.uuid4().hex}_{file.filename}"

    # 1. Upload to Supabase Storage (if available)
    doc_url = ""
    if supabase_client:
        try:
            supabase_client.storage.from_("documents").upload(
                storage_path, file_bytes,
                file_options={"content-type": "application/pdf"}
            )
            doc_url = supabase_client.storage.from_("documents").get_public_url(storage_path)
        except Exception as e:
            print(f"[Upload] Supabase storage error: {e}")
            doc_url = ""

    # 2. Save to local data/raw for processing
    raw_dir = os.path.join("data", "raw")
    os.makedirs(raw_dir, exist_ok=True)
    local_path = os.path.join(raw_dir, file.filename)
    with open(local_path, "wb") as f:
        f.write(file_bytes)

    # 3. Parse and chunk the PDF
    from src.parser import LegalDocumentParser
    parser = LegalDocumentParser()
    try:
        pages = parser.parse_pdf(local_path)
        chunks = parser.chunk_document(pages)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF parsing failed: {e}")

    # 4. Embed and index into ChromaDB
    if embedder and vector_store:
        try:
            embedder.embed_and_store_chunks(chunks, vector_store)
            
            # Re-fit BM25 with new chunks included
            if hybrid_search:
                processed_dir = os.path.join("data", "processed")
                os.makedirs(processed_dir, exist_ok=True)
                
                # Save processed chunks as JSON
                processed_path = os.path.join(processed_dir, f"{file.filename}.json")
                with open(processed_path, "w", encoding="utf-8") as pf:
                    json.dump(chunks, pf, ensure_ascii=False)
                
                # Reload ALL processed chunks for BM25
                all_chunks = []
                for jf in os.listdir(processed_dir):
                    if jf.endswith(".json"):
                        with open(os.path.join(processed_dir, jf), "r", encoding="utf-8") as rf:
                            all_chunks.extend(json.load(rf))
                hybrid_search.fit_bm25(all_chunks)
            
            print(f"[Upload] Indexed {len(chunks)} chunks from {file.filename}")
        except Exception as e:
            print(f"[Upload] Embedding/indexing error: {e}")

    # 5. Save document metadata to Supabase DB
    doc_record = None
    if supabase_client:
        try:
            result = supabase_client.table("documents").insert({
                "name": file.filename,
                "storage_path": storage_path,
                "url": doc_url or ""
            }).execute()
            doc_record = result.data[0] if result.data else None
        except Exception as e:
            print(f"[Upload] DB metadata save error: {e}")

    return {
        "success": True,
        "filename": file.filename,
        "chunks_indexed": len(chunks),
        "storage_url": doc_url,
        "document": doc_record
    }


@app.get("/api/documents")
def list_documents():
    """List all uploaded documents from Supabase."""
    if not supabase_client:
        return []
    try:
        result = supabase_client.table("documents") \
            .select("*") \
            .order("created_at", desc=True) \
            .execute()
        return result.data or []
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─── LLM Synthesis with Conversational Memory ─────────────────────

def call_llm_for_synthesis(query: str, retrieved_chunks: list, provider: str, chat_history: list = None) -> tuple:
    """
    Formulates context from retrieved chunks and invokes LLM (Gemini, Cohere, or OpenAI)
    for due diligence synthesis. Returns (answer_text, trace_step_name).
    """
    context = ""
    for idx, c in enumerate(retrieved_chunks):
        doc_name = c.get("metadata", {}).get("document_name", "Unknown Contract")
        page_num = c.get("metadata", {}).get("page_number", "?")
        context += f"--- Source {idx+1}: {doc_name} (Page {page_num}) ---\n{c['text']}\n\n"

    # Build conversation history block
    history_block = ""
    if chat_history:
        history_block = "Previous Conversation:\n"
        for msg in chat_history[-10:]:  # Last 10 messages for context window
            role = msg.get("role", "user").capitalize()
            content = msg.get("content", "")
            history_block += f"{role}: {content}\n"
        history_block += "\n"

    prompt = f"""You are LumièreAI India, a state-of-the-art AI due diligence copilot for Indian startup founders and corporate counsel.
Your task is to answer the user's due diligence question based strictly on the contract text snippets provided.

Guidelines:
1. Provide a direct, professional, and clear answer.
2. Rely only on facts mentioned in the context. Do not make up facts.
3. Reference specific documents and page numbers where applicable.
4. Keep the response concise, formatted with clear paragraphs or bullet points.
5. If the user's question references previous conversation, use the conversation history to understand context.

{history_block}Context Snippets:
{context}

Question: {query}
Answer:"""

    try:
        if provider == "gemini" and os.getenv("GEMINI_API_KEY"):
            import google.generativeai as genai
            genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
            model = genai.GenerativeModel("gemini-1.5-flash")
            response = model.generate_content(prompt)
            return response.text, "Gemini 1.5 Flash synthesis"
            
        elif provider == "cohere" and os.getenv("COHERE_API_KEY"):
            import cohere
            co = cohere.Client(os.getenv("COHERE_API_KEY"))
            response = co.chat(
                message=prompt,
                model="command-r-plus-08-2024"
            )
            return response.text, "Cohere Command R+ synthesis"
            
        elif provider == "openai" and os.getenv("OPENAI_API_KEY"):
            from openai import OpenAI
            client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.2
            )
            return response.choices[0].message.content, "OpenAI GPT-4o-mini synthesis"
    except Exception as e:
        print(f"[LLM Error] Failed synthesis via {provider}: {e}")
        
    fallback_text = (
        "🔍 Retrieval matches found! Here is the relevant snippet from the deal documents:\n\n"
        f"{retrieved_chunks[0]['text'] if retrieved_chunks else 'No relevant text found.'}"
    )
    return fallback_text, "Retrieval Snippet (LLM offline/failed)"


# ─── RAG Query Endpoint (with session memory) ─────────────────────

@app.post("/api/query", response_model=QueryResponse)
def query_rag(request: QueryRequest):
    if not hybrid_search:
        raise HTTPException(status_code=500, detail="Search engine not initialized")
        
    query = request.query
    session_id = request.session_id
    
    # Auto-create session if none provided
    if supabase_client and not session_id:
        try:
            title = query[:60] + ("..." if len(query) > 60 else "")
            result = supabase_client.table("chat_sessions").insert({
                "title": title
            }).execute()
            session_id = result.data[0]["id"]
        except Exception as e:
            print(f"[Query] Auto-create session error: {e}")
    
    # Save user message
    if session_id:
        save_message(session_id, "user", query)
    
    # Fetch conversation history for context
    chat_history = []
    if session_id:
        chat_history = get_session_history(session_id)
    
    # 1. Perform Hybrid RAG retrieve (top 5)
    retrieved = hybrid_search.hybrid_search(query, n_results=5)
    
    # 2. Rerank down to top 3
    reranked = hybrid_search.rerank_results(query, retrieved, top_n=3)
    
    # Trace the retrieval pipeline
    retrieval_trace = "BM25 + Chroma Cosine RRF"
    rerank_api_key = os.getenv("NVIDIA_API_KEY")
    if rerank_api_key and rerank_api_key != "your_nvidia_api_key_here":
        rerank_trace = "NVIDIA NIM Rerank"
    elif os.getenv("COHERE_API_KEY"):
        rerank_trace = "Cohere Rerank"
    else:
        rerank_trace = "No Rerank (Raw RRF)"

    # 3. Call active provider for synthesis with conversation memory
    provider = embedder.provider if embedder else "openai"
    answer, synthesis_trace = call_llm_for_synthesis(query, reranked, provider, chat_history)
    
    # Save assistant response
    steps_list = [retrieval_trace, rerank_trace, synthesis_trace]
    if session_id:
        save_message(session_id, "assistant", answer, steps_list)
    
    # Format retrieved chunks metadata for return
    serialized_chunks = []
    for c in reranked:
        serialized_chunks.append({
            "chunk_id": c.get("chunk_id", ""),
            "text": c.get("text", ""),
            "document_name": c.get("metadata", {}).get("document_name", "Unknown"),
            "page_number": c.get("metadata", {}).get("page_number", 0)
        })

    return QueryResponse(
        answer=answer,
        steps=steps_list,
        retrieved_chunks=serialized_chunks,
        session_id=session_id
    )


# ─── Audit Endpoint ────────────────────────────────────────────────

@app.post("/api/audit")
def audit_documents(request: AuditRequest):
    if not agent:
        raise HTTPException(status_code=500, detail="Audit agent not initialized")
        
    paths = request.document_paths
    if not paths:
        raw_dir = os.path.join("data", "raw")
        if os.path.exists(raw_dir):
            paths = [os.path.join(raw_dir, f) for f in os.listdir(raw_dir) if f.endswith(".pdf")]
            
    if not paths:
        raise HTTPException(status_code=400, detail="No legal documents found to audit")

    try:
        audit_state = agent.run_agent_loop(paths)
        return {
            "success": True,
            "compliance_score": audit_state.get("compliance_score", 100.0),
            "analysis_report": audit_state.get("analysis_report", ""),
            "missing_clauses": audit_state.get("missing_clauses", []),
            "contradictions": audit_state.get("contradictions", [])
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─── Serve React Frontend Static Files (if built) ─────────────────

frontend_dist = os.path.abspath(os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend", "dist"))
if os.path.exists(frontend_dist):
    from fastapi.staticfiles import StaticFiles
    from fastapi.responses import FileResponse
    
    # Mount assets first
    assets_dir = os.path.join(frontend_dist, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    # Serve index.html or other static files in the root of dist
    @app.get("/{rest_of_path:path}")
    def serve_frontend(rest_of_path: str):
        if rest_of_path.startswith("api/"):
            raise HTTPException(status_code=404, detail="Not Found")
        
        # Check if the requested file exists in dist directory
        file_path = os.path.join(frontend_dist, rest_of_path)
        if rest_of_path and os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
            
        # Default to index.html for SPA routing
        return FileResponse(os.path.join(frontend_dist, "index.html"))

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
