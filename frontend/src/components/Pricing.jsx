import React from 'react';

export default function Pricing() {
  const tiers = [
    {
      name: 'Pay-per-Report',
      tier: 'Pre-seed',
      amount: '₹2,499',
      cadence: 'one-time report',
      features: [
        'Single document analysis',
        'Risk flags + severity scoring',
        'PDF report download',
      ],
      cta: 'Get Report',
      featured: false
    },
    {
      name: 'SaaS — Startup',
      tier: 'Startup',
      amount: '₹4,999',
      cadence: 'per month',
      features: [
        'Upload your own contracts',
        'Cross-document contradiction detection',
        'Missing clause agent checks',
        'Chat with your documents',
      ],
      cta: 'Start Free Trial',
      featured: true
    },
    {
      name: 'SaaS — VC Tier',
      tier: 'VC',
      amount: '₹49,999',
      cadence: 'per month',
      features: [
        'Portfolio-wide due diligence dashboard',
        'Benchmarks across portfolio companies',
        'Dedicated model fine-tuned on your corpus',
      ],
      cta: 'Talk to Sales',
      featured: false
    },
    {
      name: 'White-label API',
      tier: 'Law Firms',
      amount: 'Custom',
      cadence: 'volume pricing',
      features: [
        'Full API access under your brand',
        '10× associate output at same cost',
        'SOC2-ready deployment options',
      ],
      cta: 'Request Demo',
      featured: false
    }
  ];

  return (
    <section className="bg-slate-dark border-t border-slate-light/40 py-16 px-10" id="pricing">
      <div className="max-w-[1200px] mx-auto w-full">
        <span className="font-mono text-[11px] font-medium tracking-[0.14em] uppercase text-teal">
          Pricing
        </span>
        <h2 className="font-sora text-2xl md:text-3xl font-bold text-white tracking-tight mt-3 mb-12">
          Built for every stage of the startup journey
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {tiers.map((t, idx) => (
            <div
              key={idx}
              className={`bg-bg2 border border-slate-light/40 rounded-2xl p-6 flex flex-col relative overflow-hidden transition-all duration-300 ${
                t.featured
                  ? 'border-teal bg-gradient-to-b from-teal/10 to-bg2 shadow-2xl scale-[1.02]'
                  : 'hover:border-teal-dim'
              }`}
            >
              {t.featured && (
                <div className="absolute top-4 -right-7 bg-teal text-white font-mono text-[9px] font-semibold tracking-wider px-8 py-1 rotate-45 select-none">
                  POPULAR
                </div>
              )}
              
              <div className="font-mono text-[9px] text-teal tracking-wider uppercase mb-3">
                {t.tier}
              </div>
              
              <div className="font-sora text-base font-bold text-white mb-1.5">
                {t.name}
              </div>
              
              <div className="font-sora text-2xl font-extrabold text-teal-bright mb-1">
                {t.amount}
              </div>
              
              <div className="text-[11px] text-gray-500 mb-5">
                {t.cadence}
              </div>
              
              <div className="h-[1px] bg-slate-light/40 mb-5" />

              <ul className="space-y-2.5 flex-1 mb-6">
                {t.features.map((f, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-2 text-[11px] text-gray-400 leading-relaxed font-sans">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal mt-1.5 flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-2.5 font-sora text-xs font-semibold rounded-xl cursor-pointer transition-all duration-200 tracking-wide border ${
                  t.featured
                    ? 'bg-teal border-teal-bright text-white glow-teal hover:bg-teal-bright hover:scale-[1.02]'
                    : 'bg-transparent border-teal-dim text-teal-bright hover:bg-teal-dim hover:text-white'
                }`}
              >
                {t.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
