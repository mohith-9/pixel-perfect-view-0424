import { createFileRoute } from "@tanstack/react-router";
import { PageIntro } from "@/components/site/page-intro";
import { TestimonialsSection, ResultsSection, ContactSection } from "@/components/site/sections";

export const Route = createFileRoute("/testimonials")({
  head: () => ({
    meta: [
      { title: "Client Testimonials — Mohith Kumar, Video Editor" },
      {
        name: "description",
        content: "What creators, coaches and business owners say about working with Mohith Kumar.",
      },
      { property: "og:title", content: "Client Testimonials — Mohith Kumar, Video Editor" },
      {
        property: "og:description",
        content: "What creators, coaches and business owners say about working with Mohith Kumar.",
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
        label="Client Testimonials"
        lead="Client"
        accent="Love"
        text="What creators, coaches and business owners say about working with Mohith Kumar."
      />
      <TestimonialsSection />
      <ResultsSection />
      <ContactSection />
    </main>
  );
}
