import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div>
          <div className="footer-brand"><BrandLogo /></div>
          <p>Relatos originales de suspense, intriga, aventura y acción.</p>
        </div>
        <div className="footer-links">
          <Link href="/historias">Biblioteca</Link>
          <span>© 2026 Ficción Oculta</span>
        </div>
      </div>
    </footer>
  );
}
