import type { DocumentSnapshot, QueryDocumentSnapshot } from "firebase-admin/firestore";

// Convert a Firestore Timestamp field to an ISO string when serializing docs
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function convertValue(value: any): unknown {
  if (value && typeof value === "object" && typeof value.toDate === "function") {
    return (value.toDate() as Date).toISOString();
  }
  return value;
}

export function docToData<T>(doc: DocumentSnapshot | QueryDocumentSnapshot): T {
  const raw = doc.data() ?? {};
  const converted: Record<string, unknown> = { id: doc.id };
  for (const [k, v] of Object.entries(raw)) {
    converted[k] = convertValue(v);
  }
  return converted as T;
}
