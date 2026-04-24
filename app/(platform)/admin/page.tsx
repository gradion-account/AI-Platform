import { requireAdmin } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
import { docToData } from "@/lib/firestore-helpers";
import { Settings, Users, Newspaper, Video, Brain, Trash2 } from "lucide-react";
import { deleteArticle } from "@/app/actions/articles";
import { deleteTalk } from "@/app/actions/talks";
import ExportButton from "./ExportButton";
import SeedButton from "./SeedButton";
import type { Article, Talk, UserProfile, QuizAttempt } from "@/lib/types";

export default async function AdminPage() {
  await requireAdmin();

  const [articlesSnap, talksSnap, usersSnap, attemptsSnap] = await Promise.all([
    adminDb.collection("articles").orderBy("createdAt", "desc").get(),
    adminDb.collection("talks").orderBy("createdAt", "desc").get(),
    adminDb.collection("users").orderBy("tokens", "desc").get(),
    adminDb.collection("quizAttempts").orderBy("createdAt", "desc").limit(50).get(),
  ]);

  const articles = articlesSnap.docs.map((d) => docToData<Article>(d));
  const talks = talksSnap.docs.map((d) => docToData<Talk>(d));
  const users = usersSnap.docs.map((d) => docToData<UserProfile>(d));
  const attempts = attemptsSnap.docs.map((d) => docToData<QuizAttempt>(d));

  const stats = [
    { label: "Total Users", value: users.length, icon: Users, color: "bg-blue-50 text-blue-600" },
    { label: "Articles Published", value: articles.length, icon: Newspaper, color: "bg-orange-50 text-brand-orange" },
    { label: "AI Talks", value: talks.length, icon: Video, color: "bg-purple-50 text-purple-600" },
    { label: "Quiz Attempts", value: attempts.length, icon: Brain, color: "bg-green-50 text-green-600" },
  ];

  async function handleDeleteArticle(formData: FormData) {
    "use server";
    await deleteArticle(formData.get("id") as string);
  }
  async function handleDeleteTalk(formData: FormData) {
    "use server";
    await deleteTalk(formData.get("id") as string);
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-brand-black flex items-center gap-2">
            <Settings className="w-6 h-6 text-brand-orange" />Admin Panel
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage platform content, users, and data exports</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <SeedButton />
          <ExportButton articles={articles} talks={talks} users={users} attempts={attempts} />
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-5">
            <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mb-3`}><Icon className="w-5 h-5" /></div>
            <div className="text-2xl font-bold text-brand-black">{value}</div>
            <div className="text-sm text-gray-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Articles */}
      <div className="card p-6">
        <h2 className="font-bold text-brand-black mb-4 flex items-center gap-2">
          <Newspaper className="w-4 h-4 text-brand-orange" />Manage Articles ({articles.length})
        </h2>
        <div className="space-y-2">
          {articles.length > 0 ? articles.map((a) => (
            <div key={a.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-brand-black truncate">{a.title}</p>
                <p className="text-xs text-gray-400">{a.authorName} · {a.department} · {new Date(a.createdAt).toLocaleDateString()}{a.aiTool && ` · ${a.aiTool}`}</p>
              </div>
              <form action={handleDeleteArticle}>
                <input type="hidden" name="id" value={a.id} />
                <button type="submit" className="text-gray-400 hover:text-red-500 p-1.5 rounded hover:bg-red-50 transition-colors" title="Delete"
                  onClick={(e) => { if (!confirm(`Delete "${a.title}"?`)) e.preventDefault(); }}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </form>
            </div>
          )) : <p className="text-sm text-gray-400 text-center py-4">No articles yet.</p>}
        </div>
      </div>

      {/* Talks */}
      <div className="card p-6">
        <h2 className="font-bold text-brand-black mb-4 flex items-center gap-2">
          <Video className="w-4 h-4 text-brand-orange" />Manage Talks ({talks.length})
        </h2>
        <div className="space-y-2">
          {talks.length > 0 ? talks.map((t) => (
            <div key={t.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-brand-black truncate">{t.title}</p>
                <p className="text-xs text-gray-400">{t.speakerName} · {t.topic} · {new Date(t.createdAt).toLocaleDateString()}</p>
              </div>
              <form action={handleDeleteTalk}>
                <input type="hidden" name="id" value={t.id} />
                <button type="submit" className="text-gray-400 hover:text-red-500 p-1.5 rounded hover:bg-red-50 transition-colors" title="Delete"
                  onClick={(e) => { if (!confirm(`Delete "${t.title}"?`)) e.preventDefault(); }}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </form>
            </div>
          )) : <p className="text-sm text-gray-400 text-center py-4">No talks yet.</p>}
        </div>
      </div>

      {/* Users */}
      <div className="card p-6">
        <h2 className="font-bold text-brand-black mb-4 flex items-center gap-2">
          <Users className="w-4 h-4 text-brand-orange" />All Users ({users.length})
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-100">
                {["Name", "Email", "Department", "Role", "Tokens"].map((h) => (
                  <th key={h} className={`pb-2 text-gray-500 font-medium ${h === "Tokens" ? "text-right" : ""}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="py-2.5 font-medium text-brand-black">{u.fullName ?? "—"}</td>
                  <td className="py-2.5 text-gray-500">{u.email}</td>
                  <td className="py-2.5 text-gray-500">{u.department ?? "—"}</td>
                  <td className="py-2.5"><span className={u.role === "admin" ? "badge-orange" : "badge-gray"}>{u.role}</span></td>
                  <td className="py-2.5 text-right font-bold text-brand-orange">{u.tokens}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
