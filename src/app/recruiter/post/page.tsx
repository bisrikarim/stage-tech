"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle, Plus, X } from "lucide-react";
import Link from "next/link";

const cities = ["Casablanca", "Rabat", "Marrakech", "Tanger", "Agadir"];
const domains = ["Software Engineering", "DevOps", "Cybersecurity", "Data & AI", "Web/Mobile", "Cloud", "QA", "Networking"];
const durations = ["1 mois", "2 mois", "3 mois", "4 mois", "5 mois", "6 mois"];
const types = [{ value: "on-site", label: "Présentiel" }, { value: "remote", label: "Remote" }, { value: "hybrid", label: "Hybride" }];

export default function PostInternshipPage() {
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [form, setForm] = useState({ title: "", description: "", projectDescription: "", city: "", domain: "", duration: "", type: "on-site" });
  const [targetSchools, setTargetSchools] = useState<string[]>([]);
  const allSchools = ["ENSIAS", "EMI", "INPT", "ENSA", "EMSI", "UM6P", "ISTA", "Universite Hassan II", "Universite Ibn Tofail"];

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-10">
          <CheckCircle className="w-16 h-16 text-brand-500 mx-auto mb-4" />
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">Stage publié avec succès !</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
            Votre offre est maintenant visible par tous les étudiants inscrits sur StageTech.ma
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/recruiter" className="w-full bg-brand-600 hover:bg-brand-700 text-white py-3 rounded-xl font-semibold text-sm transition">
              Retour au dashboard
            </Link>
            <button onClick={() => setSuccess(false)} className="w-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 py-3 rounded-xl font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition">
              Publier un autre stage
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <Link href="/recruiter" className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-brand-600 mb-8 transition">
        <ArrowLeft className="w-4 h-4" /> Retour au dashboard
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Publier un stage</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Remplissez le formulaire pour publier votre offre en quelques minutes</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">Informations générales</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5">Titre du stage *</label>
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Ex: Développeur Full Stack React/Node.js"
                className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5">Ville *</label>
                <select required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500">
                  <option value="">Sélectionner</option>
                  {cities.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5">Domaine *</label>
                <select required value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })}
                  className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500">
                  <option value="">Sélectionner</option>
                  {domains.map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5">Durée *</label>
                <select required value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })}
                  className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500">
                  <option value="">Sélectionner</option>
                  {durations.map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5">Type *</label>
                <div className="flex gap-2 mt-1">
                  {types.map((t) => (
                    <button type="button" key={t.value} onClick={() => setForm({ ...form, type: t.value })}
                      className={`flex-1 text-xs py-2.5 rounded-lg border transition font-medium ${form.type === t.value ? "bg-brand-600 text-white border-brand-600" : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-brand-400"}`}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">Description</h2>
          <textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={6} placeholder="Decrivez les missions, le contexte et ce que le stagiaire va apprendre..."
            className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none mb-4" />
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5">Projet sur lequel le stagiaire travaillera *</label>
          <textarea required value={form.projectDescription} onChange={(e) => setForm({ ...form, projectDescription: e.target.value })}
            rows={3} placeholder="Ex: Migration de notre API vers microservices, developpement du module de paiement..."
            className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20" />
        </div>

        {/* Skills */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">Compétences requises</h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {skills.map((s) => (
              <span key={s} className="flex items-center gap-1.5 bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 text-sm px-3 py-1.5 rounded-lg">
                {s} <button type="button" onClick={() => setSkills(skills.filter((k) => k !== s))}><X className="w-3.5 h-3.5" /></button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
              placeholder="Ajouter une compétence..."
              className="flex-1 text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500" />
            <button type="button" onClick={addSkill} className="p-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl transition">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Target Schools */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-2">Ecoles cibles</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Selectionnez les ecoles dont vous souhaitez recruter des laureats</p>
          <div className="flex flex-wrap gap-2">
            {allSchools.map((school) => (
              <button type="button" key={school} onClick={() => setTargetSchools(targetSchools.includes(school) ? targetSchools.filter((s) => s !== school) : [...targetSchools, school])}
                className={`text-sm px-3 py-1.5 rounded-lg border transition font-medium ${targetSchools.includes(school) ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-blue-400"}`}>
                {school}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" className="w-full bg-brand-600 hover:bg-brand-700 text-white py-4 rounded-xl font-bold text-sm transition">
          Publier l&apos;offre de stage
        </button>
      </form>
    </div>
  );
}
