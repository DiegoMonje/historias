import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Database, ShieldCheck } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { LoginForm } from "@/components/login-form";
import { hasSupabaseConfig } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Acceso editorial",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ motivo?: string }>;
}) {
  const { motivo } = await searchParams;
  const configured = hasSupabaseConfig();

  return (
    <main className="login-page">
      <section className="login-card">
        <Link className="login-brand" href="/">
          <BrandLogo />
        </Link>
        <div className="login-heading">
          <span className="admin-kicker">Área privada</span>
          <h1>Panel editorial</h1>
          <p>Acceso reservado para el administrador de Ficción Oculta.</p>
        </div>

        {configured ? (
          <LoginForm />
        ) : (
          <div className="login-setup" role="status">
            <Database size={22} />
            <div>
              <strong>Falta conectar Supabase</strong>
              <p>
                Añade <code>NEXT_PUBLIC_SUPABASE_URL</code> y{" "}
                <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> en Vercel. Después
                ejecuta <code>supabase/schema.sql</code> y crea el usuario administrador.
              </p>
            </div>
          </div>
        )}

        {configured && motivo === "sesion" ? (
          <p className="login-security-note">
            <ShieldCheck size={15} /> Inicia sesión para continuar.
          </p>
        ) : null}
        <Link className="admin-back login-back" href="/">
          <ArrowLeft size={15} /> Volver a la web
        </Link>
      </section>
    </main>
  );
}
