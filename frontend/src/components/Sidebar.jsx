import React, { useState } from 'react';
import { Home, FileText, BarChart3, Search, MessageSquare, Settings, LogOut, Plus, Trash2, Clock } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, sessions = [], activeSessionId, onSelectSession, onNewSession, onDeleteSession }) {
  const [expanded, setExpanded] = useState(false);

  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'documents', icon: FileText, label: 'Documents' },
    { id: 'analysis', icon: BarChart3, label: 'Analysis' },
    { id: 'reports', icon: Search, label: 'Reports' },
    { id: 'chat', icon: MessageSquare, label: 'Chat' },
  ];

  const toggleHistory = () => {
    setExpanded(!expanded);
  };

  // Format timestamp to relative time
  const timeAgo = (dateStr) => {
    const now = new Date();
    const then = new Date(dateStr);
    const diff = Math.floor((now - then) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <>
      {/* Slim icon bar — always visible */}
      <nav className="w-[68px] bg-slate-dark border-r border-slate-light/40 flex flex-col items-center py-5 fixed top-0 left-0 bottom-0 z-50 gap-2">
        {/* Brand logo (Vertical text) */}
        <div className="font-sora font-extrabold text-[13px] text-teal-bright tracking-[0.12em] mb-5 select-none [writing-mode:vertical-rl] rotate-180">
          LA
        </div>

        {/* Navigation Icons */}
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (item.id === 'chat') setExpanded(true);
              }}
              title={item.label}
              className={`w-[42px] h-[42px] rounded-xl flex items-center justify-center cursor-pointer transition-all duration-200 border border-transparent ${
                isActive
                  ? 'bg-teal text-white border-teal-bright glow-teal'
                  : 'text-gray-500 hover:bg-slate-light hover:text-gray-300'
              }`}
            >
              <IconComponent size={18} />
            </button>
          );
        })}

        {/* History toggle button */}
        <button
          onClick={toggleHistory}
          title="Chat History"
          className={`w-[42px] h-[42px] rounded-xl flex items-center justify-center cursor-pointer transition-all duration-200 border border-transparent ${
            expanded
              ? 'bg-teal text-white border-teal-bright glow-teal'
              : 'text-gray-500 hover:bg-slate-light hover:text-gray-300'
          }`}
        >
          <Clock size={18} />
        </button>

        <div className="flex-1"></div>

        {/* Bottom Action Icons */}
        <button
          onClick={() => setActiveTab('settings')}
          title="Settings"
          className={`w-[42px] h-[42px] rounded-xl flex items-center justify-center cursor-pointer transition-all duration-200 border border-transparent ${
            activeTab === 'settings'
              ? 'bg-teal text-white border-teal-bright glow-teal'
              : 'text-gray-500 hover:bg-slate-light hover:text-gray-300'
          }`}
        >
          <Settings size={18} />
        </button>

        <button
          title="Logout"
          className="w-[42px] h-[42px] rounded-xl flex items-center justify-center cursor-pointer transition-all duration-200 text-gray-500 hover:bg-slate-light hover:text-gray-300"
        >
          <LogOut size={18} />
        </button>

        {/* Profile Avatar */}
        <div className="w-[38px] h-[38px] rounded-full bg-gradient-to-br from-teal-dim to-slate-mid border-2 border-teal flex items-center justify-center text-sm font-bold text-teal-bright font-sora cursor-pointer mt-1">
          R
        </div>
      </nav>

      {/* Expandable History Panel */}
      <div
        className={`fixed top-0 bottom-0 left-[68px] z-40 bg-slate-dark border-r border-slate-light/40 flex flex-col transition-all duration-300 ease-in-out overflow-hidden ${
          expanded ? 'w-[260px] opacity-100' : 'w-0 opacity-0'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-slate-light/40 min-w-[260px]">
          <h2 className="font-sora text-sm font-semibold text-white tracking-wide">Chat History</h2>
          <button
            onClick={onNewSession}
            title="New Chat"
            className="w-8 h-8 rounded-lg bg-teal/20 hover:bg-teal/40 text-teal-bright flex items-center justify-center transition-all duration-200 cursor-pointer"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* Sessions list */}
        <div className="flex-1 overflow-y-auto py-2 px-2 space-y-1 min-w-[260px] scrollbar-thin">
          {sessions.length === 0 ? (
            <div className="text-center py-8 px-3">
              <MessageSquare size={28} className="mx-auto text-gray-600 mb-3" />
              <p className="text-xs text-gray-500 leading-relaxed">No conversations yet. Start a new chat to see your history here.</p>
            </div>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                onClick={() => onSelectSession(session.id)}
                className={`group flex items-start gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 ${
                  activeSessionId === session.id
                    ? 'bg-teal/15 border border-teal/30'
                    : 'hover:bg-slate-light/60 border border-transparent'
                }`}
              >
                <MessageSquare size={14} className={`mt-0.5 flex-shrink-0 ${
                  activeSessionId === session.id ? 'text-teal-bright' : 'text-gray-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium truncate ${
                    activeSessionId === session.id ? 'text-white' : 'text-gray-300'
                  }`}>
                    {session.title}
                  </p>
                  <p className="text-[10px] text-gray-600 mt-0.5">
                    {timeAgo(session.created_at)}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSession(session.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-600 hover:text-redflag p-0.5 cursor-pointer"
                  title="Delete"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
