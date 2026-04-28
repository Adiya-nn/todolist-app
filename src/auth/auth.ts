import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import type { User } from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { app } from "../firebase";

const auth = getAuth(app);
const db = getFirestore(app);

const getFirebaseErrorText = (err: any): string => {
  const code = err?.code;
  const msg = err?.message;

  if (code) {
    switch (code) {
      case "auth/email-already-in-use":
        return "Энэ email аль хэдийн бүртгэлтэй байна.";
      case "auth/invalid-email":
        return "Email буруу форматтай байна.";
      case "auth/weak-password":
        return "Password сул байна. (6+ тэмдэгт хэрэгтэй)";
      case "auth/user-not-found":
        return "Ийм хэрэглэгч олдсонгүй.";
      case "auth/wrong-password":
        return "Password буруу байна.";
      case "auth/operation-not-allowed":
        return "Firebase дээр Email/Password provider enable хийгдээгүй байна.";
      case "auth/network-request-failed":
        return "Интернет/сүлжээний алдаа гарлаа. VPN/AdBlock шалга.";
      case "auth/too-many-requests":
        return "Олон удаа оролдлоо. Түр хүлээгээд дахин оролдоорой.";
      case "auth/invalid-api-key":
        return "Firebase apiKey буруу байна (firebaseConfig шалга).";
      case "auth/app-not-authorized":
        return "App authorized биш байна (domain / api key шалга).";
      case "auth/internal-error":
        return "Firebase internal error гарлаа.";
      default:
        return `Firebase error: ${code}`;
    }
  }

  if (msg) return `Error: ${msg}`;
  return "Тодорхойгүй алдаа гарлаа.";
};

let currentUser: User | null = auth.currentUser ?? null;

onAuthStateChanged(auth, (user) => {
  currentUser = user;
});

export const register = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      createdAt: serverTimestamp(),
      role: "user",
    });

    return { ok: true as const, user };
  } catch (err: any) {
    console.error("REGISTER ERROR RAW:", err);
    console.error("REGISTER ERROR CODE:", err?.code);
    console.error("REGISTER ERROR MESSAGE:", err?.message);

    return {
      ok: false as const,
      error: getFirebaseErrorText(err),
    };
  }
};

export const login = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    return { ok: true as const, user: userCredential.user };
  } catch (err: any) {
    console.error("LOGIN ERROR RAW:", err);
    console.error("LOGIN ERROR CODE:", err?.code);
    console.error("LOGIN ERROR MESSAGE:", err?.message);

    return {
      ok: false as const,
      error: getFirebaseErrorText(err),
    };
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    return { ok: true as const };
  } catch (err: any) {
    console.error("LOGOUT ERROR RAW:", err);
    return { ok: false as const, error: getFirebaseErrorText(err) };
  }
};

export const getUser = () => currentUser;
export const isAuthed = () => !!currentUser;