import { createFileRoute } from "@tanstack/react-router";
import { PageIntro } from "@/components/site/page-intro";
import { ContactSection, ContactFormSection, ProcessSection } from "@/components/site/sections";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Hire — Mohith Kumar, Video Editor" },
      {
        name: "description",
        content:
          "Hire Mohith Kumar for high-retention reels and short-form video editing. Available worldwide.",
      },
      { property: "og:title", content: "Contact & Hire — Mohith Kumar, Video Editor" },
      {
        property: "og:description",
        content:
          "Hire Mohith Kumar for high-retention reels and short-form video editing. Available worldwide.",
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
        label="Contact & Hire"
        lead="Let's"
        accent="Talk"
        text="Hire Mohith Kumar for high-retention reels and short-form video editing. Available worldwide."
      />
      <ContactSection />
      <ContactFormSection />
      <ProcessSection />
    </main>
  );
}
