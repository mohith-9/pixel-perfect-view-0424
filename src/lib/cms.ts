import { queryOptions, useQuery } from "@tanstack/react-query";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage, handleFirestoreError, OperationType } from "./firebase";

export type HeroStat = { value: string; label1: string; label2: string };
export type HeroContent = {
  small_heading: string;
  name_line1: string;
  name_line2: string;
  role: string;
  description: string;
  image_url: string;
  background_text: string;
  tagline: string;
  stats: HeroStat[];
  primary_cta_text: string;
  primary_cta_link: string;
  secondary_cta_text: string;
  secondary_cta_link: string;
};
export type ContactContent = {
  email: string;
  alt_email: string;
  phone: string;
  whatsapp: string;
  location: string;
  business_hours: string;
};
export type SocialItem = { platform: string; url: string; active: boolean };
export type SocialsContent = { items: SocialItem[] };

export const DEFAULT_HERO: HeroContent = {
  small_heading: "Hello, I'm",
  name_line1: "Mohith",
  name_line2: "Kumar",
  role: "Video Editor & Reels Creator",
  description:
    "I create high-retention reels and short-form videos that help creators, brands and businesses grow through better storytelling, editing and content strategy.",
  image_url: "",
  background_text: "EDITOR",
  tagline: "Turning ideas into scroll-stopping videos that get results.",
  stats: [
    { value: "3+", label1: "Years", label2: "Experience" },
    { value: "150+", label1: "Projects", label2: "Completed" },
    { value: "50+", label1: "Happy", label2: "Clients" },
  ],
  primary_cta_text: "Let's Create Your Reels",
  primary_cta_link: "/contact",
  secondary_cta_text: "Watch Showreel",
  secondary_cta_link: "/work",
};

export const DEFAULT_CONTACT: ContactContent = {
  email: "editsofmkk@gmail.com",
  alt_email: "boddulamohithkumar@gmail.com",
  phone: "+91 79959 90130",
  whatsapp: "+917995990130",
  location: "",
  business_hours: "",
};

export const DEFAULT_SOCIALS: SocialsContent = {
  items: [
    { platform: "Instagram", url: "https://www.instagram.com/mohithh_kumarrr/", active: true },
    { platform: "Facebook", url: "https://www.facebook.com/mohithkumar.boddula/", active: true },
  ],
};

const DEFAULTS = { hero: DEFAULT_HERO, contact: DEFAULT_CONTACT, socials: DEFAULT_SOCIALS };
type Keys = keyof typeof DEFAULTS;

export const contentQuery = <K extends Keys>(key: K) =>
  queryOptions({
    queryKey: ["site_content", key],
    queryFn: async () => {
      const docPath = `site_content/${key}`;
      try {
        const snap = await getDoc(doc(db, "site_content", key));
        if (snap.exists()) {
          const docData = snap.data();
          const val = (docData.value as object) ?? docData;
          return { ...DEFAULTS[key], ...val } as (typeof DEFAULTS)[K];
        }
        return DEFAULTS[key];
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, docPath);
      }
    },
    staleTime: 30_000,
  });

export function useContent<K extends Keys>(key: K) {
  const q = useQuery(contentQuery(key));
  return q.data ?? DEFAULTS[key];
}

export async function saveContent(key: Keys, value: unknown) {
  const docPath = `site_content/${key}`;
  try {
    await setDoc(
      doc(db, "site_content", key),
      {
        key,
        value: value as never,
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}

export type Project = {
  id: string;
  title: string;
  client_name: string | null;
  category: string | null;
  description: string | null;
  thumbnail_url: string | null;
  video_url: string | null;
  platform: string | null;
  views: string | null;
  project_date: string | null;
  featured: boolean;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export const publicProjectsQuery = queryOptions({
  queryKey: ["projects", "public"],
  queryFn: async () => {
    const collPath = "projects";
    try {
      const q = query(
        collection(db, "projects"),
        where("published", "==", true),
        where("featured", "==", true),
        orderBy("sort_order", "asc"),
      );
      const snap = await getDocs(q);
      const list: Project[] = [];
      snap.forEach((docSnap) => {
        list.push({
          id: docSnap.id,
          ...(docSnap.data() as Omit<Project, "id">),
        });
      });
      return list;
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, collPath);
    }
  },
  staleTime: 30_000,
});

/** Uploads into the Firebase Storage media bucket and returns a download link. Admin only. */
export async function uploadMedia(file: File, folder: string): Promise<string> {
  const ext = file.name.split(".").pop() || "bin";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file, { contentType: file.type });
  return await getDownloadURL(storageRef);
}
