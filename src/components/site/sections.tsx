import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { TOOL_PATHS } from "./tool-paths";
import { useContent, publicProjectsQuery } from "@/lib/cms";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Linkedin, Twitter } from "lucide-react";
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
  Phone,
  Mail,
  Lock,
} from "lucide-react";

import portrait from "@/assets/mohith-cutout.png";
import { AutoplayVideoCard } from "./video-card";

export const NAV = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "Results", href: "/results" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Contact", href: "/contact" },
];

const SERVICES = [
  { icon: Film, title: "Reels Editing", desc: "High-retention short videos" },
  { icon: Youtube, title: "YouTube Editing", desc: "Long & short form content" },
  { icon: Megaphone, title: "Social Media Ads", desc: "Ad creatives that convert" },
  { icon: Clapperboard, title: "Brand Videos", desc: "For business growth" },
  { icon: Sparkles, title: "Motion Graphics", desc: "Engaging visuals & animation" },
];

const SOCIAL_ICONS: Record<string, typeof Globe> = {
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
  linkedin: Linkedin,
  twitter: Twitter,
  "twitter/x": Twitter,
  x: Twitter,
};

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
    quote: "Very professional and creative. He understands trends and always delivers on time.",
    initials: "NS",
  },
  {
    name: "Karan Mehta",
    role: "Business Owner",
    quote: "Our brand got 3x more leads after using his edited videos. Highly recommended.",
    initials: "KM",
  },
];

const PROCESS = [
  { no: "01", icon: Search, title: "Understand", desc: "Your goals, audience and content style" },
  { no: "02", icon: Scissors, title: "Edit", desc: "Creative and engaging edits" },
  { no: "03", icon: MessageSquare, title: "Review", desc: "You review and request changes" },
  { no: "04", icon: Send, title: "Deliver", desc: "Final videos ready to post" },
];

export function SectionTitle({ lead, accent }: { lead: string; accent: string }) {
  return (
    <h2 className="text-3xl leading-[1.05] tracking-tight uppercase sm:text-4xl">
      {lead} <span className="text-primary">{accent}</span>
    </h2>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3 lg:px-8">
        <Link to="/" className="min-w-0">
          <div className="font-display text-lg leading-none tracking-tight uppercase sm:text-xl">
            Mohith <span className="text-primary">Kumar</span>
          </div>
          <div className="mt-1 text-[10px] tracking-[0.25em] text-muted-foreground uppercase">
            Social Media Video Editor
          </div>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.label}
              to={n.href}
              activeOptions={{ exact: true }}
              activeProps={{ className: "text-primary" }}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {n.label}
            </Link>
          ))}
          <a
            href="/contact"
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
            <Link
              key={n.label}
              to={n.href}
              activeOptions={{ exact: true }}
              activeProps={{ className: "text-primary" }}
              onClick={() => setOpen(false)}
              className="block border-b border-border/60 py-3 text-sm font-medium text-muted-foreground"
            >
              {n.label}
            </Link>
          ))}
          <a
            href="/contact"
            onClick={() => setOpen(false)}
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Work With Me <ArrowRight className="h-4 w-4" />
          </a>
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
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
            <Link
              key={n.label}
              to={n.href}
              className="text-xs text-muted-foreground transition-colors hover:text-primary"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <SocialLinks size="sm" />
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-surface px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-foreground hover:border-primary hover:bg-surface-2 transition-all shadow-sm"
          >
            <Lock className="h-3.5 w-3.5 text-primary" /> Admin Manage
          </Link>
        </div>
      </div>
      <div className="mx-auto mt-6 flex max-w-7xl flex-wrap items-center justify-between gap-3 border-t border-border/60 px-5 pt-5 text-[11px] text-muted-foreground lg:px-8">
        <div className="flex flex-wrap items-center gap-4">
          <span>© 2026 Mohith Kumar. All rights reserved.</span>
          <span>Editing Videos. Creating Growth.</span>
        </div>
        <Link
          to="/admin"
          className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
        >
          <Lock className="h-3 w-3 text-primary" /> Admin Portal (/admin)
        </Link>
      </div>
    </footer>
  );
}

export function Hero() {
  const h = useContent("hero");
  return (
    <>
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
          className="pointer-events-none absolute top-[calc(4.5rem-6vw)] left-1/2 -z-20 w-max whitespace-nowrap uppercase select-none"
          style={{
            fontFamily: "Anton, Impact, var(--font-display)",
            fontWeight: 900,
            fontSize: "clamp(8rem, 31vw, 36rem)",
            lineHeight: 1.1,
            letterSpacing: "0.03em",
            transform: "translateX(-50%) scaleY(1.5)",
            transformOrigin: "top center",
            backgroundImage: "linear-gradient(180deg, #E50914 0%, #A30008 45%, #240000 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            opacity: 0.75,
            filter: "drop-shadow(0 0 40px rgba(229,9,20,0.25))",
          }}
        >
          {h.background_text}
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
              src={h.image_url || portrait}
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
                {h.small_heading}
              </p>
              <h1
                className="mt-4 text-[clamp(4rem,11vw,8rem)] leading-[0.95] uppercase"
                style={{ fontFamily: "Anton, var(--font-display)" }}
              >
                {h.name_line1}
                <br />
                {h.name_line2}
              </h1>
              <p
                className="mt-3 max-w-xs text-2xl leading-tight text-primary uppercase sm:text-3xl"
                style={{ fontFamily: "Anton, var(--font-display)" }}
              >
                {h.role}
              </p>
              <p className="mt-4 max-w-sm text-sm text-muted-foreground sm:text-base">
                {h.description}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <a
                  href={h.primary_cta_link}
                  className="inline-flex items-center gap-2 rounded-sm bg-primary px-5 py-3 text-xs font-bold tracking-widest text-primary-foreground uppercase transition-shadow hover:shadow-[0_0_28px_var(--primary)]"
                >
                  {h.primary_cta_text} <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href={h.secondary_cta_link}
                  className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-full border border-primary">
                    <Play className="h-3.5 w-3.5 fill-current text-primary" />
                  </span>
                  {h.secondary_cta_text}
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
                <p className="max-w-[13rem] text-sm leading-snug">{h.tagline}</p>
              </div>
              <div className="mt-8 divide-y divide-border/70">
                {h.stats.map((s, i) => (
                  <div key={i} className="flex items-center gap-5 py-4">
                    <span
                      className="w-28 text-5xl text-primary"
                      style={{ fontFamily: "Anton, var(--font-display)" }}
                    >
                      {s.value}
                    </span>
                    <span className="text-xs leading-tight tracking-wider uppercase">
                      {s.label1}
                      <br />
                      {s.label2}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export function ServicesSection() {
  return (
    <>
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
    </>
  );
}

export function ResultsSection() {
  return (
    <>
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
    </>
  );
}

export function WorkSection() {
  const { data: projects, isLoading } = useQuery(publicProjectsQuery);

  return (
    <>
      {/* WORK */}
      <section id="work" className="section-pad border-t border-border/60">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
            <SectionTitle lead="Featured" accent="Work" />
            <Link
              to="/contact"
              className="shrink-0 rounded-md border border-border px-4 py-2 text-xs font-semibold tracking-wide uppercase transition-colors hover:border-primary"
            >
              Get in Touch
            </Link>
          </div>

          {isLoading ? (
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
              {[1, 2, 3, 4, 5].map((idx) => (
                <div
                  key={idx}
                  className="aspect-[9/16] w-full animate-pulse rounded-xl border border-border bg-surface-2"
                />
              ))}
            </div>
          ) : projects && projects.length > 0 ? (
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
              {projects.map((p) => (
                <AutoplayVideoCard
                  key={p.id}
                  id={p.id}
                  title={p.title}
                  videoUrl={p.video_url}
                  thumbnailUrl={p.thumbnail_url}
                  views={p.views}
                  platform={p.platform}
                  clientName={p.client_name}
                />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-dashed border-border bg-surface/40 p-12 text-center">
              <Play className="mx-auto h-10 w-10 text-primary/40" />
              <h3 className="mt-3 text-sm font-semibold uppercase tracking-wider">
                Showreel Coming Soon
              </h3>
              <p className="mt-1 text-xs text-muted-foreground max-w-xs mx-auto">
                Real video projects will appear here once added in the Admin Panel.
              </p>
              <div className="mt-5 flex justify-center gap-3">
                <Link
                  to="/admin/work"
                  className="rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground uppercase hover:bg-primary/90 transition-colors"
                >
                  + Add Video in Admin
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export function CaseStudySection() {
  return (
    <>
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
              href="/contact"
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
    </>
  );
}

export function TestimonialsSection() {
  return (
    <>
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
    </>
  );
}

export function ProcessSection() {
  return (
    <>
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
    </>
  );
}

export function SocialLinks({ size = "md" }: { size?: "sm" | "md" }) {
  const { items } = useContent("socials");
  const box = size === "sm" ? "h-9 w-9" : "h-10 w-10";
  return (
    <>
      {items
        .filter((s) => s.active && s.url)
        .map((s) => {
          const Icon = SOCIAL_ICONS[s.platform.toLowerCase()] ?? Globe;
          return (
            <a
              key={s.platform + s.url}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Mohith Kumar on ${s.platform}`}
              className={`grid ${box} place-items-center rounded-md border border-border transition-colors hover:border-primary hover:text-primary`}
            >
              <Icon className="h-4 w-4" />
            </a>
          );
        })}
    </>
  );
}

export function ContactSection() {
  const c = useContent("contact");
  const tel = c.phone.replace(/[^\d+]/g, "");
  const wa = c.whatsapp.replace(/\D/g, "");
  return (
    <>
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
                Ready to grow your brand with high-quality video editing? Let's bring your ideas to
                life.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-4">
                <a
                  href={`mailto:${c.email}`}
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold tracking-wide text-primary-foreground uppercase transition-transform hover:scale-[1.03]"
                >
                  Work With Me <ArrowRight className="h-4 w-4" />
                </a>
                <span className="text-xs uppercase tracking-widest text-muted-foreground">
                  Follow
                </span>
                <SocialLinks />
              </div>
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
              <div className="mt-8 flex flex-col gap-2 text-sm">
                {c.phone && (
                  <a
                    href={`tel:${tel}`}
                    className="flex w-fit items-center gap-3 text-muted-foreground transition-colors hover:text-primary"
                  >
                    <Phone className="h-4 w-4 text-primary" /> {c.phone}
                  </a>
                )}
                {wa && (
                  <a
                    href={`https://wa.me/${wa}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-fit items-center gap-3 text-muted-foreground transition-colors hover:text-primary"
                  >
                    <MessageSquare className="h-4 w-4 text-primary" /> WhatsApp
                  </a>
                )}
                {[c.email, c.alt_email].filter(Boolean).map((e) => (
                  <a
                    key={e}
                    href={`mailto:${e}`}
                    className="flex w-fit items-center gap-3 text-muted-foreground transition-colors hover:text-primary"
                  >
                    <Mail className="h-4 w-4 text-primary" /> {e}
                  </a>
                ))}
                {c.location && (
                  <span className="flex items-center gap-3 text-muted-foreground">
                    <Globe className="h-4 w-4 text-primary" /> {c.location}
                  </span>
                )}
                {c.business_hours && (
                  <span className="text-xs text-muted-foreground">{c.business_hours}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export function ContactFormSection() {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? "").trim();
    setState("sending");
    try {
      const leadId = crypto.randomUUID();
      await setDoc(doc(db, "contact_leads", leadId), {
        id: leadId,
        name: get("name").slice(0, 120),
        email: get("email").slice(0, 200),
        phone: get("phone") || null,
        company: get("company") || null,
        service: get("service") || null,
        budget: get("budget") || null,
        message: get("message").slice(0, 5000),
        status: "new",
        is_read: false,
        created_at: new Date().toISOString(),
      });
      setState("done");
    } catch (err) {
      console.error("Failed to submit contact enquiry:", err);
      setState("error");
    }
  }
  const field =
    "w-full rounded-md border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary";
  return (
    <section className="section-pad border-t border-border/60">
      <div className="mx-auto max-w-3xl px-5 lg:px-8">
        <SectionTitle lead="Send an" accent="Enquiry" />
        {state === "done" ? (
          <p className="mt-8 rounded-xl border border-primary bg-surface p-6 text-sm">
            Thanks! Your message has been sent. Mohith will get back to you soon.
          </p>
        ) : (
          <form onSubmit={onSubmit} className="mt-8 grid gap-4 sm:grid-cols-2">
            <input name="name" required maxLength={120} placeholder="Name *" className={field} />
            <input
              name="email"
              type="email"
              required
              maxLength={200}
              placeholder="Email *"
              className={field}
            />
            <input name="phone" maxLength={40} placeholder="Phone" className={field} />
            <input name="company" maxLength={120} placeholder="Company" className={field} />
            <select name="service" className={field} defaultValue="">
              <option value="">Service required</option>
              {SERVICES.map((s) => (
                <option key={s.title}>{s.title}</option>
              ))}
            </select>
            <input name="budget" maxLength={60} placeholder="Budget" className={field} />
            <textarea
              name="message"
              required
              maxLength={5000}
              rows={5}
              placeholder="Message *"
              className={`${field} sm:col-span-2`}
            />
            {state === "error" && (
              <p className="text-sm text-primary sm:col-span-2">
                Something went wrong. Please try again.
              </p>
            )}
            <button
              disabled={state === "sending"}
              className="inline-flex w-fit items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold tracking-wide text-primary-foreground uppercase disabled:opacity-60"
            >
              {state === "sending" ? "Sending…" : "Send Message"} <Send className="h-4 w-4" />
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

export const TOOL_ITEMS = [
  {
    name: "Premiere Pro",
    desc: "Video Editing",
    kind: "adobe",
    path: TOOL_PATHS.pr,
    tile: "#00005B",
    glyph: "#9999FF",
  },
  {
    name: "After Effects",
    desc: "Motion Graphics",
    kind: "adobe",
    path: TOOL_PATHS.ae,
    tile: "#00005B",
    glyph: "#9999FF",
  },
  { name: "DaVinci Resolve", desc: "Color Grading", kind: "davinci" },
  { name: "CapCut", desc: "Short-Form Editing", kind: "capcut" },
  {
    name: "Photoshop",
    desc: "Thumbnails",
    kind: "adobe",
    path: TOOL_PATHS.ps,
    tile: "#001E36",
    glyph: "#31A8FF",
  },
  {
    name: "Illustrator",
    desc: "Graphics",
    kind: "adobe",
    path: TOOL_PATHS.ai,
    tile: "#330000",
    glyph: "#FF9A00",
  },
] as const;

function ToolIcon({ t }: { t: (typeof TOOL_ITEMS)[number] }) {
  if (t.kind === "adobe") {
    return (
      <svg viewBox="0 0 24 24" className="h-16 w-16" role="img" aria-label={t.name}>
        <rect x="2" y="2" width="20" height="20" fill={t.glyph} />
        <path d={t.path} fill={t.tile} />
      </svg>
    );
  }
  if (t.kind === "davinci") {
    return (
      <svg viewBox="0 0 64 64" className="h-16 w-16" role="img" aria-label={t.name}>
        <defs>
          <linearGradient id="dvbg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#3a3d44" />
            <stop offset="1" stopColor="#15171b" />
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx="14" fill="url(#dvbg)" />
        <rect
          x="1.5"
          y="1.5"
          width="61"
          height="61"
          rx="12.5"
          fill="none"
          stroke="#6b6f78"
          strokeOpacity=".6"
        />
        <ellipse cx="32" cy="22" rx="7.5" ry="10" fill="#F7C325" />
        <ellipse cx="22" cy="40" rx="7.5" ry="10" transform="rotate(60 22 40)" fill="#34C0EB" />
        <ellipse cx="42" cy="40" rx="7.5" ry="10" transform="rotate(-60 42 40)" fill="#EB3A5A" />
        <circle cx="32" cy="35" r="4" fill="#9BD150" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 64 64" className="h-16 w-16" role="img" aria-label={t.name}>
      <rect width="64" height="64" rx="14" fill="#FFFFFF" />
      <g fill="none" stroke="#000" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round">
        <path d="M16 20h32v8L16 36v8h32" />
        <path d="M16 20v8l32 8v8" />
      </g>
    </svg>
  );
}

export function ToolsSection() {
  return (
    <section className="relative isolate overflow-hidden border-t border-border/60 py-16 lg:py-20">
      <div
        className="pointer-events-none absolute -top-32 left-0 -z-10 h-80 w-[40rem] rounded-full opacity-25 blur-[120px]"
        style={{ background: "var(--gradient-red)" }}
      />
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2
            className="text-[clamp(3rem,8vw,6rem)] leading-[0.85] uppercase"
            style={{ fontFamily: "Anton, var(--font-display)" }}
          >
            <span className="text-primary">Tools</span> I Use
          </h2>
          <p className="max-w-xs text-[11px] leading-relaxed tracking-[0.35em] text-muted-foreground uppercase">
            Professional tools for high-quality video creation
          </p>
          <p className="text-[11px] tracking-[0.35em] text-muted-foreground uppercase">
            Edit <span className="text-primary">|</span> Create{" "}
            <span className="text-primary">|</span> Deliver
          </p>
        </div>
        <div className="mt-8 h-px bg-gradient-to-r from-primary/70 via-border to-transparent" />
        <div className="-mx-5 mt-10 flex snap-x gap-4 overflow-x-auto px-5 pb-2 lg:mx-0 lg:grid lg:grid-cols-6 lg:gap-0 lg:overflow-visible lg:px-0 lg:pb-0">
          {TOOL_ITEMS.map((t) => (
            <div
              key={t.name}
              className="flex w-40 shrink-0 snap-start flex-col items-center border-border/60 px-4 text-center lg:w-auto lg:border-l lg:first:border-l-0"
            >
              <div className="drop-shadow-[0_6px_18px_rgba(0,0,0,0.6)] [&_svg]:rounded-[14px]">
                <ToolIcon t={t} />
              </div>
              <div className="mt-4 text-sm font-bold tracking-wide uppercase">{t.name}</div>
              <div className="mt-1 text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
                {t.desc}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 h-px bg-gradient-to-l from-primary/70 via-border to-transparent" />
      </div>
    </section>
  );
}
