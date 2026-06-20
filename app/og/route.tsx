import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/config";

export const runtime = "edge";

const BACKGROUND = "#09090b";
const FOREGROUND = "#fafafa";
const MUTED = "#a1a1aa";
const BORDER = "#27272a";

// Fontsource serves raw .ttf files, which `next/og` requires (it can't use woff2).
const FONT_REGULAR =
  "https://cdn.jsdelivr.net/fontsource/fonts/geist@latest/latin-400-normal.ttf";
const FONT_SEMIBOLD =
  "https://cdn.jsdelivr.net/fontsource/fonts/geist@latest/latin-600-normal.ttf";

async function loadFont(url: string) {
  const res = await fetch(url, { cache: "force-cache" });
  if (!res.ok) throw new Error(`Failed to load font: ${url}`);
  return res.arrayBuffer();
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  const title = searchParams.get("title") ?? siteConfig.name;
  const description = searchParams.get("description") ?? siteConfig.description;

  const logoSrc = `${origin}/images/8sl_logo_disco_transparent.png`;

  const [regular, semibold] = await Promise.all([
    loadFont(FONT_REGULAR),
    loadFont(FONT_SEMIBOLD)
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: BACKGROUND,
          backgroundImage:
            "radial-gradient(circle at 25% 0%, rgba(255,255,255,0.06), transparent 55%)",
          padding: "80px",
          fontFamily: "Geist"
        }}
      >
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoSrc}
            width={72}
            height={72}
            alt={siteConfig.name}
            style={{ objectFit: "contain" }}
          />
          <div
            style={{
              fontSize: "28px",
              fontWeight: 600,
              color: FOREGROUND,
              letterSpacing: "-0.02em"
            }}
          >
            {siteConfig.name}
          </div>
        </div>

        {/* Title + description */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            style={{
              fontSize: title.length > 40 ? "64px" : "76px",
              fontWeight: 600,
              color: FOREGROUND,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              // clamp very long titles
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 3,
              overflow: "hidden"
            }}
          >
            {title}
          </div>
          {description ? (
            <div
              style={{
                fontSize: "32px",
                fontWeight: 400,
                color: MUTED,
                lineHeight: 1.4,
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
                overflow: "hidden"
              }}
            >
              {description}
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: "26px",
            fontWeight: 400,
            color: MUTED,
            letterSpacing: "-0.01em"
          }}
        >
          {siteConfig.url.replace(/^https?:\/\//, "")}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Geist", data: regular, weight: 400, style: "normal" },
        { name: "Geist", data: semibold, weight: 600, style: "normal" }
      ]
    }
  );
}
