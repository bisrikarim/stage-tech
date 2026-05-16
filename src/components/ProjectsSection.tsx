"use client";
import { useState } from "react";
import { FolderGit2, GitBranch, X, ExternalLink } from "lucide-react";

type Project = {
  id: string;
  title: string;
  type?: string;
  description?: string;
  techs?: string[];
  github_url?: string;
};

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xl w-full max-w-lg p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-3 mb-4 pr-6">
          <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
            <FolderGit2 className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-base leading-tight">{project.title}</h3>
            {project.type && (
              <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full mt-1 inline-block">
                {project.type}
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        {project.description && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Description</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {project.description}
            </p>
          </div>
        )}

        {/* Techs */}
        {(project.techs?.length ?? 0) > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Technologies</p>
            <div className="flex flex-wrap gap-1.5">
              {(project.techs ?? []).map((t) => (
                <span
                  key={t}
                  className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 px-2.5 py-1 rounded-lg font-medium"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* GitHub link */}
        {project.github_url && (
          <a
            href={project.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gray-900 dark:bg-gray-800 text-white text-sm px-4 py-2.5 rounded-xl hover:opacity-90 transition mt-2"
          >
            <GitBranch className="w-4 h-4" /> Voir sur GitHub
          </a>
        )}
      </div>
    </div>
  );
}

export default function ProjectsSection({ projects }: { projects: Project[] }) {
  const [selected, setSelected] = useState<Project | null>(null);

  if (projects.length === 0) return null;

  return (
    <>
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
        <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">Projets</h2>
        <div className="space-y-3">
          {projects.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelected(p)}
              className="w-full text-left border border-gray-100 dark:border-gray-800 hover:border-brand-300 dark:hover:border-brand-700 rounded-xl p-4 transition group cursor-pointer"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <FolderGit2 className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <span className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-brand-600 dark:group-hover:text-brand-400 transition">
                    {p.title}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {p.type && (
                    <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded-full">
                      {p.type}
                    </span>
                  )}
                  <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-brand-500 transition" />
                </div>
              </div>

              {/* Description tronquée */}
              {p.description && (
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-2 leading-relaxed">
                  {p.description}
                </p>
              )}

              {/* Techs */}
              {(p.techs?.length ?? 0) > 0 && (
                <div className="flex flex-wrap gap-1">
                  {(p.techs ?? []).slice(0, 4).map((t) => (
                    <span key={t} className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded">
                      {t}
                    </span>
                  ))}
                  {(p.techs?.length ?? 0) > 4 && (
                    <span className="text-xs text-gray-400">+{(p.techs?.length ?? 0) - 4}</span>
                  )}
                </div>
              )}

              <p className="text-xs text-brand-500 mt-2 group-hover:underline">Voir les details →</p>
            </button>
          ))}
        </div>
      </div>

      {selected && (
        <ProjectModal project={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
