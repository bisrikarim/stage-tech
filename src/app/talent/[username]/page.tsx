import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';
import Link from "next/link";
import { GithubLogo, LinkedinLogo, MapPin, GraduationCap, Star, DownloadSimple, Link as LinkIcon, UserCircle } from "@phosphor-icons/react/dist/ssr";
import ProjectsSection from "@/components/ProjectsSection";

export default async function TalentProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const supabase = await createClient();

  const { data: sp } = await supabase
    .from("student_profiles")
    .select("*")
    .eq("username", username)
    .eq("is_visible", true)
    .single();

  if (!sp) notFound();

  const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", sp.user_id).single();
  const { data: skills } = await supabase.from("student_skills").select("*").eq("student_id", sp.id);
  const { data: projects } = await supabase.from("projects").select("*").eq("student_id", sp.id);

  const fullName = profile?.full_name ?? username;
  const initials = fullName.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase();

  const TOP_SCHOOLS = ["ENSIAS", "EMI", "INPT", "ENSA", "EMSI", "Ecole Mohammadia"];
  const isTop = sp.school && TOP_SCHOOLS.some((s) => sp.school.includes(s));

  const skillsByCategory: Record<string, string[]> = {};
  (skills ?? []).forEach((s: { skill: string; category?: string }) => {
    const cat = s.category ?? "Autres";
    if (!skillsByCategory[cat]) skillsByCategory[cat] = [];
    skillsByCategory[cat].push(s.skill);
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-8 mb-6">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="text-brand-600 dark:text-brand-400 flex-shrink-0">
            <UserCircle size={80} weight="regular" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">{fullName}</h1>
              {isTop && (
                <span className="flex items-center gap-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-semibold px-2 py-0.5 rounded-full">
                  <Star size={12} weight="fill" /> Grande ecole
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-4">
              {sp.school && <span className="flex items-center gap-1"><GraduationCap size={16} weight="fill" />{sp.school}</span>}
              {sp.city && <span className="flex items-center gap-1"><MapPin size={16} weight="fill" />{sp.city}</span>}
              {sp.level && <span>{sp.level}</span>}
              {sp.domain && <span className="bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 px-2 py-0.5 rounded-full text-xs font-medium">{sp.domain}</span>}
              {sp.internship_type && <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full text-xs font-medium">Cherche: {sp.internship_type}</span>}
            </div>
            {sp.bio && <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{sp.bio}</p>}
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-gray-50 dark:border-gray-800">
          {sp.github_url && (
            <a href={sp.github_url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium px-4 py-2 rounded-full hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
              <GithubLogo size={16} weight="fill" /> GitHub
            </a>
          )}
          {sp.linkedin_url && (
            <a href={sp.linkedin_url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-sm font-medium px-4 py-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition">
              <LinkedinLogo size={16} weight="fill" /> LinkedIn
            </a>
          )}
          {sp.portfolio_url && (
            <a href={sp.portfolio_url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium px-4 py-2 rounded-full hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
              <LinkIcon size={16} weight="fill" /> Portfolio
            </a>
          )}
          {(sp.cv_url || sp.cv_filename) && (
            <a
              href={sp.cv_url || `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/cvs/${sp.user_id}/${sp.cv_filename}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2 rounded-full transition">
              <DownloadSimple size={16} weight="fill" /> Telecharger CV
            </a>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {/* Skills */}
        {Object.keys(skillsByCategory).length > 0 && (
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
            <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">Competences</h2>
            <div className="space-y-4">
              {Object.entries(skillsByCategory).map(([cat, items]) => (
                <div key={cat}>
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-2">{cat}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {items.map((skill) => (
                      <span key={skill} className="text-xs bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 border border-brand-100 dark:border-brand-800 px-2 py-0.5 rounded-lg font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {(projects ?? []).length > 0 && (
          <ProjectsSection projects={projects ?? []} />
        )}
      </div>

      <div className="mt-8 text-center">
        <Link href="/talents" className="text-sm text-gray-400 hover:text-brand-500 transition">
          ← Voir tous les talents
        </Link>
      </div>
    </div>
  );
}
