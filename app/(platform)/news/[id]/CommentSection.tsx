"use client";

import { useState, useTransition } from "react";
import { addComment } from "@/app/actions/articles";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import type { Comment } from "@/lib/types";

export default function CommentSection({
  articleId, talkId, comments, currentUserId, isAdmin,
}: {
  articleId: string | null;
  talkId: string | null;
  comments: Comment[];
  currentUserId: string;
  isAdmin: boolean;
}) {
  const [localComments, setLocalComments] = useState(comments);
  const [text, setText] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    const draft = text;
    setText("");
    startTransition(async () => {
      await addComment(draft, articleId, talkId);
      setLocalComments((prev) => [
        ...prev,
        { id: Date.now().toString(), content: draft, authorId: currentUserId, authorName: "You", articleId, talkId, createdAt: new Date().toISOString() },
      ]);
    });
  }

  return (
    <div className="card p-6 space-y-5">
      <h3 className="font-bold text-brand-black flex items-center gap-2">
        <MessageSquare className="w-4 h-4 text-brand-orange" />
        Comments <span className="text-gray-400 font-normal text-sm">({localComments.length})</span>
      </h3>

      <form onSubmit={handleSubmit} className="flex gap-3">
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Add a comment…" className="input flex-1" maxLength={1000} />
        <button type="submit" disabled={isPending || !text.trim()} className="btn-primary shrink-0">
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </form>

      {localComments.length > 0 ? (
        <div className="space-y-3">
          {localComments.map((c) => (
            <div key={c.id} className="flex gap-3">
              <div className="w-8 h-8 bg-brand-beige rounded-full flex items-center justify-center shrink-0 text-sm font-bold text-brand-orange">
                {c.authorName?.charAt(0) ?? "U"}
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-semibold text-brand-black">{c.authorName ?? "User"}</span>
                  <span className="text-xs text-gray-400">{formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}</span>
                </div>
                <p className="text-sm text-gray-700 mt-1">{c.content}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400 text-center py-4">No comments yet. Start the conversation!</p>
      )}
    </div>
  );
}
