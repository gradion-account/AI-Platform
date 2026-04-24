"use server";

import { adminDb } from "@/lib/firebase/admin";
import { requireAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { FieldValue } from "firebase-admin/firestore";

export async function submitQuizResult(data: {
  category: string;
  score: number;
  maxScore: number;
  correctCount: number;
  totalQuestions: number;
  timeTaken: number;
}) {
  const user = await requireAuth();

  const tokensEarned = Math.max(
    1,
    data.correctCount * 2 + (data.timeTaken < 120 ? 5 : 0)
  );

  await adminDb.collection("quizAttempts").add({
    userId: user.id,
    userName: user.fullName,
    category: data.category,
    score: data.score,
    maxScore: data.maxScore,
    correctCount: data.correctCount,
    totalQuestions: data.totalQuestions,
    timeTaken: data.timeTaken,
    tokensEarned,
    createdAt: FieldValue.serverTimestamp(),
  });

  await adminDb.collection("users").doc(user.id).update({
    tokens: FieldValue.increment(tokensEarned),
  });
  await adminDb.collection("tokenTransactions").add({
    userId: user.id,
    amount: tokensEarned,
    action: "quiz_completion",
    referenceId: data.category,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: FieldValue.serverTimestamp(),
  });

  revalidatePath("/leaderboard");
  revalidatePath("/dashboard");
  return { success: true, tokensEarned };
}
