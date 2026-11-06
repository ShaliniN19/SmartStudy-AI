import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  FileText,
  Lightbulb,
  AlertCircle,
  BookmarkCheck,
  ListChecks,
  KeyRound,
  FileCheck
} from 'lucide-react';
import { api } from '../services/api';

export default function NotesSummarizer({ onNotify, sampleData }) {
  const [notes, setNotes] = useState('');
  const [style, setStyle] = useState('balanced');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);

  const handleLoadSample = () => {
    if (sampleData?.summarize?.notes) {
      setNotes(sampleData.summarize.notes);
      setError(null);
      if (onNotify) onNotify('Sample study notes loaded on Cellular Respiration!', 'info');
    }
  };

  const handleClear = () => {
    setNotes('');
    setResult(null);
    setError(null);
  };

  const handleSummarize = async (e) => {
    e?.preventDefault();
    if (!notes.trim()) {
      setError('Please paste your study notes before summarizing.');
      return;
    }
    if (notes.trim().length < 15) {
      setError('Please enter at least 15 characters of notes to produce an accurate summary.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.summarize(notes.trim(), style);
      if (res.success && res.data) {
        setResult(res.data);
        if (onNotify) onNotify('Notes summarized successfully with Gemini AI!');
      } else {
        setError(res.error || 'Failed to generate summary.');
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

  const copyFullMarkdown = () => {
    if (!result) return;
    let md = `# ${result.title || 'Study Summary'}\n\n`;

    const summary = result.shortSummary || result.overview;
    if (summary) {
      md += `## Short Summary\n${summary}\n\n`;
    }

    const points = result.importantPoints || result.keyTakeaways;
    if (points && points.length > 0) {
      md += `## Important Points\n` + points.map((p) => `- ${p}`).join('\n') + `\n\n`;
    }

    const definitions = result.keyDefinitions || result.importantFormulasOrTerms;
    if (definitions && definitions.length > 0) {
      md += `## Key Definitions\n` + definitions.map((d) => `- **${d.term}**: ${d.definition}`).join('\n') + `\n\n`;
    }

    const highlights = result.examHighlights || result.examTips;
    if (highlights && highlights.length > 0) {
      md += `## Exam Highlights\n` + highlights.map((h) => `* ${h}`).join('\n');
    }

    copyToClipboard(md, 'full_markdown');
  };

  const wordCount = notes.trim() ? notes.trim().split(/\s+/).length : 0;
  const charCount = notes.length;

  const summaryText = result?.shortSummary || result?.overview;
  const pointsList = result?.importantPoints || result?.keyTakeaways || [];
  const definitionsList = result?.keyDefinitions || result?.importantFormulasOrTerms || [];
  const highlightsList = result?.examHighlights || result?.examTips || [];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl text-white shadow-lg shadow-blue-500/10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Notes Summarizer</h1>
            <p className="text-xs sm:text-sm text-blue-100 mt-0.5">
              Paste lengthy notes to extract a short summary, important bullet points, key definitions, and exam highlights.
            </p>
          </div>
        </div>
        <button
          onClick={handleLoadSample}
          className="self-start sm:self-center px-4 py-2 bg-white/15 hover:bg-white/25 border border-white/30 rounded-xl text-xs font-semibold text-white transition-all flex items-center gap-2 shadow-xs shrink-0"
        >
          <FileText className="w-4 h-4 text-amber-300" />
          <span>Load Biology Sample Notes</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Form Column (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800 text-sm">Input Study Notes</span>
              <span className="text-xs text-slate-500 font-medium">({wordCount} words)</span>
            </div>
            {notes && (
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-slate-500 hover:text-rose-600 font-medium transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          <form onSubmit={handleSummarize} className="space-y-4">
            {/* Textarea */}
            <div>
              <textarea
                rows={12}
                value={notes}
                onChange={(e) => {
                  setNotes(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Paste your lecture notes, textbook excerpt, study guide, or video transcript here..."
                className="w-full p-4 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400 font-normal leading-relaxed resize-y"
              />
              <div className="flex justify-between items-center mt-1.5 px-1 text-[11px] text-slate-500 font-medium">
                <span>Minimum 15 characters</span>
                <span>{charCount} characters</span>
              </div>
            </div>

            {/* Summary Style Options */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Summary Depth & Focus
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'balanced', label: 'Balanced Summary', desc: 'Standard high-yield' },
                  { id: 'concise', label: 'Concise Bullet', desc: 'Fast exam review' },
                  { id: 'detailed', label: 'In-Depth Summary', desc: 'Thorough coverage' },
                  { id: 'flashcards', label: 'Definitions Focus', desc: 'Terms & formulas' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setStyle(item.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      style === item.id
                        ? 'border-blue-500 bg-blue-50/70 text-blue-900 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs font-semibold">{item.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-start gap-2 animate-fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !notes.trim()}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Summarizing Notes with Gemini AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Generate Summary</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {!result && !loading && (
            <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <BookOpen className="w-8 h-8" />
              </div>
              <div className="max-w-sm mx-auto space-y-1">
                <h3 className="text-base font-bold text-slate-800">No Summary Generated Yet</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Paste your study notes on the left or click "Load Biology Sample Notes" to generate real AI-powered summaries, key points, definitions, and exam highlights.
                </p>
              </div>
            </div>
          )}

          {/* Loading Skeleton */}
          {loading && (
            <div className="p-8 bg-white rounded-2xl border border-slate-200 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 animate-pulse" />
                <div className="space-y-2 flex-1">
                  <div className="h-5 w-48 bg-slate-200 rounded animate-pulse" />
                  <div className="h-3 w-32 bg-slate-100 rounded animate-pulse" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-4 w-full bg-slate-100 rounded animate-pulse" />
                <div className="h-4 w-5/6 bg-slate-100 rounded animate-pulse" />
                <div className="h-4 w-4/6 bg-slate-100 rounded animate-pulse" />
              </div>
              <div className="grid grid-cols-2 gap-3 pt-4">
                <div className="h-20 bg-slate-100 rounded-xl animate-pulse" />
                <div className="h-20 bg-slate-100 rounded-xl animate-pulse" />
              </div>
            </div>
          )}

          {/* Generated Result Display */}
          {result && !loading && (
            <div className="space-y-6 animate-fade-in">
              {/* Title & Master Actions */}
              <div className="flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    AI Study Brief
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 mt-1">{result.title || 'Notes Summary'}</h2>
                </div>
                <button
                  onClick={copyFullMarkdown}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5"
                >
                  {copiedKey === 'full_markdown' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied Summary!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Full Result</span>
                    </>
                  )}
                </button>
              </div>

              {/* 1. Short Summary */}
              {summaryText && (
                <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
                      <BookmarkCheck className="w-4 h-4 text-blue-600" />
                      <span>Short Summary</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(summaryText, 'short_summary')}
                      className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
                    >
                      {copiedKey === 'short_summary' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy</span>
                    </button>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">{summaryText}</p>
                </div>
              )}

              {/* 2. Important Points */}
              {pointsList.length > 0 && (
                <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider">
                      <ListChecks className="w-4 h-4" />
                      <span>Important Points</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(pointsList.map((p) => `• ${p}`).join('\n'), 'points')}
                      className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
                    >
                      {copiedKey === 'points' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy Bullets</span>
                    </button>
                  </div>
                  <ul className="space-y-2.5">
                    {pointsList.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                        <span className="leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 3. Key Definitions */}
              {definitionsList.length > 0 && (
                <div className="p-5 bg-gradient-to-br from-slate-50 to-indigo-50/30 rounded-2xl border border-indigo-100 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-indigo-900 uppercase tracking-wider">
                      <KeyRound className="w-4 h-4 text-indigo-600" />
                      <span>Key Definitions</span>
                    </div>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          definitionsList.map((d) => `${d.term}: ${d.definition}`).join('\n\n'),
                          'definitions'
                        )
                      }
                      className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
                    >
                      {copiedKey === 'definitions' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy Terms</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {definitionsList.map((defItem, idx) => (
                      <div key={idx} className="p-3 bg-white rounded-xl border border-indigo-100/70 shadow-xs space-y-1">
                        <div className="font-bold text-xs text-indigo-950">{defItem.term}</div>
                        <div className="text-[11px] text-slate-600 leading-relaxed">
                          {defItem.definition}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Exam Highlights */}
              {highlightsList.length > 0 && (
                <div className="p-5 bg-amber-50/70 rounded-2xl border border-amber-200 shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wider">
                      <Lightbulb className="w-4 h-4 text-amber-600" />
                      <span>Exam Highlights</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(highlightsList.map((h) => `• ${h}`).join('\n'), 'highlights')}
                      className="text-xs text-amber-800 hover:text-amber-950 flex items-center gap-1"
                    >
                      {copiedKey === 'highlights' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy</span>
                    </button>
                  </div>
                  <ul className="space-y-2">
                    {highlightsList.map((highlight, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-amber-950">
                        <span className="font-bold text-amber-600 shrink-0">•</span>
                        <span className="leading-relaxed font-medium">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
