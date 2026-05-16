"use client";
import { useState } from "react";
import { Upload, GitBranch, ExternalLink, User, GraduationCap, CheckCircle, Plus, X, FolderGit2, Briefcase, Star } from "lucide-react";

const initialSkills = ["React", "TypeScript", "Node.js", "Python", "Git"];
const initialTechPrefs = ["React", "Node.js"];
const allTechs = ["React", "Vue.js", "Angular", "Node.js", "Python", "Django", "FastAPI", "Docker", "Kubernetes", "AWS", "Flutter", "TypeScript", "Java", "Spring", "PostgreSQL", "MongoDB"];

export default function ProfilePage() {
  const [cvUploaded, setCvUploaded] = useState(false);
  const [skills, setSkills] = useState(initialSkills);
  const [newSkill, setNewSkill] = useState("");
  const [saved, setSaved] = useState(false);
  const [techPrefs, setTechPrefs] = useState(initialTechPrefs);
  const [projects, setProjects] = useState([
    { title: "Plateforme e-learning adaptive", type: "PFA", techs: "React, Node.js, MongoDB", description: "Application web de formation en ligne avec suivi adaptatif." },
  ]);
  const [previousStages, setPreviousStages] = useState([
    { company: "InnoTech Rabat", role: "Developpeur Frontend", duration: "2 mois", year: "2025", type: "Observation" },
  ]);
  const [newProject, setNewProject] = useState({ title: "", type: "PFA", techs: "", description: "" });
  const [newStage, setNewStage] = useState({ company: "", role: "", duration: "", year: "", type: "Observation" });
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showStageForm, setShowStageForm] = useState(false);

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
        <div className="flex items-center gap-2 bg-brand-50 dark:bg-brand-900/30 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 px-4 py-3 rounded-xl mb-6 text-sm">
          <CheckCircle className="w-4 h-4" /> Profil sauvegardé avec succès !
        </div>
      )}

      <div className="space-y-6">
        {/* Avatar + Name */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2"><User className="w-5 h-5 text-brand-500" />Informations personnelles</h2>
          <div className="flex items-center gap-5 mb-6">
            <div className="w-20 h-20 bg-brand-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">YE</div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Yassine El Amrani</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">ENSIAS - Rabat · Bac+5</p>
              <button className="text-xs text-brand-600 dark:text-brand-400 mt-1 hover:underline">Changer la photo</button>
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
                  className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500" />
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
                  className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500" />
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5">Compétences techniques</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {skills.map((s) => (
              <span key={s} className="flex items-center gap-1.5 bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 text-sm px-3 py-1.5 rounded-lg">
                {s}
                <button onClick={() => removeSkill(s)} className="hover:text-red-500 transition"><X className="w-3.5 h-3.5" /></button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addSkill()}
              placeholder="Ajouter une compétence..."
              className="flex-1 text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500" />
            <button onClick={addSkill} className="p-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl transition">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tech Preferences */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2"><Star className="w-5 h-5 text-amber-500" />Technologies preferees</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Les recruteurs filtrent sur vos preferences — soyez precis</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {allTechs.map((t) => (
              <button key={t} type="button" onClick={() => setTechPrefs(techPrefs.includes(t) ? techPrefs.filter((p) => p !== t) : [...techPrefs, t])}
                className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition ${techPrefs.includes(t) ? "bg-brand-600 text-white border-brand-600" : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-brand-400"}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Projects PFA / PFE */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2"><FolderGit2 className="w-5 h-5 text-amber-500" />Projets scolaires (PFA / PFE)</h2>
            <button onClick={() => setShowProjectForm(!showProjectForm)} className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"><Plus className="w-3.5 h-3.5" />Ajouter</button>
          </div>
          {showProjectForm && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-4 space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <input value={newProject.title} onChange={(e) => setNewProject({ ...newProject, title: e.target.value })} placeholder="Titre du projet"
                  className="text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500" />
                <select value={newProject.type} onChange={(e) => setNewProject({ ...newProject, type: e.target.value })}
                  className="text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500">
                  <option>PFA</option><option>PFE</option><option>Personnel</option>
                </select>
              </div>
              <input value={newProject.techs} onChange={(e) => setNewProject({ ...newProject, techs: e.target.value })} placeholder="Technologies (ex: React, Node.js)"
                className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500" />
              <textarea value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} placeholder="Description courte du projet..." rows={2}
                className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
              <button onClick={() => { if (newProject.title) { setProjects([...projects, newProject]); setNewProject({ title: "", type: "PFA", techs: "", description: "" }); setShowProjectForm(false); } }}
                className="bg-brand-600 hover:bg-brand-700 text-white text-sm px-4 py-2 rounded-xl transition">Ajouter le projet</button>
            </div>
          )}
          <div className="space-y-3">
            {projects.map((p, i) => (
              <div key={i} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 flex items-start gap-3">
                <FolderGit2 className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{p.title}</span>
                    <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded-full">{p.type}</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">{p.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {p.techs.split(",").map((t) => t.trim()).filter(Boolean).map((t) => (
                      <span key={t} className="text-xs bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded">{t}</span>
                    ))}
                  </div>
                </div>
                <button onClick={() => setProjects(projects.filter((_, idx) => idx !== i))} className="text-gray-300 hover:text-red-500 transition"><X className="w-4 h-4" /></button>
              </div>
            ))}
            {projects.length === 0 && <p className="text-sm text-gray-400 text-center py-4">Aucun projet ajoute</p>}
          </div>
        </div>

        {/* Previous Stages */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2"><Briefcase className="w-5 h-5 text-brand-500" />Stages precedents</h2>
            <button onClick={() => setShowStageForm(!showStageForm)} className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"><Plus className="w-3.5 h-3.5" />Ajouter</button>
          </div>
          {showStageForm && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-4 space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <input value={newStage.company} onChange={(e) => setNewStage({ ...newStage, company: e.target.value })} placeholder="Entreprise"
                  className="text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500" />
                <input value={newStage.role} onChange={(e) => setNewStage({ ...newStage, role: e.target.value })} placeholder="Role (ex: Dev Frontend)"
                  className="text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500" />
                <input value={newStage.year} onChange={(e) => setNewStage({ ...newStage, year: e.target.value })} placeholder="Annee (ex: 2025)"
                  className="text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500" />
                <select value={newStage.type} onChange={(e) => setNewStage({ ...newStage, type: e.target.value })}
                  className="text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500">
                  <option>Observation</option><option>PFA</option><option>PFE</option><option>Professionnel</option>
                </select>
              </div>
              <button onClick={() => { if (newStage.company) { setPreviousStages([...previousStages, newStage]); setNewStage({ company: "", role: "", duration: "", year: "", type: "Observation" }); setShowStageForm(false); } }}
                className="bg-brand-600 hover:bg-brand-700 text-white text-sm px-4 py-2 rounded-xl transition">Ajouter le stage</button>
            </div>
          )}
          <div className="space-y-3">
            {previousStages.map((st, i) => (
              <div key={i} className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                <Briefcase className="w-4 h-4 text-brand-500 flex-shrink-0" />
                <div className="flex-1">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{st.role}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400"> @ {st.company}</span>
                  <div className="flex gap-2 mt-0.5">
                    <span className="text-xs text-gray-400">{st.year}</span>
                    <span className="text-xs bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 px-1.5 rounded">{st.type}</span>
                  </div>
                </div>
                <button onClick={() => setPreviousStages(previousStages.filter((_, idx) => idx !== i))} className="text-gray-300 hover:text-red-500 transition"><X className="w-4 h-4" /></button>
              </div>
            ))}
            {previousStages.length === 0 && <p className="text-sm text-gray-400 text-center py-4">Aucun stage precedent</p>}
          </div>
        </div>

        {/* Links */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5">Liens professionnels</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5 flex items-center gap-1.5"><ExternalLink className="w-3.5 h-3.5 text-blue-600" />LinkedIn</label>
              <input defaultValue="linkedin.com/in/yassine-elamrani" placeholder="linkedin.com/in/..."
                className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5 flex items-center gap-1.5"><GitBranch className="w-3.5 h-3.5" />GitHub</label>
              <input defaultValue="github.com/yassine-elamrani" placeholder="github.com/..."
                className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
          </div>
        </div>

        {/* CV Upload */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5">Curriculum Vitae</h2>
          {cvUploaded ? (
            <div className="flex items-center gap-3 bg-brand-50 dark:bg-brand-900/30 border border-brand-200 dark:border-brand-800 rounded-xl p-4">
              <CheckCircle className="w-5 h-5 text-brand-500 flex-shrink-0" />
              <div>
                <p className="font-medium text-brand-700 dark:text-brand-300 text-sm">CV_Yassine_ElAmrani.pdf</p>
                <p className="text-xs text-brand-600 dark:text-brand-400">Importé avec succès · 245 KB</p>
              </div>
              <button onClick={() => setCvUploaded(false)} className="ml-auto text-gray-400 hover:text-red-500 transition"><X className="w-4 h-4" /></button>
            </div>
          ) : (
            <div onClick={() => setCvUploaded(true)}
              className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center cursor-pointer hover:border-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Glisse ton CV ici ou clique pour importer</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">PDF uniquement · Max 5 MB</p>
            </div>
          )}
        </div>

        <button onClick={handleSave}
          className="w-full bg-brand-600 hover:bg-brand-700 text-white py-3.5 rounded-xl font-semibold text-sm transition">
          Sauvegarder le profil
        </button>
      </div>
    </div>
  );
}
