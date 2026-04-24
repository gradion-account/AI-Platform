"use client";

import { useState, useTransition } from "react";
import { toggleReaction } from "@/app/actions/articles";
import clsx from "clsx";

const REACTIONS = [
  { type: "like" as const, emoji: "👍", label: "Like" },
  { type: "insightful" as const, emoji: "💡", label: "Insightful" },
  { type: "fire" as const, emoji: "🔥", label: "Fire" },
];

export default function ReactionsBar({
  articleId,
  talkId,
  counts,
  userReactions,
}: {
  articleId: string | null;
  talkId: string | null;
  counts: Record<string, number>;
  userReactions: ("like" | "insightful" | "fire")[];
}) {
  const [localCounts, setLocalCounts] = useState(counts);
  const [localUserReactions, setLocalUserReactions] = useState(
    new Set(userReactions)
  );
  const [, startTransition] = useTransition();

  function handleReaction(type: "like" | "insightful" | "fire") {
    const hasReacted = localUserReactions.has(type);
    setLocalCounts((prev) => ({
      ...prev,
      [type]: hasReacted ? prev[type] - 1 : prev[type] + 1,
    }));
    setLocalUserReactions((prev) => {
      const next = new Set(prev);
      hasReacted ? next.delete(type) : next.add(type);
      return next;
    });
    startTransition(async () => { await toggleReaction(type, articleId, talkId); });
  }

  return (
    <div className="card p-4 flex items-center gap-3">
      <span className="text-sm text-gray-500 font-medium mr-1">React:</span>
      {REACTIONS.map(({ type, emoji, label }) => (
        <button
          key={type}
          onClick={() => handleReaction(type)}
          className={clsx(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all",
            localUserReactions.has(type)
              ? "bg-brand-orange text-white shadow-sm"
              : "bg-gray-100 text-gray-600 hover:bg-orange-50 hover:text-brand-orange"
          )}
        >
          <span>{emoji}</span>
          <span>{label}</span>
          {localCounts[type] > 0 && (
            <span
              className={clsx(
                "ml-0.5 font-bold",
                localUserReactions.has(type) ? "text-white/80" : "text-gray-400"
              )}
            >
              {localCounts[type]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
