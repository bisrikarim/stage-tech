"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { internships } from "@/data/internships";
import InternshipCard from "@/components/InternshipCard";
import SkeletonCard from "@/components/SkeletonCard";
import { Search, SlidersHorizontal, X } from "lucide-react";

const cities = ["Casablanca", "Rabat", "Marrakech", "Tanger", "Agadir"];
const domains = ["Software Engineering", "DevOps", "Cybersecurity", "Data & AI", "Web/Mobile", "Cloud", "QA", "Networking"];
const types = [{ value: "remote", label: "Remote" }, { value: "on-site", label: "Présentiel" }, { value: "hybrid", label: "Hybride" }];
const durations = ["2 mois", "3 mois", "4 mois", "5 mois", "6 mois"];

function InternshipListContent() {
  const params = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState(params.get("q") ?? "");
  const [city, setCity] = useState(params.get("city") ?? "");
  const [domain, setDomain] = useState(params.get("domain") ?? "");
  const [type, setType] = useState("");
  const [duration, setDuration] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const filtered = internships.filter((i) => {
    const matchQ = !q || i.title.toLowerCase().includes(q.toLowerCase()) || i.skills.some((s) => s.toLowerCase().includes(q.toLowerCase())) || i.company.toLowerCase().includes(q.toLowerCase());
    const matchCity = !city || i.city === city;
    const matchDomain = !domain || i.domain === domain;
    const matchType = !type || i.type === type;
    const matchDuration = !duration || i.duration === duration;
    return matchQ && matchCity && matchDomain && matchType && matchDuration;
  });

  const activeFilters = [city, domain, type, duration].filter(Boolean).length;

  const clearAll = () => { setQ(""); setCity(""); setDomain(""); setType(""); setDuration(""); };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Tous les stages IT</h1>
        <p className="text-gray-500 dark:text-gray-400">{internships.length} offres disponibles au Maroc</p>
      </div>

      {/* Search + Filter Toggle */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher par titre, skill, entreprise..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
        <button onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-medium text-gray-600 dark:text-gray-300 hover:border-emerald-400 transition relative">
          <SlidersHorizontal className="w-4 h-4" />
          Filtres
          {activeFilters > 0 && <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{activeFilters}</span>}
        </button>
        {activeFilters > 0 && (
          <button onClick={clearAll} className="flex items-center gap-1 px-3 py-3 rounded-xl border border-red-200 dark:border-red-800 text-red-500 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition">
            <X className="w-4 h-4" /> Reset
          </button>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Ville</label>
            <select value={city} onChange={(e) => setCity(e.target.value)}
              className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="">Toutes</option>
              {cities.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Domaine</label>
            <select value={domain} onChange={(e) => setDomain(e.target.value)}
              className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="">Tous</option>
              {domains.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)}
              className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="">Tous</option>
              {types.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Durée</label>
            <select value={duration} onChange={(e) => setDuration(e.target.value)}
              className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="">Toutes</option>
              {durations.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🔍</p>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Aucun résultat trouvé</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Essaie de modifier tes filtres ou ta recherche</p>
          <button onClick={clearAll} className="text-emerald-600 dark:text-emerald-400 text-sm font-medium hover:underline">Réinitialiser les filtres</button>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{filtered.length} stage{filtered.length > 1 ? "s" : ""} trouvé{filtered.length > 1 ? "s" : ""}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((i) => <InternshipCard key={i.id} internship={i} />)}
          </div>
        </>
      )}
    </div>
  );
}

export default function InternshipsPage() {
  return (
    <Suspense>
      <InternshipListContent />
    </Suspense>
  );
}
