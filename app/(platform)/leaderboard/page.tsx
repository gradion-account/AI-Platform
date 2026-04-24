import { requireAuth } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
import { docToData } from "@/lib/firestore-helpers";
import { Trophy, Zap, Medal, Crown } from "lucide-react";
import type { UserProfile, QuizAttempt } from "@/lib/types";

const CATEGORY_LABELS: Record<string, string> = {
  "ai-fundamentals": "AI Fundamentals",
  "generative-ai": "Generative AI",
  "ai-tools": "AI Tools & Productivity",
};

export default async function LeaderboardPage() {
  const user = await requireAuth();

  const [topUsersSnap, recentSnap] = await Promise.all([
    adminDb.collection("users").orderBy("tokens", "desc").limit(20).get(),
    adminDb.collection("quizAttempts").orderBy("createdAt", "desc").limit(10).get(),
  ]);

  const topUsers = topUsersSnap.docs.map((d) => docToData<UserProfile>(d));
  const recentAttempts = recentSnap.docs.map((d) => docToData<QuizAttempt>(d));

  const myRank = topUsers.findIndex((u) => u.id === user.id) + 1 || "—";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-black flex items-center gap-2">
          <Trophy className="w-6 h-6 text-brand-orange" />Leaderboard
        </h1>
        <p className="text-gray-500 text-sm mt-1">Token rankings — earn tokens by completing quizzes and contributing content</p>
      </div>

      <div className="card p-5 bg-gradient-to-r from-brand-black to-gray-800 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Your Ranking</p>
            <p className="text-3xl font-bold mt-1">#{myRank}</p>
            <p className="text-gray-300 text-sm mt-1">{user.fullName ?? "You"}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-sm">Your Tokens</p>
            <div className="flex items-center gap-2 mt-1">
              <Zap className="w-6 h-6 text-brand-orange" />
              <span className="text-3xl font-bold text-brand-orange">{user.tokens}</span>
            </div>
            <p className="text-gray-500 text-xs mt-1">Play quiz to earn more</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <h2 className="font-bold text-brand-black mb-4">Token Rankings (Top 20)</h2>
          {topUsers.length > 0 ? (
            <div className="space-y-2">
              {topUsers.map((u, i) => {
                const isMe = u.id === user.id;
                return (
                  <div key={u.id} className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-colors ${isMe ? "bg-orange-50 border border-brand-orange/20" : "hover:bg-gray-50"}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${i === 0 ? "bg-yellow-400 text-white" : i === 1 ? "bg-gray-300 text-white" : i === 2 ? "bg-orange-400 text-white" : "bg-gray-100 text-gray-600"}`}>
                      {i === 0 ? <Crown className="w-4 h-4" /> : i <= 2 ? <Medal className="w-3.5 h-3.5" /> : i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`text-sm font-semibold ${isMe ? "text-brand-orange" : "text-brand-black"} truncate block`}>
                        {u.fullName ?? "Anonymous"}{isMe && <span className="ml-1 text-xs font-normal">(you)</span>}
                      </span>
                      {u.department && <p className="text-xs text-gray-400 truncate">{u.department}</p>}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Zap className="w-3.5 h-3.5 text-brand-orange" />
                      <span className="font-bold text-brand-black">{u.tokens}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-400 text-sm text-center py-8">No data yet — be the first to play!</p>
          )}
        </div>

        <div className="card p-6">
          <h2 className="font-bold text-brand-black mb-4">Recent Quizzes</h2>
          <div className="space-y-3">
            {recentAttempts.length > 0 ? (
              recentAttempts.map((a, i) => (
                <div key={i} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-sm shrink-0">🎯</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-brand-black truncate">{a.userName ?? "Someone"}</p>
                    <p className="text-xs text-gray-400">{CATEGORY_LABELS[a.category] ?? a.category}</p>
                    <p className="text-xs text-green-600 font-medium">{a.score}/{a.maxScore} pts</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-brand-orange font-bold shrink-0">
                    <Zap className="w-3 h-3" />+{a.tokensEarned}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm text-center py-6">No quiz attempts yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
