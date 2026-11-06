
import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  HelpCircle,
  FileCheck2,
  Lightbulb,
  LayoutDashboard,
  Settings,
  Menu,
  X,
  LogOut
} from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  backendStatus,
  onOpenSettings,
  onLogout
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'summarize', label: 'Notes Summarizer', icon: BookOpen },
    { id: 'quiz', label: 'Quiz Generator', icon: HelpCircle },
    { id: 'improve', label: 'Answer Improver', icon: FileCheck2 },
    { id: 'explain', label: 'Concept Explainer', icon: Lightbulb },
  ];

  const isLive = backendStatus?.geminiConfigured;

  const handleLogout = () => {
    setMobileMenuOpen(false);
    onLogout?.();
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between h-16">

          {/* Logo and Brand */}
          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-slate-900 tracking-tight">
                  SmartStudy
                </span>

                <span className="px-1.5 py-0.5 text-[10px] font-extrabold tracking-wider uppercase text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-md shadow-sm">
                  AI
                </span>
              </div>

              <p className="text-[11px] text-slate-600 font-medium hidden sm:block">
                Intelligent Student Copilot
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-white text-blue-700 shadow-sm shadow-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      isActive ? 'text-blue-600' : 'text-slate-500'
                    }`}
                  />

                  <span>{item.label}</span>
                </button>
              );
            })}

          </nav>

          {/* Actions and Status */}
          <div className="flex items-center gap-2.5">

            {/* Backend Status */}
            <button
              onClick={onOpenSettings}
              className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                !backendStatus?.online
                  ? 'bg-rose-50 border-rose-200 text-rose-700'
                  : isLive
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-amber-50 border-amber-200 text-amber-700'
              }`}
              title="Click to view AI engine status"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  !backendStatus?.online
                    ? 'bg-rose-500'
                    : isLive
                    ? 'bg-emerald-500 animate-pulse'
                    : 'bg-amber-500'
                }`}
              />

              <span>
                {!backendStatus?.online
                  ? 'Backend Offline'
                  : isLive
                  ? 'Live Gemini AI'
                  : 'API Key Required'}
              </span>
            </button>

            {/* Settings Button */}
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all"
              aria-label="Settings"
              title="AI Engine Status"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Desktop Logout Button */}
            <button
              onClick={handleLogout}
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen
                ? <X className="w-5 h-5" />
                : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 bg-white border-b border-slate-200 space-y-1 animate-fade-in">

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-blue-600' : 'text-slate-400'
                  }`}
                />

                <span>{item.label}</span>
              </button>
            );
          })}

          {/* Mobile Engine Status */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs px-2 text-slate-500">

            <span>
              Status: {!backendStatus?.online
                ? 'Backend Offline'
                : isLive
                ? 'Live Gemini AI'
                : 'API Key Required'}
            </span>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSettings();
              }}
              className="text-blue-600 font-medium hover:underline"
            >
              Engine Status
            </button>

          </div>

          {/* Mobile Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>

        </div>
      )}

    </header>
  );
}
