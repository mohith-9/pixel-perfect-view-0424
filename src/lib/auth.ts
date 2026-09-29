import { User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export const OWNER_EMAILS = ["boddulamohithkumar@gmail.com", "editsofmkk@gmail.com"];

export async function isUserAdmin(user: User | null): Promise<boolean> {
  if (!user) return false;

  const emailLower = (user.email ?? "").toLowerCase();
  const isOwner = OWNER_EMAILS.some((e) => e.toLowerCase() === emailLower);

  if (isOwner) {
    // Ensure admin document exists for owner
    try {
      const adminRef = doc(db, "admins", user.uid);
      const snap = await getDoc(adminRef);
      if (!snap.exists()) {
        await setDoc(adminRef, {
          email: user.email,
          role: "admin",
          created_at: new Date().toISOString(),
        });
      }
    } catch (e) {
      console.warn("Could not sync owner admin doc:", e);
    }
    return true;
  }

  try {
    const adminSnap = await getDoc(doc(db, "admins", user.uid));
    return adminSnap.exists() && adminSnap.data()?.role === "admin";
  } catch (e) {
    console.error("Admin verification error:", e);
    return false;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      resolve(user);
    });
  });
}
