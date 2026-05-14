"use client";
import { useState } from "react";
import { Upload, GitBranch, ExternalLink, User, GraduationCap, CheckCircle, Plus, X } from "lucide-react";

const initialSkills = ["React", "TypeScript", "Node.js", "Python", "Git"];

export default function ProfilePage() {
  const [cvUploaded, setCvUploaded] = useState(false);
  const [skills, setSkills] = useState(initialSkills);
  const [newSkill, setNewSkill] = useState("");
  const [saved, setSaved] = useState(false);

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (s: string) => setSkills(skills.filter((k) => k !== s));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Mon Profil</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Complète ton profil pour augmenter tes chances d&apos;être sélectionné</p>
      </div>

      {saved && (
        <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 px-4 py-3 rounded-xl mb-6 text-sm">
          <CheckCircle className="w-4 h-4" /> Profil sauvegardé avec succès !
        </div>
      )}

      <div className="space-y-6">
        {/* Avatar + Name */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2"><User className="w-5 h-5 text-emerald-500" />Informations personnelles</h2>
          <div className="flex items-center gap-5 mb-6">
            <div className="w-20 h-20 bg-emerald-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">YE</div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Yassine El Amrani</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">ENSIAS - Rabat · Bac+5</p>
              <button className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 hover:underline">Changer la photo</button>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: "Prénom", value: "Yassine", placeholder: "Votre prénom" },
              { label: "Nom", value: "El Amrani", placeholder: "Votre nom" },
              { label: "Email", value: "yassine@gmail.com", placeholder: "Email" },
              { label: "Téléphone", value: "+212 6 12 34 56 78", placeholder: "Téléphone" },
            ].map((f) => (
              <div key={f.label}>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5">{f.label}</label>
                <input defaultValue={f.value} placeholder={f.placeholder}
                  className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
            ))}
          </div>
        </div>

        {/* School */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2"><GraduationCap className="w-5 h-5 text-blue-500" />Formation</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: "École / Université", value: "ENSIAS - Rabat" },
              { label: "Niveau", value: "Bac+5 (Master)" },
              { label: "Spécialité", value: "Génie Logiciel" },
              { label: "Ville", value: "Rabat" },
            ].map((f) => (
              <div key={f.label}>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5">{f.label}</label>
                <input defaultValue={f.value}
                  className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5">Compétences techniques</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {skills.map((s) => (
              <span key={s} className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-sm px-3 py-1.5 rounded-lg">
                {s}
                <button onClick={() => removeSkill(s)} className="hover:text-red-500 transition"><X className="w-3.5 h-3.5" /></button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addSkill()}
              placeholder="Ajouter une compétence..."
              className="flex-1 text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            <button onClick={addSkill} className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Links */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5">Liens professionnels</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5 flex items-center gap-1.5"><ExternalLink className="w-3.5 h-3.5 text-blue-600" />LinkedIn</label>
              <input defaultValue="linkedin.com/in/yassine-elamrani" placeholder="linkedin.com/in/..."
                className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5 flex items-center gap-1.5"><GitBranch className="w-3.5 h-3.5" />GitHub</label>
              <input defaultValue="github.com/yassine-elamrani" placeholder="github.com/..."
                className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
          </div>
        </div>

        {/* CV Upload */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5">Curriculum Vitae</h2>
          {cvUploaded ? (
            <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4">
              <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <div>
                <p className="font-medium text-emerald-700 dark:text-emerald-300 text-sm">CV_Yassine_ElAmrani.pdf</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400">Importé avec succès · 245 KB</p>
              </div>
              <button onClick={() => setCvUploaded(false)} className="ml-auto text-gray-400 hover:text-red-500 transition"><X className="w-4 h-4" /></button>
            </div>
          ) : (
            <div onClick={() => setCvUploaded(true)}
              className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Glisse ton CV ici ou clique pour importer</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">PDF uniquement · Max 5 MB</p>
            </div>
          )}
        </div>

        <button onClick={handleSave}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-semibold text-sm transition">
          Sauvegarder le profil
        </button>
      </div>
    </div>
  );
}
