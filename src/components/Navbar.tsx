"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { List, Moon, Sun, X, SquaresFour, SignOut, GearSix, Users, UserCircle } from "@phosphor-icons/react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";

export default function Navbar({ dark, setDark }: { dark: boolean; setDark: (v: boolean) => void }) {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userOpen, setUserOpen] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
    setUserOpen(false);
  };

  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase()
    : user?.email?.[0].toUpperCase() ?? "?";

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 text-brand-600 dark:text-brand-400" style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.01em' }}>
          <img src="/logo-website.png" alt="logo" className="w-7 h-7 object-contain" />
          StageTech.ma
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-5 text-sm font-medium text-gray-600 dark:text-gray-300">
          <Link href="/talents" className="hover:text-brand-600 dark:hover:text-brand-400 transition">Talents IT</Link>

          <button onClick={() => setDark(!dark)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {user ? (
            <div className="relative">
              <button onClick={() => setUserOpen(!userOpen)}
                className="text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 flex items-center justify-center transition">
                <UserCircle size={30} weight="regular" />
              </button>
              {userOpen && (
                <div className="absolute right-0 top-11 w-48 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-50 dark:border-gray-800">
                    <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{user.user_metadata?.full_name ?? user.email}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  </div>
                  <Link href="/dashboard" onClick={() => setUserOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                    <SquaresFour size={16} weight="fill" /> Tableau de bord
                  </Link>
                  <Link href="/settings" onClick={() => setUserOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                    <GearSix size={16} weight="fill" /> Modifier profil
                  </Link>
                  <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition">
                    <SignOut size={16} weight="fill" /> Deconnexion
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="text-gray-600 dark:text-gray-300 hover:text-brand-600 transition px-3 py-1.5">Connexion</Link>
              <Link href="/signup" className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-xl transition">S&apos;inscrire</Link>
            </div>
          )}
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-2">
          <button onClick={() => setDark(!dark)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            {dark ? <Sun size={16} weight="fill" /> : <Moon size={16} weight="fill" />}
          </button>
          <button onClick={() => setOpen(!open)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            {open ? <X size={20} weight="bold" /> : <List size={20} weight="bold" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
          <Link href="/talents" onClick={() => setOpen(false)} className="py-2.5 hover:text-brand-600 flex items-center gap-2"><Users size={16} weight="fill" />Talents IT</Link>
          {user ? (
            <>
              <Link href="/dashboard" onClick={() => setOpen(false)} className="py-2.5 hover:text-brand-600 flex items-center gap-2"><SquaresFour size={16} weight="fill" />Tableau de bord</Link>
              <Link href="/settings" onClick={() => setOpen(false)} className="py-2.5 hover:text-brand-600 flex items-center gap-2"><GearSix size={16} weight="fill" />Modifier profil</Link>
              <button onClick={handleLogout} className="py-2.5 text-red-500 flex items-center gap-2 text-left"><SignOut size={16} weight="fill" />Deconnexion</button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setOpen(false)} className="py-2.5 hover:text-brand-600">Connexion</Link>
              <Link href="/signup" onClick={() => setOpen(false)} className="py-2.5 text-brand-600 font-semibold">S&apos;inscrire</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
