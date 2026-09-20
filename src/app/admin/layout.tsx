import type { Metadata } from "next";
import { AdminNav } from "@/components/admin-nav";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Panel editorial",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="admin-shell">
      <AdminNav />
      <main className="admin-main">{children}</main>
    </div>
  );
}
