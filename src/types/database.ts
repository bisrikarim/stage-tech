export type Role = 'student' | 'admin';
export type SchoolType = 'Grande ecole' | 'Universite' | 'OFPPT' | 'Bootcamp' | 'Autre';
export type City = 'Casablanca' | 'Rabat' | 'Marrakech' | 'Tanger' | 'Agadir' | 'Fes' | 'Meknes' | 'Oujda' | 'Autre';
export type InternshipType = 'PFA' | 'PFE' | 'Observation' | 'Stage professionnel';
export type Level = 'Bac+2' | 'Bac+3' | 'Bac+4' | 'Bac+5' | 'Doctorat';
export type ProjectType = 'PFA' | 'PFE' | 'Personnel' | 'Open Source';
export type SkillCategory = 'language' | 'framework' | 'cloud' | 'devops' | 'tool' | 'database' | 'other';

export type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: Role;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
};

export type StudentProfile = {
  id: string;
  user_id: string;
  username: string | null;
  school: string | null;
  school_type: SchoolType | null;
  city: City | null;
  graduation_year: number | null;
  internship_type: InternshipType | null;
  domain: string | null;
  level: Level | null;
  bio: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  portfolio_url: string | null;
  cv_url: string | null;
  cv_filename: string | null;
  cv_uploaded_at: string | null;
  is_visible: boolean;
  profile_score: number;
  created_at: string;
  updated_at: string;
};

export type Skill = {
  id: string;
  student_id: string;
  skill: string;
  category: SkillCategory;
};

export type TechPreference = {
  id: string;
  student_id: string;
  tech: string;
};

export type Project = {
  id: string;
  student_id: string;
  title: string;
  description: string | null;
  type: ProjectType | null;
  github_url: string | null;
  demo_url: string | null;
  techs: string[];
  created_at: string;
};

// Joined type for public profile display
export type PublicStudentProfile = StudentProfile & {
  profiles: Pick<Profile, 'full_name' | 'avatar_url' | 'email'>;
  student_skills: Skill[];
  tech_preferences: TechPreference[];
  projects: Project[];
};
