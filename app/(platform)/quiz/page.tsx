import { requireAuth } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
import { docToData } from "@/lib/firestore-helpers";
import type { QuizQuestion } from "@/lib/types";
import QuizGame from "./QuizGame";

export default async function QuizPage() {
  await requireAuth();

  const snap = await adminDb
    .collection("quizQuestions")
    .where("active", "==", true)
    .get();

  const questions = snap.docs.map((d) => docToData<QuizQuestion>(d));

  return <QuizGame allQuestions={questions} />;
}
