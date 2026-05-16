"use client";
import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Upload, CheckCircle, GitBranch, ExternalLink, Plus, X, FolderGit2, Save, AlertCircle } from "lucide-react";

const DOMAINS = ["Developpement Web", "Intelligence Artificielle", "Cybersecurite", "DevOps & Cloud", "Mobile", "Data Science", "Reseaux", "Systemes Embarques"];
const CITIES = ["Casablanca", "Rabat", "Marrakech", "Fes", "Tanger", "Agadir", "Meknes", "Oujda"];
const SKILLS_BY_CAT: Record<string, string[]> = {
  "Langages": ["Python", "JavaScript", "TypeScript", "Java", "C", "C++", "PHP", "Go", "Rust"],
  "Frontend": ["React", "Next.js", "Vue.js", "Angular", "HTML/CSS", "Tailwind CSS"],
  "Backend": ["Node.js", "Django", "FastAPI", "Spring Boot", "Laravel", "NestJS"],
  "DevOps & Cloud": ["Docker", "Kubernetes", "AWS", "GCP", "Azure", "Terraform", "CI/CD"],
  "Data & AI": ["Machine Learning", "Deep Learning", "Pandas", "PyTorch", "TensorFlow", "SQL"],
};
const ALL_SKILLS = Object.values(SKILLS_BY_CAT).flat();

type Project = { id?: string; title: string; type: string; description: string; techs: string[]; github_url: string };

export default function SettingsPage() {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState("");
  const [spId, setSpId] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const cvRef = useRef<HTMLInputElement>(null);

  // Form state
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [school, setSchool] = useState("");
  const [level, setLevel] = useState("");
  const [city, setCity] = useState("");
  const [domain, setDomain] = useState("");
  const [internshipType, setInternshipType] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [cvFilename, setCvFilename] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProj, setNewProj] = useState<Project>({ title: "", type: "PFA", description: "", techs: [], github_url: "" });
  const [techInput, setTechInput] = useState("");

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      setUserId(user.id);

      const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).single();
      setFullName(profile?.full_name ?? "");

      const { data: sp } = await supabase.from("student_profiles").select("*").eq("user_id", user.id).single();
      if (sp) {
        setSpId(sp.id);
        setBio(sp.bio ?? "");
        setSchool(sp.school ?? "");
        setLevel(sp.level ?? "");
        setCity(sp.city ?? "");
        setDomain(sp.domain ?? "");
        setInternshipType(sp.internship_type ?? "");
        setGithub(sp.github_url ?? "");
        setLinkedin(sp.linkedin_url ?? "");
        setPortfolio(sp.portfolio_url ?? "");
        setCvFilename(sp.cv_filename ?? "");

        const [{ data: sk }, { data: pr }] = await Promise.all([
          supabase.from("student_skills").select("skill").eq("student_id", sp.id),
          supabase.from("projects").select("*").eq("student_id", sp.id),
        ]);
        setSkills((sk ?? []).map((s: { skill: string }) => s.skill));
        setProjects((pr ?? []).map((p: Project & { id: string }) => ({
          id: p.id, title: p.title, type: p.type ?? "PFA",
          description: p.description ?? "", techs: p.techs ?? [], github_url: p.github_url ?? "",
        })));
      }
      setLoading(false);
    };
    load();
  }, []);

  const toggleSkill = (s: string) => setSkills((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);

  const addProject = () => {
    if (!newProj.title.trim()) return;
    setProjects((prev) => [...prev, { ...newProj }]);
    setNewProj({ title: "", type: "PFA", description: "", techs: [], github_url: "" });
    setTechInput("");
  };

  const removeProject = (i: number) => setProjects((prev) => prev.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    setSaving(true); setError("");
    try {
      // Profile
      await supabase.from("profiles").update({ full_name: fullName }).eq("id", userId);

      // CV upload
      let cvUrl = ""; let cvFn = cvFilename;
      if (cvFile && spId) {
        const ext = cvFile.name.split(".").pop();
        const path = `${userId}/${Date.now()}.${ext}`;
        const { data: upData, error: upErr } = await supabase.storage.from("cvs").upload(path, cvFile, { upsert: true });
        if (upErr) throw upErr;
        const { data: urlData } = supabase.storage.from("cvs").getPublicUrl(upData.path);
        cvUrl = urlData.publicUrl;
        cvFn = cvFile.name;
      }

      // Student profile upsert
      const username = fullName.toLowerCase().replace(/\s+/g, ".") + "." + userId.slice(0, 4);
      const spPayload = {
        user_id: userId, bio, school, level, city, domain, internship_type: internshipType,
        github_url: github, linkedin_url: linkedin, portfolio_url: portfolio,
        username,
        ...(cvUrl ? { cv_url: cvUrl, cv_filename: cvFn } : cvFn ? { cv_filename: cvFn } : {}),
      };
      const { data: spData, error: spErr } = await supabase.from("student_profiles").upsert(spPayload, { onConflict: "user_id" }).select().single();
      if (spErr) throw spErr;
      const sid = spData.id;
      setSpId(sid);

      // Skills
      await supabase.from("student_skills").delete().eq("student_id", sid);
      if (skills.length > 0) {
        await supabase.from("student_skills").insert(skills.map((s) => {
          const cat = Object.entries(SKILLS_BY_CAT).find(([, v]) => v.includes(s))?.[0] ?? "Autres";
          return { student_id: sid, skill: s, category: cat };
        }));
      }

      // Projects
      await supabase.from("projects").delete().eq("student_id", sid);
      if (projects.length > 0) {
        await supabase.from("projects").insert(projects.map((p) => ({
          student_id: sid, title: p.title, type: p.type, description: p.description,
          techs: p.techs, github_url: p.github_url || null,
        })));
      }

      setSaved(true); setTimeout(() => setSaved(false), 3000);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Une erreur est survenue");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="max-w-3xl mx-auto px-4 py-16 animate-pulse"><div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-48 mb-8" /><div className="space-y-4">{[1,2,3].map(i=><div key={i} className="h-32 bg-gray-100 dark:bg-gray-800 rounded-2xl"/>)}</div></div>;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Modifier mon profil</h1>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition">
          {saved ? <><CheckCircle className="w-4 h-4" /> Sauvegarde!</> : <><Save className="w-4 h-4" /> {saving ? "Sauvegarde..." : "Sauvegarder"}</>}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl px-4 py-3 mb-6 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Info */}
        <Section title="Informations generales">
          <Field label="Nom complet">
            <input value={fullName} onChange={e => setFullName(e.target.value)} className={input} />
          </Field>
          <Field label="Bio (visible sur ton profil public)">
            <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} className={input} />
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Ville">
              <select value={city} onChange={e => setCity(e.target.value)} className={input}>
                <option value="">Selectionner...</option>
                {CITIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </Field>
          </div>
        </Section>

        {/* Formation */}
        <Section title="Formation">
          <Field label="Ecole / Universite">
            <input value={school} onChange={e => setSchool(e.target.value)} className={input} />
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Niveau">
              <select value={level} onChange={e => setLevel(e.target.value)} className={input}>
                <option value="">Selectionner...</option>
                {["Bac+1","Bac+2","Bac+3 / Licence","Bac+4","Bac+5 / Master","Ingenieur"].map(l => <option key={l}>{l}</option>)}
              </select>
            </Field>
            <Field label="Type de stage recherche">
              <select value={internshipType} onChange={e => setInternshipType(e.target.value)} className={input}>
                <option value="">Selectionner...</option>
                {["PFA","PFE","Stage d'ete","Stage professionnel"].map(t => <option key={t}>{t}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Domaine de specialisation">
            <div className="flex flex-wrap gap-2">
              {DOMAINS.map(d => (
                <button key={d} type="button" onClick={() => setDomain(d === domain ? "" : d)}
                  className={`text-xs px-3 py-1.5 rounded-xl border transition ${domain === d ? "border-brand-500 bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300" : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-brand-300"}`}>
                  {d}
                </button>
              ))}
            </div>
          </Field>
        </Section>

        {/* Skills */}
        <Section title="Competences">
          <div className="space-y-4">
            {Object.entries(SKILLS_BY_CAT).map(([cat, items]) => (
              <div key={cat}>
                <p className="text-xs font-semibold text-gray-400 uppercase mb-2">{cat}</p>
                <div className="flex flex-wrap gap-2">
                  {items.map(s => (
                    <button key={s} type="button" onClick={() => toggleSkill(s)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition ${skills.includes(s) ? "border-brand-500 bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300" : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-brand-300"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Projects */}
        <Section title="Projets PFA / PFE" id="projects">
          <div className="space-y-3 mb-4">
            {projects.map((p, i) => (
              <div key={i} className="flex items-start gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-xl p-3">
                <FolderGit2 className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900 dark:text-white text-sm">{p.title}</span>
                    <span className="text-xs bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 px-1.5 rounded-full">{p.type}</span>
                  </div>
                  {p.techs.length > 0 && <div className="flex flex-wrap gap-1">{p.techs.map(t=><span key={t} className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 px-1.5 py-0.5 rounded">{t}</span>)}</div>}
                </div>
                <button onClick={() => removeProject(i)} className="text-red-400 hover:text-red-600 transition flex-shrink-0"><X className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
          <div className="border border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-3">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Ajouter un projet</p>
            <div className="grid sm:grid-cols-2 gap-3">
              <input placeholder="Titre du projet" value={newProj.title} onChange={e=>setNewProj(p=>({...p,title:e.target.value}))} className={input} />
              <select value={newProj.type} onChange={e=>setNewProj(p=>({...p,type:e.target.value}))} className={input}>
                {["PFA","PFE","Personnel","Open Source"].map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
            <textarea placeholder="Description courte" value={newProj.description} onChange={e=>setNewProj(p=>({...p,description:e.target.value}))} rows={2} className={input}/>
            <div className="flex gap-2">
              <input placeholder="Technologies (ex: React, Python)" value={techInput} onChange={e=>setTechInput(e.target.value)}
                onKeyDown={e=>{if(e.key==="Enter"||e.key===","){e.preventDefault();const t=techInput.trim();if(t)setNewProj(p=>({...p,techs:[...p.techs,t]}));setTechInput("");}}}
                className={`${input} flex-1`} />
            </div>
            {newProj.techs.length > 0 && <div className="flex flex-wrap gap-1">{newProj.techs.map((t,i)=><span key={i} className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-lg flex items-center gap-1">{t}<button onClick={()=>setNewProj(p=>({...p,techs:p.techs.filter((_,j)=>j!==i)}))}>×</button></span>)}</div>}
            <input placeholder="Lien GitHub (optionnel)" value={newProj.github_url} onChange={e=>setNewProj(p=>({...p,github_url:e.target.value}))} className={input}/>
            <button onClick={addProject} className="flex items-center gap-1.5 text-sm bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl transition">
              <Plus className="w-4 h-4" /> Ajouter
            </button>
          </div>
        </Section>

        {/* CV & Links */}
        <Section title="CV & Liens" id="cv">
          <Field label="CV (PDF)">
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => cvRef.current?.click()} className="flex items-center gap-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-sm text-gray-600 dark:text-gray-400 hover:border-brand-400 transition">
                <Upload className="w-4 h-4" />
                {cvFile ? cvFile.name : cvFilename || "Choisir un fichier PDF"}
              </button>
              {(cvFile || cvFilename) && <CheckCircle className="w-5 h-5 text-brand-500 flex-shrink-0" />}
            </div>
            <input ref={cvRef} type="file" accept=".pdf" className="hidden" onChange={e => setCvFile(e.target.files?.[0] ?? null)} />
          </Field>
          <Field label="GitHub">
            <div className="relative">
              <GitBranch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={github} onChange={e=>setGithub(e.target.value)} placeholder="https://github.com/..." className={`${input} pl-10`} />
            </div>
          </Field>
          <Field label="LinkedIn">
            <div className="relative">
              <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={linkedin} onChange={e=>setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/..." className={`${input} pl-10`} />
            </div>
          </Field>
          <Field label="Portfolio (optionnel)">
            <input value={portfolio} onChange={e=>setPortfolio(e.target.value)} placeholder="https://..." className={input} />
          </Field>
        </Section>
      </div>

      <div className="mt-8 flex justify-end">
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl text-sm font-semibold transition">
          {saved ? <><CheckCircle className="w-4 h-4" /> Sauvegarde!</> : <><Save className="w-4 h-4" /> {saving ? "Sauvegarde..." : "Sauvegarder les modifications"}</>}
        </button>
      </div>
    </div>
  );
}

const input = "w-full border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder-gray-400";

function Section({ title, children, id }: { title: string; children: React.ReactNode; id?: string }) {
  return (
    <div id={id} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
      <h2 className="text-base font-bold text-gray-900 dark:text-white mb-5">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5">{label}</label>
      {children}
    </div>
  );
}
