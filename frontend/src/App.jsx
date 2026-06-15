import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Hero from './components/Hero';
import RiskDemo from './components/RiskDemo';
import Features from './components/Features';
import Pricing from './components/Pricing';
import TechStack from './components/TechStack';
import CTA from './components/CTA';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Mock documents dataset
const MOCK_DOCS = [
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
        desc: 'Drag-along can be triggered with only 51% investor vote. Standard market practice in India is 75%. Consider negotiating upward.',
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
        title: 'Out-of-jurisdiction Arbitration Seat',
        desc: 'Disputes are referred to Singapore International Arbitration Centre (SIAC). For small local contracts, domestic arbitration reduces litigation expenses.',
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
        desc: 'Agent audited the agreement and flagged the absence of restrictive covenants. While post-employment non-competes are hard to enforce under Section 27 of Indian Contract Act, inclusion acts as a vital deterrant.',
        severity: 'HIGH',
        location: 'Agent Audit Alert'
      },
      {
        title: 'Vague termination notice (15 days)',
        desc: 'Notice period is only 15 days. For key managerial positions (KMPs), the recommended standard in India is 60 to 90 days to allow knowledge transfer.',
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
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedDoc, setSelectedDoc] = useState(MOCK_DOCS[0]);
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // ─── Session State ────────────────────────────────────────────
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  // ─── Load sessions on mount ───────────────────────────────────
  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/sessions`);
      if (res.ok) {
        const data = await res.json();
        setSessions(data);
      }
    } catch (e) {
      console.log('Sessions fetch skipped (server may be offline)');
    }
  };

  const loadSessionMessages = async (sessionId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/sessions/${sessionId}`);
      if (res.ok) {
        const messages = await res.json();
        const formatted = messages.map((m) => ({
          role: m.role,
          text: m.content,
          steps: typeof m.steps === 'string' ? JSON.parse(m.steps) : (m.steps || [])
        }));
        setChatHistory(formatted);
        setActiveSessionId(sessionId);
      }
    } catch (e) {
      console.error('Failed to load session messages:', e);
    }
  };

  const handleSelectSession = (sessionId) => {
    loadSessionMessages(sessionId);
  };

  const handleNewSession = () => {
    setChatHistory([]);
    setActiveSessionId(null);
  };

  const handleDeleteSession = async (sessionId) => {
    try {
      await fetch(`${API_BASE_URL}/api/sessions/${sessionId}`, { method: 'DELETE' });
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      if (activeSessionId === sessionId) {
        setChatHistory([]);
        setActiveSessionId(null);
      }
    } catch (e) {
      console.error('Failed to delete session:', e);
    }
  };

  // Trigger real file imports and audits via FastAPI
  const handleImport = async (filenames) => {
    // If filenames is an array from file input, upload each file
    if (Array.isArray(filenames) && filenames.length > 0) {
      // The filenames are actually File objects from the file input
      // We need to get the actual files from the input
      return;
    }

    setIsLoading(true);
    setChatHistory((prev) => [
      ...prev,
      {
        role: 'system',
        text: '📎 Ingesting & Auditing: Mutual NDA.pdf, Employment Agreement.pdf, TERM_SHEET_EQUITY.pdf...'
      }
    ]);

    try {
      const response = await fetch(`${API_BASE_URL}/api/audit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error('API server returned error');
      }

      const data = await response.json();
      
      setIsLoading(false);
      setChatHistory((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: `✅ Real Agent Audit Completed! Compliance Score: ${data.compliance_score}%\n\n${data.analysis_report}`,
          steps: ['Agent Audit Loop', 'Contradiction Check', 'Report Synthesis']
        }
      ]);
      // Scroll to Analysis section
      document.getElementById('analysis')?.scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
      console.error("Error communicating with audit agent:", error);
      setTimeout(() => {
        setIsLoading(false);
        setChatHistory((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: '✅ Three documents ingested successfully! [Offline Fallback] 186 total clauses indexed into ChromaDB. I have detected 2 High-Risk clauses and 1 cross-document IP ownership conflict.',
            steps: ['PyMuPDF parse', 'Token splitting', 'OpenAI Embedding', 'ChromaDB Load', 'Server Offline Fallback']
          }
        ]);
        document.getElementById('analysis')?.scrollIntoView({ behavior: 'smooth' });
      }, 1500);
    }
  };

  // Handle file upload to Supabase + indexing
  const handleFileUpload = async (files) => {
    for (const file of files) {
      setIsLoading(true);
      setChatHistory((prev) => [
        ...prev,
        { role: 'system', text: `📎 Uploading & indexing: ${file.name}...` }
      ]);

      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${API_BASE_URL}/api/upload`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) throw new Error('Upload failed');
        const data = await response.json();

        setChatHistory((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: `✅ "${data.filename}" uploaded & indexed! ${data.chunks_indexed} chunks processed and stored in ChromaDB.${data.storage_url ? ' File backed up to cloud storage.' : ''}`,
            steps: ['PyMuPDF Parse', 'Chunk & Embed', 'ChromaDB Index', 'Supabase Storage']
          }
        ]);
      } catch (e) {
        console.error('Upload error:', e);
        setChatHistory((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: `⚠️ Failed to upload ${file.name}. Please try again.`,
            steps: ['Upload Error']
          }
        ]);
      }
      setIsLoading(false);
    }
  };

  // Trigger real RAG search query response via FastAPI
  const handleSearch = async (query) => {
    setChatHistory((prev) => [...prev, { role: 'user', text: query }]);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, session_id: activeSessionId }),
      });
      
      if (!response.ok) {
        throw new Error('API server returned error');
      }

      const data = await response.json();
      
      // Update session ID if a new one was created
      if (data.session_id && !activeSessionId) {
        setActiveSessionId(data.session_id);
        fetchSessions(); // Refresh sidebar list
      }

      let activeDocId = 'sha';
      const lowercaseAnswer = data.answer.toLowerCase();
      if (lowercaseAnswer.includes('nda') || lowercaseAnswer.includes('mutual nda') || lowercaseAnswer.includes('confidential')) {
        activeDocId = 'nda';
      } else if (lowercaseAnswer.includes('employment') || lowercaseAnswer.includes('employee') || lowercaseAnswer.includes('non-compete')) {
        activeDocId = 'employment';
      }

      setIsLoading(false);
      setChatHistory((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: data.answer,
          steps: data.steps
        }
      ]);

      const targetDoc = MOCK_DOCS.find(d => d.id === activeDocId);
      if (targetDoc) {
        setSelectedDoc(targetDoc);
      }
    } catch (error) {
      console.error("Error communicating with RAG server:", error);
      setIsLoading(false);
      
      let replyText = '';
      let activeDocId = 'sha';
      let steps = [];
      const lowercaseQuery = query.toLowerCase();

      if (lowercaseQuery.includes('nda') || lowercaseQuery.includes('disclosure') || lowercaseQuery.includes('confidential')) {
        replyText = "🔍 RAG Search matched 'Mutual NDA.pdf'. Key risk flagged: Perpetual confidentiality clauses (Clause 4.2) and out-of-jurisdiction dispute seats (SIAC, Clause 9.1). Custom IP exclusions are compliant.";
        activeDocId = 'nda';
        steps = ['BM25 Search', 'Chroma query', 'Cohere Rerank'];
      } else if (lowercaseQuery.includes('employment') || lowercaseQuery.includes('employee') || lowercaseQuery.includes('non-compete')) {
        replyText = "⚠️ Agentic check on 'Employment Agreement.pdf' completed. Proactive audit Alert: post-termination non-compete covenants are missing. Notice period is too short (15 days) for a CTO position.";
        activeDocId = 'employment';
        steps = ['Chroma query', 'LangGraph Agent Audit', 'Section 27 check'];
      } else if (lowercaseQuery.includes('sha') || lowercaseQuery.includes('shareholders') || lowercaseQuery.includes('lock-in') || lowercaseQuery.includes('preference') || lowercaseQuery.includes('contradiction')) {
        replyText = "⚖️ Graph RAG contradiction check completed on 'Series A SHA'. Conflict detected: Clause 14.1 (IP assignment) conflicts with NDA Clause 6. Also, liquidation preference multiplier is investor-favourable (3x uncapped).";
        activeDocId = 'sha';
        steps = ['FAISS search', 'Neo4j Graph Traversal', 'LangGraph contradict node'];
      } else {
        replyText = "I ran a hybrid search across the deal room. The SHA contains an uncapped 3x liquidation preference, the employment contract lacks a non-compete, and there is an IP contradiction between SHA Clause 14.1 and Mutual NDA Clause 6.";
        activeDocId = 'sha';
        steps = ['BM25 + Semantic', 'RRF Blending', 'Rerank'];
      }

      setChatHistory((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: `[Offline Fallback] ${replyText}`,
          steps: [...steps, "Server Offline Fallback"]
        }
      ]);
      
      const targetDoc = MOCK_DOCS.find(d => d.id === activeDocId);
      if (targetDoc) {
        setSelectedDoc(targetDoc);
      }
    }
  };

  // Calculate sidebar offset based on history panel
  const mainMargin = sidebarExpanded ? 'ml-[328px]' : 'ml-[68px]';

  return (
    <div className="flex bg-bg min-h-screen text-gray-200 font-sans">
      
      {/* Sidebar navigation with history panel */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onNewSession={handleNewSession}
        onDeleteSession={handleDeleteSession}
      />

      {/* Main dashboard space */}
      <main className="ml-[68px] flex-1 flex flex-col min-h-screen">
        
        {/* Hero & Interactive RAG Chat Box */}
        <Hero
          onSearch={handleSearch}
          onImport={handleImport}
          onFileUpload={handleFileUpload}
          chatHistory={chatHistory}
          isLoading={isLoading}
        />

        {/* Dynamic Risk Audit Panels */}
        <RiskDemo
          selectedDoc={selectedDoc}
          allDocs={MOCK_DOCS}
          onSelectDoc={setSelectedDoc}
        />

        {/* Value features grid */}
        <Features />

        {/* Pricing tiers */}
        <Pricing />

        {/* Categorized Stack modules */}
        <TechStack />

        {/* Banner call to action */}
        <CTA onImport={handleImport} />

        {/* Footer info */}
        <footer className="bg-slate-dark border-t border-slate-light/40 py-7 px-10">
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
