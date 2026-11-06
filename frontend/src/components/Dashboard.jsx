import React from 'react';
import {
  BookOpen,
  HelpCircle,
  FileCheck2,
  Lightbulb,
  ArrowRight,
  Sparkles,
  Zap,
  Target,
  Brain,
  CheckCircle,
  GraduationCap
} from 'lucide-react';

export default function Dashboard({ setActiveTab, backendStatus, onOpenSettings }) {
  const tools = [
    {
      id: 'summarize',
      title: 'Notes Summarizer',
      badge: 'High-Yield Retention',
      description: 'Paste lengthy textbook chapters, lecture transcripts, or notes. Generate structured bullet summaries, key takeaways, and exam highlights.',
      icon: BookOpen,
      gradient: 'from-blue-600 to-cyan-500',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      metrics: 'Save ~70% reading time',
      features: ['Executive summary', 'Core bullet points', 'Key terms glossary', 'High-yield exam tips']
    },
    {
      id: 'quiz',
      title: 'Quiz Generator',
      badge: 'Active Recall',
      description: 'Generate 5 multiple-choice questions from your study material. Test yourself interactively with immediate score tracking and detailed explanations.',
      icon: HelpCircle,
      gradient: 'from-purple-600 to-indigo-500',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      metrics: '5 questions with 4 options',
      features: ['Interactive quiz taker', 'Instant score calculation', 'Pedagogical explanations', 'Printable study sheet']
    },
    {
      id: 'improve',
      title: 'Answer Improver',
      badge: 'Grade Maximizer',
      description: 'Enter an exam question and your rough draft answer. AI transforms it into an A+ model answer with enriched academic vocabulary and clear structure.',
      icon: FileCheck2,
      gradient: 'from-indigo-600 to-blue-500',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      metrics: 'Score uplift from 5/10 to 9.5/10',
      features: ['Side-by-side comparison', 'Strengths & weaknesses critique', 'Academic vocabulary bank', 'Structural essay breakdown']
    },
    {
      id: 'explain',
      title: 'Concept Explainer',
      badge: 'Feynman Technique',
      description: 'Demystify difficult or abstract topics with intuitive analogies, step-by-step mechanisms, practical real-world examples, and memory hooks.',
      icon: Lightbulb,
      gradient: 'from-violet-600 to-fuchsia-500',
      badgeColor: 'bg-violet-50 text-violet-700 border-violet-200',
      metrics: 'Intuitive analogies & mnemonics',
      features: ['One-line essence', 'Everyday real-life analogy', 'Common misconceptions', 'Catchy memory hooks']
    },
  ];

  const studyTips = [
    {
      title: 'Active Recall',
      desc: 'Testing yourself with the Quiz Generator creates stronger neural pathways than re-reading notes passively.'
    },
    {
      title: 'Feynman Technique',
      desc: 'Use the Concept Explainer to verify you can explain a topic in plain words without relying on jargon.'
    },
    {
      title: 'Iterative Refinement',
      desc: 'Write raw drafts first, then feed them to the Answer Improver to observe how top examiners structure arguments.'
    }
  ];

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-800 text-white p-8 sm:p-12 shadow-xl shadow-indigo-500/15">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-64 h-64 rounded-full bg-purple-400/10 blur-2xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold tracking-wide text-blue-100 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI-Powered Academic Excellence Engine</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Study Smarter, Retain Faster, Score Higher.
          </h1>

          <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed max-w-2xl">
            SmartStudy AI brings together 4 dedicated AI study workflows designed to turn overwhelming course content into crystal-clear understanding and exam mastery.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('summarize')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-blue-900 font-bold text-sm shadow-md hover:bg-blue-50 transition-all hover:translate-y-[-1px]"
            >
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Start Summarizing Notes</span>
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-sm transition-all"
            >
              <span>Take a 5-Question Quiz</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Main Feature Cards */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Dedicated Study Tools</h2>
            <p className="text-xs sm:text-sm text-slate-500">Pick a dedicated workflow tailored to your learning stage</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.id}
                className="group relative flex flex-col justify-between p-6 bg-white rounded-2xl border border-slate-200 hover:border-blue-300 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-200"
              >
                <div className="space-y-4">
                  {/* Top Header */}
                  <div className="flex items-start justify-between">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${tool.gradient} flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${tool.badgeColor}`}>
                      {tool.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                      {tool.description}
                    </p>
                  </div>

                  {/* Feature Bullets */}
                  <div className="pt-2 border-t border-slate-100">
                    <div className="grid grid-cols-2 gap-2">
                      {tool.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-600">
                          <CheckCircle className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom CTA */}
                <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">{tool.metrics}</span>
                  <button
                    onClick={() => setActiveTab(tool.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 group-hover:text-blue-700 hover:underline"
                  >
                    <span>Launch Tool</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it Works / Study Workflow */}
      <section className="bg-gradient-to-b from-slate-50 to-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold tracking-wide uppercase">
            Proven Study Pipeline
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">How SmartStudy AI Elevates Your Workflow</h2>
          <p className="text-xs sm:text-sm text-slate-500">A systematic 3-step cycle designed around cognitive science</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm">
              1
            </div>
            <h4 className="font-bold text-slate-800 text-sm">1. Condense with Notes Summarizer</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Feed raw, messy class lectures or PDFs. Isolate key formulas, definitions, and high-yield topics without drowning in text.
            </p>
          </div>

          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-sm">
              2
            </div>
            <h4 className="font-bold text-slate-800 text-sm">2. Test with Quiz Generator</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Switch from passive reading to active recall. Take 5 targeted multiple choice questions and review detailed reasoning.
            </p>
          </div>

          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm">
              3
            </div>
            <h4 className="font-bold text-slate-800 text-sm">3. Elevate with Answer Improver</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Draft answers to predicted exam questions and refine them into model responses with academic vocabulary and strong arguments.
            </p>
          </div>
        </div>
      </section>

      {/* Cognitive Study Tips */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {studyTips.map((tip, idx) => (
          <div key={idx} className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs space-y-1">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
              <Brain className="w-3.5 h-3.5" />
              <span>{tip.title}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{tip.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
