"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/actions/auth";
import clsx from "clsx";
import {
  LayoutDashboard,
  Newspaper,
  Video,
  Brain,
  Trophy,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import type { UserProfile } from "@/lib/types";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/news", label: "AI News", icon: Newspaper },
  { href: "/talks", label: "AI Talks", icon: Video },
  { href: "/quiz", label: "AI Quiz", icon: Brain },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
];

export default function Sidebar({ profile }: { profile: UserProfile | null }) {
  const pathname = usePathname();

  return (
    <aside className="w-60 bg-brand-black flex flex-col min-h-screen fixed left-0 top-0 z-40">
      <div className="px-6 py-5 border-b border-white/10">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-brand-orange rounded-md flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm">G</span>
          </div>
          <div>
            <div className="text-white font-bold text-sm tracking-widest">GRADION</div>
            <div className="text-gray-500 text-[10px] tracking-wide">AI Platform</div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group",
                active
                  ? "bg-brand-orange text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight className="w-3.5 h-3.5 opacity-70" />}
            </Link>
          );
        })}

        {profile?.role === "admin" && (
          <div className="pt-4 mt-4 border-t border-white/10">
            <p className="text-gray-600 text-[10px] uppercase tracking-wider px-3 mb-2">Admin</p>
            <Link
              href="/admin"
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                pathname.startsWith("/admin")
                  ? "bg-brand-orange text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <Settings className="w-4 h-4 shrink-0" />
              Admin Panel
            </Link>
          </div>
        )}
      </nav>

      <div className="px-3 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg">
          <div className="w-8 h-8 bg-brand-orange/20 rounded-full flex items-center justify-center shrink-0">
            <span className="text-brand-orange font-bold text-xs">
              {profile?.fullName?.charAt(0) ?? profile?.email?.charAt(0) ?? "U"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-xs font-medium truncate">
              {profile?.fullName ?? "User"}
            </div>
            <div className="text-gray-500 text-[10px] truncate">
              {profile?.tokens ?? 0} tokens
            </div>
          </div>
        </div>
        <form action={signOut}>
          <button
            type="submit"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors w-full mt-1"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  );
}
