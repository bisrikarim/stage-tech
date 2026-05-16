"use client";
import Link from "next/link";
import { internships } from "@/data/internships";
import { students } from "@/data/students";
import { LayoutDashboard, Briefcase, Users, Plus, TrendingUp, Eye, ArrowRight } from "lucide-react";

const logoColors = ["bg-brand-500","bg-blue-500","bg-violet-500","bg-rose-500","bg-amber-500","bg-sky-500","bg-pink-500","bg-brand-500"];

export default function RecruiterDashboard() {
  const myInternships = internships.slice(0, 4);
  const totalApplicants = myInternships.reduce((acc, i) => acc + i.applicants, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
            <LayoutDashboard className="w-4 h-4" /> Dashboard Recruteur
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Bienvenue, CasaTech Solutions 👋</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Gérez vos offres et découvrez vos candidats</p>
        </div>
        <Link href="/recruiter/post"
          className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition">
          <Plus className="w-4 h-4" /> Publier un stage
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { icon: <Briefcase className="w-6 h-6 text-brand-500" />, label: "Stages publiés", value: myInternships.length, bg: "bg-brand-50 dark:bg-brand-900/20" },
          { icon: <Users className="w-6 h-6 text-blue-500" />, label: "Total candidatures", value: totalApplicants, bg: "bg-blue-50 dark:bg-blue-900/20" },
          { icon: <TrendingUp className="w-6 h-6 text-violet-500" />, label: "Vues cette semaine", value: "342", bg: "bg-violet-50 dark:bg-violet-900/20" },
          { icon: <Eye className="w-6 h-6 text-amber-500" />, label: "Profils consultés", value: "28", bg: "bg-amber-50 dark:bg-amber-900/20" },
        ].map((s) => (
          <div key={s.label} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5">
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>{s.icon}</div>
            <p className="text-2xl font-extrabold text-gray-900 dark:text-white mb-0.5">{s.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* My Internships */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Mes offres de stage</h2>
            <Link href="/recruiter/post" className="text-sm text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">
              Nouvelle offre <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {myInternships.map((i) => (
              <div key={i.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition group">
                <div className={`w-9 h-9 rounded-lg ${logoColors[parseInt(i.id) % logoColors.length]} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>{i.logo}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{i.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{i.city} · {i.duration}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{i.applicants}</p>
                  <p className="text-xs text-gray-400">candidats</p>
                </div>
                <Link href={`/recruiter/applicants/${i.id}`} className="opacity-0 group-hover:opacity-100 transition">
                  <ArrowRight className="w-4 h-4 text-brand-500" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Applicants */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Candidatures récentes</h2>
            <Link href="/recruiter/applicants/1" className="text-sm text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">
              Voir tout <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {students.map((s) => (
              <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-400 to-brand-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {s.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{s.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{s.school}</p>
                </div>
                <div className="text-xs text-gray-400">{s.appliedAt}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
