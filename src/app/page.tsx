import Link from "next/link";
import {
  ArrowRight, UserCircle, FileText, Eye, Users, GraduationCap,
  FolderOpen, Globe, Star, CheckCircle, Lightning
} from "@phosphor-icons/react/dist/ssr";

const STACKS = ["React", "Python", "Node.js", "TypeScript", "Docker", "Next.js", "FastAPI", "TensorFlow", "Kubernetes", "Flutter", "PostgreSQL", "Spring Boot"];
const SCHOOLS = ["ENSIAS", "EMI", "INPT", "ENSA Rabat", "EMSI", "UM6P", "UIR", "ENSA Marrakech"];
const STEPS = [
  {
    num: "01", title: "Crée ton profil",
    desc: "École, niveau, domaine, type de stage, disponibilité — rempli en 5 minutes.",
    icon: <UserCircle size={44} weight="fill" className="text-brand-600" />,
  },
  {
    num: "02", title: "Ajoute tes preuves",
    desc: "CV, projets PFA/PFE, GitHub, LinkedIn, stack technique.",
    icon: <FileText size={44} weight="fill" className="text-brand-600" />,
  },
  {
    num: "03", title: "Deviens visible",
    desc: "Ton profil rejoint le vivier de talents consulté par les entreprises marocaines.",
    icon: <Eye size={44} weight="fill" className="text-brand-600" />,
  },
];

const STATS = [
  { value: "500+", label: "Étudiants inscrits",    icon: <Users          size={40} weight="fill" className="text-brand-600" /> },
  { value: "30+",  label: "Écoles représentées",   icon: <GraduationCap  size={40} weight="fill" className="text-brand-600" /> },
  { value: "200+", label: "Projets PFA/PFE",       icon: <FolderOpen     size={40} weight="fill" className="text-brand-600" /> },
  { value: "9",    label: "Domaines IT",            icon: <Globe          size={40} weight="fill" className="text-brand-600" /> },
];

const VALUE_PROPS = [
  {
    title: "Un profil, pas un CV PDF perdu",
    desc: "Ton profil est structuré, mis à jour, et toujours accessible. GitHub, LinkedIn, projets — tout au même endroit.",
    icon: <FileText size={36} weight="fill" className="text-brand-600" />,
  },
  {
    title: "Mets en avant tes projets PFA/PFE",
    desc: "Les recruteurs veulent voir ce que tu as fait. Ajoute tes projets académiques et personnels facilement.",
    icon: <FolderOpen size={36} weight="fill" className="text-brand-600" />,
  },
  {
    title: "Score de complétion du profil",
    desc: "Un indicateur clair te guide pour rendre ton profil le plus attractif possible.",
    icon: <CheckCircle size={36} weight="fill" className="text-brand-600" />,
  },
  {
    title: "Contrôle ta visibilité",
    desc: "Tu décides quand ton profil est visible. Tu peux le masquer ou le rendre public en un clic.",
    icon: <Eye size={36} weight="fill" className="text-brand-600" />,
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-white to-brand-100 dark:from-gray-900 dark:via-gray-950 dark:to-brand-950/30 py-24 px-4">
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <Lightning size={14} weight="fill" />
            Le vivier de talents IT marocains
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6">
            Fais-toi{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-400">
              repérer
            </span>{" "}
            par les recruteurs IT
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">
            Crée ton profil de stagiaire en quelques minutes. Ajoute ton CV, tes projets et tes compétences.
            Les entreprises tech marocaines consultent le vivier — sois présent.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup" className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-3.5 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2">
              Créer mon profil gratuitement <ArrowRight size={16} weight="bold" />
            </Link>
            <Link href="/talents" className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:border-brand-400 hover:text-brand-600 dark:hover:text-brand-400 px-8 py-3.5 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2">
              <Eye size={16} weight="fill" />
              Voir les profils
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-3">
              {s.icon}
              <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{s.value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-3">Comment ça marche</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xl mx-auto">
            En 3 étapes simples, ton profil rejoint le vivier consulté par les recruteurs marocains.
          </p>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {STEPS.map((s) => (
            <div key={s.num} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 relative flex flex-col gap-4">
              <span className="text-5xl font-black text-brand-100 dark:text-brand-900/60 absolute top-4 right-5 leading-none select-none">{s.num}</span>
              {s.icon}
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tech stack tags */}
      <section className="bg-gray-50 dark:bg-gray-900/50 border-y border-gray-100 dark:border-gray-800 py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">Des profils dans tous les domaines</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Frontend, backend, data, DevOps, mobile, sécurité — toutes les stacks représentées.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2.5">
            {STACKS.map((tech) => (
              <span key={tech} className="text-sm bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-xl font-medium shadow-sm">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Schools */}
      <section className="py-16 px-4 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-brand-600 dark:text-brand-400 mb-3">Communauté</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
              Les meilleures écoles marocaines
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Des étudiants de tous horizons, prêts pour leurs premiers stages.</p>
          </div>
          <div className="relative">
            <div className="flex flex-wrap justify-center gap-3">
              {SCHOOLS.map((school) => (
                <div key={school}
                  className="flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-sm font-semibold border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 transition hover:border-brand-400 hover:text-brand-600 dark:hover:text-brand-400">
                  <GraduationCap size={15} weight="fill" className="text-brand-500 flex-shrink-0" />
                  {school}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">Tout ce dont tu as besoin</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Un seul profil pour te rendre visible et attractif.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {VALUE_PROPS.map((v) => (
              <div key={v.title} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 flex gap-4">
                <div className="flex-shrink-0">{v.icon}</div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1">{v.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-brand-600 dark:bg-gray-950 border-t border-transparent dark:border-gray-800 py-20 px-4">
        <div className="max-w-2xl mx-auto text-center text-white">
          <h2 className="text-3xl font-extrabold mb-4 dark:text-white">Prêt à être découvert ?</h2>
          <p className="text-brand-100 dark:text-gray-400 mb-8 text-base">
            Crée ton profil maintenant. C&apos;est gratuit, ça prend 5 minutes, et ça peut changer la suite de ton parcours.
          </p>
          <Link href="/signup" className="inline-flex items-center gap-2 bg-white dark:bg-brand-600 text-brand-700 dark:text-white hover:bg-brand-50 dark:hover:bg-brand-700 px-8 py-3.5 rounded-xl font-bold text-sm transition">
            Créer mon profil <ArrowRight size={16} weight="bold" />
          </Link>
        </div>
      </section>
    </div>
  );
}
