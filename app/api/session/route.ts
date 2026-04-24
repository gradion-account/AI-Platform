import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { cookies } from "next/headers";

const ALLOWED_DOMAIN = "@gradion.com";
const ADMIN_EMAIL = "tuyen.tong@gradion.com";
const SESSION_DURATION_MS = 60 * 60 * 24 * 7 * 1000; // 7 days

export async function POST(request: NextRequest) {
  const { idToken } = await request.json();

  try {
    const decoded = await adminAuth.verifyIdToken(idToken);

    if (!decoded.email?.endsWith(ALLOWED_DOMAIN)) {
      return NextResponse.json(
        { error: "Only @gradion.com accounts are allowed." },
        { status: 403 }
      );
    }

    // Ensure user document exists in Firestore
    const userRef = adminDb.collection("users").doc(decoded.uid);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      await userRef.set({
        email: decoded.email,
        fullName: decoded.name ?? decoded.email.split("@")[0],
        role: decoded.email === ADMIN_EMAIL ? "admin" : "user",
        tokens: 0,
        createdAt: new Date().toISOString(),
      });
    }

    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: SESSION_DURATION_MS,
    });

    const cookieStore = await cookies();
    cookieStore.set("__session", sessionCookie, {
      maxAge: SESSION_DURATION_MS / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Session creation error:", err);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("__session");
  return NextResponse.json({ success: true });
}
