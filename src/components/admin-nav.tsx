import Link from "next/link";
import { BookOpen, FilePlus2, LayoutDashboard, LogOut, Settings } from "lucide-react";
import { logoutAction } from "@/app/acceso/actions";
import { BrandLogo } from "@/components/brand-logo";

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
        <BrandLogo compact />
        <span>
          FICCIÓN OCULTA
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
        <span>Sesión protegida</span>
        <p>Los cambios se guardan en Supabase con permisos exclusivos de administrador.</p>
        <Link href="/">Ver web pública</Link>
        <form action={logoutAction}>
          <button type="submit"><LogOut size={14} /> Cerrar sesión</button>
        </form>
      </div>
    </aside>
  );
}
