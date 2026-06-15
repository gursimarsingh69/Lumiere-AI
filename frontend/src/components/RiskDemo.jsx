import React from 'react';

export default function RiskDemo({ selectedDoc, allDocs, onSelectDoc }) {
  if (!selectedDoc) return null;

  return (
    <section className="py-16 px-10" id="analysis">
      <div className="max-w-[1200px] mx-auto w-full flex flex-wrap md:flex-nowrap gap-12 items-start">
      
      {/* Description on Left */}
      <div className="flex-1 min-w-[260px]">
        <span className="font-mono text-[11px] font-medium tracking-[0.14em] uppercase text-teal">
          Live risk analysis
        </span>
        <h2 className="font-sora text-2xl md:text-3xl font-bold text-white tracking-tight leading-snug mt-3 mb-3">
          See every risk before <br />your lawyer does
        </h2>
        <p className="text-sm text-gray-400 leading-relaxed font-sans max-w-[420px] mb-6">
          LumièreAI highlights compliance risks, missing clauses, and conflicting statements. Select from the uploaded deal-room files to run active RAG audits.
        </p>

        {/* Small document tabs selector */}
        <div className="flex flex-col gap-2 max-w-[320px]">
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Active Deal Room Documents</span>
          {allDocs.map((doc) => (
            <button
              key={doc.id}
              onClick={() => onSelectDoc(doc)}
              className={`w-full text-left p-3 rounded-lg border text-xs flex justify-between items-center transition-all ${
                selectedDoc.id === doc.id
                  ? 'bg-teal/10 border-teal text-white'
                  : 'bg-slate-dark/40 border-slate-light/40 text-gray-400 hover:border-slate-light hover:text-white'
              }`}
            >
              <span className="truncate pr-2 font-sora font-medium">📄 {doc.name}</span>
              <span className="text-[9px] font-mono bg-slate-mid px-1.5 py-0.5 rounded text-teal-bright">
                {doc.type}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Mock Doc Viewer on Right */}
      <div className="flex-[1.4] min-w-[300px] w-full">
        <div className="bg-slate-mid border border-slate-light/60 rounded-2xl overflow-hidden shadow-2xl">
          
          {/* Header */}
          <div className="bg-slate-dark border-b border-slate-light/60 px-5 py-3.5 flex items-center gap-3">
            <span className="text-lg">📄</span>
            <div className="flex-1">
              <div className="font-sora text-xs font-semibold text-white">
                {selectedDoc.name}
              </div>
              <div className="font-mono text-[9px] text-gray-500 mt-0.5">
                {selectedDoc.meta}
              </div>
            </div>
            <div className="font-mono text-[9px] bg-teal/15 border border-teal-dim px-2.5 py-1 rounded-full text-teal-bright select-none">
              ✓ Audited
            </div>
          </div>

          {/* Body */}
          <div className="p-5 flex flex-col gap-3">
            {selectedDoc.risks.map((risk, idx) => {
              let cardClass = '';
              let dotClass = '';
              let labelClass = '';
              
              if (risk.severity === 'HIGH') {
                cardClass = 'bg-redflag/5 border-redflag/20 hover:border-redflag/40';
                dotClass = 'bg-redflag shadow-[0_0_6px_#E05A5A]';
                labelClass = 'text-redflag';
              } else if (risk.severity === 'MEDIUM') {
                cardClass = 'bg-gold/5 border-gold/20 hover:border-gold/40';
                dotClass = 'bg-gold shadow-[0_0_6px_#C8A96E]';
                labelClass = 'text-gold';
              } else {
                cardClass = 'bg-greenok/5 border-greenok/20 hover:border-greenok/40';
                dotClass = 'bg-greenok shadow-[0_0_6px_#4CAF82]';
                labelClass = 'text-greenok';
              }

              return (
                <div
                  key={idx}
                  className={`flex items-start gap-3 p-3.5 border rounded-xl transition-all duration-200 cursor-pointer hover:translate-x-1 ${cardClass}`}
                >
                  <div className="mt-1">
                    <div className={`w-2 h-2 rounded-full ${dotClass}`} />
                  </div>
                  <div className="flex-1 font-sans text-xs md:text-sm text-gray-400">
                    <div className="font-semibold text-white mb-0.5">{risk.title}</div>
                    <p className="leading-relaxed">{risk.desc}</p>
                    <div className={`font-mono text-[9px] uppercase tracking-wider mt-1.5 ${labelClass}`}>
                      ● {risk.severity} RISK — {risk.location}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
      </div>
    </section>
  );
}
