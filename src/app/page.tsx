"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, MapPin, ArrowRight, Zap, Users, Building2, TrendingUp } from "lucide-react";
import { internships } from "@/data/internships";
import InternshipCard from "@/components/InternshipCard";
import SkeletonCard from "@/components/SkeletonCard";

const domains = [
  "Software Engineering",
  "DevOps",
  "Cybersecurity",
  "Data & AI",
  "Web/Mobile",
  "Cloud",
  "QA",
  "Networking",
];
const cities = ["Casablanca", "Rabat", "Marrakech", "Tanger", "Agadir"];

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  const latest = internships.slice(0, 6);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-950 dark:to-emerald-950/30 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <Zap className="w-3.5 h-3.5" />
            La plateforme 100% marocaine des stages IT
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6">
            Trouve ton{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
              stage IT
            </span>{" "}
            au Maroc
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">
            Connecte-toi avec les meilleures entreprises tech marocaines. Dev,
            DevOps, IA, cybersecurite — ton prochain stage commence ici.
          </p>

          {/* Search */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Ex: React, Data Science, DevOps..."
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>
            <Link
              href={`/internships?q=${search}`}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3.5 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2"
            >
              Rechercher <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* City pills */}
          <div className="flex flex-wrap justify-center gap-2">
            {cities.map((c) => (
              <Link
                key={c}
                href={`/internships?city=${c}`}
                className="flex items-center gap-1 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1.5 rounded-full hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
              >
                <MapPin className="w-3 h-3" />
                {c}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: <Building2 className="w-6 h-6 text-emerald-500" />, value: "48+", label: "Entreprises" },
            { icon: <TrendingUp className="w-6 h-6 text-blue-500" />, value: "120+", label: "Stages actifs" },
            { icon: <Users className="w-6 h-6 text-violet-500" />, value: "850+", label: "Candidats" },
            { icon: <Zap className="w-6 h-6 text-amber-500" />, value: "9", label: "Domaines IT" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-2">
              {s.icon}
              <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{s.value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Domains */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Explorer par domaine
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
          Trouve le stage qui correspond a ta specialite
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {domains.map((d) => (
            <Link
              key={d}
              href={`/internships?domain=${encodeURIComponent(d)}`}
              className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4 text-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:shadow-sm transition"
            >
              {d}
            </Link>
          ))}
        </div>
      </section>

      {/* Latest internships */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              Derniers stages publies
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Mis a jour en temps reel
            </p>
          </div>
          <Link
            href="/internships"
            className="text-sm text-emerald-600 dark:text-emerald-400 font-medium hover:underline flex items-center gap-1"
          >
            Voir tout <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : latest.map((item) => (
                <InternshipCard key={item.id} internship={item} />
              ))}
        </div>
        <div className="text-center mt-10">
          <Link
            href="/internships"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-semibold text-sm transition"
          >
            Voir tous les stages <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Recruiter CTA */}
      <section className="bg-gradient-to-r from-emerald-600 to-teal-600 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl font-extrabold mb-4">
            Vous recrutez des talents IT ?
          </h2>
          <p className="text-emerald-100 mb-8 text-lg">
            Publiez votre offre de stage en 2 minutes et accedez a des centaines
            de profils qualifies au Maroc.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/recruiter/post"
              className="bg-white text-emerald-700 hover:bg-emerald-50 px-8 py-3 rounded-xl font-bold text-sm transition"
            >
              Publier un stage gratuitement
            </Link>
            <Link
              href="/recruiter"
              className="border border-white/40 text-white hover:bg-white/10 px-8 py-3 rounded-xl font-semibold text-sm transition"
            >
              Voir le dashboard recruteur
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
