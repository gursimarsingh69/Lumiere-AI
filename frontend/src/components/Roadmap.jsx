import React, { useState } from 'react';
import { Calendar, HelpCircle, Code2, Server } from 'lucide-react';

export default function Roadmap() {
  const [activeStage, setActiveStage] = useState(0);

  const stages = [
    {
      index: '01',
      weeks: 'Weeks 1–2',
      title: 'Basic RAG — Semantic Search',
      desc: 'PDF parsing using PyMuPDF, segmenting text into chunks, generating OpenAI embeddings, and querying a local Chroma vector index.',
      tags: ['PyMuPDF', 'ChromaDB', 'text-embedding-3-small', 'LangChain'],
      details: {
        objective: 'Build local document query index.',
        challenge: 'Handling multi-page agreements where headers/footers add garbage to sentence boundaries.',
        codeSnippet: "parser = LegalDocumentParser()\nchunks = parser.chunk_document(pages)\nvector_store.add_documents(chunks, embeddings)"
      }
    },
    {
      index: '02',
      weeks: 'Weeks 3–4',
      title: 'Intermediate RAG — Hybrid Search',
      desc: 'BM25 keyword search blended with semantic cosine search using Reciprocal Rank Fusion (RRF). Added Cohere rerank model to select high-relevance chunks.',
      tags: ['BM25Okapi', 'FAISS', 'Cohere Rerank', 'Metadata Filters'],
      details: {
        objective: 'Improve keyword recall for legal-specific terminology.',
        challenge: 'Blending keyword frequency weights with cosine distance parameters.',
        codeSnippet: "lexical_hits = keyword_search(query)\nsemantic_hits = vector_search(query)\nblended = reciprocal_rank_fusion(lexical_hits, semantic_hits)"
      }
    },
    {
      index: '03',
      weeks: 'Weeks 5–8',
      title: 'Advanced RAG — Agentic Graph',
      desc: 'LangGraph multi-document agent loops. Builds a Neo4j knowledge graph of entities and clause relationships to audit documents for missing clauses and contradictions.',
      tags: ['Neo4j', 'LangGraph', 'Self-RAG', 'RAGAS Framework'],
      details: {
        objective: 'Conduct multi-doc compliance audit.',
        challenge: 'Configuring self-correction agent loops when RAGAS hallucination indexes are triggered.',
        codeSnippet: "workflow = StateGraph(DueDiligenceAgentState)\nworkflow.add_node('audit', audit_documents)\nworkflow.add_edge('audit', 'contradictions')"
      }
    }
  ];

  return (
    <section className="py-16 px-10" id="roadmap">
      <div className="max-w-[1200px] mx-auto w-full flex flex-col md:flex-row gap-12 items-start">
      {/* Left side details */}
      <div className="flex-1 min-w-[260px]">
        <span className="font-mono text-[11px] font-medium tracking-[0.14em] uppercase text-teal">
          The RAG architecture
        </span>
        <h2 className="font-sora text-2xl md:text-3xl font-bold text-white tracking-tight leading-snug mt-3 mb-3">
          Three stages of <br />retrieval intelligence
        </h2>
        <p className="text-sm text-gray-400 leading-relaxed font-sans max-w-[420px] mb-6">
          LumièreAI follows a progressive roadmap. Click on any stage in the flow chart to inspect development benchmarks, challenges, and snippets.
        </p>

        {/* Selected Stage Detail Card */}
        <div className="bg-slate-dark border border-slate-light/40 rounded-xl p-5 glow-teal-large max-w-[420px]">
          <div className="flex items-center gap-2 text-teal-bright text-xs font-mono mb-2 uppercase tracking-wide">
            <Code2 size={14} />
            Stage {stages[activeStage].index} Specifications
          </div>
          <h3 className="font-sora text-sm font-semibold text-white mb-2">
            {stages[activeStage].title}
          </h3>
          
          <div className="space-y-3 font-sans text-xs text-gray-400 mt-3.5">
            <div>
              <span className="font-semibold text-gray-300 block mb-0.5">📌 Primary Objective</span>
              {stages[activeStage].details.objective}
            </div>
            <div>
              <span className="font-semibold text-gray-300 block mb-0.5">🔥 Code Implementation</span>
              <pre className="bg-bg border border-slate-light/40 rounded p-2.5 font-mono text-[10px] overflow-x-auto text-teal-bright mt-1">
                {stages[activeStage].details.codeSnippet}
              </pre>
            </div>
            <div>
              <span className="font-semibold text-gray-300 block mb-0.5">⚠️ Edge Case Challenge</span>
              {stages[activeStage].details.challenge}
            </div>
          </div>
        </div>
      </div>

      {/* Right side flow timeline */}
      <div className="flex-[1.4] min-w-[300px] w-full flex flex-col gap-0">
        {stages.map((stage, idx) => {
          const isActive = idx === activeStage;
          return (
            <div
              key={idx}
              onClick={() => setActiveStage(idx)}
              className={`flex gap-5 pb-9 cursor-pointer group last:pb-0`}
            >
              {/* Timeline bubble columns */}
              <div className="flex flex-col items-center w-9 flex-shrink-0">
                <div className={`w-9 h-9 rounded-full bg-slate-mid border-2 flex items-center justify-center font-mono text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'border-teal-bright bg-teal-dim text-white glow-teal'
                    : 'border-teal-dim text-teal-bright group-hover:border-teal group-hover:bg-slate-light'
                }`}>
                  {stage.index}
                </div>
                {idx < stages.length - 1 && (
                  <div className="w-[1px] flex-1 bg-gradient-to-b from-teal-dim/60 to-transparent mt-1" />
                )}
              </div>

              {/* Text content columns */}
              <div className="flex-1">
                <span className="font-mono text-[9px] uppercase tracking-wider text-teal block mb-1">
                  {stage.weeks}
                </span>
                <h4 className={`font-sora text-sm font-semibold mb-1 transition-all ${
                  isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'
                }`}>
                  {stage.title}
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed max-w-[500px]">
                  {stage.desc}
                </p>

                {/* Sub-tags */}
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {stage.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="font-mono text-[9px] text-teal-bright bg-teal/5 border border-teal/15 px-2 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      </div>
    </section>
  );
}
