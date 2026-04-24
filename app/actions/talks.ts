"use server";

import { adminDb } from "@/lib/firebase/admin";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { FieldValue } from "firebase-admin/firestore";

export async function createTalk(formData: FormData) {
  await requireAdmin();

  const tagsRaw = formData.get("tags") as string;
  const tags = tagsRaw
    ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  const scheduledAt = formData.get("scheduled_at") as string;
  const duration = formData.get("duration") as string;

  await adminDb.collection("talks").add({
    title: formData.get("title") as string,
    speakerName: formData.get("speaker_name") as string,
    description: (formData.get("description") as string) || null,
    videoUrl: (formData.get("video_url") as string) || null,
    slidesUrl: (formData.get("slides_url") as string) || null,
    topic: (formData.get("topic") as string) || null,
    duration: duration ? parseInt(duration) : null,
    scheduledAt: scheduledAt || null,
    tags,
    createdAt: FieldValue.serverTimestamp(),
  });

  revalidatePath("/talks");
  return { success: true, error: undefined };
}

export async function deleteTalk(id: string) {
  await requireAdmin();
  await adminDb.collection("talks").doc(id).delete();
  revalidatePath("/talks");
  return { success: true };
}
