export type Student = {
  id: string;
  name: string;
  school: string;
  city: string;
  skills: string[];
  linkedin: string;
  github: string;
  domain: string;
  level: string;
  appliedAt: string;
};

export const students: Student[] = [
  {
    id: "1",
    name: "Yassine El Amrani",
    school: "ENSIAS - Rabat",
    city: "Rabat",
    skills: ["React", "TypeScript", "Node.js", "MongoDB"],
    linkedin: "linkedin.com/in/yassine-elamrani",
    github: "github.com/yassine-elamrani",
    domain: "Software Engineering",
    level: "Bac+5",
    appliedAt: "2026-05-11",
  },
  {
    id: "2",
    name: "Salma Benali",
    school: "EMI - Rabat",
    city: "Casablanca",
    skills: ["Python", "Machine Learning", "TensorFlow", "SQL"],
    linkedin: "linkedin.com/in/salma-benali",
    github: "github.com/salma-benali",
    domain: "Data & AI",
    level: "Bac+5",
    appliedAt: "2026-05-10",
  },
  {
    id: "3",
    name: "Omar Tahiri",
    school: "INPT - Rabat",
    city: "Rabat",
    skills: ["Docker", "Kubernetes", "AWS", "Terraform"],
    linkedin: "linkedin.com/in/omar-tahiri",
    github: "github.com/omar-tahiri",
    domain: "DevOps",
    level: "Bac+5",
    appliedAt: "2026-05-09",
  },
  {
    id: "4",
    name: "Fatima Zahra Moussaoui",
    school: "Université Hassan II - Casablanca",
    city: "Casablanca",
    skills: ["Flutter", "Dart", "Firebase", "UI/UX"],
    linkedin: "linkedin.com/in/fatimazahra-moussaoui",
    github: "github.com/fz-moussaoui",
    domain: "Web/Mobile",
    level: "Bac+3",
    appliedAt: "2026-05-08",
  },
  {
    id: "5",
    name: "Amine Chakib",
    school: "ENSA - Tanger",
    city: "Tanger",
    skills: ["Pentest", "Kali Linux", "OWASP", "Python"],
    linkedin: "linkedin.com/in/amine-chakib",
    github: "github.com/amine-chakib",
    domain: "Cybersecurity",
    level: "Bac+5",
    appliedAt: "2026-05-07",
  },
  {
    id: "6",
    name: "Nadia Berrada",
    school: "ENSA - Marrakech",
    city: "Marrakech",
    skills: ["Selenium", "Cypress", "Jest", "Python"],
    linkedin: "linkedin.com/in/nadia-berrada",
    github: "github.com/nadia-berrada",
    domain: "QA",
    level: "Bac+4",
    appliedAt: "2026-05-06",
  },
];
