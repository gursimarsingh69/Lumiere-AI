import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Paperclip, Sparkles, Upload, ArrowRight } from 'lucide-react';

export default function Hero({ onSearch, onImport, onFileUpload, onQuickAction, chatHistory = [], isLoading }) {
  const [query, setQuery] = useState('');
  const chatBottomRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-scroll chat history when new message arrives
  useEffect(() => {
    if (chatHistory.length > 0) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;
    if (onSearch) {
      onSearch(query);
    }
    setQuery('');
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    if (onFileUpload) {
      onFileUpload(files);
    } else if (onImport) {
      const filenames = files.map(f => f.name);
      onImport(filenames);
    }
  };

  const handleQuickCardClick = (promptText, quickKey) => {
    if (onSearch) {
      onSearch(promptText);
    }
    if (onQuickAction) {
      onQuickAction(quickKey);
    }
  };

  return (
    <section className="flex flex-col items-center pt-10 px-6 md:px-8 pb-12 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-[-60px] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[radial-gradient(ellipse,rgba(0,128,128,0.14)_0%,transparent_70%)] pointer-events-none"></div>

      {/* Animated Legal Orb */}
      <div className="w-[150px] h-[150px] mb-6 relative select-none">
        <svg className="w-full h-full drop-shadow-[0_0_32px_rgba(0,180,180,0.5)] drop-shadow-[0_0_8px_rgba(0,128,128,0.7)]" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="orbGrad" cx="40%" cy="35%" r="55%">
              <stop offset="0%" stopColor="#00BFBF" stopOpacity="0.9" />
              <stop offset="45%" stopColor="#008080" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#001A1A" stopOpacity="1" />
            </radialGradient>
            <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00BFBF" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#008080" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="80" cy="80" r="75" fill="url(#glowGrad)" />
          <circle cx="80" cy="80" r="60" fill="url(#orbGrad)" className="animate-pulse-orb" />
          <ellipse cx="62" cy="58" rx="18" ry="10" fill="rgba(255,255,255,0.15)" transform="rotate(-20,62,58)" />
          <g className="animate-spin-slow origin-[80px_80px]">
            <ellipse cx="80" cy="80" rx="72" ry="24" fill="none" stroke="rgba(0,191,191,0.35)" strokeWidth="1.5" strokeDasharray="8 6" />
          </g>
          <g className="animate-spin-slow-reverse origin-[80px_80px]">
            <ellipse cx="80" cy="80" rx="50" ry="16" fill="none" stroke="rgba(0,128,128,0.5)" strokeWidth="1" strokeDasharray="5 8" />
          </g>
          <g transform="translate(80,80)" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="-22" y1="0" x2="22" y2="0" />
            <line x1="0" y1="0" x2="0" y2="14" />
            <line x1="-8" y1="14" x2="8" y2="14" />
            <line x1="-22" y1="0" x2="-28" y2="9" />
            <line x1="-22" y1="0" x2="-16" y2="9" />
            <path d="M-28 9 Q-22 13 -16 9" stroke="rgba(255,255,255,0.75)" />
            <line x1="22" y1="0" x2="28" y2="9" />
            <line x1="22" y1="0" x2="16" y2="9" />
            <path d="M16 9 Q22 13 28 9" stroke="rgba(255,255,255,0.75)" />
            <circle cx="0" cy="-3" r="2.5" fill="rgba(255,255,255,0.4)" stroke="rgba(0,191,191,0.9)" strokeWidth="1.5" />
          </g>
          <circle cx="80" cy="18" r="2.5" fill="#00BFBF" opacity="0.8" className="animate-pulse-orb" />
          <circle cx="142" cy="80" r="2" fill="#008080" opacity="0.6" className="animate-pulse-orb [animation-delay:1s]" />
          <circle cx="18" cy="80" r="2" fill="#008080" opacity="0.6" className="animate-pulse-orb [animation-delay:0.5s]" />
          <circle cx="80" cy="142" r="2.5" fill="#00BFBF" opacity="0.8" className="animate-pulse-orb [animation-delay:1.5s]" />
        </svg>
      </div>

      {/* Greetings & Taglines */}
      <p className="font-sora text-base md:text-lg font-light text-gray-400 tracking-[0.04em] mb-1.5">
        Welcome back, Rahul
      </p>
      <h1 className="font-sora text-3xl md:text-5xl font-extrabold text-white tracking-tight text-center mb-3">
        Your AI <span className="text-teal-bright">Due Diligence</span> Copilot
      </h1>
      <p className="text-xs md:text-sm text-gray-400 text-center leading-relaxed max-w-[480px] mb-8 font-sans">
        Upload your contracts, MoUs, or term sheets — LumièreAI flags risks, missing clauses, and contradictions in seconds. No law degree required.
      </p>

      {/* ═══ MAIN UNIFIED BOX: Chat + Upload ═══ */}
      <div className="w-full max-w-[760px] mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-teal-bright tracking-wider uppercase bg-teal/10 border border-teal/20 border-b-0 px-3.5 py-1.5 rounded-t-xl font-mono">
          <Sparkles size={12} className="animate-pulse" />
          {isLoading ? 'RAG Engine Analyzing Query...' : 'Upload a document to begin analysis'}
        </div>

        <div className="bg-slate-mid border border-teal/25 rounded-tr-2xl rounded-b-2xl p-5 glow-teal-large">

          {/* ── Scrollable Chat History Panel ── */}
          {chatHistory.length > 0 && (
            <div className="max-h-[280px] overflow-y-auto mb-4 space-y-3.5 pr-2 scrollbar-thin">
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[88%] rounded-2xl p-3.5 text-xs md:text-sm font-sans leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-teal text-white rounded-br-none shadow-md'
                      : 'bg-slate-dark text-gray-200 border border-slate-light/50 rounded-bl-none shadow-lg'
                  }`}>
                    <p className="whitespace-pre-line">{msg.text}</p>

                    {/* Step pill tags (NVIDIA Rerank, BM25, etc.) */}
                    {msg.steps && msg.steps.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-slate-light/30 flex flex-wrap gap-1.5">
                        {msg.steps.map((st, i) => (
                          <span
                            key={i}
                            className="text-[9px] font-mono bg-teal/15 text-teal-bright px-2 py-0.5 rounded border border-teal/30"
                          >
                            {st}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing bounce indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-dark text-gray-300 border border-slate-light/50 rounded-2xl rounded-bl-none p-3.5 text-xs font-sans flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-teal rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-teal rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-teal rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    <span className="text-[10px] font-mono text-teal-bright ml-1">Executing RAG pipeline & NVIDIA Rerank...</span>
                  </div>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>
          )}

          {/* ── Upload Drop Zone (shown only when no chat yet) ── */}
          {chatHistory.length === 0 && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-teal/30 hover:border-teal rounded-xl p-8 text-center cursor-pointer transition-all duration-200 bg-slate-dark/50 hover:bg-slate-dark/80 group mb-4"
            >
              <div className="w-12 h-12 rounded-full bg-teal/15 text-teal-bright mx-auto flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Upload size={22} />
              </div>
              <h3 className="font-sora text-sm md:text-base font-semibold text-white mb-1">
                Click or drag legal documents to upload
              </h3>
              <p className="text-xs text-gray-400 font-sans max-w-[420px] mx-auto mb-3">
                Supports Term Sheets, SHAs, SSAs, NDAs, and Employment Agreements (PDF, DOCX). Stored directly in Supabase.
              </p>
              <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-teal-bright">
                <span className="bg-teal/10 px-2.5 py-1 rounded border border-teal/20">Automatic OCR</span>
                <span>·</span>
                <span className="bg-teal/10 px-2.5 py-1 rounded border border-teal/20">Clause Indexing</span>
                <span>·</span>
                <span className="bg-teal/10 px-2.5 py-1 rounded border border-teal/20">Risk Extraction</span>
              </div>
            </div>
          )}

          {/* ── Chat Input Form (ALWAYS visible) ── */}
          <form onSubmit={handleSubmit} className="relative">
            <textarea
              className="w-full bg-bg border border-slate-light/60 rounded-xl py-3 px-4 text-white font-sans text-xs md:text-sm outline-none transition-all duration-200 resize-none min-h-[64px] max-h-[120px] focus:border-teal focus:ring-2 focus:ring-teal/20 placeholder-gray-500"
              placeholder="Ask anything about your contracts — 'What are my lock-in obligations?' or 'Does this NDA have a carve-out for prior IP?'"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              rows={2}
            />

            {/* Action Toolbar */}
            <div className="flex items-center justify-between gap-2 mt-3 pt-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                multiple
                accept=".pdf,.doc,.docx"
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-dark hover:bg-slate-light/80 border border-slate-light/60 hover:border-teal rounded-lg text-gray-300 text-xs font-sans cursor-pointer transition-all duration-150"
              >
                <Paperclip size={14} className="text-teal-bright" />
                Import files (NDA, SHA)
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="w-9 h-9 rounded-xl bg-slate-dark hover:bg-slate-light/80 border border-slate-light/60 hover:border-teal flex items-center justify-center cursor-pointer transition-all text-gray-400 hover:text-teal-bright"
                  title="Voice Input"
                >
                  <Mic size={16} />
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !query.trim()}
                  className="w-9 h-9 rounded-xl bg-teal hover:bg-teal-bright disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer transition-all text-white shadow-md shadow-teal/20"
                  title="Send"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 w-full max-w-[760px] mx-auto">
        <button
          onClick={() => handleQuickCardClick('Review my SHA — flag unusual investor rights or liquidation preferences', 'sha')}
          className="bg-slate-mid border border-slate-light/60 hover:border-teal-dim hover:bg-slate-light/80 rounded-xl p-4.5 cursor-pointer text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-lg flex flex-col gap-1 group"
        >
          <span className="text-xl mb-1 group-hover:scale-110 transition-transform inline-block">🔍</span>
          <span className="font-sora text-xs font-semibold text-white group-hover:text-teal-bright transition-colors">
            Review my SHA
          </span>
          <span className="text-[11px] text-gray-400 leading-normal">
            Flag unusual investor rights or liquidation preferences.
          </span>
        </button>

        <button
          onClick={() => handleQuickCardClick('Detect missing clauses — check for post-employment non-competes or IP ownership transfers', 'missing')}
          className="bg-slate-mid border border-slate-light/60 hover:border-teal-dim hover:bg-slate-light/80 rounded-xl p-4.5 cursor-pointer text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-lg flex flex-col gap-1 group"
        >
          <span className="text-xl mb-1 group-hover:scale-110 transition-transform inline-block">⚠️</span>
          <span className="font-sora text-xs font-semibold text-white group-hover:text-gold transition-colors">
            Detect missing clauses
          </span>
          <span className="text-[11px] text-gray-400 leading-normal">
            Check for post-employment non-competes or IP ownership transfers.
          </span>
        </button>

        <button
          onClick={() => handleQuickCardClick('Find cross-document contradictions between Term Sheet, SHA, and NDA IP terms', 'contradictions')}
          className="bg-slate-mid border border-slate-light/60 hover:border-teal-dim hover:bg-slate-light/80 rounded-xl p-4.5 cursor-pointer text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-lg flex flex-col gap-1 group"
        >
          <span className="text-xl mb-1 group-hover:scale-110 transition-transform inline-block">⚖️</span>
          <span className="font-sora text-xs font-semibold text-white group-hover:text-teal-bright transition-colors">
            Cross-doc contradictions
          </span>
          <span className="text-[11px] text-gray-400 leading-normal">
            Does your Term Sheet or SHA conflict with your Mutual NDA IP terms?
          </span>
        </button>
      </div>
    </section>
  );
}
