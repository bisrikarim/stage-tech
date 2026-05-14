import Link from "next/link";
import { MapPin, Clock, Wifi, Building2, Calendar } from "lucide-react";
import { Internship } from "@/data/internships";

const domainColors: Record<string, string> = {
  "Software Engineering": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "DevOps": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  "Cybersecurity": "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  "Data & AI": "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  "Web/Mobile": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "Networking": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  "QA": "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300",
  "Cloud": "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
};

const typeLabel: Record<string, string> = {
  remote: "Remote",
  "on-site": "Présentiel",
  hybrid: "Hybride",
};

const typeIcon = {
  remote: <Wifi className="w-3 h-3" />,
  "on-site": <Building2 className="w-3 h-3" />,
  hybrid: <Building2 className="w-3 h-3" />,
};

function daysAgo(dateStr: string) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  if (diff === 0) return "Aujourd'hui";
  if (diff === 1) return "Hier";
  return `Il y a ${diff} jours`;
}

const logoColors = [
  "bg-emerald-500","bg-blue-500","bg-violet-500","bg-rose-500",
  "bg-amber-500","bg-sky-500","bg-pink-500","bg-teal-500",
];

function logoColor(id: string) {
  return logoColors[parseInt(id) % logoColors.length];
}

export default function InternshipCard({ internship }: { internship: Internship }) {
  return (
    <Link href={`/internships/${internship.id}`}>
      <div className="group bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 hover:shadow-lg hover:border-emerald-200 dark:hover:border-emerald-800 transition-all duration-200 cursor-pointer h-full flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className={`w-11 h-11 rounded-xl ${logoColor(internship.id)} flex items-center justify-center text-white font-bold text-xs flex-shrink-0`}>
            {internship.logo}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition line-clamp-2">
              {internship.title}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">{internship.company}</p>
          </div>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{internship.city}</span>
          <span className="flex items-center gap-1">{typeIcon[internship.type]}{typeLabel[internship.type]}</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{internship.duration}</span>
        </div>

        {/* Domain badge */}
        <span className={`text-xs px-2 py-1 rounded-full font-medium w-fit ${domainColors[internship.domain] ?? "bg-gray-100 text-gray-700"}`}>
          {internship.domain}
        </span>

        {/* Skills */}
        <div className="flex flex-wrap gap-1 mt-auto">
          {internship.skills.slice(0, 3).map((s) => (
            <span key={s} className="text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-md">
              {s}
            </span>
          ))}
          {internship.skills.length > 3 && (
            <span className="text-xs text-gray-400 dark:text-gray-500 px-1 py-0.5">+{internship.skills.length - 3}</span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 border-t border-gray-50 dark:border-gray-800 pt-3">
          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{daysAgo(internship.postedAt)}</span>
          <span>{internship.applicants} candidats</span>
        </div>
      </div>
    </Link>
  );
}
