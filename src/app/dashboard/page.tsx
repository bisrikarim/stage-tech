"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { StudentProfile, Profile, Project, Skill } from "@/types/database";
import {
  UserCircle, GithubLogo, LinkedinLogo, Upload, FolderOpen,
  CheckCircle, Eye, EyeSlash, ArrowRight, Plus, GearSix,
  Warning, Lock, Star, Lightning, ArrowSquareOut, X,
} from "@phosphor-icons/react";

type DashboardData = {
  profile: Profile | null;
  studentProfile: StudentProfile | null;
  projects: Project[];
  skills: Skill[];
};

function computeScore(sp: StudentProfile | null, skills: Skill[], projects: Project[]): number {
  if (!sp) return 0;
  let score = 0;
  if (sp.bio) score += 10;
  if (sp.school) score += 10;
  if (sp.city) score += 5;
  if (sp.github_url) score += 15;
  if (sp.linkedin_url) score += 10;
  if (sp.cv_url || sp.cv_filename) score += 20;
  if (skills.length >= 3) score += 10;
  if (projects.length >= 1) score += 10;
  if (sp.domain) score += 5;
  if (sp.level) score += 5;
  return Math.min(score, 100);
}

function ScoreRing({ score }: { score: number }) {
  const color = score >= 80 ? "#10B981" : score >= 50 ? "#F59E0B" : "#F87171";
  const r = 28;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div className="relative w-20 h-20 flex-shrink-0">
      <svg className="w-20 h-20 -rotate-90" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={r} fill="none" stroke="currentColor" strokeWidth="5" className="text-gray-100 dark:text-gray-800" />
        <circle cx="32" cy="32" r={r} fill="none" strokeWidth="5" stroke={color}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" style={{ transition: "stroke-dasharray 0.6s ease" }} />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-base font-extrabold" style={{ color }}>{score}%</span>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const [data, setData] = useState<DashboardData>({ profile: null, studentProfile: null, projects: [], skills: [] });
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      const [{ data: profile }, { data: sp }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("student_profiles").select("*").eq("user_id", user.id).single(),
      ]);
      let projects: Project[] = [], skills: Skill[] = [];
      if (sp) {
        const [{ data: proj }, { data: sk }] = await Promise.all([
          supabase.from("projects").select("*").eq("student_id", sp.id),
          supabase.from("student_skills").select("*").eq("student_id", sp.id),
        ]);
        projects = proj ?? [];
        skills = sk ?? [];
      }
      setData({ profile, studentProfile: sp, projects, skills });
      setLoading(false);
    };
    load();
  }, []);

  const toggleVisibility = async () => {
    if (!data.studentProfile) return;
    const newVal = !data.studentProfile.is_visible;
    const { error } = await supabase.rpc("set_profile_visibility", { new_visibility: newVal });
    if (error) { console.error("Erreur toggle visibilite:", error.message); return; }
    setData((d) => ({ ...d, studentProfile: d.studentProfile ? { ...d.studentProfile, is_visible: newVal } : null }));
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 space-y-6 animate-pulse">
        <div className="h-40 bg-gray-100 dark:bg-gray-800 rounded-3xl" />
        <div className="grid sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-32 bg-gray-100 dark:bg-gray-800 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  const sp = data.studentProfile;
  const score = computeScore(sp, data.skills, data.projects);
  const fullName = data.profile?.full_name ?? "Etudiant";
  const firstName = fullName.split(" ")[0];
  const scoreLabel = score >= 80 ? "Profil excellent" : score >= 50 ? "Bon profil, continue !" : "Complete ton profil";
  const scoreDesc = score >= 80
    ? "Tu es bien positionné pour être découvert par les recruteurs."
    : score >= 50
    ? "Quelques ajouts et ton profil sera top."
    : "Plus ton profil est complet, plus tu seras visible.";

  const tips = [
    { done: !!sp?.github_url,         text: "Ajoute ton GitHub",           icon: <GithubLogo size={16} weight="fill" /> },
    { done: !!sp?.linkedin_url,       text: "Ajoute ton LinkedIn",         icon: <LinkedinLogo size={16} weight="fill" /> },
    { done: !!sp?.cv_filename,        text: "Upload ton CV",               icon: <Upload size={16} weight="fill" /> },
    { done: data.projects.length > 0, text: "Ajoute un projet PFA/PFE",   icon: <FolderOpen size={16} weight="fill" /> },
    { done: data.skills.length >= 3,  text: "Ajoute tes competences",     icon: <Star size={16} weight="fill" /> },
  ].filter((t) => !t.done);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center flex-shrink-0">
            <UserCircle size={36} weight="regular" className="text-brand-600 dark:text-brand-400" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-0.5">Bonjour 👋</p>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">{firstName}</h1>
            {sp && <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{sp.school ?? "—"} · {sp.city ?? "—"}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {sp?.username && (
            <Link href={`/talent/${sp.username}`} target="_blank"
              className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-brand-400 hover:text-brand-600 dark:hover:text-brand-400 text-xs font-semibold px-4 py-2.5 rounded-xl transition">
              <ArrowSquareOut size={14} weight="bold" />
              Voir mon profil
            </Link>
          )}
          <Link href="/settings"
            className="flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90 text-xs font-bold px-4 py-2.5 rounded-xl transition">
            <GearSix size={14} weight="bold" />
            Modifier profil
          </Link>
        </div>
      </div>

      {/* Onboarding alert */}
      {!sp && (
        <div className="flex items-center gap-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-2xl p-5">
          <div className="w-10 h-10 bg-amber-100 dark:bg-amber-800/40 rounded-xl flex items-center justify-center flex-shrink-0">
            <Warning size={20} weight="fill" className="text-amber-500" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-amber-800 dark:text-amber-200 text-sm">Profil non complete</p>
            <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">Complete l&apos;onboarding pour apparaitre dans le vivier.</p>
          </div>
          <Link href="/onboarding"
            className="text-xs bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl font-semibold transition whitespace-nowrap">
            Completer
          </Link>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-5">

          {/* Score + Visibility */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
            <div className="flex items-center gap-6 flex-wrap justify-between">
              <div className="flex items-center gap-5">
                <ScoreRing score={score} />
                <div>
                  <p className="font-extrabold text-gray-900 dark:text-white text-base">{scoreLabel}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xs">{scoreDesc}</p>
                </div>
              </div>
              {sp && (
                <div className="flex items-center gap-3">
                  {sp.is_visible
                    ? <Eye size={16} weight="fill" className="text-brand-500" />
                    : <EyeSlash size={16} weight="fill" className="text-gray-400" />}
                  <span className="text-xs text-gray-500 dark:text-gray-400">{sp.is_visible ? "Profil visible" : "Profil masqué"}</span>
                  <button onClick={toggleVisibility}
                    className={`cursor-pointer relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${sp.is_visible ? "bg-brand-500" : "bg-gray-300 dark:bg-gray-600"}`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${sp.is_visible ? "translate-x-6" : "translate-x-1"}`} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Tips */}
          {tips.length > 0 && (
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <Lightning size={16} weight="fill" className="text-amber-500" />
                <h2 className="text-sm font-bold text-gray-900 dark:text-white">Ameliore ton profil</h2>
                <span className="ml-auto text-xs bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-300 px-2 py-0.5 rounded-full font-semibold">{tips.length} a faire</span>
              </div>
              <div className="space-y-2">
                {tips.map((tip, i) => (
                  <Link key={i} href="/settings"
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition group">
                    <div className="w-8 h-8 bg-amber-50 dark:bg-amber-900/30 text-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      {tip.icon}
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{tip.text}</span>
                    <ArrowRight size={14} weight="bold" className="text-gray-300 group-hover:text-brand-500 transition" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-bold text-gray-900 dark:text-white">Mes projets</h2>
              <Link href="/settings#projects"
                className="flex items-center gap-1.5 text-xs text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20 hover:bg-brand-100 dark:hover:bg-brand-900/40 px-3 py-1.5 rounded-lg font-semibold transition">
                <Plus size={12} weight="bold" /> Ajouter
              </Link>
            </div>
            {data.projects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-14 h-14 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-4">
                  <FolderOpen size={28} weight="duotone" className="text-gray-300 dark:text-gray-600" />
                </div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Aucun projet ajoute</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">Tes projets PFA/PFE impressionnent les recruteurs.</p>
                <Link href="/settings#projects"
                  className="text-xs bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-xl font-semibold transition">
                  Ajouter un projet
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {data.projects.map((p) => (
                  <button key={p.id} onClick={() => setSelectedProject(p)}
                    className="w-full text-left flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer">
                    <div className="w-9 h-9 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                      <FolderOpen size={16} weight="duotone" className="text-brand-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">{p.title}</span>
                        {p.type && <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full flex-shrink-0 font-medium">{p.type}</span>}
                      </div>
                      {p.techs?.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {p.techs.slice(0, 4).map((t) => (
                            <span key={t} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-md">{t}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    {p.github_url && (
                      <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 flex-shrink-0">
                        <GithubLogo size={15} weight="fill" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-5">

          {/* Profile info */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Mon profil</h2>
            <div className="space-y-3">
              {[
                { label: "Ecole",          value: sp?.school },
                { label: "Niveau",         value: sp?.level },
                { label: "Ville",          value: sp?.city },
                { label: "Domaine",        value: sp?.domain },
                { label: "Stage cherche",  value: sp?.internship_type },
              ].map((row) => (
                <div key={row.label} className="flex justify-between gap-2 text-sm">
                  <span className="text-gray-400 dark:text-gray-500 flex-shrink-0">{row.label}</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200 text-right truncate">
                    {row.value ?? <span className="text-gray-200 dark:text-gray-700">—</span>}
                  </span>
                </div>
              ))}
            </div>
            {data.skills.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2.5">Compétences</p>
                <div className="flex flex-wrap gap-1.5">
                  {data.skills.slice(0, 8).map((s) => (
                    <span key={s.id} className="text-xs bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 border border-brand-100 dark:border-brand-800 px-2.5 py-1 rounded-lg font-medium">
                      {s.skill}
                    </span>
                  ))}
                  {data.skills.length > 8 && <span className="text-xs text-gray-400 px-2 py-1">+{data.skills.length - 8}</span>}
                </div>
              </div>
            )}
          </div>

          {/* CV card */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-gray-900 dark:text-white">Mon CV</h2>
              <span className="flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-2.5 py-1 rounded-full font-medium border border-gray-200 dark:border-gray-700">
                <Lock size={11} weight="fill" />
                CV protégé
              </span>
            </div>
            {sp?.cv_filename ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 bg-brand-50 dark:bg-brand-900/20 rounded-xl p-3 border border-brand-100 dark:border-brand-800">
                  <CheckCircle size={20} weight="fill" className="text-brand-500 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-brand-700 dark:text-brand-300 truncate">{sp.cv_filename}</p>
                    <p className="text-xs text-brand-500 dark:text-brand-400">CV charge</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                  <Lock size={13} weight="fill" className="text-gray-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    Ton CV n&apos;est pas accessible publiquement. Il sera reserve aux recruteurs valides.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-3">
                  <Upload size={22} weight="duotone" className="text-gray-300 dark:text-gray-600" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 font-medium">Aucun CV charge</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">Ton CV sera protege et ne sera jamais public.</p>
                <Link href="/settings#cv"
                  className="text-xs bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-xl font-semibold transition inline-block">
                  Uploader mon CV
                </Link>
              </div>
            )}
          </div>

          {/* View public profile */}
          {sp?.username && (
            <Link href={`/talent/${sp.username}`} target="_blank"
              className="flex items-center justify-center gap-2 w-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-brand-300 hover:text-brand-600 dark:hover:border-brand-700 dark:hover:text-brand-400 py-3 rounded-2xl text-sm font-semibold transition bg-white dark:bg-gray-900">
              <ArrowSquareOut size={16} weight="bold" />
              Voir mon profil public
            </Link>
          )}
        </div>
      </div>

      {/* Project modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelectedProject(null)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg p-6 z-10" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-50 dark:bg-brand-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FolderOpen size={20} weight="duotone" className="text-brand-500" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900 dark:text-white">{selectedProject.title}</h2>
                  {selectedProject.type && (
                    <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full font-medium">{selectedProject.type}</span>
                  )}
                </div>
              </div>
              <button onClick={() => setSelectedProject(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 transition flex-shrink-0">
                <X size={16} weight="bold" />
              </button>
            </div>

            {selectedProject.description && (
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-5">{selectedProject.description}</p>
            )}

            {selectedProject.techs?.length > 0 && (
              <div className="mb-5">
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">Stack technique</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProject.techs.map((t) => (
                    <span key={t} className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2.5 py-1 rounded-lg font-medium">{t}</span>
                  ))}
                </div>
              </div>
            )}

            {selectedProject.github_url && (
              <a href={selectedProject.github_url} target="_blank"
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-4 py-2.5 rounded-xl transition w-fit">
                <GithubLogo size={16} weight="fill" />
                Voir sur GitHub
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
