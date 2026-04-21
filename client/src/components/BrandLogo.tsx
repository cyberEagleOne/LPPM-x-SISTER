import praditaLogo from "@/assets/pradita-logo.png";

type BrandTone = "dark" | "light";
type BrandSize = "sm" | "md" | "lg";

interface BrandLogoProps {
  tone?: BrandTone;
  size?: BrandSize;
  compact?: boolean;
  showSubtitle?: boolean;
  subtitle?: string;
  className?: string;
}

const SIZE_MAP: Record<
  BrandSize,
  { frame: string; compactFrame: string; image: string; compactImage: string; title: string; subtitle: string }
> = {
  sm: {
    frame: "h-11 px-2.5",
    compactFrame: "h-10 px-2",
    image: "h-7",
    compactImage: "h-5",
    title: "text-[0.95rem]",
    subtitle: "text-[0.67rem]",
  },
  md: {
    frame: "h-12 px-3",
    compactFrame: "h-10 px-2.5",
    image: "h-8",
    compactImage: "h-6",
    title: "text-[1.02rem]",
    subtitle: "text-[0.7rem]",
  },
  lg: {
    frame: "h-14 px-3.5",
    compactFrame: "h-11 px-2.5",
    image: "h-9",
    compactImage: "h-6",
    title: "text-[1.12rem]",
    subtitle: "text-[0.72rem]",
  },
};

export function BrandLogo({
  tone = "dark",
  size = "md",
  compact = false,
  showSubtitle = false,
  subtitle = "Research Workspace",
  className = "",
}: BrandLogoProps) {
  const palette =
    tone === "light"
      ? {
          title: "text-white",
          subtitle: "text-slate-300",
        }
      : {
          title: "text-slate-950",
          subtitle: "text-slate-500",
        };

  const currentSize = SIZE_MAP[size];
  const frameClass = compact ? currentSize.compactFrame : currentSize.frame;
  const imageClass = compact ? currentSize.compactImage : currentSize.image;

  return (
    <div className={`flex items-center gap-3 ${className}`.trim()}>
      <div className={`flex shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/95 shadow-sm ${frameClass}`}>
        <img src={praditaLogo} alt="LPPM Pradita" className={`${imageClass} w-auto max-w-none object-contain`} />
      </div>

      {!compact ? (
        <div className="min-w-0">
          <div
            className={`${currentSize.title} ${palette.title} truncate leading-none tracking-[-0.02em]`}
            style={{ fontWeight: 700 }}
          >
            LPPM Pradita
          </div>
          {showSubtitle ? (
            <div
              className={`${currentSize.subtitle} ${palette.subtitle} mt-1 uppercase tracking-[0.22em]`}
              style={{ fontWeight: 600 }}
            >
              {subtitle}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
