'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { analyzeEssay, type EssayAnalysis, type Suggestion } from '@/lib/essays/analyzer';
import { cn } from '@/lib/utils';

const EXAMPLE_PROMPTS = [
  'The Common App: Some students have a background, identity, interest, or talent that is so meaningful they believe their application would be incomplete without it.',
  'Describe a time when you faced a challenge, setback, or failure. How did it affect you, and what did you learn?',
  'Reflect on something that someone has done for you that has made you happy or thankful in a surprising way.',
  'Discuss something that inspires you — a concept, idea, work of art, or person.',
];

function SuggestionCard({ suggestion }: { suggestion: Suggestion }) {
  const styles = {
    warning: {
      border: 'border-l-red-400 dark:border-l-red-500',
      icon: '⚠️',
      label: 'text-red-600 dark:text-red-400',
      labelText: 'Warning',
    },
    tip: {
      border: 'border-l-blue-400 dark:border-l-blue-500',
      icon: '💡',
      label: 'text-blue-600 dark:text-blue-400',
      labelText: 'Tip',
    },
    improvement: {
      border: 'border-l-amber-400 dark:border-l-amber-500',
      icon: '🔧',
      label: 'text-amber-600 dark:text-amber-400',
      labelText: 'Improvement',
    },
  };

  const s = styles[suggestion.type];

  return (
    <div className={cn('bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4 border-l-4', s.border)}>
      <div className="flex items-start gap-3">
        <span className="text-lg shrink-0">{s.icon}</span>
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn('text-xs font-semibold uppercase tracking-wider', s.label)}>{s.labelText}</span>
          </div>
          <p className="font-semibold text-sm text-gray-900 dark:text-white mb-1">{suggestion.title}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{suggestion.detail}</p>
        </div>
      </div>
    </div>
  );
}

function CategoryBar({ name, score, label, icon, feedback }: { name: string; score: number; label: string; icon: string; feedback: string }) {
  const [expanded, setExpanded] = useState(false);

  function getColor(s: number) {
    if (s >= 80) return 'bg-emerald-500';
    if (s >= 60) return 'bg-cyan-500';
    if (s >= 40) return 'bg-amber-500';
    return 'bg-red-400';
  }

  return (
    <button
      onClick={() => setExpanded(!expanded)}
      className="w-full text-left"
    >
      <div className="flex items-center gap-3 mb-1.5">
        <span className="text-base">{icon}</span>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex-1">{name}</span>
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{label}</span>
        <span className="text-xs font-bold text-gray-900 dark:text-white w-8 text-right">{score}</span>
      </div>
      <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden ml-7">
        <div
          className={cn('h-full rounded-full transition-all duration-700 ease-out', getColor(score))}
          style={{ width: `${score}%` }}
        />
      </div>
      {expanded && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 ml-7 leading-relaxed animate-slide-down-fade">
          {feedback}
        </p>
      )}
    </button>
  );
}

export default function EssayCoachPage() {
  const [essayText, setEssayText] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState<number | null>(null);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const analysis = useMemo<EssayAnalysis | null>(() => {
    if (!hasAnalyzed || essayText.trim().length === 0) return null;
    return analyzeEssay(essayText);
  }, [essayText, hasAnalyzed]);

  const wordCount = useMemo(() => {
    return essayText.trim().split(/\s+/).filter(w => w.length > 0).length;
  }, [essayText]);

  function handleAnalyze() {
    if (essayText.trim().length > 0) {
      setHasAnalyzed(true);
    }
  }

  function handleClear() {
    setEssayText('');
    setHasAnalyzed(false);
    setSelectedPrompt(null);
  }

  return (
    <div className="space-y-8 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="text-3xl">📝</span> Essay Coach
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Get instant feedback on your college essay drafts
          </p>
        </div>
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">&larr; Dashboard</Button>
        </Link>
      </div>

      {/* Prompt Picker */}
      <Card className="!p-4">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
          Choose a prompt (optional)
        </p>
        <div className="space-y-2">
          {EXAMPLE_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              onClick={() => setSelectedPrompt(selectedPrompt === i ? null : i)}
              className={cn(
                'w-full text-left px-4 py-3 rounded-xl border text-sm transition-all duration-200',
                selectedPrompt === i
                  ? 'border-emerald-300 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300'
                  : 'border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-200 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-750'
              )}
            >
              <span className="font-medium text-gray-400 dark:text-gray-500 mr-2">{i + 1}.</span>
              {prompt}
            </button>
          ))}
        </div>
      </Card>

      {/* Essay Input */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-4">
          <Card className="!p-0 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Your Essay</span>
              <div className="flex items-center gap-3">
                <span className={cn(
                  'text-xs font-mono',
                  wordCount > 650 ? 'text-red-500' : wordCount > 500 ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'
                )}>
                  {wordCount} / 650 words
                </span>
              </div>
            </div>
            <textarea
              value={essayText}
              onChange={(e) => {
                setEssayText(e.target.value);
                if (hasAnalyzed) setHasAnalyzed(true); // re-analyze on edit
              }}
              placeholder="Paste your essay draft here..."
              className="w-full h-80 lg:h-[480px] p-4 text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 placeholder:text-gray-400 dark:placeholder:text-gray-500 resize-none focus:outline-none leading-relaxed"
            />
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <button
                onClick={handleClear}
                className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                Clear
              </button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleAnalyze}
                disabled={essayText.trim().length === 0}
              >
                {hasAnalyzed ? '🔄 Re-analyze' : '✨ Analyze Essay'}
              </Button>
            </div>
          </Card>

          {/* Word count bar */}
          <div className="relative h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-500 ease-out',
                wordCount > 650 ? 'bg-red-400' : wordCount > 500 ? 'bg-emerald-500' : wordCount > 250 ? 'bg-cyan-500' : 'bg-amber-400'
              )}
              style={{ width: `${Math.min((wordCount / 650) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-4">
          {!analysis ? (
            <Card className="text-center py-16">
              <div className="text-5xl mb-4">📝</div>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Paste your essay
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                Write or paste your college essay draft, then click &quot;Analyze Essay&quot; to get instant feedback
              </p>
            </Card>
          ) : (
            <>
              {/* Overall Score */}
              <Card className="text-center !py-8">
                <div className="flex justify-center mb-3">
                  <ScoreRing score={analysis.overallScore} size={100} strokeWidth={7} />
                </div>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  Essay Readiness
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {analysis.overallScore >= 80 ? 'Looking great! Final polish time.' :
                   analysis.overallScore >= 60 ? 'Good foundation. Keep refining.' :
                   analysis.overallScore >= 40 ? 'Getting there. Focus on the feedback below.' :
                   'Early draft. Lots of room to improve!'}
                </p>
              </Card>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-3">
                <Card className="!p-3 text-center">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{analysis.wordCount}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Words</p>
                </Card>
                <Card className="!p-3 text-center">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{analysis.sentenceCount}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Sentences</p>
                </Card>
                <Card className="!p-3 text-center">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{analysis.paragraphCount}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Paragraphs</p>
                </Card>
              </div>

              {/* Reading Level */}
              <Card className="!p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Reading Level</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{analysis.readingLevel}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Avg. Sentence</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{Math.round(analysis.avgSentenceLength)} words</span>
                </div>
              </Card>

              {/* Category Scores */}
              <Card className="!p-4 space-y-4">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Category Breakdown
                </p>
                {analysis.categories.map((cat) => (
                  <CategoryBar
                    key={cat.name}
                    name={cat.name}
                    score={cat.score}
                    label={cat.label}
                    icon={cat.icon}
                    feedback={cat.feedback}
                  />
                ))}
                <p className="text-xs text-gray-400 dark:text-gray-500 italic">
                  Tap any category for detailed feedback
                </p>
              </Card>

              {/* Strengths */}
              {analysis.strengths.length > 0 && (
                <Card className="!p-4 border-l-4 border-l-emerald-400 dark:border-l-emerald-500">
                  <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2">
                    Strengths
                  </p>
                  <ul className="space-y-1.5">
                    {analysis.strengths.map((s, i) => (
                      <li key={i} className="text-sm text-gray-700 dark:text-gray-300">{s}</li>
                    ))}
                  </ul>
                </Card>
              )}

              {/* Suggestions */}
              {analysis.suggestions.length > 0 && (
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Suggestions
                  </p>
                  {analysis.suggestions.map((s, i) => (
                    <SuggestionCard key={i} suggestion={s} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
