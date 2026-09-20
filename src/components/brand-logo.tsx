interface BrandLogoProps {
  compact?: boolean;
  className?: string;
}

export function BrandLogo({ compact = false, className }: BrandLogoProps) {
  return (
    <span
      className={["brand-logo", compact ? "brand-logo--compact" : "", className]
        .filter(Boolean)
        .join(" ")}
    >
      <svg
        className="brand-logo__mark"
        viewBox="0 0 64 64"
        role="img"
        aria-label="Símbolo de Ficción Oculta"
      >
        <path className="brand-logo__page" d="M13 7h30l9 9v41H13z" />
        <path className="brand-logo__fold" d="M43 7v11h9" />
        <path className="brand-logo__letter" d="M23 22h19M23 32h14M23 32v13" />
        <path className="brand-logo__shadow" d="m12 52 41-39" />
        <circle className="brand-logo__signal" cx="47" cy="49" r="2.5" />
      </svg>
      {compact ? null : (
        <span className="brand-logo__wordmark">
          <strong>FICCIÓN</strong>
          <strong>OCULTA</strong>
        </span>
      )}
    </span>
  );
}
