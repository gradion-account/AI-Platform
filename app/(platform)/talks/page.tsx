import { requireAuth } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
import { docToData } from "@/lib/firestore-helpers";
import { Video } from "lucide-react";
import type { Talk } from "@/lib/types";
import AddTalkModal from "./AddTalkModal";
import TalkCard from "./TalkCard";

export default async function TalksPage() {
  const user = await requireAuth();

  const snap = await adminDb.collection("talks").orderBy("createdAt", "desc").get();
  const talks = snap.docs.map((d) => docToData<Talk>(d));
  const isAdmin = user.role === "admin";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-black flex items-center gap-2">
            <Video className="w-6 h-6 text-brand-orange" />
            AI Talks
          </h1>
          <p className="text-gray-500 text-sm mt-1">Internal speaker sessions — every Thursday 5pm</p>
        </div>
        {isAdmin && <AddTalkModal />}
      </div>

      {talks.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-4">
          {talks.map((talk) => (
            <TalkCard key={talk.id} talk={talk} isAdmin={isAdmin} />
          ))}
        </div>
      ) : (
        <div className="card p-16 text-center">
          <Video className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No talks yet</p>
          <p className="text-gray-400 text-sm mt-1">
            {isAdmin ? "Add the first AI Talk session." : "AI Talks sessions are coming soon!"}
          </p>
        </div>
      )}
    </div>
  );
}
