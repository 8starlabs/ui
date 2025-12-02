import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import { META_THEME_COLORS, siteConfig } from "@/lib/config";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import ProgressWrapper from "@/providers/ProgressWrapper";
import { ThemeProvider } from "@/providers/ThemeProvider";
import FaviconWrapper from "@/providers/FaviconWrapper";
import Script from "next/script";
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
  metadataBase: new URL("https://8starlabs.com"),
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
        url: "https://8starlabs.com/thumbnails/thumbnail.png",
        width: 1200,
        height: 630,
        alt: "8StarLabs Logo"
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

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const tree = source.pageTree;
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=G-RHF72GM2ES`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-RHF72GM2ES');
          `}
        </Script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.querySelector('meta[name="theme-color"]').setAttribute('content', '${META_THEME_COLORS.dark}')
                }
                if (localStorage.layout) {
                  document.documentElement.classList.add('layout-' + localStorage.layout)
                }
              } catch (_) {}
            `
          }}
        />
        <meta name="theme-color" content={META_THEME_COLORS.light} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} group/body overscroll-none antialiased [--footer-height:calc(var(--spacing)*14)] [--header-height:calc(var(--spacing)*14)] xl:[--footer-height:calc(var(--spacing)*24)]`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="bg-background relative z-10 flex min-h-svh flex-col">
            <FaviconWrapper />
            <SiteHeader tree={tree} />
            <SystemBannerClientWrapper />
            <ProgressWrapper>
              <main className="flex flex-1 flex-col">{children}</main>
            </ProgressWrapper>
            <SiteFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
