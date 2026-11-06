import React, { useState } from 'react';
import {
  Lightbulb,
  Sparkles,
  Copy,
  Check,
  FileText,
  AlertCircle,
  RotateCcw,
  Globe2,
  Brain,
  Quote,
  Layers,
  KeyRound,
  BookCheck
} from 'lucide-react';
import { api } from '../services/api';

export default function ConceptExplainer({ onNotify, sampleData }) {
  const [concept, setConcept] = useState('');
  const [depth, setDepth] = useState('intuitive');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);

  const handleLoadSample = () => {
    if (sampleData?.explain_concept?.concept) {
      setConcept(sampleData.explain_concept.concept);
      setError(null);
      if (onNotify) onNotify('Sample concept loaded: Distributed Consensus & Byzantine Generals!', 'info');
    }
  };

  const handleClear = () => {
    setConcept('');
    setResult(null);
    setError(null);
  };

  const handleExplain = async (e) => {
    e?.preventDefault();
    if (!concept.trim()) {
      setError('Please enter a concept, topic, or theory to explain.');
      return;
    }
    if (concept.trim().length < 3) {
      setError('Please enter a valid concept name or question (at least 3 characters).');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.explainConcept(concept.trim(), depth);
      if (res.success && res.data) {
        setResult(res.data);
        if (onNotify) onNotify('Concept explained with Gemini AI!');
      } else {
        setError(res.error || 'Failed to explain concept.');
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

  const copyFullConceptMarkdown = () => {
    if (!result) return;
    let md = `# Concept: ${result.concept || concept}\n\n`;

    const simpleExp = result.simpleExplanation || result.oneLineDefinition;
    if (simpleExp) {
      md += `## Simple Explanation\n${simpleExp}\n\n`;
    }

    if (result.simpleAnalogy) {
      md += `## Intuitive Analogy\n"${result.simpleAnalogy}"\n\n`;
    }

    const steps = result.stepByStepUnderstanding || result.stepByStepExplanation || [];
    if (steps.length > 0) {
      md += `## Step-by-Step Understanding\n`;
      steps.forEach((s, idx) => {
        md += `### Step ${s.step || idx + 1}: ${s.title}\n${s.explanation || s.description}\n\n`;
      });
    }

    const realEx = result.realWorldExample || (result.realWorldExamples && result.realWorldExamples[0]);
    if (realEx) {
      const scenario = typeof realEx === 'string' ? 'Real-World Example' : realEx.scenario;
      const explanation = typeof realEx === 'string' ? realEx : realEx.explanation || realEx.application;
      md += `## Real-World Example (${scenario})\n${explanation}\n\n`;
    }

    const terms = result.importantTerms || result.importantFormulasOrTerms || [];
    if (terms.length > 0) {
      md += `## Important Terms\n`;
      terms.forEach((t) => {
        md += `- **${t.term}**: ${t.definition}\n`;
      });
      md += '\n';
    }

    const summary = result.quickRevisionSummary;
    if (summary) {
      md += `## Quick Revision Summary\n${summary}\n`;
    }

    copyToClipboard(md, 'full_markdown');
  };

  const simpleExplanationText = result?.simpleExplanation || result?.oneLineDefinition;
  const stepsList = result?.stepByStepUnderstanding || result?.stepByStepExplanation || [];
  const termsList = result?.importantTerms || result?.importantFormulasOrTerms || [];
  const realExample = result?.realWorldExample || (result?.realWorldExamples && result?.realWorldExamples[0]);
  const revisionSummary = result?.quickRevisionSummary;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 rounded-3xl text-white shadow-lg shadow-violet-500/10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
            <Lightbulb className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Concept Explainer</h1>
            <p className="text-xs sm:text-sm text-violet-100 mt-0.5">
              Enter any difficult concept or theory to receive simple explanations, step-by-step understanding, practical examples, and revision summaries.
            </p>
          </div>
        </div>
        <button
          onClick={handleLoadSample}
          className="self-start sm:self-center px-4 py-2 bg-white/15 hover:bg-white/25 border border-white/30 rounded-xl text-xs font-semibold text-white transition-all flex items-center gap-2 shadow-xs shrink-0"
        >
          <FileText className="w-4 h-4 text-amber-300" />
          <span>Load Blockchain Consensus Sample</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Column (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800 text-sm">Target Concept or Topic</span>
            {concept && (
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-slate-500 hover:text-rose-600 font-medium"
              >
                Clear
              </button>
            )}
          </div>

          <form onSubmit={handleExplain} className="space-y-4">
            <textarea
              rows={6}
              value={concept}
              onChange={(e) => {
                setConcept(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Enter any complex topic (e.g. 'Schrodinger\'s Cat', 'Recursion in Computer Science', 'Keynesian Multiplier', 'CRISPR Gene Editing')..."
              className="w-full p-4 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all placeholder:text-slate-400 font-normal leading-relaxed resize-y"
            />

            {/* Explanation Depth Mode */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Explanation Style & Depth
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'eli5', label: 'ELI5', desc: 'Simple words, 10yo' },
                  { id: 'intuitive', label: 'Balanced', desc: 'Intuition + steps' },
                  { id: 'college', label: 'In-Depth', desc: 'Academic clarity' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setDepth(item.id)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      depth === item.id
                        ? 'border-violet-500 bg-violet-50/70 text-violet-900 font-bold shadow-xs'
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
              disabled={loading || !concept.trim()}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-violet-500/20 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin" />
                  <span>Explaining with Gemini AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Explain Concept</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {!result && !loading && (
            <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center">
                <Lightbulb className="w-8 h-8" />
              </div>
              <div className="max-w-sm mx-auto space-y-1">
                <h3 className="text-base font-bold text-slate-800">No Concept Explained Yet</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Enter an intimidating topic or click "Load Blockchain Consensus Sample" to see how SmartStudy AI breaks it down into simple steps, analogies, and practical examples.
                </p>
              </div>
            </div>
          )}

          {/* Loading Skeleton */}
          {loading && (
            <div className="p-8 bg-white rounded-2xl border border-slate-200 space-y-6">
              <div className="h-6 w-52 bg-violet-100 rounded animate-pulse" />
              <div className="h-20 bg-slate-50 rounded-2xl animate-pulse" />
              <div className="space-y-3">
                <div className="h-4 w-full bg-slate-100 rounded animate-pulse" />
                <div className="h-4 w-5/6 bg-slate-100 rounded animate-pulse" />
              </div>
            </div>
          )}

          {/* Result Display */}
          {result && !loading && (
            <div className="space-y-6 animate-fade-in">
              {/* Header with Title & Master Copy Button */}
              <div className="flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-violet-600 bg-violet-50 px-2 py-0.5 rounded">
                    Concept Breakdown
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 mt-1">{result.concept || concept}</h2>
                </div>
                <button
                  onClick={copyFullConceptMarkdown}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5"
                >
                  {copiedKey === 'full_markdown' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied Full Result!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Full Result</span>
                    </>
                  )}
                </button>
              </div>

              {/* 1. Simple Explanation */}
              {simpleExplanationText && (
                <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-violet-700 flex items-center gap-1.5">
                      <Lightbulb className="w-4 h-4 text-violet-600" />
                      <span>Simple Explanation</span>
                    </span>
                    <button
                      onClick={() => copyToClipboard(simpleExplanationText, 'simple_exp')}
                      className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
                    >
                      {copiedKey === 'simple_exp' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy</span>
                    </button>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed font-medium">
                    {simpleExplanationText}
                  </p>
                </div>
              )}

              {/* Intuitive Everyday Analogy */}
              {result.simpleAnalogy && (
                <div className="relative p-6 bg-gradient-to-br from-violet-900 via-indigo-900 to-slate-900 rounded-3xl text-white shadow-xl space-y-3 overflow-hidden">
                  <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 rounded-full bg-violet-400/10 blur-xl pointer-events-none" />
                  <div className="flex items-center gap-2 text-xs font-bold text-violet-300 uppercase tracking-wider">
                    <Quote className="w-4 h-4 text-violet-400" />
                    <span>The Everyday Analogy</span>
                  </div>
                  <p className="text-xs sm:text-sm text-violet-100 leading-relaxed font-serif">
                    "{result.simpleAnalogy}"
                  </p>
                </div>
              )}

              {/* 2. Step-by-Step Understanding */}
              {stepsList.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-violet-600" />
                      <span>Step-by-Step Understanding</span>
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {stepsList.map((step, idx) => (
                      <div key={idx} className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex items-start gap-3">
                        <div className="w-7 h-7 rounded-lg bg-violet-100 text-violet-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {step.step || idx + 1}
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="text-xs font-bold text-slate-900">{step.title}</h4>
                          <p className="text-xs text-slate-600 leading-relaxed">{step.explanation || step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Real-World Practical Example */}
              {realExample && (
                <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                      <Globe2 className="w-4 h-4 text-blue-600" />
                      <span>Real-World Example</span>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <div className="font-bold text-xs text-slate-900">
                      {typeof realExample === 'string' ? 'Scenario' : realExample.scenario}
                    </div>
                    <div className="text-xs text-slate-600 leading-relaxed">
                      {typeof realExample === 'string' ? realExample : realExample.explanation || realExample.application}
                    </div>
                  </div>
                </div>
              )}

              {/* 4. Important Terms */}
              {termsList.length > 0 && (
                <div className="p-5 bg-gradient-to-br from-slate-50 to-indigo-50/30 rounded-2xl border border-indigo-100 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-indigo-900 uppercase tracking-wider">
                      <KeyRound className="w-4 h-4 text-indigo-600" />
                      <span>Important Terms</span>
                    </div>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          termsList.map((t) => `${t.term}: ${t.definition}`).join('\n\n'),
                          'terms'
                        )
                      }
                      className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
                    >
                      {copiedKey === 'terms' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy Terms</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {termsList.map((item, idx) => (
                      <div key={idx} className="p-3 bg-white rounded-xl border border-indigo-100/70 shadow-xs space-y-1">
                        <div className="font-bold text-xs text-indigo-950">{item.term}</div>
                        <div className="text-[11px] text-slate-600 leading-relaxed">{item.definition}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. Quick Revision Summary */}
              {revisionSummary && (
                <div className="p-5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950 uppercase tracking-wider">
                      <BookCheck className="w-4 h-4 text-emerald-600" />
                      <span>Quick Revision Summary</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(revisionSummary, 'revision_summary')}
                      className="text-xs text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
                    >
                      {copiedKey === 'revision_summary' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy</span>
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-emerald-950 leading-relaxed font-medium">
                    {revisionSummary}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
