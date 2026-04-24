import { requireAuth } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
import { docToData } from "@/lib/firestore-helpers";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Newspaper, Video, Brain, Zap, TrendingUp, Trophy } from "lucide-react";
import type { Article, UserProfile } from "@/lib/types";

export default async function DashboardPage() {
  const user = await requireAuth();

  const [articlesSnap, talksSnap, recentSnap, topUsersSnap] = await Promise.all([
    adminDb.collection("articles").count().get(),
    adminDb.collection("talks").count().get(),
    adminDb.collection("articles").orderBy("createdAt", "desc").limit(4).get(),
    adminDb.collection("users").orderBy("tokens", "desc").limit(3).get(),
  ]);

  const recentArticles = recentSnap.docs.map((d) => docToData<Article>(d));
  const topUsers = topUsersSnap.docs.map((d) => docToData<UserProfile>(d));

  const stats = [
    { label: "AI News Articles", value: articlesSnap.data().count, icon: Newspaper, href: "/news", color: "text-brand-orange", bg: "bg-orange-50" },
    { label: "AI Talks", value: talksSnap.data().count, icon: Video, href: "/talks", color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Quiz Questions", value: 30, icon: Brain, href: "/quiz", color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Your Tokens", value: user.tokens, icon: Zap, href: "/leaderboard", color: "text-yellow-600", bg: "bg-yellow-50" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-brand-black">
          Welcome back, <span className="text-brand-orange">{user.fullName?.split(" ")[0] ?? "there"}</span> 👋
        </h1>
        <p className="text-gray-500 mt-1">Here&apos;s what&apos;s happening in the Gradion AI community.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, href, color, bg }) => (
          <Link key={label} href={href} className="card p-5 hover:shadow-md transition-shadow group">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div className="text-2xl font-bold text-brand-black">{value}</div>
            <div className="text-sm text-gray-500 mt-0.5 group-hover:text-brand-orange transition-colors">{label}</div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-brand-black flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-orange" />
              Latest AI News
            </h2>
            <Link href="/news" className="text-brand-orange text-sm font-medium hover:underline">View all →</Link>
          </div>
          <div className="space-y-3">
            {recentArticles.length > 0 ? (
              recentArticles.map((a) => (
                <Link key={a.id} href={`/news/${a.id}`} className="flex items-start gap-3 p-3 rounded-lg hover:bg-brand-beige transition-colors group">
                  <div className="w-9 h-9 bg-orange-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                    <Newspaper className="w-4 h-4 text-brand-orange" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-brand-black group-hover:text-brand-orange transition-colors line-clamp-2">{a.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {a.department} · {formatDistanceToNow(new Date(a.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  {a.aiTool && <span className="badge-orange shrink-0">{a.aiTool}</span>}
                </Link>
              ))
            ) : (
              <p className="text-sm text-gray-400 text-center py-8">No articles yet. Be the first to share an AI use case!</p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-brand-black flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-500" />
                Top Earners
              </h2>
              <Link href="/leaderboard" className="text-brand-orange text-sm font-medium hover:underline">Full board →</Link>
            </div>
            <div className="space-y-3">
              {topUsers.length > 0 ? (
                topUsers.map((u, i) => (
                  <div key={u.id} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? "bg-yellow-100 text-yellow-600" : i === 1 ? "bg-gray-100 text-gray-600" : "bg-orange-100 text-orange-600"}`}>
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-brand-black truncate">{u.fullName ?? "Anonymous"}</p>
                      <p className="text-xs text-gray-400">{u.department}</p>
                    </div>
                    <span className="text-sm font-bold text-brand-orange">{u.tokens}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400 text-center py-4">Play the quiz to earn tokens!</p>
              )}
            </div>
          </div>

          <div className="card p-6">
            <h2 className="font-bold text-brand-black mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link href="/quiz" className="btn-primary w-full justify-center"><Brain className="w-4 h-4" />Take AI Quiz</Link>
              <Link href="/news" className="btn-secondary w-full justify-center"><Newspaper className="w-4 h-4" />Browse AI News</Link>
              <Link href="/talks" className="btn-outline w-full justify-center"><Video className="w-4 h-4" />Watch AI Talks</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
