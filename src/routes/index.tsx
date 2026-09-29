import { createFileRoute } from "@tanstack/react-router";
import {
  Hero,
  ServicesSection,
  ResultsSection,
  WorkSection,
  CaseStudySection,
  TestimonialsSection,
  ProcessSection,
  ToolsSection,
  ContactSection,
} from "@/components/site/sections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mohith Kumar — Social Media Video Editor" },
      {
        name: "description",
        content:
          "Mohith Kumar edits high-retention reels, YouTube videos and social ads that grow brands and creators. 12M+ views, 150+ projects delivered.",
      },
      { property: "og:title", content: "Mohith Kumar — Social Media Video Editor" },
      {
        property: "og:description",
        content:
          "High-retention, scroll-stopping video editing for brands, creators and businesses. 12M+ views generated.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main>
      <Hero />
      <ServicesSection />
      <ResultsSection />
      <WorkSection />
      <CaseStudySection />
      <TestimonialsSection />
      <ProcessSection />
      <ToolsSection />
      <ContactSection />
    </main>
  );
}
