"use client";
import { useParams } from "next/navigation";
import { students } from "@/data/students";
import { internships } from "@/data/internships";
import Link from "next/link";
import { ArrowLeft, Download, GitBranch, ExternalLink, GraduationCap, MapPin } from "lucide-react";

export default function ApplicantsPage() {
  const { id } = useParams<{ id: string }>();
  const internship = internships.find((i) => i.id === id);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/recruiter" className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-emerald-600 mb-8 transition">
        <ArrowLeft className="w-4 h-4" /> Retour au dashboard
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1">
          Candidats — {internship?.title ?? "Stage"}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">{students.length} candidature{students.length > 1 ? "s" : ""} reçue{students.length > 1 ? "s" : ""}</p>
      </div>

      {/* Table (desktop) */}
      <div className="hidden md:block bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
            <tr>
              {["Candidat", "École", "Domaine", "Compétences", "Date", "Actions"].map((h) => (
                <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
            {students.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {s.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{s.name}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1"><MapPin className="w-3 h-3" />{s.city}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <p className="text-gray-700 dark:text-gray-300 text-xs flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5 text-blue-500" />{s.school}</p>
                  <p className="text-xs text-gray-400">{s.level}</p>
                </td>
                <td className="px-5 py-4">
                  <span className="text-xs bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-2 py-1 rounded-lg">{s.domain}</span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-1">
                    {s.skills.slice(0, 3).map((sk) => (
                      <span key={sk} className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded">{sk}</span>
                    ))}
                    {s.skills.length > 3 && <span className="text-xs text-gray-400">+{s.skills.length - 3}</span>}
                  </div>
                </td>
                <td className="px-5 py-4 text-xs text-gray-400">{s.appliedAt}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg transition">
                      <Download className="w-3.5 h-3.5" /> CV
                    </button>
                    <a href={`https://${s.linkedin}`} target="_blank" className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-500 transition">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <a href={`https://${s.github}`} target="_blank" className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition">
                      <GitBranch className="w-4 h-4" />
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards (mobile) */}
      <div className="md:hidden space-y-4">
        {students.map((s) => (
          <div key={s.id} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {s.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{s.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{s.school} · {s.level}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1 mb-3">
              {s.skills.map((sk) => (
                <span key={sk} className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded">{sk}</span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg transition">
                <Download className="w-3.5 h-3.5" /> Télécharger CV
              </button>
              <a href={`https://${s.linkedin}`} className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition">
                <ExternalLink className="w-4 h-4" />
              </a>
              <a href={`https://${s.github}`} className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                <GitBranch className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
