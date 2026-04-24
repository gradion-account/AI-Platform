import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { getStorage, Storage } from "firebase-admin/storage";

function ensureInit() {
  if (getApps().length) return;
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

function lazyProxy<T extends object>(getInstance: () => T): T {
  return new Proxy({} as T, {
    get(_, prop: string | symbol) {
      const instance = getInstance();
      const val = Reflect.get(instance, prop, instance);
      return typeof val === "function" ? (val as (...a: unknown[]) => unknown).bind(instance) : val;
    },
  });
}

export const adminAuth: Auth = lazyProxy(() => { ensureInit(); return getAuth(); });
export const adminDb: Firestore = lazyProxy(() => { ensureInit(); return getFirestore(); });
export const adminStorage: Storage = lazyProxy(() => { ensureInit(); return getStorage(); });
