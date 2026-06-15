import React from 'react';
import { Database, Share2, ShieldAlert, Flag } from 'lucide-react';

export default function Features() {
  const items = [
    {
      num: 'F.01',
      icon: Database,
      title: 'Smart Contract Ingestion',
      desc: 'Upload any PDF — term sheets, NDAs, employment agreements, cap tables. LumièreAI extracts clauses with full layout-aware structural accuracy.'
    },
    {
      num: 'F.02',
      icon: Share2,
      title: 'Graph-based Clause Reasoning',
      desc: 'We map every party, obligation, and date into a Neo4j knowledge graph — enabling conflict checks no semantic vector matching can notice.'
    },
    {
      num: 'F.03',
      icon: ShieldAlert,
      title: 'Agentic Risk Detection',
      desc: 'Our agent proactively audits files for missing clauses — flagging the absence of non-competes, IP assignments, or veto exceptions.'
    },
    {
      num: 'F.04',
      icon: Flag,
      title: 'Indian Legal Corpus',
      desc: 'Tuned specifically to the Companies Act 2013, SEBI rules, and local precedents. Not a US legal model retrofitted for Indian operations.'
    }
  ];

  return (
    <section className="bg-slate-dark border-t border-b border-slate-light/40 py-16 px-10">
      <div className="max-w-[1200px] mx-auto w-full">
        <div className="mb-12">
          <span className="font-mono text-[11px] font-medium tracking-[0.14em] uppercase text-teal">
            What LumièreAI does
          </span>
          <h2 className="font-sora text-2xl md:text-3xl font-bold text-white tracking-tight leading-snug mt-3">
            Due diligence that used to cost ₹5 lakh,<br />now in minutes
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div
                key={idx}
                className="bg-bg2 border border-slate-light/40 rounded-2xl p-6.5 relative overflow-hidden transition-all duration-300 hover:border-teal-dim hover:-translate-y-1 hover:shadow-2xl group"
              >
                {/* Visual hover border overlay line */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-teal to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                
                <div className="font-mono text-[10px] text-teal-dim tracking-wider mb-4">
                  {item.num}
                </div>
                
                <div className="w-11 h-11 bg-teal/10 border border-teal/20 rounded-xl flex items-center justify-center text-teal-bright text-lg mb-4">
                  <IconComponent size={20} />
                </div>
                
                <h3 className="font-sora text-sm font-semibold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed font-sans">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
