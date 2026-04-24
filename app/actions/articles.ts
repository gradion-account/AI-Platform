"use server";

import { adminDb } from "@/lib/firebase/admin";
import { requireAuth, requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { FieldValue } from "firebase-admin/firestore";

export async function createArticle(formData: FormData) {
  const user = await requireAdmin();

  const tagsRaw = formData.get("tags") as string;
  const tags = tagsRaw
    ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  const { id } = await adminDb.collection("articles").add({
    title: formData.get("title") as string,
    department: (formData.get("department") as string) || null,
    challenge: (formData.get("challenge") as string) || null,
    aiTool: (formData.get("ai_tool") as string) || null,
    whatWeDid: (formData.get("what_we_did") as string) || null,
    result: (formData.get("result") as string) || null,
    tip: (formData.get("tip") as string) || null,
    fileUrl: (formData.get("file_url") as string) || null,
    tags,
    authorId: user.id,
    authorName: user.fullName,
    published: true,
    views: 0,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  // Award 10 tokens for publishing
  await adminDb.collection("users").doc(user.id).update({
    tokens: FieldValue.increment(10),
  });
  await adminDb.collection("tokenTransactions").add({
    userId: user.id,
    amount: 10,
    action: "article_published",
    referenceId: id,
    createdAt: FieldValue.serverTimestamp(),
  });

  revalidatePath("/news");
  revalidatePath("/dashboard");
  return { success: true, error: undefined };
}

export async function deleteArticle(id: string) {
  await requireAdmin();
  await adminDb.collection("articles").doc(id).delete();
  // Also delete related comments and reactions
  const [comments, reactions] = await Promise.all([
    adminDb.collection("comments").where("articleId", "==", id).get(),
    adminDb.collection("reactions").where("articleId", "==", id).get(),
  ]);
  const batch = adminDb.batch();
  comments.docs.forEach((d) => batch.delete(d.ref));
  reactions.docs.forEach((d) => batch.delete(d.ref));
  await batch.commit();

  revalidatePath("/news");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function addComment(
  content: string,
  articleId: string | null,
  talkId: string | null
) {
  const user = await requireAuth();
  await adminDb.collection("comments").add({
    content,
    authorId: user.id,
    authorName: user.fullName,
    articleId,
    talkId,
    createdAt: FieldValue.serverTimestamp(),
  });
  if (articleId) revalidatePath(`/news/${articleId}`);
  if (talkId) revalidatePath(`/talks/${talkId}`);
  return { success: true };
}

export async function toggleReaction(
  type: "like" | "insightful" | "fire",
  articleId: string | null,
  talkId: string | null
) {
  const user = await requireAuth();

  const query = adminDb
    .collection("reactions")
    .where("userId", "==", user.id)
    .where("type", "==", type)
    .where(articleId ? "articleId" : "talkId", "==", articleId ?? talkId);

  const existing = await query.get();

  if (!existing.empty) {
    await existing.docs[0].ref.delete();
  } else {
    await adminDb.collection("reactions").add({
      userId: user.id,
      type,
      articleId,
      talkId,
      createdAt: FieldValue.serverTimestamp(),
    });
  }

  if (articleId) revalidatePath(`/news/${articleId}`);
  if (talkId) revalidatePath(`/talks/${talkId}`);
  return { success: true };
}
