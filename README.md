<div align="center">
  <h1>LumièreAI India 🇮🇳</h1>
  <p><b>AI Due Diligence Copilot for Startups and Corporate Law</b></p>
  
  [![Python Version](https://img.shields.io/badge/python-3.10%2B-blue.svg)](https://www.python.org/downloads/)
  [![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
  [![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![React](https://img.shields.io/badge/react-%2320232a.svg?style=flat&logo=react&logoColor=%2361DAFB)](https://reactjs.org/)
</div>

<br />

LumièreAI India is an AI-powered due diligence assistant built specifically for Indian corporate law and the startup ecosystem. It processes transactional documents (term sheets, SHAs, SSAs, NDAs), compliance filings (MCA forms like MGT-7, AOC-4), and capitalization tables to flag high-risk clauses, detect cross-document contradictions, and uncover missing clauses (e.g. absent non-competes or IP assignments).

---

## ✨ Key Features

- **Document Ingestion & Parsing:** Extracts structured data from complex legal PDFs (Agreements, Filings, etc.).
- **Hybrid Search Engine:** Combines BM25 keyword matching with Semantic vector search.
- **Advanced RAG Workflows:** Utilizes Graph RAG (Neo4j) to map clauses to entities and LangGraph for agentic auditing workflows.
- **Risk Flagging & Contradiction Detection:** Autonomously audits documents to spot anomalies across multiple files.
- **Interactive Dashboard:** A modern, fast Vite + React frontend for seamless legal analysis.

---

## 📁 Repository Structure

```text
LumiereAI/
├── data/
│   ├── raw/                      # Store raw PDF agreements here
│   └── processed/                # Extracted text/chunks/markdown data
├── notebooks/                    # Interactive Jupyter Notebook guides
│   ├── stage1_basic_rag.ipynb    # Ingestion, basic vector search (Chroma)
│   ├── stage2_hybrid_search.ipynb # BM25 + Semantic, Cohere re-ranking
│   └── stage3_advanced_rag.ipynb  # Neo4j Graph RAG, LangGraph agents, RAGAS
├── src/                          # Python Backend Source Modules
│   ├── __init__.py
│   ├── parser.py                 # PyMuPDF and LlamaParse PDF extractor
│   ├── embedder.py               # Embedding wrapper (OpenAI/Cohere)
│   ├── vector_db.py              # ChromaDB and FAISS vectors manager
│   ├── search.py                 # Keyword + Semantic search + Cohere reranker
│   └── agent.py                  # LangGraph multi-document audit agent
├── frontend/                     # Interactive Vite + React + Tailwind CSS Dashboard
│   ├── src/                      # UI components and global styling
│   ├── package.json
│   ├── tailwind.config.js
│   └── index.html
├── docs/                         # Detailed Guides
│   ├── sources.md                # PDF files and regulatory documents required
│   └── architecture.md           # RAG architecture and agent execution logs
├── requirements.txt              # Python requirements
├── run.bat                       # Startup script for Windows
└── README.md                     # This file
```

---

## 🛣️ The 3-Stage RAG Learning Arc

### Stage 1: Basic RAG (Weeks 1-2)
*   **Goal**: Ingest a single PDF and answer questions like *"What's the lock-in period in this agreement?"*
*   **Tech Stack**: PyMuPDF, `text-embedding-3-small` (OpenAI), ChromaDB.
*   **Concepts**: Naive chunking, vector embeddings, similarity search, prompt construction.

### Stage 2: Intermediate RAG (Weeks 3-4)
*   **Goal**: Perform precise keyword checks and metadata filtering across documents.
*   **Tech Stack**: BM25 (via `rank_bm25` / `BM25Okapi`), FAISS, Cohere Rerank.
*   **Concepts**: Hybrid search, metadata filtering (by document type, party name, date), recall vs precision tradeoffs.

### Stage 3: Advanced RAG (Weeks 5-8)
*   **Goal**: Identify cross-document contradictions, missing clauses, and perform self-evaluations.
*   **Tech Stack**: Neo4j (Graph Database), LangGraph (Agentic flow), Self-RAG loops, RAGAS framework.
*   **Concepts**: Multi-document reasoning, Graph RAG (mapping clauses and entities), Agentic audits.

---

## ⚙️ Quick Start Setup

### Prerequisites
- Python 3.10+
- Node.js 18+
- API Keys: OpenAI, Cohere, LlamaCloud (optional)

### 1. Python Backend & Notebooks

```bash
# 1. Create a virtual environment
python -m venv .venv

# 2. Activate it
# On Windows:
.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate

# 3. Install Python dependencies
pip install -r requirements.txt

# 4. Setup environment variables
cp .env.example .env
# Open .env and add your API keys.

# 5. Open Jupyter Notebooks to run RAG stages
jupyter notebook
```

### 2. React Frontend Dashboard

Open a new terminal and navigate to the `frontend` folder to start the UI.

```bash
# 1. Navigate to frontend folder
cd frontend

# 2. Install dependencies
npm install

# 3. Run developer local server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to interact with the dashboard!

---

## 🔍 Sample Data Included
The following sample documents are located in `data/raw/` for test-parsing:
*   `Mutual NDA.pdf`
*   `Employment Agreement.pdf`
*   `TERM_SHEET_EQUITY.pdf`

---

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License
This project is licensed under the Apache License 2.0 - see the LICENSE file for details.
