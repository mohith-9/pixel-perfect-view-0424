import { createFileRoute } from "@tanstack/react-router";
import { PageIntro } from "@/components/site/page-intro";
import { ServicesSection, ProcessSection, ToolsSection, ContactSection } from "@/components/site/sections";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Video Editing Services — Mohith Kumar, Video Editor" },
      { name: "description", content: "Reels editing, YouTube editing, social ads, brand videos and motion graphics by Mohith Kumar." },
      { property: "og:title", content: "Video Editing Services — Mohith Kumar, Video Editor" },
      { property: "og:description", content: "Reels editing, YouTube editing, social ads, brand videos and motion graphics by Mohith Kumar." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <main>
      <PageIntro label="Video Editing Services" lead="Editing" accent="Services" text="Reels editing, YouTube editing, social ads, brand videos and motion graphics by Mohith Kumar." />
      <ServicesSection />
      <ProcessSection />
      <ToolsSection />
      <ContactSection />
    </main>
  );
}
