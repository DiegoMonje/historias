import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div>
          <div className="footer-brand">HISTORIAS</div>
          <p>Relatos originales de suspense, intriga, aventura y acción.</p>
        </div>
        <div className="footer-links">
          <Link href="/historias">Biblioteca</Link>
          <span>© 2026 Historias</span>
        </div>
      </div>
    </footer>
  );
}
