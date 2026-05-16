"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CheckCircle, ArrowRight, ArrowLeft, Upload, X, Plus } from "lucide-react";

const STEPS = ["Informations", "Formation", "Competences", "Projets", "CV & Liens"];

const CITIES = ["Casablanca", "Rabat", "Marrakech", "Tanger", "Agadir", "Fes", "Meknes", "Oujda", "Autre"];
const SCHOOL_TYPES = ["Grande ecole", "Universite", "OFPPT", "Bootcamp", "Autre"];
const INTERNSHIP_TYPES = ["PFA", "PFE", "Observation", "Stage professionnel"];
const LEVELS = ["Bac+2", "Bac+3", "Bac+4", "Bac+5", "Doctorat"];
const DOMAINS = ["Software Engineering", "Frontend", "Backend", "Fullstack", "DevOps", "Cloud", "Cybersecurity", "Data & AI", "Mobile", "Networking", "QA"];

const SKILLS_BY_CATEGORY: Record<string, string[]> = {
  "Langages": ["JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Go", "Rust", "PHP", "Kotlin", "Swift"],
  "Frontend": ["React", "Vue.js", "Angular", "Next.js", "Tailwind CSS", "HTML/CSS"],
  "Backend": ["Node.js", "Django", "FastAPI", "Spring Boot", "Laravel", "Express.js"],
  "Mobile": ["Flutter", "React Native", "Android", "iOS"],
  "DevOps & Cloud": ["Docker", "Kubernetes", "AWS", "Azure", "GCP", "Terraform", "Ansible", "Jenkins", "GitHub Actions", "Linux"],
  "Data & AI": ["TensorFlow", "PyTorch", "Scikit-learn", "Pandas", "SQL", "MongoDB", "PostgreSQL", "Spark"],
  "Securite": ["Pentest", "OWASP", "Kali Linux", "Wireshark", "Burp Suite"],
  "Outils": ["Git", "Docker", "VS Code", "Figma", "Postman", "Jira"],
};

type FormData = {
  full_name: string;
  bio: string;
  city: string;
  school: string;
  school_type: string;
  level: string;
  graduation_year: string;
  internship_type: string;
  domain: string;
  skills: string[];
  github_url: string;
  linkedin_url: string;
  portfolio_url: string;
  projects: { title: string; description: string; type: string; techs: string; github_url: string }[];
};

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [form, setForm] = useState<FormData>({
    full_name: "", bio: "", city: "", school: "", school_type: "", level: "",
    graduation_year: "", internship_type: "", domain: "", skills: [],
    github_url: "", linkedin_url: "", portfolio_url: "", projects: [],
  });
  const [newProject, setNewProject] = useState({ title: "", description: "", type: "PFA", techs: "", github_url: "" });

  const updateForm = (key: keyof FormData, value: string | string[] | FormData["projects"]) => setForm((f) => ({ ...f, [key]: value }));
  const toggleSkill = (skill: string) =>
    updateForm("skills", form.skills.includes(skill) ? form.skills.filter((s) => s !== skill) : [...form.skills, skill]);

  const addProject = () => {
    if (newProject.title.trim()) {
      updateForm("projects", [...form.projects, newProject]);
      setNewProject({ title: "", description: "", type: "PFA", techs: "", github_url: "" });
    }
  };

  const handleFinish = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    // Update profile
    await supabase.from("profiles").upsert({
      id: user.id, full_name: form.full_name, onboarding_completed: true,
    });

    // Create student profile
    const username = form.full_name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") + "-" + Date.now().toString(36);
    const { data: studentProfile } = await supabase.from("student_profiles").upsert({
      user_id: user.id, username, school: form.school, school_type: form.school_type,
      city: form.city, graduation_year: parseInt(form.graduation_year) || null,
      internship_type: form.internship_type, domain: form.domain, level: form.level,
      bio: form.bio, github_url: form.github_url, linkedin_url: form.linkedin_url,
      portfolio_url: form.portfolio_url, is_visible: true,
    }).select().single();

    if (studentProfile) {
      // Upload CV
      if (cvFile) {
        const { data: cvData } = await supabase.storage.from("cvs").upload(`${user.id}/${cvFile.name}`, cvFile, { upsert: true });
        if (cvData) {
          const { data: publicUrlData } = supabase.storage.from("cvs").getPublicUrl(cvData.path);
          await supabase.from("student_profiles").update({
            cv_filename: cvFile.name,
            cv_url: publicUrlData.publicUrl,
            cv_uploaded_at: new Date().toISOString(),
          }).eq("id", studentProfile.id);
        }
      }

      // Save skills
      if (form.skills.length > 0) {
        await supabase.from("student_skills").insert(
          form.skills.map((skill) => ({ student_id: studentProfile.id, skill, category: "other" }))
        );
      }

      // Save projects
      for (const p of form.projects) {
        await supabase.from("projects").insert({
          student_id: studentProfile.id, title: p.title, description: p.description,
          type: p.type, github_url: p.github_url || null,
          techs: p.techs.split(",").map((t) => t.trim()).filter(Boolean),
        });
      }
    }

    router.push("/dashboard");
  };

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-1">Cree ton profil IT</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Etape {step + 1} sur {STEPS.length} — {STEPS[step]}</p>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full mb-8 overflow-hidden">
          <div className="h-full bg-brand-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>

        {/* Steps nav */}
        <div className="flex justify-between mb-8 hidden sm:flex">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${i < step ? "bg-brand-500 text-white" : i === step ? "bg-brand-600 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-400"}`}>
                {i < step ? <CheckCircle className="w-4 h-4" /> : i + 1}
              </div>
              {i < STEPS.length - 1 && <div className={`w-8 h-0.5 ${i < step ? "bg-brand-500" : "bg-gray-200 dark:bg-gray-700"}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-8">
          {/* STEP 0: Informations */}
          {step === 0 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5">Informations personnelles</h2>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5">Nom complet *</label>
                <input value={form.full_name} onChange={(e) => updateForm("full_name", e.target.value)}
                  placeholder="Yassine El Amrani"
                  className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5">Ville *</label>
                <select value={form.city} onChange={(e) => updateForm("city", e.target.value)}
                  className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500">
                  <option value="">Selectionner une ville</option>
                  {CITIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5">Bio courte</label>
                <textarea value={form.bio} onChange={(e) => updateForm("bio", e.target.value)}
                  rows={3} placeholder="Etudiant en Genie Logiciel passionne par le DevOps et les architectures cloud..."
                  className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
              </div>
            </div>
          )}

          {/* STEP 1: Formation */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5">Formation academique</h2>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5">Ecole / Universite *</label>
                <input value={form.school} onChange={(e) => updateForm("school", e.target.value)}
                  placeholder="Ex: ENSIAS, EMI, INPT, EMSI..."
                  className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5">Type d&apos;ecole</label>
                  <select value={form.school_type} onChange={(e) => updateForm("school_type", e.target.value)}
                    className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500">
                    <option value="">Selectionner</option>
                    {SCHOOL_TYPES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5">Niveau</label>
                  <select value={form.level} onChange={(e) => updateForm("level", e.target.value)}
                    className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500">
                    <option value="">Selectionner</option>
                    {LEVELS.map((l) => <option key={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5">Annee de diplome</label>
                  <input type="number" value={form.graduation_year} onChange={(e) => updateForm("graduation_year", e.target.value)}
                    placeholder="2026" min="2020" max="2030"
                    className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5">Type de stage recherche</label>
                  <select value={form.internship_type} onChange={(e) => updateForm("internship_type", e.target.value)}
                    className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500">
                    <option value="">Selectionner</option>
                    {INTERNSHIP_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5">Domaine principal</label>
                <div className="flex flex-wrap gap-2">
                  {DOMAINS.map((d) => (
                    <button key={d} type="button" onClick={() => updateForm("domain", d)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition ${form.domain === d ? "bg-brand-600 text-white border-brand-600" : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-brand-400"}`}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Competences */}
          {step === 2 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Competences techniques</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">Selectionne toutes les technologies que tu maitrises</p>
              <div className="space-y-5">
                {Object.entries(SKILLS_BY_CATEGORY).map(([cat, skills]) => (
                  <div key={cat}>
                    <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-2">{cat}</p>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill) => (
                        <button key={skill} type="button" onClick={() => toggleSkill(skill)}
                          className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition ${form.skills.includes(skill) ? "bg-brand-600 text-white border-brand-600" : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-brand-400"}`}>
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {form.skills.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <p className="text-xs text-gray-500 mb-2">{form.skills.length} competence{form.skills.length > 1 ? "s" : ""} selectionnee{form.skills.length > 1 ? "s" : ""}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {form.skills.map((s) => (
                      <span key={s} className="text-xs bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-700 px-2 py-1 rounded-lg flex items-center gap-1">
                        {s} <button onClick={() => toggleSkill(s)}><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Projets */}
          {step === 3 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Projets scolaires et personnels</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">Les recruteurs regardent en priorite tes projets PFA/PFE</p>

              {/* Add project form */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-5 space-y-3">
                <div className="grid sm:grid-cols-2 gap-3">
                  <input value={newProject.title} onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    placeholder="Titre du projet *"
                    className="text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500" />
                  <select value={newProject.type} onChange={(e) => setNewProject({ ...newProject, type: e.target.value })}
                    className="text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500">
                    <option>PFA</option><option>PFE</option><option>Personnel</option><option>Open Source</option>
                  </select>
                </div>
                <textarea value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  placeholder="Decris le projet, les enjeux techniques, ce que tu as construit..."
                  rows={2} className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
                <input value={newProject.techs} onChange={(e) => setNewProject({ ...newProject, techs: e.target.value })}
                  placeholder="Technologies (ex: React, Node.js, Docker)"
                  className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500" />
                <input value={newProject.github_url} onChange={(e) => setNewProject({ ...newProject, github_url: e.target.value })}
                  placeholder="Lien GitHub (optionnel)"
                  className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500" />
                <button onClick={addProject} type="button"
                  className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm px-4 py-2 rounded-xl transition">
                  <Plus className="w-4 h-4" /> Ajouter ce projet
                </button>
              </div>

              {/* Projects list */}
              <div className="space-y-3">
                {(form.projects as { title: string; description: string; type: string; techs: string; github_url: string }[]).map((p, i) => (
                  <div key={i} className="flex items-start gap-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm text-gray-900 dark:text-white">{p.title}</span>
                        <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">{p.type}</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{p.techs}</p>
                    </div>
                    <button onClick={() => updateForm("projects", form.projects.filter((_, idx) => idx !== i))}
                      className="text-gray-300 hover:text-red-500 transition mt-1">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {form.projects.length === 0 && (
                  <p className="text-center text-sm text-gray-400 py-4">Aucun projet ajoute. Tu peux en ajouter plus tard depuis ton dashboard.</p>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: CV & Liens */}
          {step === 4 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5">CV et liens professionnels</h2>

              {/* CV Upload */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5">CV (PDF)</label>
                {cvFile ? (
                  <div className="flex items-center gap-3 bg-brand-50 dark:bg-brand-900/30 border border-brand-200 dark:border-brand-800 rounded-xl p-4">
                    <CheckCircle className="w-5 h-5 text-brand-500 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-brand-700 dark:text-brand-300 text-sm">{cvFile.name}</p>
                      <p className="text-xs text-brand-600 dark:text-brand-400">{(cvFile.size / 1024).toFixed(0)} KB</p>
                    </div>
                    <button onClick={() => setCvFile(null)} className="text-gray-400 hover:text-red-500 transition"><X className="w-4 h-4" /></button>
                  </div>
                ) : (
                  <label className="block border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center cursor-pointer hover:border-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Clique pour uploader ton CV</p>
                    <p className="text-xs text-gray-400">PDF uniquement · Max 5 MB</p>
                    <input type="file" accept=".pdf" className="hidden" onChange={(e) => setCvFile(e.target.files?.[0] ?? null)} />
                  </label>
                )}
              </div>

              {/* Links */}
              {[
                { key: "github_url", label: "GitHub", placeholder: "https://github.com/username" },
                { key: "linkedin_url", label: "LinkedIn", placeholder: "https://linkedin.com/in/username" },
                { key: "portfolio_url", label: "Portfolio (optionnel)", placeholder: "https://monportfolio.dev" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5">{field.label}</label>
                  <input value={form[field.key as keyof FormData] as string} onChange={(e) => updateForm(field.key as keyof FormData, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
              ))}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
            <button onClick={() => setStep((s) => s - 1)} disabled={step === 0}
              className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-30 transition">
              <ArrowLeft className="w-4 h-4" /> Precedent
            </button>

            {step < STEPS.length - 1 ? (
              <button onClick={() => setStep((s) => s + 1)}
                className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition">
                Suivant <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={handleFinish} disabled={saving}
                className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition">
                {saving ? "Enregistrement..." : "Terminer et voir mon profil"}
                <CheckCircle className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Tu pourras modifier ton profil a tout moment depuis ton dashboard.
        </p>
      </div>
    </div>
  );
}
