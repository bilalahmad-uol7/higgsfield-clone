import type { Metadata } from "next";
import { Instrument_Serif, Inter_Tight, JetBrains_Mono } from "next/font/google";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { FilmGrain } from "@/components/motion/FilmGrain";
import { getSessionProfile } from "@/lib/auth/session";
import "./globals.css";

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

const TITLE = "Higgsfield AI — AI-native creative suite";
const DESCRIPTION =
  "Create images, videos, and voice content with Higgsfield AI from text prompts or references. Edit and upscale media, automate creative workflows with its AI agent, and generate content on web and mobile.";

export const metadata: Metadata = {
  title: { default: TITLE, template: "%s — Higgsfield" },
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    siteName: "Higgsfield",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const profile = await getSessionProfile();
  const viewer = profile
    ? {
        name: profile.full_name || profile.email.split("@")[0],
        email: profile.email,
        avatarUrl: profile.avatar_url,
        credits: profile.credits,
        isAdmin: profile.role === "admin",
      }
    : null;

  return (
    <html
      lang="en"
      className={`${interTight.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">
        <SmoothScroll>
          <SiteHeader viewer={viewer} />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </SmoothScroll>
        <FilmGrain />
      </body>
    </html>
  );
}
