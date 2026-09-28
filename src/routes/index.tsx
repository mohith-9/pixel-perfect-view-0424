import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  Play,
  Film,
  Youtube,
  Megaphone,
  Clapperboard,
  Sparkles,
  Eye,
  Users,
  TrendingUp,
  Star,
  Search,
  Scissors,
  MessageSquare,
  Send,
  Instagram,
  Facebook,
  Zap,
  Check,
  ShieldCheck,
  Menu,
  X,
  Globe,
} from "lucide-react";

import portrait from "@/assets/mohith-cutout.png";
import reelFitness from "@/assets/reel-fitness.jpg";
import reelTravel from "@/assets/reel-travel.jpg";
import reelFood from "@/assets/reel-food.jpg";
import reelProduct from "@/assets/reel-product.jpg";
import reelPodcast from "@/assets/reel-podcast.jpg";

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

const NAV = [
  { label: "Home", href: "#home" },
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "Results", href: "#results" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

const SERVICES = [
  { icon: Film, title: "Reels Editing", desc: "High-retention short videos" },
  { icon: Youtube, title: "YouTube Editing", desc: "Long & short form content" },
  { icon: Megaphone, title: "Social Media Ads", desc: "Ad creatives that convert" },
  { icon: Clapperboard, title: "Brand Videos", desc: "For business growth" },
  { icon: Sparkles, title: "Motion Graphics", desc: "Engaging visuals & animation" },
];

const WORK = [
  { img: reelFitness, views: "1.2M", name: "Fitness Coach Reel" },
  { img: reelTravel, views: "2.4M", name: "Travel Series" },
  { img: reelFood, views: "1.1M", name: "Restaurant Promo" },
  { img: reelProduct, views: "900K", name: "Skincare Ad" },
  { img: reelPodcast, views: "850K", name: "Podcast Shorts" },
];

const TESTIMONIALS = [
  {
    name: "Arjun Fitness",
    role: "Fitness Coach",
    quote:
      "His reels editing completely changed my page. My views and followers increased massively.",
    initials: "AF",
  },
  {
    name: "Neha Sharma",
    role: "Lifestyle Creator",
    quote:
      "Very professional and creative. He understands trends and always delivers on time.",
    initials: "NS",
  },
  {
    name: "Karan Mehta",
    role: "Business Owner",
    quote:
      "Our brand got 3x more leads after using his edited videos. Highly recommended.",
    initials: "KM",
  },
];

const PROCESS = [
  { no: "01", icon: Search, title: "Understand", desc: "Your goals, audience and content style" },
  { no: "02", icon: Scissors, title: "Edit", desc: "Creative and engaging edits" },
  { no: "03", icon: MessageSquare, title: "Review", desc: "You review and request changes" },
  { no: "04", icon: Send, title: "Deliver", desc: "Final videos ready to post" },
];

const TOOLS = [
  { short: "Pr", name: "Premiere Pro", color: "oklch(0.55 0.21 295)" },
  { short: "Ae", name: "After Effects", color: "oklch(0.5 0.2 285)" },
  { short: "Dv", name: "DaVinci Resolve", color: "oklch(0.55 0.16 250)" },
  { short: "Cc", name: "CapCut", color: "oklch(0.3 0.01 285)" },
  { short: "Ps", name: "Photoshop", color: "oklch(0.5 0.16 240)" },
];

function SectionTitle({ lead, accent }: { lead: string; accent: string }) {
  return (
    <h2 className="text-3xl leading-[1.05] tracking-tight uppercase sm:text-4xl">
      {lead} <span className="text-primary">{accent}</span>
    </h2>
  );
}

function Index() {
  const [open, setOpen] = useState(false);

  return (
    <div id="home" className="min-h-screen bg-background">
      {/* NAV */}
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3 lg:px-8">
          <a href="#home" className="min-w-0">
            <div className="font-display text-lg leading-none tracking-tight uppercase sm:text-xl">
              Mohith <span className="text-primary">Kumar</span>
            </div>
            <div className="mt-1 text-[10px] tracking-[0.25em] text-muted-foreground uppercase">
              Social Media Video Editor
            </div>
          </a>

          <nav className="hidden items-center gap-7 lg:flex">
            {NAV.map((n) => (
              <a
                key={n.label}
                href={n.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {n.label}
              </a>
            ))}
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
            >
              Work With Me <ArrowRight className="h-4 w-4" />
            </a>
          </nav>

          <button
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="shrink-0 rounded-md border border-border p-2 lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <nav className="border-t border-border bg-background px-5 pb-5 lg:hidden">
            {NAV.map((n) => (
              <a
                key={n.label}
                href={n.href}
                onClick={() => setOpen(false)}
                className="block border-b border-border/60 py-3 text-sm font-medium text-muted-foreground"
              >
                {n.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              Work With Me <ArrowRight className="h-4 w-4" />
            </a>
          </nav>
        )}
      </header>

      {/* HERO */}
      <section className="relative isolate overflow-hidden border-b border-border/60 bg-background">
        {/* glow */}
        <div
          className="pointer-events-none absolute top-0 left-1/2 -z-10 h-[40rem] w-[60rem] -translate-x-1/2 rounded-full opacity-40 blur-[140px]"
          style={{ background: "var(--gradient-red)" }}
        />
        {/* giant EDITOR */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-[4.5rem] left-1/2 -z-20 w-max whitespace-nowrap uppercase select-none"
          style={{
            fontFamily: "Anton, Impact, var(--font-display)",
            fontWeight: 900,
            fontSize: "clamp(8rem, 32vw, 36rem)",
            lineHeight: 0.78,
            letterSpacing: "-0.03em",
            transform: "translateX(-50%) scaleY(1.5)",
            transformOrigin: "top center",
            backgroundImage:
              "linear-gradient(180deg, #E50914 0%, #A30008 45%, #240000 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            opacity: 0.75,
            filter: "drop-shadow(0 0 40px rgba(229,9,20,0.25))",
          }}
        >
          EDITOR
        </div>

        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          {/* mini bar */}
          <div className="flex items-center justify-between border-b border-border/50 py-4 text-[10px] tracking-[0.3em] uppercase">
            <span className="text-muted-foreground">Portfolio — 2026</span>
            <span className="flex items-center gap-2 text-foreground">
              <span className="text-primary drop-shadow-[0_0_6px_var(--primary)]">✦</span>
              Available for freelance
            </span>
          </div>

          <div className="relative grid min-h-[calc(100svh-8rem)] items-end gap-6 pt-6 lg:grid-cols-[1fr_1.2fr_0.8fr]">
            {/* portrait */}
            <img
              src={portrait}
              alt="Mohith Kumar, video editor"
              width={928}
              height={1152}
              className="reveal pointer-events-none mx-auto w-[min(88vw,30rem)] self-end lg:absolute lg:bottom-0 lg:left-1/2 lg:w-[min(42vw,36rem)] lg:-translate-x-1/2"
              style={{
                filter:
                  "contrast(1.08) drop-shadow(0 0 28px color-mix(in oklab, var(--primary) 55%, transparent))",
                maskImage: "linear-gradient(180deg, #000 80%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(180deg, #000 80%, transparent 100%)",
              }}
            />

            {/* left copy */}
            <div className="reveal relative z-10 -mt-24 pb-10 lg:mt-0 lg:pb-16">
              <p
                className="text-5xl text-foreground sm:text-6xl"
                style={{ fontFamily: "'Mr Dafoe', cursive" }}
              >
                Hello, I'm
              </p>
              <h1
                className="mt-1 text-[clamp(4rem,11vw,8rem)] leading-[0.85] uppercase"
                style={{ fontFamily: "Anton, var(--font-display)" }}
              >
                Mohith
                <br />
                Kumar
              </h1>
              <p
                className="mt-3 text-2xl leading-tight text-primary uppercase sm:text-3xl"
                style={{ fontFamily: "Anton, var(--font-display)" }}
              >
                Video Editor &<br />
                Reels Creator
              </p>
              <p className="mt-4 max-w-sm text-sm text-muted-foreground sm:text-base">
                I create high-retention reels and short-form videos that help creators, brands
                and businesses grow through better storytelling, editing and content strategy.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-sm bg-primary px-5 py-3 text-xs font-bold tracking-widest text-primary-foreground uppercase transition-shadow hover:shadow-[0_0_28px_var(--primary)]"
                >
                  Let's Create Your Reels <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#work"
                  className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-full border border-primary">
                    <Play className="h-3.5 w-3.5 fill-current text-primary" />
                  </span>
                  Watch Showreel
                </a>
              </div>
              <div className="mt-6 flex items-center gap-3 text-xs tracking-[0.2em] uppercase">
                <span className="grid h-7 w-7 place-items-center rounded-full border border-primary text-primary">
                  <Globe className="h-3.5 w-3.5" />
                </span>
                Available Worldwide
              </div>
            </div>

            <div className="hidden lg:block" />

            {/* right */}
            <div className="reveal relative z-10 pb-10 lg:pb-16">
              <div className="flex items-center gap-4">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-primary">
                  <Sparkles className="h-5 w-5" />
                </span>
                <p className="text-sm leading-snug">
                  Turning ideas
                  <br />
                  into scroll-stopping
                  <br />
                  videos that get results.
                </p>
              </div>
              <div className="mt-8 divide-y divide-border/70">
                {[
                  ["3+", "Years", "Experience"],
                  ["150+", "Projects", "Completed"],
                  ["50+", "Happy", "Clients"],
                ].map(([n, a, b]) => (
                  <div key={a} className="flex items-center gap-5 py-4">
                    <span
                      className="w-28 text-5xl text-primary"
                      style={{ fontFamily: "Anton, var(--font-display)" }}
                    >
                      {n}
                    </span>
                    <span className="text-xs leading-tight tracking-wider uppercase">
                      {a}
                      <br />
                      {b}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="section-pad border-t border-border/60">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionTitle lead="What I" accent="Do" />
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {SERVICES.map(({ icon: Icon, title, desc }, i) => (
              <div
                key={title}
                className={`rounded-xl border bg-surface p-5 transition-colors hover:border-primary ${
                  i === 0 ? "border-primary" : "border-border"
                }`}
              >
                <Icon className={`h-6 w-6 ${i === 0 ? "text-primary" : "text-foreground"}`} />
                <h3 className="mt-4 text-sm tracking-wide uppercase">{title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RESULTS */}
      <section id="results" className="section-pad border-t border-border/60">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionTitle lead="Real Results For" accent="Real Clients" />
          <p className="mt-3 text-sm text-muted-foreground">
            Videos that not only look good, but get real views, engagement and growth.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { icon: Eye, n: "12M+", l: "Total Views Generated" },
              { icon: Users, n: "250K+", l: "Followers Gained (Clients)" },
              { icon: TrendingUp, n: "300%", l: "Average Growth in 3 Months" },
            ].map(({ icon: Icon, n, l }) => (
              <div
                key={l}
                className="flex items-center gap-4 rounded-xl border border-border bg-surface p-5"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-accent">
                  <Icon className="h-5 w-5 text-primary" />
                </span>
                <div className="min-w-0">
                  <div className="font-display text-2xl">{n}</div>
                  <div className="text-xs text-muted-foreground">{l}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WORK */}
      <section id="work" className="section-pad border-t border-border/60">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
            <SectionTitle lead="Featured" accent="Work" />
            <a
              href="#contact"
              className="shrink-0 rounded-md border border-border px-4 py-2 text-xs font-semibold tracking-wide uppercase transition-colors hover:border-primary"
            >
              View All
            </a>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {WORK.map((w) => (
              <figure
                key={w.name}
                className="group relative overflow-hidden rounded-xl border border-border"
              >
                <img
                  src={w.img}
                  alt={w.name}
                  loading="lazy"
                  width={608}
                  height={1088}
                  className="aspect-[9/16] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-0 grid place-items-center bg-black/25">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-background/80 backdrop-blur transition-transform group-hover:scale-110">
                    <Play className="h-5 w-5 fill-current" />
                  </span>
                </span>
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-3">
                  <div className="flex items-center gap-1.5 text-xs font-semibold">
                    <Play className="h-3 w-3 fill-current text-primary" />
                    {w.views}
                  </div>
                  <div className="truncate text-[11px] text-muted-foreground">{w.name}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* CASE STUDY */}
      <section className="section-pad border-t border-border/60">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 lg:grid-cols-2 lg:px-8">
          <div>
            <SectionTitle lead="Client" accent="Success Story" />
            <p className="mt-4 max-w-md text-sm text-muted-foreground">
              Helped a fitness coach grow from 10K to 150K followers in just 3 months with
              consistent, high-quality reels.
            </p>
            <a
              href="#contact"
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold tracking-wide text-primary-foreground uppercase transition-transform hover:scale-[1.03]"
            >
              See Full Case Study <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="relative rounded-xl border border-border bg-surface p-6">
            <div className="flex items-end justify-between text-xs">
              <div>
                <div className="font-display text-xl">10K</div>
                <div className="text-muted-foreground">Followers</div>
              </div>
              <div className="text-right">
                <div className="font-display text-xl text-primary">150K</div>
                <div className="text-muted-foreground">Followers</div>
              </div>
            </div>
            <div className="mt-6 flex h-44 items-end gap-2">
              {[12, 18, 24, 30, 40, 52, 66, 80, 100].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t"
                  style={{ height: `${h}%`, background: "var(--gradient-red)" }}
                />
              ))}
            </div>
            <div className="mt-3 flex justify-between text-[11px] text-muted-foreground">
              <span>Month 1</span>
              <span>Month 2</span>
              <span>Month 3</span>
            </div>
            <div className="glow-red absolute -top-4 -right-3 rounded-lg bg-primary px-4 py-2 text-center text-primary-foreground">
              <div className="font-display text-lg leading-none">+140K</div>
              <div className="text-[10px]">Followers in 3 Months</div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="section-pad border-t border-border/60">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionTitle lead="What Clients" accent="Say" />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <blockquote key={t.name} className="rounded-xl border border-border bg-surface p-6">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent font-display text-sm text-primary">
                    {t.initials}
                  </span>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{t.name}</div>
                    <div className="truncate text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
                <div className="mt-3 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="mt-4 text-sm text-muted-foreground">"{t.quote}"</p>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="section-pad border-t border-border/60">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
            <SectionTitle lead="My Editing" accent="Process" />
            <span className="shrink-0 text-xs text-muted-foreground">Simple. Fast. Effective.</span>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS.map(({ no, icon: Icon, title, desc }) => (
              <div key={no}>
                <span className="grid h-12 w-12 place-items-center rounded-full border border-primary/50 bg-accent">
                  <Icon className="h-5 w-5 text-primary" />
                </span>
                <h3 className="mt-4 text-sm tracking-wide uppercase">
                  <span className="text-primary">{no}</span> {title}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TOOLS */}
      <section className="section-pad border-t border-border/60">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionTitle lead="Tools I" accent="Use" />
          <div className="mt-8 flex flex-wrap gap-8">
            {TOOLS.map((t) => (
              <div key={t.name} className="flex items-center gap-3">
                <span
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-lg font-display text-base"
                  style={{ backgroundColor: t.color }}
                >
                  {t.short}
                </span>
                <span className="text-sm font-medium">{t.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section id="contact" className="section-pad">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl border border-border bg-surface p-8 lg:p-14">
            <div
              className="pointer-events-none absolute -top-24 -right-16 h-96 w-96 rounded-full opacity-40 blur-[110px]"
              style={{ background: "var(--gradient-red)" }}
            />
            <div className="relative max-w-2xl">
              <h2 className="text-[clamp(1.8rem,5vw,3rem)] leading-[1] uppercase">
                Let's Create
                <br />
                Viral Reels <span className="text-primary">Together</span>
              </h2>
              <p className="mt-4 text-sm text-muted-foreground">
                Ready to grow your brand with high-quality video editing? Let's bring your ideas
                to life.
              </p>
              <a
                href="mailto:hello@mohithkumar.com"
                className="mt-7 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold tracking-wide text-primary-foreground uppercase transition-transform hover:scale-[1.03]"
              >
                Work With Me <ArrowRight className="h-4 w-4" />
              </a>
              <div className="mt-8 flex flex-wrap gap-6 text-xs text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" /> Fast Delivery
                </span>
                <span className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" /> Unlimited Revisions
                </span>
                <span className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" /> Quality Guaranteed
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border/60 py-8">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 lg:grid-cols-[auto_1fr_auto] lg:items-center lg:px-8">
          <div>
            <div className="font-display text-lg uppercase">
              Mohith <span className="text-primary">Kumar</span>
            </div>
            <div className="text-[10px] tracking-[0.25em] text-muted-foreground uppercase">
              Social Media Video Editor
            </div>
          </div>
          <nav className="flex flex-wrap gap-5 lg:justify-center">
            {NAV.map((n) => (
              <a
                key={n.label}
                href={n.href}
                className="text-xs text-muted-foreground transition-colors hover:text-primary"
              >
                {n.label}
              </a>
            ))}
          </nav>
          <div className="flex gap-3">
            {[Instagram, Youtube, Play, Facebook].map((Icon, i) => (
              <a
                key={i}
                href="#contact"
                aria-label="Social profile"
                className="grid h-9 w-9 place-items-center rounded-md border border-border transition-colors hover:border-primary hover:text-primary"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        <div className="mx-auto mt-6 flex max-w-7xl flex-wrap justify-between gap-2 border-t border-border/60 px-5 pt-5 text-[11px] text-muted-foreground lg:px-8">
          <span>© 2026 Mohith Kumar. All rights reserved.</span>
          <span>Editing Videos. Creating Growth.</span>
        </div>
      </footer>
    </div>
  );
}
