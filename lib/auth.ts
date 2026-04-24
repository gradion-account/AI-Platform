import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import type { UserProfile } from "@/lib/types";

const ADMIN_EMAIL = "tuyen.tong@gradion.com";
const ALLOWED_DOMAIN = "@gradion.com";

export async function getCurrentUser(): Promise<UserProfile | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get("__session")?.value;
  if (!session) return null;

  try {
    const decoded = await adminAuth.verifySessionCookie(session, true);
    if (!decoded.email?.endsWith(ALLOWED_DOMAIN)) return null;

    const userRef = adminDb.collection("users").doc(decoded.uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      // First sign-in — create profile
      const profile: Omit<UserProfile, "id"> = {
        email: decoded.email!,
        fullName: decoded.name ?? decoded.email!.split("@")[0],
        department: null,
        role: decoded.email === ADMIN_EMAIL ? "admin" : "user",
        tokens: 0,
        createdAt: new Date().toISOString(),
      };
      await userRef.set(profile);
      return { id: decoded.uid, ...profile };
    }

    const data = userDoc.data()!;
    return {
      id: userDoc.id,
      email: data.email,
      fullName: data.fullName ?? null,
      department: data.department ?? null,
      role: data.role ?? "user",
      tokens: data.tokens ?? 0,
      createdAt:
        typeof data.createdAt === "string"
          ? data.createdAt
          : data.createdAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export async function requireAuth(): Promise<UserProfile> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireAdmin(): Promise<UserProfile> {
  const user = await requireAuth();
  if (user.role !== "admin") redirect("/dashboard");
  return user;
}
