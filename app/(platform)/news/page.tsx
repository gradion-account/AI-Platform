import { requireAuth } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
import { docToData } from "@/lib/firestore-helpers";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Newspaper, Wrench, ChevronRight } from "lucide-react";
import type { Article } from "@/lib/types";
import AddArticleModal from "./AddArticleModal";

export default async function NewsPage() {
  const user = await requireAuth();

  const snap = await adminDb
    .collection("articles")
    .orderBy("createdAt", "desc")
    .get();

  const articles = snap.docs.map((d) => docToData<Article>(d));
  const isAdmin = user.role === "admin";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-black flex items-center gap-2">
            <Newspaper className="w-6 h-6 text-brand-orange" />
            AI News Hub
          </h1>
          <p className="text-gray-500 text-sm mt-1">Real AI use cases from across the organisation</p>
        </div>
        {isAdmin && <AddArticleModal />}
      </div>

      {articles.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-4">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/news/${article.id}`}
              className="card p-5 hover:shadow-md transition-all group border-l-4 border-l-transparent hover:border-l-brand-orange"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex flex-wrap gap-1.5">
                  {article.department && <span className="badge-gray">{article.department}</span>}
                  {article.aiTool && (
                    <span className="badge-orange">
                      <Wrench className="w-3 h-3" />{article.aiTool}
                    </span>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-brand-orange transition-colors shrink-0 mt-0.5" />
              </div>

              <h2 className="font-bold text-brand-black group-hover:text-brand-orange transition-colors line-clamp-2 mb-2">
                {article.title}
              </h2>

              {article.challenge && (
                <p className="text-sm text-gray-500 line-clamp-2 mb-3">{article.challenge}</p>
              )}

              {article.result && (
                <div className="bg-green-50 border border-green-100 rounded-lg px-3 py-2 mb-3">
                  <p className="text-xs font-medium text-green-700 line-clamp-2">✓ {article.result}</p>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{article.authorName ?? "Unknown"}</span>
                <span>{formatDistanceToNow(new Date(article.createdAt), { addSuffix: true })}</span>
              </div>

              {article.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {article.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="badge-gray">{tag}</span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <div className="card p-16 text-center">
          <Newspaper className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No articles yet</p>
          <p className="text-gray-400 text-sm mt-1">
            {isAdmin ? 'Click "Add Article" to publish the first AI use case.' : "The first AI News article is coming soon!"}
          </p>
        </div>
      )}
    </div>
  );
}
