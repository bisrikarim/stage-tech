"use client";
import { useState } from "react";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Briefcase } from "lucide-react";

const geist = Geist({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(false);

  return (
    <html lang="fr" className={dark ? "dark" : ""}>
      <head>
        <title>StageTech.ma – Stages IT au Maroc</title>
        <meta name="description" content="La plateforme marocaine qui connecte les jeunes talents IT avec les entreprises." />
      </head>
      <body className={`${geist.className} bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white min-h-screen flex flex-col`}>
        <Navbar dark={dark} setDark={setDark} />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2 font-bold text-emerald-600 dark:text-emerald-400">
              <Briefcase className="w-5 h-5" />
              StageTech.ma
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              La plateforme 100% marocaine dédiée aux stages IT · {new Date().getFullYear()}
            </p>
            <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
              <Link href="/internships" className="hover:text-emerald-600 transition">Stages</Link>
              <Link href="/recruiter" className="hover:text-emerald-600 transition">Recruteurs</Link>
              <Link href="/profile" className="hover:text-emerald-600 transition">Profil</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
