import type { Metadata } from "next";
import { Suspense } from "react";
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

// Resolves the signed-in viewer for the header. Rendered inside Suspense so
// the page never waits on the profile query: the shell streams immediately
// and the account slot fills in when the session resolves.
async function SessionHeader() {
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
  return <SiteHeader viewer={viewer} />;
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${interTight.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">
        <SmoothScroll>
          <Suspense fallback={<SiteHeader viewer={undefined} />}>
            <SessionHeader />
          </Suspense>
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </SmoothScroll>
        <FilmGrain />
      </body>
    </html>
  );
}
