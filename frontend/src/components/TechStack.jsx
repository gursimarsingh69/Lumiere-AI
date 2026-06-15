import React from 'react';

export default function TechStack() {
  const stack = [
    {
      cat: 'Ingestion',
      items: ['LlamaParse', 'PyMuPDF']
    },
    {
      cat: 'Embeddings',
      items: ['text-embedding-3-small', 'Cohere Embed']
    },
    {
      cat: 'Vector DB',
      items: ['ChromaDB', 'Weaviate', 'Qdrant']
    },
    {
      cat: 'Hybrid Search',
      items: ['BM25Okapi', 'FAISS']
    },
    {
      cat: 'Reranking',
      items: ['Cohere Rerank', 'FlashRank']
    },
    {
      cat: 'Graph RAG',
      items: ['Neo4j', 'LangChain']
    },
    {
      cat: 'Agentic Layer',
      items: ['LangGraph', 'CrewAI']
    },
    {
      cat: 'Evaluation',
      items: ['RAGAS', 'LangSmith']
    }
  ];

  return (
    <section className="bg-slate-dark border-t border-slate-light/40 py-14 px-10">
      <div className="max-w-[1200px] mx-auto w-full">
        <span className="font-mono text-[11px] font-medium tracking-[0.14em] uppercase text-teal">
          Tech Stack
        </span>
        <h2 className="font-sora text-2xl font-bold text-white tracking-tight mt-3">
          Enterprise-grade RAG infrastructure
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mt-10">
          {stack.map((group, idx) => (
            <div
              key={idx}
              className="bg-bg2 border border-slate-light/40 rounded-xl p-4.5 transition-colors duration-200 hover:border-teal-dim"
            >
              <div className="font-mono text-[9px] uppercase tracking-wider text-teal mb-3">
                {group.cat}
              </div>
              
              <div className="flex flex-col gap-2">
                {group.items.map((item, iIdx) => (
                  <div key={iIdx} className="text-[11px] text-gray-400 flex items-center gap-1.5 font-sans leading-normal">
                    <div className="w-1 h-1 rounded-full bg-teal-dim flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
