import { requireAuth } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
import { docToData } from "@/lib/firestore-helpers";
import { notFound } from "next/navigation";
import { format, formatDistanceToNow } from "date-fns";
import { ArrowLeft, Wrench, FileText, Download, Trash2 } from "lucide-react";
import Link from "next/link";
import { deleteArticle } from "@/app/actions/articles";
import ReactionsBar from "./ReactionsBar";
import CommentSection from "./CommentSection";
import type { Article, Comment, Reaction } from "@/lib/types";

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireAuth();

  const [articleDoc, commentsSnap, reactionsSnap] = await Promise.all([
    adminDb.collection("articles").doc(id).get(),
    adminDb.collection("comments").where("articleId", "==", id).get(),
    adminDb.collection("reactions").where("articleId", "==", id).get(),
  ]);

  if (!articleDoc.exists) notFound();

  const article = docToData<Article>(articleDoc);
  const comments = commentsSnap.docs
    .map((d) => docToData<Comment>(d))
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  const reactions = reactionsSnap.docs.map((d) => docToData<Reaction>(d));

  const reactionCounts = {
    like: reactions.filter((r) => r.type === "like").length,
    insightful: reactions.filter((r) => r.type === "insightful").length,
    fire: reactions.filter((r) => r.type === "fire").length,
  };
  const userReactions = reactions
    .filter((r) => r.userId === user.id)
    .map((r) => r.type) as ("like" | "insightful" | "fire")[];

  const isAdmin = user.role === "admin";

  async function handleDelete() {
    "use server";
    await deleteArticle(id);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href="/news" className="btn-ghost inline-flex">
        <ArrowLeft className="w-4 h-4" />Back to AI News
      </Link>

      <article className="card p-8">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {article.department && <span className="badge-gray">{article.department}</span>}
          {article.aiTool && (
            <span className="badge-orange"><Wrench className="w-3 h-3" />{article.aiTool}</span>
          )}
          {article.tags.map((tag) => <span key={tag} className="badge-gray">{tag}</span>)}
        </div>

        <h1 className="text-2xl font-bold text-brand-black mb-3">{article.title}</h1>

        <div className="flex items-center gap-3 text-sm text-gray-400 mb-8 pb-6 border-b border-gray-100">
          <span className="font-medium text-brand-black">{article.authorName ?? "Unknown"}</span>
          <span>·</span>
          <time>{format(new Date(article.createdAt), "d MMM yyyy")}</time>
          <span>·</span>
          <span>{formatDistanceToNow(new Date(article.createdAt), { addSuffix: true })}</span>
        </div>

        <div className="space-y-6">
          {article.challenge && <Section title="The Challenge" color="blue"><p className="text-gray-700 leading-relaxed">{article.challenge}</p></Section>}
          {article.whatWeDid && <Section title="What We Did" color="orange"><p className="text-gray-700 leading-relaxed">{article.whatWeDid}</p></Section>}
          {article.result && <Section title="The Result" color="green"><p className="text-gray-700 leading-relaxed">{article.result}</p></Section>}
          {article.tip && <Section title="One Tip for Others" color="purple"><p className="text-gray-700 leading-relaxed">{article.tip}</p></Section>}
        </div>

        {article.fileUrl && (
          <div className="mt-8 pt-6 border-t border-gray-100">
            <a href={article.fileUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-brand-beige rounded-xl hover:bg-orange-100 transition-colors group">
              <FileText className="w-8 h-8 text-brand-orange" />
              <div className="flex-1">
                <p className="font-medium text-brand-black">Attached Document</p>
                <p className="text-sm text-gray-500">Click to open</p>
              </div>
              <Download className="w-5 h-5 text-gray-400 group-hover:text-brand-orange" />
            </a>
          </div>
        )}

        {isAdmin && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <form action={handleDelete}>
              <button type="submit" className="btn-danger"
                onClick={(e) => { if (!confirm("Delete this article?")) e.preventDefault(); }}>
                <Trash2 className="w-4 h-4" />Delete Article
              </button>
            </form>
          </div>
        )}
      </article>

      <ReactionsBar articleId={id} talkId={null} counts={reactionCounts} userReactions={userReactions} />
      <CommentSection articleId={id} talkId={null} comments={comments} currentUserId={user.id} isAdmin={isAdmin} />
    </div>
  );
}

function Section({ title, color, children }: { title: string; color: "blue" | "orange" | "green" | "purple"; children: React.ReactNode }) {
  const colors = { blue: "border-blue-400 bg-blue-50", orange: "border-brand-orange bg-orange-50", green: "border-green-400 bg-green-50", purple: "border-purple-400 bg-purple-50" };
  const titleColors = { blue: "text-blue-700", orange: "text-brand-orange", green: "text-green-700", purple: "text-purple-700" };
  return (
    <div className={`border-l-4 ${colors[color]} rounded-r-xl pl-4 pr-4 py-4`}>
      <h3 className={`text-sm font-bold uppercase tracking-wider ${titleColors[color]} mb-2`}>{title}</h3>
      {children}
    </div>
  );
}
