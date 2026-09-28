import { createFileRoute } from "@tanstack/react-router";
import { PageIntro } from "@/components/site/page-intro";
import { WorkSection, CaseStudySection, ToolsSection, ContactSection } from "@/components/site/sections";

export const Route = createFileRoute("/work")({
  head: () => ({
    meta: [
      { title: "Featured Work — Mohith Kumar, Video Editor" },
      { name: "description", content: "Reels, ads and brand videos with millions of views — a selection of Mohith Kumar's recent edits." },
      { property: "og:title", content: "Featured Work — Mohith Kumar, Video Editor" },
      { property: "og:description", content: "Reels, ads and brand videos with millions of views — a selection of Mohith Kumar's recent edits." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <main>
      <PageIntro label="Featured Work" lead="Selected" accent="Work" text="Reels, ads and brand videos with millions of views — a selection of Mohith Kumar's recent edits." />
      <WorkSection />
      <CaseStudySection />
      <ToolsSection />
      <ContactSection />
    </main>
  );
}
