export type Project = {
  title: string;
  type: "PFA" | "PFE" | "Personnel";
  techs: string[];
  description: string;
  github?: string;
};

export type PreviousStage = {
  company: string;
  role: string;
  duration: string;
  year: string;
  type: "Observation" | "PFA" | "PFE" | "Professionnel";
};

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
  techPreferences: string[];
  projects: Project[];
  previousStages: PreviousStage[];
  isTopSchool: boolean;
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
    techPreferences: ["React", "Node.js", "TypeScript"],
    isTopSchool: true,
    projects: [
      {
        title: "Plateforme e-learning adaptive",
        type: "PFA",
        techs: ["React", "Node.js", "MongoDB", "Socket.io"],
        description: "Application web de formation en ligne avec suivi adaptatif et tableaux de bord professeur/etudiant.",
        github: "github.com/yassine-elamrani/elearning",
      },
      {
        title: "API REST gestion RH",
        type: "Personnel",
        techs: ["Node.js", "PostgreSQL", "JWT"],
        description: "Backend complet avec authentification, gestion des conges et rapports PDF.",
      },
    ],
    previousStages: [
      { company: "InnoTech Rabat", role: "Developpeur Frontend", duration: "2 mois", year: "2025", type: "Observation" },
    ],
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
    techPreferences: ["Python", "TensorFlow", "PyTorch"],
    isTopSchool: true,
    projects: [
      {
        title: "Systeme de detection de fraude bancaire",
        type: "PFE",
        techs: ["Python", "Scikit-learn", "XGBoost", "FastAPI"],
        description: "Modele ML de detection de transactions frauduleuses avec taux de precision de 94%.",
        github: "github.com/salma-benali/fraud-detection",
      },
    ],
    previousStages: [
      { company: "Attijariwafa Bank", role: "Stagiaire Data", duration: "3 mois", year: "2025", type: "PFA" },
    ],
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
    techPreferences: ["Kubernetes", "AWS", "Terraform"],
    isTopSchool: true,
    projects: [
      {
        title: "Infrastructure CI/CD multi-environnements",
        type: "PFA",
        techs: ["Terraform", "GitHub Actions", "Docker", "AWS ECS"],
        description: "Mise en place d'un pipeline CI/CD complet avec deploiement zero-downtime sur AWS.",
        github: "github.com/omar-tahiri/cicd-infra",
      },
    ],
    previousStages: [
      { company: "OCP Group", role: "Stagiaire DevOps", duration: "2 mois", year: "2025", type: "Observation" },
    ],
  },
  {
    id: "4",
    name: "Fatima Zahra Moussaoui",
    school: "Universite Hassan II - Casablanca",
    city: "Casablanca",
    skills: ["Flutter", "Dart", "Firebase", "UI/UX"],
    linkedin: "linkedin.com/in/fatimazahra-moussaoui",
    github: "github.com/fz-moussaoui",
    domain: "Web/Mobile",
    level: "Bac+3",
    appliedAt: "2026-05-08",
    techPreferences: ["Flutter", "React Native"],
    isTopSchool: false,
    projects: [
      {
        title: "App mobile livraison Casablanca",
        type: "Personnel",
        techs: ["Flutter", "Firebase", "Google Maps API"],
        description: "Application de livraison avec tracking en temps reel et systeme de notation.",
        github: "github.com/fz-moussaoui/delivery-app",
      },
    ],
    previousStages: [],
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
    techPreferences: ["Pentest", "Python", "Kali Linux"],
    isTopSchool: true,
    projects: [
      {
        title: "Audit securite application web",
        type: "PFA",
        techs: ["Burp Suite", "Python", "OWASP ZAP"],
        description: "Audit complet d'une application bancaire avec rapport de vulnerabilites et recommandations.",
      },
    ],
    previousStages: [
      { company: "Maroc Telecom", role: "Stagiaire SOC", duration: "1 mois", year: "2024", type: "Observation" },
    ],
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
    techPreferences: ["Cypress", "Selenium", "Python"],
    isTopSchool: true,
    projects: [
      {
        title: "Framework de tests automatises e-commerce",
        type: "PFA",
        techs: ["Cypress", "Jest", "GitHub Actions"],
        description: "Suite de tests end-to-end couvrant 200+ scenarios pour une plateforme e-commerce.",
        github: "github.com/nadia-berrada/test-framework",
      },
    ],
    previousStages: [],
  },
];
