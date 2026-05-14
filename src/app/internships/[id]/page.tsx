"use client";
import { useState } from "react";
import { useParams, notFound } from "next/navigation";
import { internships } from "@/data/internships";
import ApplyModal from "@/components/ApplyModal";
import Link from "next/link";
import { MapPin, Clock, Wifi, Building2, Calendar, ArrowLeft, Users, CheckCircle, FolderGit2, GraduationCap } from "lucide-react";

const typeLabel: Record<string, string> = { remote: "Remote", "on-site": "Présentiel", hybrid: "Hybride" };
const logoColors = ["bg-emerald-500","bg-blue-500","bg-violet-500","bg-rose-500","bg-amber-500","bg-sky-500","bg-pink-500","bg-teal-500"];

function daysAgo(dateStr: string) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  if (diff === 0) return "Aujourd'hui";
  if (diff === 1) return "Hier";
  return `Il y a ${diff} jours`;
}

export default function InternshipDetailPage() {
  const { id } = useParams<{ id: string }>();
  const internship = internships.find((i) => i.id === id);
  const [modal, setModal] = useState(false);

  if (!internship) return notFound();

  const color = logoColors[parseInt(internship.id) % logoColors.length];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/internships" className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 mb-8 transition">
        <ArrowLeft className="w-4 h-4" /> Retour aux stages
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className={`w-16 h-16 rounded-2xl ${color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                {internship.logo}
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white leading-tight mb-1">{internship.title}</h1>
                <p className="text-gray-500 dark:text-gray-400 font-medium">{internship.company}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400 mb-6">
              <span className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-lg"><MapPin className="w-4 h-4 text-emerald-500" />{internship.city}</span>
              <span className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-lg">
                {internship.type === "remote" ? <Wifi className="w-4 h-4 text-blue-500" /> : <Building2 className="w-4 h-4 text-violet-500" />}
                {typeLabel[internship.type]}
              </span>
              <span className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-lg"><Clock className="w-4 h-4 text-amber-500" />{internship.duration}</span>
              <span className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-lg"><Calendar className="w-4 h-4 text-gray-400" />{daysAgo(internship.postedAt)}</span>
              <span className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-lg"><Users className="w-4 h-4 text-gray-400" />{internship.applicants} candidats</span>
            </div>

            <button onClick={() => setModal(true)}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4" /> Postuler maintenant
            </button>
          </div>

          {/* Description */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Description du stage</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed whitespace-pre-line">{internship.description}</p>
          </div>

          {/* Skills */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Competences requises</h2>
            <div className="flex flex-wrap gap-2">
              {internship.skills.map((s) => (
                <span key={s} className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-sm px-3 py-1.5 rounded-lg font-medium">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Project */}
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <FolderGit2 className="w-5 h-5 text-amber-500" />
              Projet sur lequel vous allez travailler
            </h2>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{internship.projectDescription}</p>
          </div>

          {/* Target Schools */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-blue-500" />
              Ecoles cibles
            </h2>
            <div className="flex flex-wrap gap-2">
              {internship.targetSchools.map((school) => (
                <span key={school} className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-sm px-3 py-1.5 rounded-lg font-medium">
                  {school}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Company Info */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">À propos de l&apos;entreprise</h2>
            <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center text-white font-bold text-xs mb-3`}>{internship.logo}</div>
            <p className="font-semibold text-gray-900 dark:text-white mb-1">{internship.company}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{internship.city}, Maroc</p>
            <div className="text-xs bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 rounded-lg w-fit">{internship.domain}</div>
          </div>

          {/* Details */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Informations</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Durée</span>
                <span className="font-medium text-gray-900 dark:text-white">{internship.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Type</span>
                <span className="font-medium text-gray-900 dark:text-white">{typeLabel[internship.type]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Localisation</span>
                <span className="font-medium text-gray-900 dark:text-white">{internship.city}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Candidats</span>
                <span className="font-medium text-gray-900 dark:text-white">{internship.applicants}</span>
              </div>
            </div>
          </div>

          <button onClick={() => setModal(true)}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold text-sm transition">
            Postuler maintenant
          </button>
        </div>
      </div>

      {modal && <ApplyModal title={internship.title} company={internship.company} onClose={() => setModal(false)} />}
    </div>
  );
}
