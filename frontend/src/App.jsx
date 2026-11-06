
import React, { useState, useEffect } from 'react';

import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import NotesSummarizer from './components/NotesSummarizer';
import QuizGenerator from './components/QuizGenerator';
import AnswerImprover from './components/AnswerImprover';
import ConceptExplainer from './components/ConceptExplainer';
import ApiKeyModal from './components/ApiKeyModal';
import Toast from './components/Toast';
import Auth from './components/Auth';

import { api, auth } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  const [backendStatus, setBackendStatus] = useState({
    online: false,
    geminiConfigured: false,
    model: 'gemini-2.5-flash'
  });

  const [sampleData, setSampleData] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [toast, setToast] = useState({
    message: '',
    type: 'success'
  });

  const notify = (message, type = 'success') => {
    setToast({ message, type });
  };

  const refreshBackendStatus = async () => {
    try {
      const health = await api.checkHealth();

      setBackendStatus({
        online: true,
        geminiConfigured: Boolean(health.geminiConfigured),
        model: health.model || 'gemini-2.5-flash'
      });
    } catch {
      setBackendStatus({
        online: false,
        geminiConfigured: false,
        model: 'gemini-2.5-flash'
      });
    }

    try {
      const samplesRes = await api.getSamples();

      if (samplesRes.success && samplesRes.samples) {
        setSampleData(samplesRes.samples);
      }
    } catch {
      // Sample data is optional.
    }
  };

  useEffect(() => {
    const initializeApp = async () => {
      await refreshBackendStatus();

      if (!auth.isLoggedIn()) {
        setIsAuthenticated(false);
        setAuthChecking(false);
        return;
      }

      try {
        await api.getMe();
        setIsAuthenticated(true);
      } catch {
        auth.clearToken();
        setIsAuthenticated(false);
      } finally {
        setAuthChecking(false);
      }
    };

    initializeApp();
  }, []);

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
    setActiveTab('dashboard');
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch {
      auth.clearToken();
    }

    setIsAuthenticated(false);
    setActiveTab('dashboard');
    notify('Logged out successfully.', 'success');
  };

  if (authChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600">
          Loading SmartStudy AI...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Auth
          onAuthenticated={handleAuthenticated}
          notify={notify}
        />

        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({
            message: '',
            type: 'success'
          })}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">

      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        backendStatus={backendStatus}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {activeTab === 'dashboard' && (
          <Dashboard
            setActiveTab={setActiveTab}
            sampleData={sampleData}
            backendStatus={backendStatus}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        )}

        {activeTab === 'summarize' && (
          <NotesSummarizer
            notify={notify}
            sampleData={sampleData}
          />
        )}

        {activeTab === 'quiz' && (
          <QuizGenerator
            notify={notify}
            sampleData={sampleData}
          />
        )}

        {activeTab === 'improve' && (
          <AnswerImprover notify={notify} />
        )}

        {activeTab === 'explain' && (
          <ConceptExplainer notify={notify} />
        )}

      </main>

      <footer className="border-t border-slate-200 bg-white py-6 mt-10">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-500">
          SmartStudy AI – Your Intelligent Student Copilot
        </div>
      </footer>

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({
          message: '',
          type: 'success'
        })}
      />

      <ApiKeyModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        backendStatus={backendStatus}
        onRefresh={refreshBackendStatus}
      />

    </div>
  );
}
