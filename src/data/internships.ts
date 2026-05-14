export type Internship = {
  id: string;
  title: string;
  company: string;
  city: string;
  domain: string;
  type: "remote" | "on-site" | "hybrid";
  duration: string;
  skills: string[];
  description: string;
  postedAt: string;
  logo: string;
  applicants: number;
};

export const internships: Internship[] = [
  {
    id: "1",
    title: "Développeur Full Stack React/Node.js",
    company: "CasaTech Solutions",
    city: "Casablanca",
    domain: "Software Engineering",
    type: "hybrid",
    duration: "3 mois",
    skills: ["React", "Node.js", "TypeScript", "PostgreSQL"],
    description:
      "Rejoignez notre équipe de développement pour travailler sur des projets innovants. Vous participez au développement de notre plateforme SaaS B2B utilisée par plus de 500 entreprises marocaines. Stack moderne, environnement agile, code review systématique.",
    postedAt: "2026-05-10",
    logo: "CT",
    applicants: 12,
  },
  {
    id: "2",
    title: "Ingénieur DevOps / Cloud",
    company: "Maroc Cloud Group",
    city: "Rabat",
    domain: "DevOps",
    type: "on-site",
    duration: "6 mois",
    skills: ["Docker", "Kubernetes", "AWS", "Terraform", "CI/CD"],
    description:
      "Intégrez notre équipe infrastructure pour automatiser nos pipelines CI/CD, gérer nos clusters Kubernetes et optimiser notre infrastructure AWS. Vous travaillerez directement avec des ingénieurs seniors sur des projets à fort impact.",
    postedAt: "2026-05-08",
    logo: "MCG",
    applicants: 8,
  },
  {
    id: "3",
    title: "Analyste Cybersécurité",
    company: "SecureNet Maroc",
    city: "Casablanca",
    domain: "Cybersecurity",
    type: "on-site",
    duration: "4 mois",
    skills: ["Pentest", "SIEM", "Python", "Kali Linux", "OWASP"],
    description:
      "Participez à nos missions d'audit de sécurité, de test de pénétration et de réponse aux incidents. Vous serez accompagné par notre équipe SOC certifiée CISSP pour développer vos compétences en cybersécurité offensive et défensive.",
    postedAt: "2026-05-07",
    logo: "SN",
    applicants: 5,
  },
  {
    id: "4",
    title: "Data Scientist / ML Engineer",
    company: "DataMa Analytics",
    city: "Marrakech",
    domain: "Data & AI",
    type: "remote",
    duration: "3 mois",
    skills: ["Python", "Pandas", "Scikit-learn", "TensorFlow", "SQL"],
    description:
      "Travaillez sur des modèles de machine learning appliqués au e-commerce marocain. Vous construirez des pipelines de données, entraînerez des modèles de recommandation et présenterez vos résultats aux équipes produit.",
    postedAt: "2026-05-05",
    logo: "DMA",
    applicants: 15,
  },
  {
    id: "5",
    title: "Développeur Mobile Flutter",
    company: "AppNova",
    city: "Casablanca",
    domain: "Web/Mobile",
    type: "hybrid",
    duration: "3 mois",
    skills: ["Flutter", "Dart", "Firebase", "REST API"],
    description:
      "Développez de nouvelles fonctionnalités sur notre application mobile comptant 50 000 utilisateurs actifs. Vous travaillerez en étroite collaboration avec notre designer UX et notre backend Go.",
    postedAt: "2026-05-04",
    logo: "AN",
    applicants: 20,
  },
  {
    id: "6",
    title: "Ingénieur Réseau & Infrastructure",
    company: "TeleLink Maroc",
    city: "Tanger",
    domain: "Networking",
    type: "on-site",
    duration: "6 mois",
    skills: ["Cisco", "CCNA", "BGP", "MPLS", "Linux"],
    description:
      "Intégrez notre NOC pour gérer et superviser notre réseau national. Vous participerez à des projets de migration réseau, configuration de routeurs et switches Cisco, et mise en place de solutions de monitoring.",
    postedAt: "2026-05-03",
    logo: "TLM",
    applicants: 6,
  },
  {
    id: "7",
    title: "Développeur Frontend Vue.js",
    company: "StartupHub Agadir",
    city: "Agadir",
    domain: "Web/Mobile",
    type: "remote",
    duration: "2 mois",
    skills: ["Vue.js", "Nuxt.js", "Tailwind CSS", "GraphQL"],
    description:
      "Rejoignez notre startup en pleine croissance pour construire notre interface utilisateur. Vous travaillerez sur des composants réutilisables, l'optimisation des performances et l'accessibilité.",
    postedAt: "2026-05-02",
    logo: "SHA",
    applicants: 9,
  },
  {
    id: "8",
    title: "Ingénieur QA / Test Automation",
    company: "QualityFirst Tech",
    city: "Rabat",
    domain: "QA",
    type: "hybrid",
    duration: "4 mois",
    skills: ["Selenium", "Cypress", "Jest", "Postman", "Python"],
    description:
      "Automatisez nos tests end-to-end et API. Vous participerez à la mise en place d'une stratégie de test globale, réduisant notre taux de régression et accélérant nos cycles de release.",
    postedAt: "2026-04-30",
    logo: "QFT",
    applicants: 4,
  },
  {
    id: "9",
    title: "Développeur Backend Python/Django",
    company: "FinTech Casa",
    city: "Casablanca",
    domain: "Software Engineering",
    type: "on-site",
    duration: "6 mois",
    skills: ["Python", "Django", "PostgreSQL", "Redis", "Docker"],
    description:
      "Contribuez au développement de notre plateforme de paiement. Vous implémenterez de nouvelles API REST, optimiserez les requêtes base de données et assurerez la sécurité des transactions financières.",
    postedAt: "2026-04-28",
    logo: "FC",
    applicants: 11,
  },
  {
    id: "10",
    title: "Ingénieur Cloud AWS / Azure",
    company: "CloudSys Maroc",
    city: "Casablanca",
    domain: "Cloud",
    type: "hybrid",
    duration: "5 mois",
    skills: ["AWS", "Azure", "Terraform", "Ansible", "Python"],
    description:
      "Participez à la migration cloud de nos clients entreprises. Vous concevrez des architectures cloud, automatiserez le provisioning et mettrez en place des solutions de monitoring et d'alerting.",
    postedAt: "2026-04-25",
    logo: "CSM",
    applicants: 7,
  },
  {
    id: "11",
    title: "Ingénieur IA / NLP",
    company: "AI Ventures Maroc",
    city: "Rabat",
    domain: "Data & AI",
    type: "remote",
    duration: "4 mois",
    skills: ["Python", "HuggingFace", "NLP", "PyTorch", "LLM"],
    description:
      "Travaillez sur des solutions NLP pour l'arabe et le darija marocain. Vous fine-tunerez des modèles de langage, construirez des pipelines d'évaluation et publierez vos résultats.",
    postedAt: "2026-04-22",
    logo: "AVM",
    applicants: 18,
  },
  {
    id: "12",
    title: "Développeur Web WordPress / PHP",
    company: "DigitalBoost Tanger",
    city: "Tanger",
    domain: "Web/Mobile",
    type: "on-site",
    duration: "2 mois",
    skills: ["PHP", "WordPress", "MySQL", "JavaScript", "SEO"],
    description:
      "Développez et maintenez des sites web pour nos clients PME marocains. Vous créerez des thèmes WordPress sur mesure, optimiserez les performances et formerez les clients à l'utilisation du CMS.",
    postedAt: "2026-04-20",
    logo: "DBT",
    applicants: 3,
  },
];
