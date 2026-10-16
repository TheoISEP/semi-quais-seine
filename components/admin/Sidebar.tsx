"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Flag,
  Image as ImageIcon,
  Mail,
  Mails,
  Package,
  Receipt,
  Settings,
  Ticket,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Item = { label: string; href: string; icon: LucideIcon; soon?: boolean };

const items: Item[] = [
  { label: "Tableau de bord", href: "", icon: BarChart3 },
  { label: "Pré-inscrits", href: "/pre-inscrits", icon: Mails },
  { label: "Édition & courses", href: "/edition", icon: Flag },
  { label: "Produits", href: "/produits", icon: Package },
  { label: "Codes promo", href: "/codes-promo", icon: Ticket },
  { label: "Commandes", href: "/commandes", icon: Receipt, soon: true },
  { label: "Inscrits", href: "/inscrits", icon: Users, soon: true },
  { label: "Médiathèque", href: "/mediatheque", icon: ImageIcon, soon: true },
  { label: "Emails", href: "/emails", icon: Mail, soon: true },
  { label: "Paramètres", href: "/parametres", icon: Settings, soon: true },
];

export default function Sidebar({ slug }: { slug: string }) {
  const pathname = usePathname();
  const base = `/${slug}`;

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-slate-200 bg-navy-dark text-white md:flex">
      <div className="flex items-center gap-3 px-4 py-4">
        <Image src="/images/logo-gray.png" alt="" width={36} height={36} className="rounded-full bg-white/10 p-0.5" />
        <div className="leading-tight">
          <p className="text-sm font-semibold">Semi des Quais de Seine</p>
          <p className="text-[11px] uppercase tracking-wider text-white/60">Administration</p>
        </div>
      </div>
      <nav className="mt-2 flex-1 space-y-0.5 px-2">
        {items.map(({ label, href, icon: Icon, soon }) => {
          const full = `${base}${href}`;
          const active = href === "" ? pathname === base : pathname.startsWith(full);
          if (soon) {
            return (
              <span
                key={label}
                className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/40"
                title="Disponible en phase 2"
              >
                <Icon className="h-4 w-4" />
                <span className="flex-1">{label}</span>
                <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] uppercase tracking-wide">bientôt</span>
              </span>
            );
          }
          return (
            <Link
              key={label}
              href={full}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
                active ? "bg-white/15 font-medium text-white" : "text-white/80 hover:bg-white/10 hover:text-white",
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
      <p className="px-4 py-3 text-[11px] text-white/40">Course le 28 février 2027</p>
    </aside>
  );
}
