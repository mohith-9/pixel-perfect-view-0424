import { createFileRoute } from "@tanstack/react-router";
import { PageIntro } from "@/components/site/page-intro";
import { ResultsSection, CaseStudySection, ContactSection } from "@/components/site/sections";

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [
      { title: "Client Results — Mohith Kumar, Video Editor" },
      {
        name: "description",
        content:
          "12M+ views, 250K+ followers gained and 300% average growth for creators and brands.",
      },
      { property: "og:title", content: "Client Results — Mohith Kumar, Video Editor" },
      {
        property: "og:description",
        content:
          "12M+ views, 250K+ followers gained and 300% average growth for creators and brands.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <main>
      <PageIntro
        label="Client Results"
        lead="Proven"
        accent="Results"
        text="12M+ views, 250K+ followers gained and 300% average growth for creators and brands."
      />
      <ResultsSection />
      <CaseStudySection />
      <ContactSection />
    </main>
  );
}
