import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, ExternalLink, RefreshCw, ShieldCheck, Terminal, Cpu, FileCode } from 'lucide-react';
import { api } from '../services/api';

export default function ApiKeyModal({ isOpen, onClose, backendStatus, onRefreshStatus }) {
  const [checking, setChecking] = useState(false);

  if (!isOpen) return null;

  const handleRefresh = async () => {
    setChecking(true);
    try {
      if (onRefreshStatus) await onRefreshStatus();
    } finally {
      setChecking(false);
    }
  };

  const isConfigured = backendStatus?.geminiConfigured;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg leading-tight">AI Engine & Backend Configuration</h3>
              <p className="text-xs text-blue-100">Google Gemini API Environment Status</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Status Box */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Backend Status</span>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                backendStatus?.online ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${backendStatus?.online ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                {backendStatus?.online ? 'Flask Server Online (127.0.0.1:5000)' : 'Backend Offline'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Gemini API Key</span>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                isConfigured ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {isConfigured ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Configured in backend/.env</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                    <span>Missing or Placeholder</span>
                  </>
                )}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Model</span>
              <span className="text-xs font-mono font-medium text-slate-700 bg-slate-200/60 px-2 py-0.5 rounded">
                {backendStatus?.model || 'gemini-2.5-flash'}
              </span>
            </div>
          </div>

          {/* Security Notice */}
          <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-950 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-blue-900">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Strict Security & Privacy:</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              For security compliance, API keys are never stored in browser memory, never exposed in frontend code, and are read exclusively from the backend environment.
            </p>
          </div>

          {/* Instructions on how to set the key */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-indigo-600" />
              <span>How to Configure Your Gemini API Key:</span>
            </label>
            <div className="p-3.5 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs space-y-2 shadow-inner">
              <div className="text-slate-400 text-[11px]"># Open backend/.env and paste your API key:</div>
              <div className="text-emerald-400 font-semibold select-all">
                GEMINI_API_KEY=YOUR_API_KEY_HERE
              </div>
              <div className="text-slate-400 text-[11px] pt-1 border-t border-slate-800">
                # File location: <span className="text-slate-300">smartstudy-ai/backend/.env</span>
              </div>
            </div>
          </div>

          {/* Google AI Studio link */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>Need an API key?</span>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium hover:underline"
            >
              <span>Get Key on Google AI Studio / Cloud</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-100">
          <button
            onClick={handleRefresh}
            disabled={checking}
            className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-semibold transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${checking ? 'animate-spin' : ''}`} />
            <span>Re-check Configuration</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-md shadow-blue-500/20 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
