"use client";
import Link from "next/link";
import { useState } from "react";
import { Briefcase, Menu, Moon, Sun, X } from "lucide-react";

export default function Navbar({ dark, setDark }: { dark: boolean; setDark: (v: boolean) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-emerald-600 dark:text-emerald-400">
          <Briefcase className="w-6 h-6" />
          StageTech.ma
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-300">
          <Link href="/internships" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
            Stages
          </Link>
          <Link href="/profile" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
            Mon Profil
          </Link>
          <Link href="/recruiter" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
            Recruteurs
          </Link>
          <Link
            href="/recruiter/post"
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
          >
            Publier un stage
          </Link>
          <button onClick={() => setDark(!dark)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-2">
          <button onClick={() => setDark(!dark)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button onClick={() => setOpen(!open)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
          <Link href="/internships" onClick={() => setOpen(false)} className="py-2 hover:text-emerald-600">Stages</Link>
          <Link href="/profile" onClick={() => setOpen(false)} className="py-2 hover:text-emerald-600">Mon Profil</Link>
          <Link href="/recruiter" onClick={() => setOpen(false)} className="py-2 hover:text-emerald-600">Recruteurs</Link>
          <Link href="/recruiter/post" onClick={() => setOpen(false)} className="py-2 text-emerald-600 font-semibold">Publier un stage</Link>
        </div>
      )}
    </nav>
  );
}
