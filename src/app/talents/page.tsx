"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { MapPin, GraduationCap, Star, Search, SlidersHorizontal, X } from "lucide-react";
import { UserCircle } from "@phosphor-icons/react";

type TalentCard = {
  id: string;
  username: string;
  school: string | null;
  city: string | null;
  domain: string | null;
  level: string | null;
  internship_type: string | null;
  bio: string | null;
  full_name: string | null;
  skills: string[];
  is_top: boolean;
};

const DOMAINS = ["Developpement Web", "Intelligence Artificielle", "Cybersecurite", "DevOps & Cloud", "Mobile", "Data Science", "Reseaux", "Systemes Embarques"];
const CITIES = ["Casablanca", "Rabat", "Marrakech", "Fes", "Tanger", "Agadir", "Meknes", "Oujda"];
const TOP_SCHOOLS = ["ENSIAS", "EMI", "INPT", "ENSA", "EMSI", "Ecole Mohammadia"];

export default function TalentsPage() {
  const supabase = createClient();
  const [talents, setTalents] = useState<TalentCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterDomain, setFilterDomain] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterTopOnly, setFilterTopOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data: sps } = await supabase.from("student_profiles").select("*").eq("is_visible", true);
      if (!sps) { setLoading(false); return; }

      const userIds = sps.map((s) => s.user_id);
      const { data: profiles } = await supabase.from("profiles").select("id, full_name").in("id", userIds);

      const profileMap: Record<string, string> = {};
      (profiles ?? []).forEach((p: { id: string; full_name: string }) => { profileMap[p.id] = p.full_name; });

      const cards: TalentCard[] = await Promise.all(
        sps.map(async (sp) => {
          const { data: skillsData } = await supabase.from("student_skills").select("skill").eq("student_id", sp.id).limit(6);
          return {
            id: sp.id,
            username: sp.username,
            school: sp.school,
            city: sp.city,
            domain: sp.domain,
            level: sp.level,
            internship_type: sp.internship_type,
            bio: sp.bio,
            full_name: profileMap[sp.user_id] ?? sp.username,
            skills: (skillsData ?? []).map((s: { skill: string }) => s.skill),
            is_top: sp.school ? TOP_SCHOOLS.some((t) => sp.school.includes(t)) : false,
          };
        })
      );

      setTalents(cards);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = talents.filter((t) => {
    const q = search.toLowerCase();
    const matchSearch = !q || (t.full_name ?? "").toLowerCase().includes(q) || t.skills.some((s) => s.toLowerCase().includes(q)) || (t.school ?? "").toLowerCase().includes(q) || (t.domain ?? "").toLowerCase().includes(q);
    const matchDomain = !filterDomain || t.domain === filterDomain;
    const matchCity = !filterCity || t.city === filterCity;
    const matchTop = !filterTopOnly || t.is_top;
    return matchSearch && matchDomain && matchCity && matchTop;
  });

  const activeFilters = [filterDomain, filterCity, filterTopOnly].filter(Boolean).length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Talents IT Marocains</h1>
        <p className="text-gray-500 dark:text-gray-400">Decouvre les etudiants disponibles pour des stages</p>
      </div>

      {/* Search + Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher par nom, skill, ecole..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-900 dark:text-white" />
        </div>
        <button onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition ${showFilters || activeFilters > 0 ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300" : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300"}`}>
          <SlidersHorizontal className="w-4 h-4" />
          Filtres {activeFilters > 0 && <span className="bg-brand-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">{activeFilters}</span>}
        </button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 mb-6">
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Domaine</label>
              <select value={filterDomain} onChange={(e) => setFilterDomain(e.target.value)}
                className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500">
                <option value="">Tous</option>
                {DOMAINS.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Ville</label>
              <select value={filterCity} onChange={(e) => setFilterCity(e.target.value)}
                className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500">
                <option value="">Toutes</option>
                {CITIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={filterTopOnly} onChange={(e) => setFilterTopOnly(e.target.checked)}
                  className="w-4 h-4 accent-brand-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-500" /> Grandes ecoles seulement
                </span>
              </label>
            </div>
          </div>
          {activeFilters > 0 && (
            <button onClick={() => { setFilterDomain(""); setFilterCity(""); setFilterTopOnly(false); }}
              className="mt-4 flex items-center gap-1 text-xs text-red-500 hover:underline">
              <X className="w-3 h-3" /> Effacer filtres
            </button>
          )}
        </div>
      )}

      {/* Results */}
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{filtered.length} talent{filtered.length !== 1 ? "s" : ""} trouve{filtered.length !== 1 ? "s" : ""}</p>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map((i) => <div key={i} className="h-48 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Search className="w-12 h-12 text-gray-200 dark:text-gray-700 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-2">Aucun talent trouve</p>
          <p className="text-xs text-gray-400">Modifie tes filtres ou ta recherche</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((t) => {
            const initials = (t.full_name ?? "").split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
            return (
              <Link key={t.id} href={`/talent/${t.username}`}
                className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 hover:shadow-md hover:border-brand-200 dark:hover:border-brand-800 transition group">
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-brand-600 dark:text-brand-400 flex-shrink-0">
                    <UserCircle size={40} weight="regular" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-gray-900 dark:text-white text-sm group-hover:text-brand-600 dark:group-hover:text-brand-400 transition">{t.full_name}</span>
                      {t.is_top && <Star className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />}
                    </div>
                    {t.school && (
                      <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <GraduationCap className="w-3 h-3" />{t.school}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {t.city && (
                    <span className="flex items-center gap-0.5 text-xs text-gray-500 dark:text-gray-400">
                      <MapPin className="w-3 h-3" />{t.city}
                    </span>
                  )}
                  {t.domain && <span className="text-xs bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 px-1.5 py-0.5 rounded-full">{t.domain}</span>}
                  {t.internship_type && <span className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-1.5 py-0.5 rounded-full">{t.internship_type}</span>}
                </div>

                {t.bio && <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{t.bio}</p>}

                {t.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {t.skills.slice(0, 4).map((s) => (
                      <span key={s} className="text-xs bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-700 px-1.5 py-0.5 rounded-lg">{s}</span>
                    ))}
                    {t.skills.length > 4 && <span className="text-xs text-gray-400">+{t.skills.length - 4}</span>}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
