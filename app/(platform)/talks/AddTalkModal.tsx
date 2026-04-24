"use client";

import { useState, useTransition } from "react";
import { createTalk } from "@/app/actions/talks";
import { Plus, X, Loader2 } from "lucide-react";

export default function AddTalkModal() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await createTalk(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setOpen(false);
        (e.target as HTMLFormElement).reset();
      }
    });
  }

  if (!open)
    return (
      <button onClick={() => setOpen(true)} className="btn-primary">
        <Plus className="w-4 h-4" />
        Add Talk
      </button>
    );

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-bold text-brand-black">Add AI Talk</h2>
          <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="label">Title *</label>
            <input name="title" required placeholder="Talk title" className="input" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Speaker Name *</label>
              <input name="speaker_name" required placeholder="Speaker name" className="input" />
            </div>
            <div>
              <label className="label">Topic</label>
              <input name="topic" placeholder="e.g. Prompt Engineering" className="input" />
            </div>
          </div>
          <div>
            <label className="label">Description</label>
            <textarea name="description" rows={2} placeholder="What is this talk about?" className="input resize-none" />
          </div>
          <div>
            <label className="label">YouTube / Video URL</label>
            <input name="video_url" type="url" placeholder="https://youtube.com/watch?v=..." className="input" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Slides URL</label>
              <input name="slides_url" type="url" placeholder="https://..." className="input" />
            </div>
            <div>
              <label className="label">Duration (minutes)</label>
              <input name="duration" type="number" min="1" max="300" placeholder="60" className="input" />
            </div>
          </div>
          <div>
            <label className="label">Scheduled Date</label>
            <input name="scheduled_at" type="datetime-local" className="input" />
          </div>
          <div>
            <label className="label">Tags</label>
            <input name="tags" placeholder="ai, prompting, tools (comma-separated)" className="input" />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">{error}</div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setOpen(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button type="submit" disabled={isPending} className="btn-primary flex-1 justify-center">
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Add Talk
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
