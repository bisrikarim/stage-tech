"use client";
import { useState } from "react";
import { Geist, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Briefcase } from "@phosphor-icons/react";

const geist = Geist({ subsets: ["latin"] });
export const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["700", "800"], variable: "--font-jakarta" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(false);

  return (
    <html lang="fr" className={dark ? "dark" : ""} style={{ colorScheme: dark ? "dark" : "light" }}>
      <head>
        <title>StageTech.ma – Vivier de talents IT marocains</title>
        <meta name="description" content="Cree ton profil de stagiaire IT et rends-toi visible par les recruteurs marocains." />
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <meta name="theme-color" content="#059669" />
      </head>
      <body className={`${geist.className} ${jakarta.variable} min-h-screen flex flex-col`}>
        <Navbar dark={dark} setDark={setDark} />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400" style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 800 }}>
              <img src="/logo-website.png" alt="logo" className="w-6 h-6 object-contain" />
              StageTech.ma
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              La plateforme 100% marocaine dédiée aux stages IT · {new Date().getFullYear()}
            </p>
            <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
              <Link href="/talents" className="hover:text-brand-600 transition">Talents IT</Link>
              <Link href="/signup" className="hover:text-brand-600 transition">S&apos;inscrire</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
