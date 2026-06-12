import React, { memo } from "react";
import { cn } from "@/lib/utils";

interface GlassContainerSimpleProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "prominent" | "regular" | "thin";
  blur?: number;
  opacity?: number;
  tint?: "neutral" | "warm" | "cool" | "vibrant";
  border?: boolean;
  edgeBlur?: boolean;
  hover?: boolean;
}

const variantConfig = {
  default: { blur: 18, opacity: 0.22 },
  prominent: { blur: 26, opacity: 0.3 },
  regular: { blur: 14, opacity: 0.18 },
  thin: { blur: 10, opacity: 0.14 }
} as const;

const tintStyles = {
  neutral: "rgba(255, 255, 255, 0.16)",
  warm: "rgba(255, 248, 240, 0.2)",
  cool: "rgba(240, 248, 255, 0.2)",
  vibrant: "rgba(255, 255, 255, 0.24)"
} as const;

const GlassContainer: React.FC<GlassContainerSimpleProps> = memo(
  ({
    children,
    className,
    variant = "default",
    blur,
    opacity,
    tint = "warm",
    border = true,
    edgeBlur = true,
    hover = true,
    style,
    ...props
  }) => {
    const config = variantConfig[variant];
    const finalBlur = blur ?? config.blur;
    const finalOpacity = opacity ?? config.opacity;

    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-4xl p-4 text-white shadow-lg",
          hover && "transition-transform duration-300 hover:scale-[1.04]",
          border && "border border-white/20",
          className
        )}
        style={{
          backdropFilter: `blur(${finalBlur}px)`,
          WebkitBackdropFilter: `blur(${finalBlur}px)`,
          backgroundColor: tintStyles[tint],
          ...style
        }}
        {...props}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: finalOpacity,
            background:
              "linear-gradient(180deg, rgba(255, 255, 255, 0.28) 0%, rgba(255, 255, 255, 0.08) 45%, rgba(255, 255, 255, 0.12) 100%)"
          }}
        />

        {edgeBlur && (
          <div
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
            style={{
              boxShadow:
                "inset 0 1px 0 rgba(255, 255, 255, 0.35), inset 0 0 0 1px rgba(255, 255, 255, 0.08)"
            }}
          />
        )}

        <div className="relative z-10">{children}</div>
      </div>
    );
  }
);

export default GlassContainer;
