import React, { useState } from 'react';
import {
  HelpCircle,
  Sparkles,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Copy,
  Check,
  FileText,
  AlertCircle,
  Trophy,
  ArrowRight,
  ArrowLeft,
  Printer,
  ListOrdered
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';

export default function QuizGenerator({ onNotify, sampleData }) {
  const [content, setContent] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [error, setError] = useState(null);

  // Interactive Quiz State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [questionIndex]: selectedOptionIndex }
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [viewMode, setViewMode] = useState('interactive'); // 'interactive' or 'sheet'
  const [copied, setCopied] = useState(false);

  const handleLoadSample = () => {
    if (sampleData?.quiz?.content) {
      setContent(sampleData.quiz.content);
      setError(null);
      if (onNotify) onNotify('Sample study notes loaded on Machine Learning Overfitting!', 'info');
    }
  };

  const handleGenerateQuiz = async (e) => {
    e?.preventDefault();
    if (!content.trim()) {
      setError('Please provide study notes or a topic to generate the quiz.');
      return;
    }
    if (content.trim().length < 15) {
      setError('Please provide at least 15 characters of content for quiz generation.');
      return;
    }

    setLoading(true);
    setError(null);
    setQuizData(null);
    setUserAnswers({});
    setCurrentQuestionIndex(0);
    setQuizSubmitted(false);

    try {
      const res = await api.generateQuiz(content.trim(), difficulty);
      if (res.success && res.data?.questions) {
        setQuizData(res.data);
        if (onNotify) onNotify('5-Question Quiz generated successfully!');
      } else {
        setError(res.error || 'Failed to generate quiz questions.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while generating the quiz.');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (qIdx, optIdx) => {
    if (quizSubmitted) return; // Locked once final submit
    setUserAnswers((prev) => ({
      ...prev,
      [qIdx]: optIdx,
    }));
  };

  const calculateScore = () => {
    if (!quizData?.questions) return 0;
    return quizData.questions.reduce((acc, q, idx) => {
      return acc + (userAnswers[idx] === q.correctAnswer ? 1 : 0);
    }, 0);
  };

  const handleFinishQuiz = () => {
    setQuizSubmitted(true);
    const score = calculateScore();
    if (score >= 3) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
    if (onNotify) onNotify(`Quiz finished! You scored ${score} out of 5.`);
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
    setCurrentQuestionIndex(0);
    setQuizSubmitted(false);
  };

  const copyQuizMarkdown = () => {
    if (!quizData?.questions) return;
    let md = `# Quiz: ${quizData.topic || 'SmartStudy AI Quiz'}\n\n`;
    quizData.questions.forEach((q, idx) => {
      md += `### Question ${idx + 1}: ${q.question}\n`;
      q.options.forEach((opt, oIdx) => {
        const isCorrect = oIdx === q.correctAnswer;
        md += `${String.fromCharCode(65 + oIdx)}) ${opt} ${isCorrect ? '✓ [Correct]' : ''}\n`;
      });
      md += `\n**Explanation:** ${q.explanation}\n\n---\n\n`;
    });
    navigator.clipboard.writeText(md);
    setCopied(true);
    if (onNotify) onNotify('Quiz copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const questions = quizData?.questions || [];
  const currentQ = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(userAnswers).length;
  const score = calculateScore();

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-3xl text-white shadow-lg shadow-purple-500/10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Quiz Generator</h1>
            <p className="text-xs sm:text-sm text-purple-100 mt-0.5">
              Generate 5 targeted multiple-choice questions from your notes for active recall practice.
            </p>
          </div>
        </div>
        <button
          onClick={handleLoadSample}
          className="self-start sm:self-center px-4 py-2 bg-white/15 hover:bg-white/25 border border-white/30 rounded-xl text-xs font-semibold text-white transition-all flex items-center gap-2 shadow-xs shrink-0"
        >
          <FileText className="w-4 h-4 text-amber-300" />
          <span>Load ML Notes Sample</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Column (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800 text-sm">Study Content or Topic</span>
            {content && (
              <button
                type="button"
                onClick={() => {
                  setContent('');
                  setError(null);
                }}
                className="text-xs text-slate-600 hover:text-rose-600 font-medium"
              >
                Clear
              </button>
            )}
          </div>

          <form onSubmit={handleGenerateQuiz} className="space-y-4">
            <textarea
              rows={11}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Paste notes, lecture bullets, or specify a complex topic (e.g. 'Newtonian Mechanics', 'French Revolution', 'Cell Division')..."
              className="w-full p-4 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder:text-slate-400 font-normal leading-relaxed resize-y"
            />

            {/* Difficulty Toggle */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Question Difficulty
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'easy', label: 'Easy', desc: 'Core definitions' },
                  { id: 'medium', label: 'Medium', desc: 'Conceptual links' },
                  { id: 'hard', label: 'Hard', desc: 'Deep synthesis' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setDifficulty(item.id)}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      difficulty === item.id
                        ? 'border-purple-500 bg-purple-50/70 text-purple-900 font-bold shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs">{item.label}</div>
                    <div className="text-[10px] text-slate-600 font-normal">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !content.trim()}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-purple-500/20 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing 5 Exam Questions...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Generate 5-Question Quiz</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Quiz Display Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {!quizData && !loading && (
            <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <HelpCircle className="w-8 h-8" />
              </div>
              <div className="max-w-sm mx-auto space-y-1">
                <h3 className="text-base font-bold text-slate-800">No Quiz Generated Yet</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Enter your topic or click "Load ML Notes Sample" to generate 5 high-yield multiple-choice questions with answer explanations.
                </p>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="p-8 bg-white rounded-2xl border border-slate-200 space-y-5">
              <div className="h-5 w-40 bg-purple-100 rounded animate-pulse" />
              <div className="h-4 w-full bg-slate-100 rounded animate-pulse" />
              <div className="space-y-3 pt-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-12 bg-slate-50 rounded-xl border border-slate-200 animate-pulse" />
                ))}
              </div>
            </div>
          )}

          {/* Render Quiz */}
          {quizData && !loading && totalQuestions > 0 && (
            <div className="space-y-6 animate-fade-in">
              {/* Controls bar: Interactive vs Printable Sheet & Copy */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('interactive')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      viewMode === 'interactive'
                        ? 'bg-purple-100 text-purple-900 shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Interactive Quiz
                  </button>
                  <button
                    onClick={() => setViewMode('sheet')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      viewMode === 'sheet'
                        ? 'bg-purple-100 text-purple-900 shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Study Sheet View
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={copyQuizMarkdown}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Quiz</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleResetQuiz}
                    className="p-1.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                    title="Reset Answers"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* MODE 1: INTERACTIVE RUNNER */}
              {viewMode === 'interactive' && (
                <div className="space-y-6">
                  {/* Progress Header */}
                  <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                      <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
                      <span>{answeredCount} of {totalQuestions} Answered</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 transition-all duration-300"
                        style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Question Card */}
                  <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-5">
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
                        Question #{currentQuestionIndex + 1}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                        {currentQ.question}
                      </h3>
                    </div>

                    {/* 4 Options */}
                    <div className="space-y-2.5">
                      {currentQ.options.map((option, optIdx) => {
                        const isSelected = userAnswers[currentQuestionIndex] === optIdx;
                        const isCorrect = currentQ.correctAnswer === optIdx;
                        const hasAnsweredCurrent = userAnswers[currentQuestionIndex] !== undefined;

                        let optionStyle = 'border-slate-200 bg-slate-50/70 hover:bg-purple-50/40 hover:border-purple-300 text-slate-800';

                        if (hasAnsweredCurrent) {
                          if (isSelected && isCorrect) {
                            optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold';
                          } else if (isSelected && !isCorrect) {
                            optionStyle = 'border-rose-400 bg-rose-50 text-rose-950';
                          } else if (isCorrect) {
                            optionStyle = 'border-emerald-400 bg-emerald-50/60 text-emerald-900 font-semibold';
                          } else {
                            optionStyle = 'border-slate-200 bg-slate-50 text-slate-400 opacity-60';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => handleOptionSelect(currentQuestionIndex, optIdx)}
                            className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-start gap-3 ${optionStyle}`}
                          >
                            <span className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-2xs">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="flex-1 leading-relaxed">{option}</span>
                            {hasAnsweredCurrent && isCorrect && (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                            )}
                            {hasAnsweredCurrent && isSelected && !isCorrect && (
                              <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation Box (Reveals when answered) */}
                    {userAnswers[currentQuestionIndex] !== undefined && (
                      <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200/80 text-xs text-purple-950 space-y-1.5 animate-fade-in">
                        <div className="font-bold flex items-center gap-1.5 text-purple-900">
                          <CheckCircle2 className="w-4 h-4 text-purple-600" />
                          <span>Pedagogical Explanation:</span>
                        </div>
                        <p className="leading-relaxed text-slate-700">{currentQ.explanation}</p>
                      </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                        disabled={currentQuestionIndex === 0}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition-all flex items-center gap-1.5"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Previous</span>
                      </button>

                      {currentQuestionIndex < totalQuestions - 1 ? (
                        <button
                          type="button"
                          onClick={() => setCurrentQuestionIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                          className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 transition-all flex items-center gap-1.5 shadow-sm"
                        >
                          <span>Next Question</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleFinishQuiz}
                          className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
                        >
                          <Trophy className="w-4 h-4" />
                          <span>Submit & View Final Score</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Score Summary Modal/Card */}
                  {quizSubmitted && (
                    <div className="p-6 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 rounded-3xl text-white shadow-xl space-y-4 text-center animate-fade-in">
                      <div className="w-16 h-16 mx-auto rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-amber-300">
                        <Trophy className="w-8 h-8" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-xl font-bold">Quiz Complete!</h3>
                        <p className="text-xs text-purple-200">
                          You scored <span className="font-extrabold text-white text-base">{score} / {totalQuestions}</span> ({Math.round((score / totalQuestions) * 100)}%)
                        </p>
                      </div>

                      <div className="inline-block p-3 rounded-2xl bg-white/10 text-xs text-purple-100 max-w-sm">
                        {score === 5 && '🌟 Perfect Score! You have thoroughly mastered this topic.'}
                        {score >= 3 && score < 5 && '👏 Solid understanding! Review the few explanations above to reach 100%.'}
                        {score < 3 && '💪 Good practice attempt! Read through the explanations and try retaking the quiz.'}
                      </div>

                      <div className="flex justify-center gap-3 pt-2">
                        <button
                          onClick={handleResetQuiz}
                          className="px-4 py-2 bg-white text-purple-900 font-bold text-xs rounded-xl hover:bg-purple-50 transition-colors flex items-center gap-2"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Retake Quiz</span>
                        </button>
                        <button
                          onClick={() => setViewMode('sheet')}
                          className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-semibold text-xs rounded-xl transition-colors"
                        >
                          Review All Questions
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* MODE 2: PRINTABLE / FULL STUDY SHEET */}
              {viewMode === 'sheet' && (
                <div className="space-y-4">
                  {questions.map((q, idx) => (
                    <div key={idx} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-sm text-slate-900">
                          {idx + 1}. {q.question}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {q.options.map((opt, oIdx) => {
                          const isCorrect = q.correctAnswer === oIdx;
                          return (
                            <div
                              key={oIdx}
                              className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                                isCorrect
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-medium'
                                  : 'bg-slate-50 border-slate-200 text-slate-700'
                              }`}
                            >
                              <span className="w-5 h-5 rounded-md bg-white border border-slate-300 flex items-center justify-center font-bold text-[10px] shrink-0">
                                {String.fromCharCode(65 + oIdx)}
                              </span>
                              <span className="flex-1">{opt}</span>
                              {isCorrect && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                            </div>
                          );
                        })}
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 leading-relaxed">
                        <strong className="text-slate-800">Explanation: </strong>
                        {q.explanation}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
