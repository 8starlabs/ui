import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import { META_THEME_COLORS, siteConfig } from "@/lib/config";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AnnouncementBar } from "@/components/announcement-bar";
import ProgressWrapper from "@/providers/ProgressWrapper";
import { ThemeProvider } from "@/providers/ThemeProvider";
import GoogleAnalytics from "@/providers/GoogleAnalytics";
import { source } from "@/lib/source";
import SystemBannerClientWrapper from "@/providers/SystemBannerClientWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  keywords: ["8StarLabs", "UI", "shadcn", "Components", "transport"],
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    type: "website",
    url: "https://ui.8starlabs.com",
    images: [
      {
        url: "https://ui.8starlabs.com/thumbnails/banner_x.png",
        width: 1200,
        height: 630,
        alt: "8StarLabs UI"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    creator: "@8starlabs"
  },
  authors: [
    {
      name: "8StarLabs",
      url: "https://8starlabs.com"
    }
  ],
  creator: "8StarLabs"
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: META_THEME_COLORS.light },
    { media: "(prefers-color-scheme: dark)", color: META_THEME_COLORS.dark }
  ]
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const tree = source.pageTree;
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} group/body antialiased [--footer-height:calc(var(--spacing)*18)] [--header-height:calc(var(--spacing)*14)] xl:[--footer-height:calc(var(--spacing)*24)]`}
      >
        <GoogleAnalytics />
        <ThemeProvider defaultTheme="system" enableSystem>
          <div className="bg-background relative z-10 flex min-h-svh flex-col">
            <div className="sticky top-0 z-50 backdrop-blur-[20px] backdrop-saturate-180">
              <AnnouncementBar />
              <SiteHeader tree={tree} />
            </div>
            <SystemBannerClientWrapper />
            <ProgressWrapper>
              <main className="flex flex-1 flex-col size-full">{children}</main>
            </ProgressWrapper>
            <SiteFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
