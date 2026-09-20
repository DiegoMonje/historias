import Link from "next/link";
import { BookOpen, FilePlus2, LayoutDashboard, Settings } from "lucide-react";

const navItems = [
  { href: "/admin", label: "Resumen", icon: LayoutDashboard },
  { href: "/admin#historias", label: "Historias", icon: BookOpen },
  { href: "/admin/historias/nueva", label: "Nueva historia", icon: FilePlus2 },
  { href: "/admin#configuracion", label: "Configuración", icon: Settings },
];

export function AdminNav() {
  return (
    <aside className="admin-sidebar">
      <Link className="admin-brand" href="/admin">
        <span className="brand__mark" aria-hidden="true">
          <span />
        </span>
        <span>
          HISTORIAS
          <small>Panel editorial</small>
        </span>
      </Link>
      <nav aria-label="Navegación del panel">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link href={item.href} key={item.href}>
              <Icon size={18} strokeWidth={1.8} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="admin-sidebar__footer">
        <span>Modo preparación</span>
        <p>El guardado definitivo se activará al conectar Supabase.</p>
        <Link href="/">Ver web pública</Link>
      </div>
    </aside>
  );
}
