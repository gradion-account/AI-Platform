"use client";

import { useState, useEffect, useCallback } from "react";
import { submitQuizResult } from "@/app/actions/quiz";
import { Brain, Timer, CheckCircle2, XCircle, Zap, ChevronRight, RotateCcw } from "lucide-react";
import clsx from "clsx";
import type { QuizQuestion } from "@/lib/types";

const CATEGORIES = [
  { id: "ai-fundamentals", name: "AI Fundamentals", emoji: "🧠", description: "Core concepts of machine learning, neural networks, and AI systems.", color: "from-purple-500 to-purple-700" },
  { id: "generative-ai", name: "Generative AI", emoji: "✨", description: "LLMs, ChatGPT, Claude, prompting techniques, and generative models.", color: "from-orange-500 to-brand-orange" },
  { id: "ai-tools", name: "AI Tools & Productivity", emoji: "🛠️", description: "Developer tools, productivity apps, and practical AI integrations.", color: "from-green-500 to-green-700" },
];

type Phase = "select" | "playing" | "results";

export default function QuizGame({ allQuestions }: { allQuestions: QuizQuestion[] }) {
  const [phase, setPhase] = useState<Phase>("select");
  const [category, setCategory] = useState<(typeof CATEGORIES)[0] | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [totalTime, setTotalTime] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [tokensEarned, setTokensEarned] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (phase !== "playing" || answered) return;
    if (timeLeft <= 0) { handleNext(null); return; }
    const t = setTimeout(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearTimeout(t);
  });

  useEffect(() => {
    if (phase !== "playing") return;
    const t = setInterval(() => setTotalTime((p) => p + 1), 1000);
    return () => clearInterval(t);
  }, [phase]);

  function startQuiz(cat: (typeof CATEGORIES)[0]) {
    const catQuestions = allQuestions
      .filter((q) => q.category === cat.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 10);
    setCategory(cat);
    setQuestions(catQuestions);
    setCurrent(0); setScore(0); setCorrectCount(0); setTotalTime(0);
    setTimeLeft(30); setSelected(null); setAnswered(false);
    setTokensEarned(0); setSubmitted(false);
    setPhase("playing");
  }

  const handleNext = useCallback((choice: number | null) => {
    if (answered) return;
    setAnswered(true);
    setSelected(choice);
    const q = questions[current];
    if (choice !== null && choice === q.correctIndex) {
      setScore((p) => p + q.points);
      setCorrectCount((p) => p + 1);
    }
    setTimeout(() => {
      if (current + 1 >= questions.length) {
        setPhase("results");
      } else {
        setCurrent((p) => p + 1);
        setSelected(null); setAnswered(false); setTimeLeft(30);
      }
    }, 1500);
  }, [answered, current, questions]);

  async function handleSaveResults() {
    if (!category || submitting || submitted) return;
    setSubmitting(true);
    const maxScore = questions.reduce((s, q) => s + q.points, 0);
    const result = await submitQuizResult({ category: category.id, score, maxScore, correctCount, totalQuestions: questions.length, timeTaken: totalTime });
    if (result?.tokensEarned) setTokensEarned(result.tokensEarned);
    setSubmitted(true);
    setSubmitting(false);
  }

  if (allQuestions.length === 0) {
    return (
      <div className="card p-16 text-center">
        <Brain className="w-12 h-12 text-gray-200 mx-auto mb-4" />
        <p className="text-gray-500 font-medium">No quiz questions yet</p>
        <p className="text-gray-400 text-sm mt-1">Ask an admin to seed the quiz questions.</p>
      </div>
    );
  }

  if (phase === "select") {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-black flex items-center gap-2"><Brain className="w-6 h-6 text-brand-orange" />AI Quiz</h1>
          <p className="text-gray-500 text-sm mt-1">Test your AI knowledge and earn tokens. Choose a category to begin.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {CATEGORIES.map((cat) => (
            <button key={cat.id} onClick={() => startQuiz(cat)} className="card p-6 text-left hover:shadow-lg transition-all group hover:border-brand-orange/30 border border-transparent">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>{cat.emoji}</div>
              <h2 className="font-bold text-brand-black group-hover:text-brand-orange transition-colors">{cat.name}</h2>
              <p className="text-sm text-gray-500 mt-1 mb-4">{cat.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">10 questions · 30s each</span>
                <ChevronRight className="w-4 h-4 text-brand-orange opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>
          ))}
        </div>
        <div className="card p-5 bg-brand-beige border-brand-orange/20">
          <h3 className="font-bold text-brand-black mb-3 flex items-center gap-2"><Zap className="w-4 h-4 text-brand-orange" />How Tokens Work</h3>
          <div className="grid grid-cols-3 gap-4 text-sm text-center">
            {[{ label: "Per correct answer", value: "2 tokens" }, { label: "Speed bonus (under 2 min)", value: "+5 tokens" }, { label: "Token expiry", value: "30 days" }].map((item) => (
              <div key={item.label}><div className="text-xl font-bold text-brand-orange">{item.value}</div><div className="text-gray-500 mt-0.5">{item.label}</div></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (phase === "playing" && questions.length > 0) {
    const q = questions[current];
    const maxScore = questions.reduce((s, q) => s + q.points, 0);
    return (
      <div className="max-w-2xl mx-auto space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-brand-orange font-bold text-sm">{category?.emoji} {category?.name}</span>
            <div className="text-xs text-gray-400 mt-0.5">Question {current + 1} of {questions.length}</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-brand-black">{score} pts</div>
            <div className="text-xs text-gray-400">of {maxScore} max</div>
          </div>
        </div>

        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-brand-orange transition-all duration-300" style={{ width: `${(current / questions.length) * 100}%` }} />
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <span className={clsx("badge", q.difficulty === "easy" ? "badge-green" : q.difficulty === "hard" ? "bg-red-100 text-red-600" : "badge-blue")}>
              {q.difficulty} · {q.points}pts
            </span>
            <div className={clsx("flex items-center gap-1.5 font-bold", timeLeft <= 10 ? "text-red-500" : "text-brand-black")}>
              <Timer className="w-4 h-4" />{timeLeft}s
            </div>
          </div>

          <p className="text-lg font-semibold text-brand-black mb-5 leading-relaxed">{q.question}</p>

          <div className="space-y-3">
            {q.options.map((opt, i) => {
              const isCorrect = i === q.correctIndex;
              const isSelected = i === selected;
              return (
                <button key={i} onClick={() => !answered && handleNext(i)} disabled={answered}
                  className={clsx("w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all",
                    !answered && "hover:border-brand-orange hover:bg-orange-50 border-gray-200 bg-white text-brand-black",
                    answered && isCorrect && "border-green-400 bg-green-50 text-green-700",
                    answered && isSelected && !isCorrect && "border-red-400 bg-red-50 text-red-700",
                    answered && !isSelected && !isCorrect && "border-gray-100 bg-gray-50 text-gray-400")}>
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full border-2 border-current flex items-center justify-center text-xs font-bold shrink-0">{["A","B","C","D"][i]}</span>
                    <span className="flex-1">{opt}</span>
                    {answered && isCorrect && <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />}
                    {answered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-500 shrink-0" />}
                  </div>
                </button>
              );
            })}
          </div>

          {answered && q.explanation && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-xl">
              <p className="text-sm text-blue-700"><span className="font-bold">💡 </span>{q.explanation}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (phase === "results") {
    const maxScore = questions.reduce((s, q) => s + q.points, 0);
    const pct = Math.round((score / maxScore) * 100);
    const mins = Math.floor(totalTime / 60);
    const secs = totalTime % 60;
    return (
      <div className="max-w-xl mx-auto">
        <div className="card p-8 text-center">
          <div className="text-5xl mb-4">{pct >= 80 ? "🏆" : pct >= 60 ? "🎯" : "📚"}</div>
          <h2 className="text-2xl font-bold text-brand-black mb-1">{pct >= 80 ? "Outstanding!" : pct >= 60 ? "Well done!" : "Keep learning!"}</h2>
          <p className="text-gray-500 text-sm mb-6">{category?.name} · {correctCount}/{questions.length} correct</p>

          <div className="grid grid-cols-3 gap-4 mb-6">
            {[{ label: "Score", value: `${score}`, sub: `/ ${maxScore} pts` }, { label: "Accuracy", value: `${pct}%`, sub: "correct" }, { label: "Time", value: `${mins}:${secs.toString().padStart(2,"0")}`, sub: "minutes" }].map((s) => (
              <div key={s.label} className="bg-brand-beige rounded-xl p-4">
                <div className="text-2xl font-bold text-brand-orange">{s.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.sub}</div>
                <div className="text-xs font-medium text-brand-black">{s.label}</div>
              </div>
            ))}
          </div>

          {submitted ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-center gap-2 text-yellow-700 font-bold text-lg"><Zap className="w-5 h-5" />+{tokensEarned} tokens earned!</div>
              <p className="text-yellow-600 text-xs mt-1">Tokens expire in 30 days. Check your rank on the leaderboard.</p>
            </div>
          ) : (
            <button onClick={handleSaveResults} disabled={submitting} className="btn-primary w-full justify-center mb-4">
              <Zap className="w-4 h-4" />{submitting ? "Saving…" : "Save Results & Earn Tokens"}
            </button>
          )}

          <div className="flex gap-3">
            <button onClick={() => { setPhase("select"); setCategory(null); }} className="btn-secondary flex-1 justify-center"><RotateCcw className="w-4 h-4" />Try Another</button>
            <button onClick={() => category && startQuiz(category)} className="btn-primary flex-1 justify-center">Play Again</button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
