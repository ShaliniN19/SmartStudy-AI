import React, { useState } from 'react';
import {
  FileCheck2,
  Sparkles,
  Copy,
  Check,
  TrendingUp,
  FileText,
  AlertCircle,
  RotateCcw,
  CheckCircle2,
  GraduationCap,
  Lightbulb,
  ListOrdered,
  Wand2,
  BookOpen
} from 'lucide-react';
import { api } from '../services/api';

export default function AnswerImprover({ onNotify, sampleData }) {
  const [question, setQuestion] = useState('');
  const [draft, setDraft] = useState('');
  const [targetLevel, setTargetLevel] = useState('undergraduate');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('improved'); // 'improved' or 'comparison'
  const [copiedKey, setCopiedKey] = useState(null);

  const handleLoadSample = () => {
    if (sampleData?.improve_answer) {
      setQuestion(sampleData.improve_answer.question);
      setDraft(sampleData.improve_answer.draft);
      setError(null);
      if (onNotify) onNotify('Sample Economics Question & Draft loaded!', 'info');
    }
  };

  const handleClear = () => {
    setQuestion('');
    setDraft('');
    setResult(null);
    setError(null);
  };

  const handleImprove = async (e) => {
    e?.preventDefault();
    if (!draft.trim()) {
      setError('Please provide your draft answer to improve.');
      return;
    }
    if (draft.trim().length < 8) {
      setError('Draft answer is too short to analyze and elevate (minimum 8 characters).');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.improveAnswer(question.trim(), draft.trim(), targetLevel);
      if (res.success && res.data) {
        setResult(res.data);
        if (onNotify) onNotify('Answer successfully elevated to A+ standard with Gemini AI!');
      } else {
        setError(res.error || 'Failed to improve answer.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while communicating with the server.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    if (onNotify) onNotify('Copied to clipboard!');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const importantPoints = result?.importantPoints || [];
  const suggestedImprovements = result?.suggestedImprovements || [];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 rounded-3xl text-white shadow-lg shadow-indigo-500/10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
            <FileCheck2 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Answer Improver</h1>
            <p className="text-xs sm:text-sm text-indigo-100 mt-0.5">
              Enter your basic draft answer to generate an improved, well-structured exam answer, important points, and suggested improvements.
            </p>
          </div>
        </div>
        <button
          onClick={handleLoadSample}
          className="self-start sm:self-center px-4 py-2 bg-white/15 hover:bg-white/25 border border-white/30 rounded-xl text-xs font-semibold text-white transition-all flex items-center gap-2 shadow-xs shrink-0"
        >
          <FileText className="w-4 h-4 text-amber-300" />
          <span>Load Economics Essay Sample</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Column (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800 text-sm">Exam Question & Draft</span>
            {(question || draft) && (
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-slate-500 hover:text-rose-600 font-medium"
              >
                Clear
              </button>
            )}
          </div>

          <form onSubmit={handleImprove} className="space-y-4">
            {/* Exam Question (Optional) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Exam Question Prompt <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={question}
                onChange={(e) => {
                  setQuestion(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="e.g. 'Explain the economic concept of Opportunity Cost...'"
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Student's Draft */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Your Basic / Draft Answer <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={9}
                value={draft}
                onChange={(e) => {
                  setDraft(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Write your basic or poorly structured answer here. AI will fix grammar, structure, and academic vocabulary while preserving your meaning."
                className="w-full p-4 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-slate-400 font-normal leading-relaxed resize-y"
              />
            </div>

            {/* Target Academic Level */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Target Academic Rigor
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'high_school', label: 'High School', desc: 'Clear & structured' },
                  { id: 'undergraduate', label: 'Undergraduate', desc: 'Formal analysis' },
                  { id: 'honors', label: 'Advanced / A+', desc: 'Scholarly critique' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTargetLevel(item.id)}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      targetLevel === item.id
                        ? 'border-indigo-500 bg-indigo-50/70 text-indigo-900 font-bold shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs">{item.label}</div>
                    <div className="text-[10px] text-slate-500 font-normal">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-start gap-2 animate-fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !draft.trim()}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin" />
                  <span>Elevating Answer with Gemini AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Improve & Elevate Answer</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {!result && !loading && (
            <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <FileCheck2 className="w-8 h-8" />
              </div>
              <div className="max-w-sm mx-auto space-y-1">
                <h3 className="text-base font-bold text-slate-800">No Improved Answer Yet</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Enter your draft answer or click "Load Economics Essay Sample" to generate a well-structured A+ model answer, key points, and suggested improvements.
                </p>
              </div>
            </div>
          )}

          {/* Loading Skeleton */}
          {loading && (
            <div className="p-8 bg-white rounded-2xl border border-slate-200 space-y-6">
              <div className="h-14 bg-indigo-50 rounded-2xl animate-pulse" />
              <div className="space-y-3">
                <div className="h-4 w-full bg-slate-100 rounded animate-pulse" />
                <div className="h-4 w-5/6 bg-slate-100 rounded animate-pulse" />
                <div className="h-4 w-4/6 bg-slate-100 rounded animate-pulse" />
              </div>
              <div className="h-28 bg-slate-50 rounded-xl animate-pulse" />
            </div>
          )}

          {/* Result Display */}
          {result && !loading && (
            <div className="space-y-6 animate-fade-in">
              {/* Score Uplift Banner */}
              <div className="p-5 bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                      {result.scoreAssessment?.gradeLevel || 'Elevated to A+'}
                    </span>
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h3 className="text-base font-bold">Academic Assessment Uplift</h3>
                  <p className="text-xs text-slate-300 max-w-md leading-relaxed">
                    {result.scoreAssessment?.evaluationSummary}
                  </p>
                </div>

                <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 shrink-0">
                  <div className="text-center">
                    <div className="text-[10px] text-slate-300 uppercase font-bold">Original</div>
                    <div className="text-lg font-bold text-amber-300">{result.scoreAssessment?.originalScore || '5/10'}</div>
                  </div>
                  <div className="text-slate-400 font-bold">→</div>
                  <div className="text-center">
                    <div className="text-[10px] text-slate-300 uppercase font-bold">Improved</div>
                    <div className="text-xl font-extrabold text-emerald-400">{result.scoreAssessment?.improvedScore || '9.5/10'}</div>
                  </div>
                </div>
              </div>

              {/* View Toggle Bar (Improved Answer vs Side-by-Side Comparison) */}
              <div className="flex items-center justify-between p-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('improved')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      activeTab === 'improved'
                        ? 'bg-indigo-100 text-indigo-900 shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Improved Answer
                  </button>
                  <button
                    onClick={() => setActiveTab('comparison')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      activeTab === 'comparison'
                        ? 'bg-indigo-100 text-indigo-900 shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Draft vs. Improved Comparison
                  </button>
                </div>

                <button
                  onClick={() => copyToClipboard(result.improvedAnswer, 'improved_answer')}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-all flex items-center gap-1.5 shadow-sm"
                >
                  {copiedKey === 'improved_answer' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-200" />
                      <span>Copied Answer!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Result</span>
                    </>
                  )}
                </button>
              </div>

              {/* 1. Improved Answer View */}
              {activeTab === 'improved' && (
                <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4" />
                      <span>Improved Answer</span>
                    </span>
                    <span className="text-xs text-slate-500 font-medium">Exam-Ready Structure</span>
                  </div>
                  <div className="text-xs sm:text-sm text-slate-800 leading-relaxed space-y-3 whitespace-pre-line font-serif">
                    {result.improvedAnswer}
                  </div>
                </div>
              )}

              {/* Comparison View */}
              {activeTab === 'comparison' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <span className="text-xs font-bold uppercase text-slate-500">Your Original Draft</span>
                    <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                      {draft}
                    </p>
                  </div>
                  <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-200 space-y-2">
                    <span className="text-xs font-bold uppercase text-indigo-800">Elevated A+ Answer</span>
                    <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-line font-medium">
                      {result.improvedAnswer}
                    </p>
                  </div>
                </div>
              )}

              {/* 2. Important Points */}
              {importantPoints.length > 0 && (
                <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider">
                      <ListOrdered className="w-4 h-4" />
                      <span>Important Points</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(importantPoints.map((p) => `• ${p}`).join('\n'), 'points')}
                      className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
                    >
                      {copiedKey === 'points' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy Points</span>
                    </button>
                  </div>
                  <ul className="space-y-2">
                    {importantPoints.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                        <span className="leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 3. Suggested Improvements */}
              {suggestedImprovements.length > 0 && (
                <div className="p-5 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 rounded-2xl border border-indigo-100 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-950 uppercase tracking-wider">
                    <Wand2 className="w-4 h-4 text-indigo-600" />
                    <span>Suggested Improvements</span>
                  </div>
                  <div className="space-y-2">
                    {suggestedImprovements.map((sug, idx) => (
                      <div key={idx} className="p-3 bg-white rounded-xl border border-indigo-100/80 shadow-2xs text-xs text-slate-700 leading-relaxed flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{sug}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Critique: Strengths & Weaknesses */}
              {result.critique && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-2">
                    <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>What You Got Right</span>
                    </span>
                    <ul className="space-y-1.5">
                      {result.critique.strengths?.map((str, idx) => (
                        <li key={idx} className="text-xs text-emerald-950 flex items-start gap-1.5">
                          <span className="text-emerald-500 font-bold">•</span>
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-2">
                    <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      <span>Areas for Elevation</span>
                    </span>
                    <ul className="space-y-1.5">
                      {result.critique.weaknesses?.map((weak, idx) => (
                        <li key={idx} className="text-xs text-amber-950 flex items-start gap-1.5">
                          <span className="text-amber-500 font-bold">•</span>
                          <span>{weak}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
