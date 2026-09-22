import Image from "next/image";

interface BrandLogoProps {
  compact?: boolean;
  className?: string;
  variant?: "dark" | "light";
}

export function BrandLogo({ compact = false, className, variant = "dark" }: BrandLogoProps) {
  const logoSrc = `/brand/ficcion-oculta-logo-${variant}.svg`;

  return (
    <span
      className={["brand-logo", compact ? "brand-logo--compact" : "", className]
        .filter(Boolean)
        .join(" ")}
    >
      {compact ? (
        <Image
          className="brand-logo__mark"
          src="/brand/ficcion-oculta-mark.svg"
          width={64}
          height={64}
          alt="Ficción Oculta"
        />
      ) : (
        <>
          <Image
            className="brand-logo__wordmark"
            src={logoSrc}
            width={1400}
            height={260}
            alt="Ficción Oculta"
          />
          <Image
            className="brand-logo__mark brand-logo__mark--mobile"
            src="/brand/ficcion-oculta-mark.svg"
            width={64}
            height={64}
            alt=""
            aria-hidden="true"
          />
        </>
      )}
    </span>
  );
}
