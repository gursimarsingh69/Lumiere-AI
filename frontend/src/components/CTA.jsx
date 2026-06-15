import React from 'react';

export default function CTA({ onImport }) {
  return (
    <section className="py-16 px-10 text-center relative overflow-hidden">
      {/* Glow backgrounds */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center_bottom,rgba(0,128,128,0.1)_0%,transparent_70%)] pointer-events-none" />

      <h2 className="font-sora text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-snug mb-3 relative">
        Stop paying ₹5 lakh per round<br />to understand your own contracts
      </h2>
      <p className="text-sm text-gray-500 max-w-[520px] mx-auto mb-8 relative font-sans leading-relaxed">
        LumièreAI gives Indian founders the legal clarity that was previously reserved for well-funded companies with in-house counsel.
      </p>

      <div className="flex gap-3 justify-center flex-wrap relative">
        <button
          onClick={onImport}
          className="px-7 py-3 bg-teal hover:bg-teal-bright text-white font-sora text-xs font-semibold rounded-xl cursor-pointer transition-all duration-200 shadow-[0_6px_20px_rgba(0,128,128,0.35)] hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(0,128,128,0.5)]"
        >
          Upload your first contract →
        </button>
        <button
          className="px-7 py-3 bg-transparent border border-slate-light/60 hover:border-teal-dim hover:bg-slate-mid text-gray-300 font-sora text-xs font-medium rounded-xl cursor-pointer transition-all duration-200"
        >
          See a live demo
        </button>
      </div>
    </section>
  );
}
