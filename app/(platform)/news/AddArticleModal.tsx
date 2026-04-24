"use client";

import { useState, useTransition } from "react";
import { createArticle } from "@/app/actions/articles";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase/client";
import { Plus, X, Loader2, Upload } from "lucide-react";

export default function AddArticleModal() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [isPending, startTransition] = useTransition();

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const storageRef = ref(storage, `documents/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setFileUrl(url);
      setFileName(file.name);
    } catch {
      setError("File upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    // Inject the already-uploaded URL
    if (fileUrl) formData.set("file_url", fileUrl);
    startTransition(async () => {
      const result = await createArticle(formData);
      if (result?.error) {
        setError(result.error as string);
      } else {
        setOpen(false);
        setFileUrl("");
        setFileName("");
        (e.target as HTMLFormElement).reset();
      }
    });
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="btn-primary">
        <Plus className="w-4 h-4" />Add Article
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-brand-black">Add AI News Article</h2>
          <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="label">Title *</label>
            <input name="title" required placeholder="e.g. How We Cut Proposal Writing Time by 60% Using Claude" className="input" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Department</label>
              <select name="department" className="input">
                <option value="">Select department</option>
                {["BOD", "Consulting", "Sales", "SAP", "Finance & Accounting", "HR", "Marketing & Branding", "IT", "Engineering Excellence", "Vietnam Delivery", "Thailand Delivery", "Egypt Delivery", "Community Team"].map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">AI Tool Used</label>
              <input name="ai_tool" placeholder="e.g. Claude, GPT-4, Perplexity…" className="input" />
            </div>
          </div>

          <div>
            <label className="label">The Challenge</label>
            <textarea name="challenge" rows={2} placeholder="What problem were you solving?" className="input resize-none" />
          </div>
          <div>
            <label className="label">What We Did</label>
            <textarea name="what_we_did" rows={3} placeholder="Brief description of how you used the AI tool…" className="input resize-none" />
          </div>
          <div>
            <label className="label">The Result</label>
            <textarea name="result" rows={2} placeholder="Measurable outcome — time saved, quality improved, cost reduced…" className="input resize-none" />
          </div>
          <div>
            <label className="label">One Tip for Others</label>
            <textarea name="tip" rows={2} placeholder="What would you tell a colleague trying to replicate this?" className="input resize-none" />
          </div>
          <div>
            <label className="label">Tags</label>
            <input name="tags" placeholder="productivity, automation, claude (comma-separated)" className="input" />
          </div>

          <div>
            <label className="label">Attach File (PDF, DOCX, etc.)</label>
            <label className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-brand-orange hover:bg-orange-50 transition-colors">
              <Upload className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-500">
                {uploading ? "Uploading…" : fileName ? fileName : "Click to upload a file"}
              </span>
              <input type="file" accept=".pdf,.doc,.docx,.pptx" className="hidden" onChange={handleFileChange} disabled={uploading} />
            </label>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">{error}</div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setOpen(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button type="submit" disabled={isPending || uploading} className="btn-primary flex-1 justify-center">
              {(isPending || uploading) && <Loader2 className="w-4 h-4 animate-spin" />}
              Publish Article
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
