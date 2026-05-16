"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { StudentProfile, Profile, Project, Skill } from "@/types/database";
import {
  User, Upload, GitBranch, ExternalLink, FolderGit2, CheckCircle,
  AlertCircle, Eye, EyeOff, ArrowRight, Plus, Settings,
} from "lucide-react";
import { UserCircle } from "@phosphor-icons/react";

type DashboardData = {
  profile: Profile | null;
  studentProfile: StudentProfile | null;
  projects: Project[];
  skills: Skill[];
};

function ProfileScore({ score }: { score: number }) {
  const color = score >= 80 ? "text-brand-500" : score >= 50 ? "text-amber-500" : "text-red-400";
  const bg = score >= 80 ? "bg-brand-500" : score >= 50 ? "bg-amber-500" : "bg-red-400";
  return (
    <div className="flex items-center gap-3">
      <div className="relative w-16 h-16 flex-shrink-0">
        <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="6" className="text-gray-100 dark:text-gray-800" />
          <circle cx="32" cy="32" r="28" fill="none" strokeWidth="6" className={bg.replace("bg-", "text-")}
            strokeDasharray={`${(score / 100) * 176} 176`} strokeLinecap="round" />
        </svg>
        <span className={`absolute inset-0 flex items-center justify-center text-sm font-bold ${color}`}>{score}%</span>
      </div>
      <div>
        <p className="font-semibold text-gray-900 dark:text-white text-sm">Completude du profil</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {score >= 80 ? "Profil excellent !" : score >= 50 ? "Bon profil, continue !" : "Complete ton profil pour etre visible"}
        </p>
      </div>
    </div>
  );
}

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

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const [data, setData] = useState<DashboardData>({ profile: null, studentProfile: null, projects: [], skills: [] });
  const [loading, setLoading] = useState(true);

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
    if (error) {
      console.error("Erreur toggle visibilité:", error.message);
      return;
    }
    setData((d) => ({ ...d, studentProfile: d.studentProfile ? { ...d.studentProfile, is_visible: newVal } : null }));
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-xl w-48 mb-8" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-40 bg-gray-100 dark:bg-gray-800 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  const sp = data.studentProfile;
  const score = computeScore(sp, data.skills, data.projects);
  const fullName = data.profile?.full_name ?? "Etudiant";
  const initials = fullName.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  const tips = [
    { done: !!sp?.github_url, text: "Ajoute ton GitHub", icon: <GitBranch className="w-4 h-4" />, href: "/settings" },
    { done: !!sp?.linkedin_url, text: "Ajoute ton LinkedIn", icon: <ExternalLink className="w-4 h-4" />, href: "/settings" },
    { done: !!sp?.cv_filename, text: "Upload ton CV", icon: <Upload className="w-4 h-4" />, href: "/settings" },
    { done: data.projects.length > 0, text: "Ajoute un projet PFA/PFE", icon: <FolderGit2 className="w-4 h-4" />, href: "/settings" },
    { done: data.skills.length >= 3, text: "Ajoute tes competences", icon: <CheckCircle className="w-4 h-4" />, href: "/settings" },
  ].filter((t) => !t.done);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="text-brand-600 dark:text-brand-400 flex-shrink-0">
            <UserCircle size={56} weight="regular" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Bonjour, {fullName.split(" ")[0]} !</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {sp ? `${sp.school ?? "..."} · ${sp.city ?? "..."}` : "Complete ton profil pour etre visible"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/settings" className="flex items-center gap-1.5 text-xs bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-3 py-2 rounded-xl hover:opacity-90 transition">
            <Settings className="w-3.5 h-3.5" /> Modifier profil
          </Link>
        </div>
      </div>

      {/* No onboarding completed */}
      {!sp && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6 mb-8 flex items-center gap-4">
          <AlertCircle className="w-8 h-8 text-amber-500 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-amber-800 dark:text-amber-200 mb-1">Tu n&apos;as pas encore complete ton profil</p>
            <p className="text-sm text-amber-700 dark:text-amber-300">Complete l&apos;onboarding pour etre visible par les recruteurs.</p>
          </div>
          <Link href="/onboarding" className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition whitespace-nowrap">
            Completer maintenant
          </Link>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left */}
        <div className="lg:col-span-2 space-y-6">
          {/* Score + Visibility */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <ProfileScore score={score} />
              {sp && (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Profil visible</span>
                  <button onClick={toggleVisibility}
                    className={`cursor-pointer relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${sp.is_visible ? "bg-brand-500" : "bg-gray-300 dark:bg-gray-600"}`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${sp.is_visible ? "translate-x-6" : "translate-x-1"}`} />
                  </button>
                  {sp.is_visible ? <Eye className="w-4 h-4 text-brand-500" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
                </div>
              )}
            </div>
          </div>

          {/* Tips */}
          {tips.length > 0 && (
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
              <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">Ameliore ton profil</h2>
              <div className="space-y-3">
                {tips.map((tip, i) => (
                  <Link key={i} href={tip.href} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition group">
                    <div className="w-8 h-8 bg-amber-50 dark:bg-amber-900/30 text-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      {tip.icon}
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{tip.text}</span>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-brand-500 transition" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-gray-900 dark:text-white">Mes projets</h2>
              <Link href="/settings#projects" className="flex items-center gap-1 text-xs text-brand-600 dark:text-brand-400 hover:underline">
                <Plus className="w-3.5 h-3.5" /> Ajouter
              </Link>
            </div>
            {data.projects.length === 0 ? (
              <div className="text-center py-8">
                <FolderGit2 className="w-10 h-10 text-gray-200 dark:text-gray-700 mx-auto mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Aucun projet ajoute</p>
                <Link href="/settings#projects" className="text-xs text-brand-600 dark:text-brand-400 hover:underline">
                  Ajouter un projet PFA/PFE
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {data.projects.map((p) => (
                  <div key={p.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                    <div className="w-8 h-8 bg-amber-50 dark:bg-amber-900/30 text-amber-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FolderGit2 className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">{p.title}</span>
                        {p.type && <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded-full flex-shrink-0">{p.type}</span>}
                      </div>
                      {p.techs?.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {p.techs.slice(0, 4).map((t) => (
                            <span key={t} className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded">{t}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    {p.github_url && (
                      <a href={p.github_url} target="_blank" className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition flex-shrink-0">
                        <GitBranch className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Profile summary */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
            <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">Mon profil</h2>
            <div className="space-y-3 text-sm">
              {[
                { label: "Ecole", value: sp?.school },
                { label: "Niveau", value: sp?.level },
                { label: "Ville", value: sp?.city },
                { label: "Domaine", value: sp?.domain },
                { label: "Stage cherche", value: sp?.internship_type },
              ].map((row) => (
                <div key={row.label} className="flex justify-between gap-2">
                  <span className="text-gray-500 dark:text-gray-400 flex-shrink-0">{row.label}</span>
                  <span className="font-medium text-gray-900 dark:text-white text-right">{row.value ?? <span className="text-gray-300 dark:text-gray-600">—</span>}</span>
                </div>
              ))}
            </div>

            {/* Skills */}
            {data.skills.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-50 dark:border-gray-800">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Competences</p>
                <div className="flex flex-wrap gap-1.5">
                  {data.skills.slice(0, 8).map((s) => (
                    <span key={s.id} className="text-xs bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 border border-brand-100 dark:border-brand-800 px-2 py-0.5 rounded-lg">{s.skill}</span>
                  ))}
                  {data.skills.length > 8 && <span className="text-xs text-gray-400">+{data.skills.length - 8}</span>}
                </div>
              </div>
            )}
          </div>

          {/* CV */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
            <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">Mon CV</h2>
            {sp?.cv_filename ? (
              <div className="flex items-center gap-3 bg-brand-50 dark:bg-brand-900/30 rounded-xl p-3">
                <CheckCircle className="w-5 h-5 text-brand-500 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-brand-700 dark:text-brand-300 truncate">{sp.cv_filename}</p>
                  <p className="text-xs text-brand-600 dark:text-brand-400">CV uploade</p>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <Upload className="w-8 h-8 text-gray-200 dark:text-gray-700 mx-auto mb-2" />
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Aucun CV uploade</p>
                <Link href="/settings#cv" className="text-xs bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-xl transition inline-block">
                  Uploader mon CV
                </Link>
              </div>
            )}
          </div>

          {/* View public profile */}
          {sp?.username && (
            <Link href={`/talent/${sp.username}`}
              className="flex items-center justify-center gap-2 w-full border-2 border-brand-200 dark:border-brand-800 text-brand-600 dark:text-brand-400 py-3 rounded-2xl text-sm font-semibold hover:bg-brand-50 dark:hover:bg-brand-900/20 transition">
              <User className="w-4 h-4" />
              Voir mon profil public
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
