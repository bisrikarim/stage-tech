-- ============================================================
-- StageTech.ma - Supabase Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES (extends auth.users)
-- ============================================================
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  role text default 'student' check (role in ('student', 'admin')),
  onboarding_completed boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id);

-- ============================================================
-- STUDENT PROFILES
-- ============================================================
create table public.student_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade unique,
  username text unique,
  school text,
  school_type text check (school_type in ('Grande ecole', 'Universite', 'OFPPT', 'Bootcamp', 'Autre')),
  city text check (city in ('Casablanca', 'Rabat', 'Marrakech', 'Tanger', 'Agadir', 'Fes', 'Meknes', 'Oujda', 'Autre')),
  graduation_year int,
  internship_type text check (internship_type in ('PFA', 'PFE', 'Observation', 'Stage professionnel')),
  domain text,
  level text check (level in ('Bac+2', 'Bac+3', 'Bac+4', 'Bac+5', 'Doctorat')),
  bio text,
  linkedin_url text,
  github_url text,
  portfolio_url text,
  cv_url text,
  cv_filename text,
  cv_uploaded_at timestamptz,
  is_visible boolean default true,
  profile_score int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.student_profiles enable row level security;

create policy "Student profiles are viewable by everyone"
  on public.student_profiles for select using (is_visible = true);

create policy "Users can insert their own student profile"
  on public.student_profiles for insert with check (
    auth.uid() = user_id
  );

create policy "Users can update their own student profile"
  on public.student_profiles for update using (
    auth.uid() = user_id
  );

-- ============================================================
-- SKILLS
-- ============================================================
create table public.student_skills (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.student_profiles(id) on delete cascade,
  skill text not null,
  category text check (category in ('language', 'framework', 'cloud', 'devops', 'tool', 'database', 'other'))
);

alter table public.student_skills enable row level security;

create policy "Skills are viewable by everyone"
  on public.student_skills for select using (true);

create policy "Users can manage their own skills"
  on public.student_skills for all using (
    exists (
      select 1 from public.student_profiles
      where id = student_id and user_id = auth.uid()
    )
  );

-- ============================================================
-- TECH PREFERENCES
-- ============================================================
create table public.tech_preferences (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.student_profiles(id) on delete cascade,
  tech text not null
);

alter table public.tech_preferences enable row level security;

create policy "Tech preferences are viewable by everyone"
  on public.tech_preferences for select using (true);

create policy "Users can manage their own tech preferences"
  on public.tech_preferences for all using (
    exists (
      select 1 from public.student_profiles
      where id = student_id and user_id = auth.uid()
    )
  );

-- ============================================================
-- PROJECTS
-- ============================================================
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.student_profiles(id) on delete cascade,
  title text not null,
  description text,
  type text check (type in ('PFA', 'PFE', 'Personnel', 'Open Source')),
  github_url text,
  demo_url text,
  techs text[] default '{}',
  created_at timestamptz default now()
);

alter table public.projects enable row level security;

create policy "Projects are viewable by everyone"
  on public.projects for select using (true);

create policy "Users can manage their own projects"
  on public.projects for all using (
    exists (
      select 1 from public.student_profiles
      where id = student_id and user_id = auth.uid()
    )
  );

-- ============================================================
-- FUNCTION: auto-create profile on signup
-- ============================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- FUNCTION: compute profile score
-- ============================================================
create or replace function public.compute_profile_score(p_student_id uuid)
returns int as $$
declare
  score int := 0;
  sp public.student_profiles%rowtype;
  skill_count int;
  project_count int;
begin
  select * into sp from public.student_profiles where id = p_student_id;
  if sp.full_name is not null then score := score + 10; end if;
  if sp.school is not null then score := score + 10; end if;
  if sp.city is not null then score := score + 5; end if;
  if sp.bio is not null then score := score + 10; end if;
  if sp.github_url is not null then score := score + 15; end if;
  if sp.linkedin_url is not null then score := score + 10; end if;
  if sp.cv_url is not null then score := score + 20; end if;
  select count(*) into skill_count from public.student_skills where student_id = p_student_id;
  if skill_count >= 3 then score := score + 10; end if;
  select count(*) into project_count from public.projects where student_id = p_student_id;
  if project_count >= 1 then score := score + 10; end if;
  return least(score, 100);
end;
$$ language plpgsql;

-- ============================================================
-- STORAGE BUCKET for CVs
-- ============================================================
insert into storage.buckets (id, name, public) values ('cvs', 'cvs', false);

create policy "Authenticated users can upload CVs"
  on storage.objects for insert with check (
    bucket_id = 'cvs' and auth.role() = 'authenticated'
  );

create policy "Users can view their own CV"
  on storage.objects for select using (
    bucket_id = 'cvs' and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can delete their own CV"
  on storage.objects for delete using (
    bucket_id = 'cvs' and auth.uid()::text = (storage.foldername(name))[1]
  );
