import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Hero from './components/Hero';
import RiskDemo from './components/RiskDemo';
import DocumentsView from './components/DocumentsView';
import ReportsView from './components/ReportsView';
import Features from './components/Features';
import Pricing from './components/Pricing';
import TechStack from './components/TechStack';
import CTA from './components/CTA';

// Complete deal room documents dataset
const ALL_DEAL_DOCS = [
  {
    id: 'sha',
    name: 'Series A SHA — Acme Ventures × TechStartup Pvt. Ltd.',
    type: 'SHA',
    meta: 'SHA · 42 pages · Uploaded 2 hours ago · 138 clauses indexed',
    risks: [
      {
        title: 'Uncapped liquidation preference (3×)',
        desc: 'Investor receives 3× their investment before founders see any exit proceeds. No participation cap defined — this is significantly investor-favourable.',
        severity: 'HIGH',
        location: 'Clause 8.2(c)'
      },
      {
        title: 'Missing IP assignment clause',
        desc: 'No clause assigns pre-existing IP to the company. SHA Clause 14.1 references "Company IP" but NDA Clause 6 defines it differently — direct contradiction detected.',
        severity: 'HIGH',
        location: 'Cross-doc conflict'
      },
      {
        title: 'Broad drag-along rights (51% threshold)',
        desc: 'Drag-along can be triggered with only 51% investor vote. Standard market practice in India is 75% special resolution. Consider negotiating upward.',
        severity: 'MEDIUM',
        location: 'Clause 12.4'
      },
      {
        title: 'ESOP pool — standard structure',
        desc: '12% ESOP pool pre-money with standard 1-year cliff, 4-year vest. Consistent with SEBI AIF Category II norms.',
        severity: 'COMPLIANT',
        location: 'Clause 9.1'
      }
    ]
  },
  {
    id: 'nda',
    name: 'Mutual NDA — TechStartup × LargeVendor Corp',
    type: 'NDA',
    meta: 'NDA · 6 pages · Uploaded 1 hour ago · 18 clauses indexed',
    risks: [
      {
        title: 'Perpetual confidentiality obligations',
        desc: 'Clause 4 mandates confidentiality indefinitely. Standard practice in vendor NDAs in India is 3 to 5 years post-termination.',
        severity: 'MEDIUM',
        location: 'Clause 4.2'
      },
      {
        title: 'Out-of-jurisdiction Arbitration Seat (SIAC)',
        desc: 'Disputes are referred to Singapore International Arbitration Centre (SIAC). For domestic vendor contracts, Indian Arbitration Act 1996 in Mumbai/Delhi is recommended.',
        severity: 'MEDIUM',
        location: 'Clause 9.1'
      },
      {
        title: 'Prior Intellectual Property carve-outs',
        desc: 'Clause 6 contains standard protections ensuring pre-existing work is not transferred or compromised under disclosure definitions.',
        severity: 'COMPLIANT',
        location: 'Clause 6.1'
      }
    ]
  },
  {
    id: 'employment',
    name: 'Employment Agreement — Chief Technology Officer',
    type: 'Employment',
    meta: 'Employment · 11 pages · Uploaded 30 mins ago · 34 clauses indexed',
    risks: [
      {
        title: 'Missing Post-Termination Non-Compete',
        desc: 'Agent audited the agreement and flagged the absence of restrictive covenants. While post-employment non-competes face Section 27 scrutiny under the Indian Contract Act, negative covenants during employment and garden leave are essential.',
        severity: 'HIGH',
        location: 'Agent Audit Alert'
      },
      {
        title: 'Vague termination notice (15 days)',
        desc: 'Notice period is only 15 days. For key managerial personnel (KMPs), the recommended standard in India is 60 to 90 days to ensure proper knowledge transfer.',
        severity: 'MEDIUM',
        location: 'Clause 11.3'
      },
      {
        title: 'IP Assignment for inventions',
        desc: 'Clause 7 requires the employee to assign all inventions developed during employment. Clean wording, standard structure.',
        severity: 'COMPLIANT',
        location: 'Clause 7.2'
      }
    ]
  },
  {
    id: 'termsheet',
    name: 'TERM_SHEET_EQUITY — Seed & Series A Round',
    type: 'Term Sheet',
    meta: 'Term Sheet · 8 pages · Uploaded 3 hours ago · 29 clauses indexed',
    risks: [
      {
        title: 'Broad-based vs Full Ratchet Anti-dilution',
        desc: 'The draft references full-ratchet price protection in down-rounds, which punishes existing founders disproportionately compared to weighted-average anti-dilution.',
        severity: 'HIGH',
        location: 'Clause 4.1'
      },
      {
        title: 'Board seat and negative consent rights',
        desc: 'Investors demand veto on any operational expense exceeding ₹10,00,000, severely restricting routine executive decisions.',
        severity: 'MEDIUM',
        location: 'Schedule B'
      },
      {
        title: '60-day exclusivity (No-Shop) period',
        desc: '60-day lock-out period is standard market practice for venture capital institutional rounds in India.',
        severity: 'COMPLIANT',
        location: 'Clause 11'
      },
      {
        title: 'FEMA / RBI Reporting Condition Precedent',
        desc: 'Ensures foreign inward remittance is compliant with RBI pricing guidelines and Form FC-GPR filing deadlines.',
        severity: 'COMPLIANT',
        location: 'Clause 7'
      }
    ]
  },
  {
    id: 'safe',
    name: 'YC Post-Money SAFE & Pro Rata Agreement (Cayman v1.2)',
    type: 'SAFE',
    meta: 'SAFE · 9 pages · Uploaded 10 mins ago · 40 clauses indexed',
    risks: [
      {
        title: 'Option Pool Dilution Allocation',
        desc: 'Post-money valuation cap absorbs future option pool increases before equity round conversion, placing 100% of unissued pool dilution on founders.',
        severity: 'HIGH',
        location: 'Section 2 (Company Capitalisation)'
      },
      {
        title: 'Cayman Islands Governing Law & Courts',
        desc: 'Non-exclusive jurisdiction lies with Cayman courts. For Indian operating companies, enforceability requires reciprocal enforcement protocols.',
        severity: 'MEDIUM',
        location: 'Section 5(f)'
      },
      {
        title: 'Pro Rata Right Termination Event',
        desc: 'Pro Rata Rights terminate upon initial closing of Equity Financing or Liquidity Event. Standard YC practice.',
        severity: 'COMPLIANT',
        location: 'Pro Rata Agreement (Para 2)'
      },
      {
        title: 'No Shareholder Voting Rights Prior to Conversion',
        desc: 'Investor is not entitled to vote as a shareholder until conversion preference shares are formally issued and allotted.',
        severity: 'COMPLIANT',
        location: 'Section 5(c)'
      }
    ]
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [docs, setDocs] = useState(ALL_DEAL_DOCS);
  const [selectedDoc, setSelectedDoc] = useState(ALL_DEAL_DOCS[0]);
  const [isLoading, setIsLoading] = useState(false);

  // Chat conversation state — starts completely empty
  const [chatHistory, setChatHistory] = useState([]);

  // Sessions fetched from Supabase via backend API
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);

  // Fetch sessions from backend (Supabase) on mount
  useEffect(() => {
    fetch('/api/sessions')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setSessions(data);
      })
      .catch((err) => console.error('Failed to load sessions:', err));
  }, []);

  // Handle direct conversational search query — calls real backend RAG
  const handleSearch = useCallback(async (query) => {
    const userMsg = { role: 'user', text: query };
    setChatHistory((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          session_id: activeSessionId || undefined
        })
      });

      const data = await res.json();

      const aiMsg = {
        role: 'assistant',
        text: data.answer || 'No response from the analysis engine.',
        steps: data.steps || []
      };

      setChatHistory((prev) => [...prev, aiMsg]);

      // If backend created a new session, capture its id
      if (data.session_id && !activeSessionId) {
        setActiveSessionId(data.session_id);
      }

      // Refresh sessions list from Supabase so sidebar updates
      const sessRes = await fetch('/api/sessions');
      const sessData = await sessRes.json();
      if (Array.isArray(sessData)) setSessions(sessData);

    } catch (err) {
      console.error('Query failed:', err);
      const errMsg = {
        role: 'assistant',
        text: 'Sorry, the analysis engine is unreachable. Please make sure the backend server is running on port 8000.',
        steps: ['Connection Error']
      };
      setChatHistory((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [activeSessionId]);

  // Select a session → load its messages from Supabase
  const handleSelectSession = useCallback(async (sessionId) => {
    setActiveSessionId(sessionId);
    setActiveTab('home');
    try {
      const res = await fetch(`/api/sessions/${sessionId}`);
      const messages = await res.json();
      if (Array.isArray(messages)) {
        setChatHistory(
          messages.map((m) => ({
            role: m.role,
            text: m.content,
            steps: (() => { try { return JSON.parse(m.steps || '[]'); } catch { return []; } })()
          }))
        );
      }
    } catch (err) {
      console.error('Failed to load session messages:', err);
    }
  }, []);

  const handleNewSession = useCallback(() => {
    setChatHistory([]);
    setActiveSessionId(null);
    setActiveTab('home');
  }, []);

  // Delete session from Supabase
  const handleDeleteSession = useCallback(async (sessionId) => {
    try {
      await fetch(`/api/sessions/${sessionId}`, { method: 'DELETE' });
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      if (activeSessionId === sessionId) {
        setChatHistory([]);
        setActiveSessionId(null);
      }
    } catch (err) {
      console.error('Failed to delete session:', err);
    }
  }, [activeSessionId]);

  // Quick action triggers from Home Section
  const handleQuickAction = (actionKey) => {
    if (actionKey === 'sha') {
      const shaDoc = docs.find(d => d.id === 'sha') || docs[0];
      setSelectedDoc(shaDoc);
      setActiveTab('analysis');
      setTimeout(() => {
        document.getElementById('doc-analysis-sha')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else if (actionKey === 'missing') {
      const empDoc = docs.find(d => d.id === 'employment') || docs[0];
      setSelectedDoc(empDoc);
      setActiveTab('analysis');
      setTimeout(() => {
        document.getElementById('doc-analysis-employment')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else if (actionKey === 'contradictions') {
      setActiveTab('analysis');
      setTimeout(() => {
        document.getElementById('analysis')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      setActiveTab('analysis');
    }
  };

  // Simulated upload handler
  const handleFileUpload = (files) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const newDocs = Array.from(files).map((f, i) => ({
        id: `upload-${Date.now()}-${i}`,
        name: f.name,
        type: f.name.toUpperCase().includes('NDA') ? 'NDA' : f.name.toUpperCase().includes('SHA') ? 'SHA' : 'Agreement',
        meta: `${f.name.split('.').pop().toUpperCase()} · Uploaded just now · 24 clauses indexed`,
        risks: [
          {
            title: 'Initial AI Due Diligence Scan Complete',
            desc: `Document ${f.name} uploaded to Supabase Storage and successfully indexed in ChromaDB. Key clause parameters mapped.`,
            severity: 'COMPLIANT',
            location: 'Initial Ingestion'
          }
        ]
      }));
      setDocs(prev => [...newDocs, ...prev]);
      setActiveTab('documents');
    }, 1200);
  };

  return (
    <div className="flex bg-bg min-h-screen text-gray-200 font-sans">
      
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onNewSession={handleNewSession}
        onDeleteSession={handleDeleteSession}
      />

      {/* Main Content Area */}
      <main className="ml-[68px] flex-1 flex flex-col min-h-screen">
        
        {/* TAB 1: HOME (1st Screenshot Screen without chat) */}
        {activeTab === 'home' && (
          <div className="flex flex-col">
            <Hero
              onSearch={handleSearch}
              onImport={(filenames) => handleFileUpload(filenames.map(f => ({ name: f })))}
              onFileUpload={handleFileUpload}
              onQuickAction={handleQuickAction}
              chatHistory={chatHistory}
              isLoading={isLoading}
            />

            {/* Deal Room Status Metrics */}
            <div className="max-w-[1200px] mx-auto w-full px-8 mb-12">
              <div className="bg-slate-mid/70 border border-slate-light/50 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-6 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-teal/15 border border-teal/30 flex items-center justify-center text-teal-bright text-xl">
                    ⚖️
                  </div>
                  <div>
                    <h3 className="font-sora text-sm md:text-base font-semibold text-white">
                      Active Deal Room Overview
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Cloud synced with Supabase · 5 Analyzed Agreements · Automated Clause Indexing
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveTab('documents')}
                    className="px-4 py-2 rounded-xl bg-slate-dark hover:bg-slate-light border border-slate-light/60 text-xs font-mono text-gray-300 hover:text-white cursor-pointer transition-colors"
                  >
                    View Documents (5) →
                  </button>
                  <button
                    onClick={() => setActiveTab('analysis')}
                    className="px-4 py-2 rounded-xl bg-teal hover:bg-teal-bright text-white text-xs font-sora font-semibold cursor-pointer transition-colors shadow-md shadow-teal/20"
                  >
                    Open Risk Analysis →
                  </button>
                </div>
              </div>
            </div>

            {/* Supporting product value cards */}
            <Features />
            <Pricing />
            <TechStack />
            <CTA onImport={() => setActiveTab('documents')} />
          </div>
        )}

        {/* TAB 2: DOCUMENTS (Downloadable Supabase Repository) */}
        {activeTab === 'documents' && (
          <DocumentsView
            docs={docs}
            onSelectDoc={(doc) => setSelectedDoc(doc)}
            onNavigateToAnalysis={() => setActiveTab('analysis')}
          />
        )}

        {/* TAB 3: ANALYSIS (2nd Screenshot Screen for EVERY Document) */}
        {activeTab === 'analysis' && (
          <RiskDemo
            allDocs={docs}
            selectedDoc={selectedDoc}
            onSelectDoc={setSelectedDoc}
          />
        )}

        {/* TAB 4: REPORTS (Filled Out Due Diligence Summary) */}
        {activeTab === 'reports' && (
          <ReportsView
            docs={docs}
            onNavigateToAnalysis={() => setActiveTab('analysis')}
          />
        )}

        {/* TAB 5: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="py-12 px-10 max-w-[900px] mx-auto w-full">
            <h1 className="font-sora text-2xl font-bold text-white mb-2">Deal Room & Engine Settings</h1>
            <p className="text-xs text-gray-400 mb-8">Manage API connections, Supabase credentials, and active rerankers.</p>

            <div className="space-y-6">
              <div className="bg-slate-mid border border-slate-light/60 rounded-2xl p-6">
                <h3 className="font-sora text-sm font-semibold text-white mb-1">Supabase Storage Configuration</h3>
                <p className="text-xs text-gray-400 mb-4">Cloud bucket endpoint for legal document archiving and encrypted storage.</p>
                <div className="space-y-3 font-mono text-xs">
                  <div>
                    <label className="text-gray-500 block mb-1">SUPABASE_URL</label>
                    <input readOnly value="https://hrfthahhweklgxkswfzb.supabase.co" className="w-full bg-slate-dark border border-slate-light/40 rounded-lg p-2.5 text-gray-300" />
                  </div>
                  <div>
                    <label className="text-gray-500 block mb-1">STORAGE BUCKET</label>
                    <input readOnly value="legal-dealroom-vault (AES-256 Enabled)" className="w-full bg-slate-dark border border-slate-light/40 rounded-lg p-2.5 text-gray-300" />
                  </div>
                </div>
              </div>

              <div className="bg-slate-mid border border-slate-light/60 rounded-2xl p-6">
                <h3 className="font-sora text-sm font-semibold text-white mb-1">Active RAG Models & Keys</h3>
                <p className="text-xs text-gray-400 mb-4">Inference, vector embeddings, and cross-encoder rerankers status.</p>
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="bg-slate-dark p-3 rounded-lg border border-slate-light/40">
                    <div className="text-gray-500">RERANKER</div>
                    <div className="text-teal-bright font-bold mt-1">NVIDIA Nemotron</div>
                  </div>
                  <div className="bg-slate-dark p-3 rounded-lg border border-slate-light/40">
                    <div className="text-gray-500">EMBEDDINGS</div>
                    <div className="text-white font-bold mt-1">Cohere Embed v3.0</div>
                  </div>
                  <div className="bg-slate-dark p-3 rounded-lg border border-slate-light/40">
                    <div className="text-gray-500">VECTOR DB</div>
                    <div className="text-greenok font-bold mt-1">ChromaDB Local</div>
                  </div>
                  <div className="bg-slate-dark p-3 rounded-lg border border-slate-light/40">
                    <div className="text-gray-500">REASONING</div>
                    <div className="text-gold font-bold mt-1">LangGraph Agent</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Global Footer */}
        <footer className="bg-slate-dark border-t border-slate-light/40 py-7 px-10 mt-auto">
          <div className="max-w-[1200px] mx-auto w-full flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-4">
            <div className="font-sora font-bold text-teal-bright tracking-wider">
              LUMIÈREAI INDIA
            </div>
            <div>
              Built for Indian founders. Tuned to the Companies Act 2013, FEMA, and SEBI regulations.
            </div>
            <div className="flex gap-5">
              <a href="#" className="hover:text-teal-bright transition-colors">Privacy</a>
              <a href="#" className="hover:text-teal-bright transition-colors">Terms</a>
              <a href="#" className="hover:text-teal-bright transition-colors">API Docs</a>
              <a href="#" className="hover:text-teal-bright transition-colors">Contact</a>
            </div>
          </div>
        </footer>

      </main>

    </div>
  );
}
