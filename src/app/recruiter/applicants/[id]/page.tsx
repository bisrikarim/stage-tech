"use client";
import { useParams } from "next/navigation";
import { students } from "@/data/students";
import { internships } from "@/data/internships";
import Link from "next/link";
import { ArrowLeft, Download, GitBranch, ExternalLink, GraduationCap, MapPin, FolderGit2, Briefcase, Star } from "lucide-react";

function matchScore(studentSkills: string[], studentPrefs: string[], internshipSkills: string[]): number {
  const skillMatch = studentSkills.filter((s) => internshipSkills.some((is) => is.toLowerCase() === s.toLowerCase())).length;
  const prefMatch = studentPrefs.filter((p) => internshipSkills.some((is) => is.toLowerCase() === p.toLowerCase())).length;
  const total = internshipSkills.length;
  if (total === 0) return 0;
  return Math.round(((skillMatch + prefMatch * 1.5) / (total * 2.5)) * 100);
}

const topSchools = ["ENSIAS", "EMI", "INPT", "ENSA", "EMSI"];

function isTopSchool(school: string) {
  return topSchools.some((s) => school.toUpperCase().includes(s));
}

export default function ApplicantsPage() {
  const { id } = useParams<{ id: string }>();
  const internship = internships.find((i) => i.id === id);

  const sortedStudents = [...students].sort((a, b) => {
    const scoreA = matchScore(a.skills, a.techPreferences, internship?.skills ?? []);
    const scoreB = matchScore(b.skills, b.techPreferences, internship?.skills ?? []);
    return scoreB - scoreA;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/recruiter" className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-brand-600 mb-8 transition">
        <ArrowLeft className="w-4 h-4" /> Retour au dashboard
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1">
          Candidats — {internship?.title ?? "Stage"}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">{students.length} candidature{students.length > 1 ? "s" : ""} recue{students.length > 1 ? "s" : ""} · tries par score de matching</p>
      </div>

      {internship && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 mb-8 text-sm text-amber-800 dark:text-amber-200">
          <span className="font-semibold">Projet :</span> {internship.projectDescription}
        </div>
      )}

      <div className="space-y-4">
        {sortedStudents.map((s, idx) => {
          const score = matchScore(s.skills, s.techPreferences, internship?.skills ?? []);
          const topSchool = isTopSchool(s.school);
          const matchedSkills = s.skills.filter((sk) => internship?.skills.some((is) => is.toLowerCase() === sk.toLowerCase()));

          return (
            <div key={s.id} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 hover:shadow-md transition">
              <div className="flex flex-col lg:flex-row lg:items-start gap-5">
                {/* Avatar + identity */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-400 to-brand-400 flex items-center justify-center text-white text-sm font-bold">
                      {s.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </div>
                    {idx === 0 && (
                      <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">1</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center flex-wrap gap-2 mb-1">
                      <h3 className="font-bold text-gray-900 dark:text-white">{s.name}</h3>
                      {topSchool && (
                        <span className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs px-2 py-0.5 rounded-full font-semibold">
                          <Star className="w-3 h-3" /> Grande ecole
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-2">
                      <GraduationCap className="w-3.5 h-3.5 text-blue-500" />
                      <span className="font-medium text-gray-700 dark:text-gray-300">{s.school}</span>
                      <span>·</span>
                      <span>{s.level}</span>
                      <span>·</span>
                      <MapPin className="w-3 h-3" />
                      <span>{s.city}</span>
                    </div>

                    {/* Skills + match */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {s.skills.map((sk) => (
                        <span key={sk} className={`text-xs px-2 py-0.5 rounded-md border font-medium ${matchedSkills.includes(sk) ? "bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 border-brand-300 dark:border-brand-700" : "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700"}`}>
                          {sk}
                        </span>
                      ))}
                    </div>

                    {/* Preferences tech */}
                    {s.techPreferences.length > 0 && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                        <span className="font-medium">Prefers :</span> {s.techPreferences.join(", ")}
                      </p>
                    )}

                    {/* Projects */}
                    {s.projects.length > 0 && (
                      <div className="space-y-2">
                        {s.projects.map((p) => (
                          <div key={p.title} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <FolderGit2 className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                              <span className="text-xs font-semibold text-gray-900 dark:text-white">{p.title}</span>
                              <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${p.type === "PFE" ? "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300" : p.type === "PFA" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"}`}>
                                {p.type}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 ml-5 mb-1.5">{p.description}</p>
                            <div className="flex flex-wrap gap-1 ml-5">
                              {p.techs.map((t) => (
                                <span key={t} className="text-xs bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded">{t}</span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Previous stages */}
                    {s.previousStages.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {s.previousStages.map((st) => (
                          <span key={st.company} className="flex items-center gap-1 text-xs bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 px-2 py-1 rounded-lg">
                            <Briefcase className="w-3 h-3" />
                            {st.type} @ {st.company} ({st.year})
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Score + actions */}
                <div className="flex lg:flex-col items-center lg:items-end gap-3 flex-shrink-0">
                  <div className="text-center">
                    <div className={`text-2xl font-extrabold ${score >= 70 ? "text-brand-500" : score >= 40 ? "text-amber-500" : "text-gray-400"}`}>
                      {score}%
                    </div>
                    <div className="text-xs text-gray-400">matching</div>
                    <div className="w-16 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full mt-1 overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${score >= 70 ? "bg-brand-500" : score >= 40 ? "bg-amber-500" : "bg-gray-300"}`} style={{ width: `${score}%` }} />
                    </div>
                  </div>
                  <div className="flex lg:flex-col gap-2">
                    <button className="flex items-center gap-1 text-xs bg-brand-600 hover:bg-brand-700 text-white px-3 py-1.5 rounded-lg transition whitespace-nowrap">
                      <Download className="w-3.5 h-3.5" /> CV
                    </button>
                    <a href={`https://${s.linkedin}`} target="_blank" className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-500 transition border border-gray-100 dark:border-gray-700">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <a href={`https://${s.github}`} target="_blank" className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition border border-gray-100 dark:border-gray-700">
                      <GitBranch className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}