import React, { useState, useRef } from 'react';
import { Send, Mic, Paperclip, Wrench, Sparkles } from 'lucide-react';

export default function Hero({ onSearch, onImport, onFileUpload, chatHistory, isLoading }) {
  const [query, setQuery] = useState('');
  const chatBottomRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;
    onSearch(query);
    setQuery('');
    
    // Smooth scroll chat down
    setTimeout(() => {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleQuickCard = (cardText) => {
    onSearch(cardText);
  };

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    if (onFileUpload) {
      onFileUpload(files);
    } else {
      const filenames = files.map(f => f.name);
      onImport(filenames);
    }
  };

  return (
    <section className="flex flex-col items-center pt-12 px-8 pb-8 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-[-60px] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[radial-gradient(ellipse,rgba(0,128,128,0.12)_0%,transparent_70%)] pointer-events-none"></div>

      {/* Animated Legal Orb */}
      <div className="w-[160px] h-[160px] mb-7 relative select-none">
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

          {/* Outer glow */}
          <circle cx="80" cy="80" r="75" fill="url(#glowGrad)" />

          {/* Main orb sphere */}
          <circle cx="80" cy="80" r="60" fill="url(#orbGrad)" className="animate-pulse-orb" />

          {/* Highlight shimmer */}
          <ellipse cx="62" cy="58" rx="18" ry="10" fill="rgba(255,255,255,0.15)" transform="rotate(-20,62,58)" />

          {/* Outer ring */}
          <g className="animate-spin-slow origin-[80px_80px]">
            <ellipse cx="80" cy="80" rx="72" ry="24" fill="none" stroke="rgba(0,191,191,0.35)" strokeWidth="1.5" strokeDasharray="8 6" />
          </g>

          {/* Inner ring */}
          <g className="animate-spin-slow-reverse origin-[80px_80px]">
            <ellipse cx="80" cy="80" rx="50" ry="16" fill="none" stroke="rgba(0,128,128,0.5)" strokeWidth="1" strokeDasharray="5 8" />
          </g>

          {/* Scales of justice icon inside orb */}
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

          {/* Teal data-pulse dots */}
          <circle cx="80" cy="18" r="2.5" fill="#00BFBF" opacity="0.8" className="animate-pulse-orb" />
          <circle cx="142" cy="80" r="2" fill="#008080" opacity="0.6" className="animate-pulse-orb [animation-delay:1s]" />
          <circle cx="18" cy="80" r="2" fill="#008080" opacity="0.6" className="animate-pulse-orb [animation-delay:0.5s]" />
          <circle cx="80" cy="142" r="2.5" fill="#00BFBF" opacity="0.8" className="animate-pulse-orb [animation-delay:1.5s]" />
        </svg>
      </div>

      <p className="font-sora text-lg font-light text-gray-400 tracking-[0.04em] mb-1.5">Welcome back, Rahul</p>
      <h1 className="font-sora text-[28px] md:text-[44px] font-extrabold text-white tracking-tight text-center mb-3">
        Your AI <span className="text-gradient-teal">Due Diligence</span> Copilot
      </h1>
      <p className="text-sm text-gray-500 text-center leading-relaxed max-w-[440px] mb-8 font-sans">
        Upload your contracts, MoUs, or term sheets — LumièreAI flags risks, missing clauses, and contradictions in seconds. No law degree required.
      </p>

      {/* Chat Wrapper */}
      <div className="w-full max-w-[740px] mx-auto mb-7">
        <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-teal-bright tracking-wider uppercase bg-teal/10 border border-teal/20 border-b-0 px-3.5 py-1.5 rounded-t-xl font-mono">
          <Sparkles size={12} className="animate-pulse" />
          {isLoading ? 'RAG Engine Analyzing...' : 'Upload a document to begin analysis'}
        </div>
        
        <div className="bg-slate-mid border border-teal/18 rounded-tr-2xl rounded-b-2xl p-4.5 glow-teal-large">
          
          {/* Chat History Panel inside the input box */}
          {chatHistory.length > 0 && (
            <div className="max-h-[260px] overflow-y-auto mb-4 space-y-3 pr-2 scrollbar-thin">
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[85%] rounded-xl p-3 text-xs md:text-sm font-sans leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-teal text-white rounded-br-none'
                      : 'bg-slate-dark text-gray-300 border border-slate-light/40 rounded-bl-none'
                  }`}>
                    {msg.text}
                    {msg.steps && (
                      <div className="mt-2 pt-2 border-t border-teal-dim/30 flex flex-wrap gap-1">
                        {msg.steps.map((st, i) => (
                          <span key={i} className="text-[9px] font-mono bg-teal-dim/40 text-teal-bright px-1.5 py-0.5 rounded border border-teal/10">
                            {st}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-dark text-gray-400 border border-slate-light/40 rounded-xl rounded-bl-none p-3 text-xs font-sans flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-teal rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-teal rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-teal rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    <span className="text-[10px] font-mono text-teal-bright ml-1">Executing RAG pipeline...</span>
                  </div>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="relative">
            <textarea
              className="w-full bg-bg border border-slate-light/60 rounded-xl py-3 px-4.5 pr-20 text-white font-sans text-sm outline-none transition-all duration-200 resize-none min-h-[64px] max-h-[120px] focus:border-teal focus:ring-3 focus:ring-teal/12"
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
            
            <div className="flex items-center gap-2 mt-3">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                multiple
                accept=".pdf"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-transparent border border-slate-light/60 hover:border-teal-dim hover:bg-slate-light hover:text-white rounded-lg text-gray-400 text-xs font-sans cursor-pointer transition-all duration-200"
              >
                <Paperclip size={14} />
                Import files (NDA, SHA)
              </button>
              
              <div className="ml-auto flex items-center gap-2">
                <button
                  type="button"
                  className="w-9 h-9 rounded-full bg-transparent border border-slate-light/60 text-gray-400 hover:text-white hover:bg-slate-light flex items-center justify-center cursor-pointer transition-all duration-200 text-sm"
                >
                  <Mic size={15} />
                </button>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-9 h-9 rounded-full bg-teal hover:bg-teal-bright text-white flex items-center justify-center cursor-pointer transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed glow-teal hover:scale-105"
                >
                  <Send size={15} />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Quick cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full max-w-[740px] mx-auto">
        <button
          onClick={() => handleQuickCard('Review my Series A SHA terms')}
          className="bg-slate-mid border border-slate-light/60 hover:border-teal-dim hover:bg-slate-light/80 rounded-xl p-4.5 cursor-pointer text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg flex flex-col gap-1"
        >
          <span className="text-xl mb-1">🔍</span>
          <span className="font-sora text-xs font-semibold text-white">Review my SHA</span>
          <span className="text-[11px] text-gray-500 leading-normal">Flag unusual investor rights or liquidation preferences.</span>
        </button>

        <button
          onClick={() => handleQuickCard('Detect missing clauses in my employment agreement')}
          className="bg-slate-mid border border-slate-light/60 hover:border-teal-dim hover:bg-slate-light/80 rounded-xl p-4.5 cursor-pointer text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg flex flex-col gap-1"
        >
          <span className="text-xl mb-1">⚠️</span>
          <span className="font-sora text-xs font-semibold text-white">Detect missing clauses</span>
          <span className="text-[11px] text-gray-500 leading-normal">Check for post-employment non-competes or IP ownership transfers.</span>
        </button>

        <button
          onClick={() => handleQuickCard('Check for contradictions between SHA and NDA')}
          className="bg-slate-mid border border-slate-light/60 hover:border-teal-dim hover:bg-slate-light/80 rounded-xl p-4.5 cursor-pointer text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg flex flex-col gap-1"
        >
          <span className="text-xl mb-1">⚖️</span>
          <span className="font-sora text-xs font-semibold text-white">Cross-doc contradictions</span>
          <span className="text-[11px] text-gray-500 leading-normal">Does your Term Sheet or SHA conflict with your Mutual NDA IP terms?</span>
        </button>
      </div>
    </section>
  );
}
