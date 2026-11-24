import React, { useState } from 'react';
import { CheckCircle2, Filter } from 'lucide-react';

export default function RiskDemo({ allDocs, selectedDoc, onSelectDoc }) {
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [activeDocFilter, setActiveDocFilter] = useState('ALL');

  if (!allDocs || allDocs.length === 0) return null;

  // Filtered documents
  const displayedDocs = allDocs.filter(d => activeDocFilter === 'ALL' || d.id === activeDocFilter);

  return (
    <section className="py-12 px-6 md:px-10 max-w-[1360px] mx-auto w-full" id="analysis">
      {/* Top Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 pb-6 border-b border-slate-light/40">
        <div>
          <span className="font-mono text-[11px] font-medium tracking-[0.14em] uppercase text-teal bg-teal/10 px-2.5 py-1 rounded border border-teal/20">
            Live Risk Analysis Engine
          </span>
          <h2 className="font-sora text-2xl md:text-4xl font-extrabold text-white tracking-tight mt-2.5">
            See every risk before <span className="text-teal-bright">your lawyer does</span>
          </h2>
          <p className="text-sm text-gray-400 mt-2 max-w-[650px] leading-relaxed">
            LumièreAI highlights compliance risks, missing clauses, and conflicting statements across every agreement in your deal room simultaneously.
          </p>
        </div>

        {/* Severity Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-mono text-gray-400 mr-1 flex items-center gap-1">
            <Filter size={13} /> Filter:
          </span>
          {[
            { id: 'ALL', label: 'All Severities' },
            { id: 'HIGH', label: '● High Risk', color: 'text-redflag border-redflag/30 hover:border-redflag' },
            { id: 'MEDIUM', label: '● Medium', color: 'text-gold border-gold/30 hover:border-gold' },
            { id: 'COMPLIANT', label: '✓ Compliant', color: 'text-greenok border-greenok/30 hover:border-greenok' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterSeverity(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer whitespace-nowrap border ${
                filterSeverity === f.id
                  ? 'bg-teal text-white border-teal-bright shadow-md'
                  : `bg-slate-mid text-gray-400 border-slate-light/60 hover:text-white ${f.color || ''}`
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 items-start">
        
        {/* Left Sidebar Sticky Quick Jump Navigation */}
        <div className="w-full lg:w-[320px] lg:sticky lg:top-8 flex flex-col gap-4">
          <div className="bg-slate-mid/80 border border-slate-light/60 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3.5">
              <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider font-semibold">
                Active Deal Room ({allDocs.length} Docs)
              </span>
              <button
                onClick={() => setActiveDocFilter('ALL')}
                className={`text-[10px] font-mono hover:underline cursor-pointer ${
                  activeDocFilter === 'ALL' ? 'text-teal-bright font-bold' : 'text-gray-500'
                }`}
              >
                Show All
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {allDocs.map((doc) => {
                const highCount = doc.risks.filter(r => r.severity === 'HIGH').length;
                const isSelected = activeDocFilter === doc.id;

                return (
                  <button
                    key={doc.id}
                    onClick={() => {
                      setActiveDocFilter(doc.id);
                      const el = document.getElementById(`doc-analysis-${doc.id}`);
                      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className={`w-full text-left p-3 rounded-xl border text-xs flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-teal/15 border-teal text-white shadow-lg'
                        : 'bg-slate-dark/60 border-slate-light/40 text-gray-400 hover:border-slate-light hover:text-white'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <div className="font-sora font-medium truncate flex items-center gap-1.5">
                        <span>📄</span>
                        <span className="truncate">{doc.name}</span>
                      </div>
                      <div className="text-[10px] font-mono text-gray-500 mt-0.5 truncate">
                        {doc.meta.split('·')[0]} · {doc.risks.length} clauses audited
                      </div>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      {highCount > 0 && (
                        <span className="w-2 h-2 rounded-full bg-redflag shadow-[0_0_6px_#E05A5A]" title={`${highCount} High Risks`} />
                      )}
                      <span className="text-[9px] font-mono bg-slate-mid px-2 py-0.5 rounded text-teal-bright border border-teal/20">
                        {doc.type}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Stat Pill */}
          <div className="bg-slate-dark border border-slate-light/40 rounded-xl p-4 text-xs font-mono text-gray-400 space-y-1.5">
            <div className="text-white font-semibold flex items-center gap-1.5">
              <span className="text-teal-bright">●</span> Deal Room Health Matrix
            </div>
            <div>Total Risk Clauses: <span className="text-white font-bold">{allDocs.reduce((acc, d) => acc + d.risks.length, 0)}</span></div>
            <div>High Risk Alerts: <span className="text-redflag font-bold">{allDocs.reduce((acc, d) => acc + d.risks.filter(r => r.severity === 'HIGH').length, 0)}</span></div>
            <div>Contradictions: <span className="text-gold font-bold">1 Flagged</span></div>
          </div>
        </div>

        {/* Right Area: 2nd Screenshot Analysis Card for EVERY Document */}
        <div className="flex-1 w-full space-y-8">
          {displayedDocs.map((doc) => {
            const visibleRisks = doc.risks.filter(r => filterSeverity === 'ALL' || r.severity === filterSeverity);

            return (
              <div
                key={doc.id}
                id={`doc-analysis-${doc.id}`}
                className="bg-slate-mid border border-slate-light/60 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 hover:border-slate-light"
              >
                {/* 2nd Screenshot Style Header */}
                <div className="bg-slate-dark border-b border-slate-light/60 px-5 py-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📄</span>
                    <div>
                      <div className="font-sora text-sm md:text-base font-semibold text-white">
                        {doc.name}
                      </div>
                      <div className="font-mono text-[10px] text-gray-400 mt-0.5">
                        {doc.meta}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[9px] uppercase tracking-wider bg-slate-mid px-2.5 py-1 rounded text-teal-bright border border-slate-light/40">
                      {doc.type}
                    </span>
                    <div className="font-mono text-[10px] bg-teal/15 border border-teal-dim px-3 py-1 rounded-full text-teal-bright select-none flex items-center gap-1">
                      <CheckCircle2 size={12} />
                      Audited
                    </div>
                  </div>
                </div>

                {/* Body: All Risk Cards for this Document */}
                <div className="p-5 flex flex-col gap-3.5">
                  {visibleRisks.length === 0 ? (
                    <div className="py-8 text-center text-gray-500 font-mono text-xs">
                      No clauses match the selected "{filterSeverity}" severity filter for this document.
                    </div>
                  ) : (
                    visibleRisks.map((risk, idx) => {
                      let cardClass = '';
                      let dotClass = '';
                      let labelClass = '';

                      if (risk.severity === 'HIGH') {
                        cardClass = 'bg-redflag/5 border-redflag/25 hover:border-redflag/50';
                        dotClass = 'bg-redflag shadow-[0_0_8px_#E05A5A]';
                        labelClass = 'text-redflag';
                      } else if (risk.severity === 'MEDIUM') {
                        cardClass = 'bg-gold/5 border-gold/25 hover:border-gold/50';
                        dotClass = 'bg-gold shadow-[0_0_8px_#C8A96E]';
                        labelClass = 'text-gold';
                      } else {
                        cardClass = 'bg-greenok/5 border-greenok/25 hover:border-greenok/50';
                        dotClass = 'bg-greenok shadow-[0_0_8px_#4CAF82]';
                        labelClass = 'text-greenok';
                      }

                      return (
                        <div
                          key={idx}
                          className={`flex items-start gap-3.5 p-4 border rounded-xl transition-all duration-200 hover:translate-x-1 ${cardClass}`}
                        >
                          {/* Dot indicator */}
                          <div className="mt-1.5 flex-shrink-0">
                            <div className={`w-2.5 h-2.5 rounded-full ${dotClass}`} />
                          </div>

                          {/* Content */}
                          <div className="flex-1 font-sans text-xs md:text-sm text-gray-300">
                            <div className="font-sora font-semibold text-white text-sm mb-1">
                              {risk.title}
                            </div>
                            <p className="leading-relaxed text-gray-400 font-sans text-xs md:text-[13px]">
                              {risk.desc}
                            </p>
                            <div className={`font-mono text-[10px] uppercase tracking-wider mt-2 font-medium ${labelClass}`}>
                              ● {risk.severity} RISK — {risk.location}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
