create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "Users read own roles" on public.user_roles for select to authenticated using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id = _user_id and role = _role) $$;

create or replace function public.claim_admin()
returns boolean language plpgsql security definer set search_path = public
as $$
declare _email text; _confirmed timestamptz;
begin
  select email, email_confirmed_at into _email, _confirmed from auth.users where id = auth.uid();
  if lower(_email) = 'editsofmkk@gmail.com' and _confirmed is not null then
    insert into public.user_roles(user_id, role) values (auth.uid(), 'admin') on conflict do nothing;
    return true;
  end if;
  return public.has_role(auth.uid(), 'admin');
end $$;
revoke execute on function public.claim_admin() from anon, public;
grant execute on function public.claim_admin() to authenticated;

create or replace function public.touch_updated_at() returns trigger language plpgsql set search_path = public
as $$ begin new.updated_at = now(); return new; end $$;

create table public.site_content (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
grant select on public.site_content to anon, authenticated;
grant insert, update, delete on public.site_content to authenticated;
grant all on public.site_content to service_role;
alter table public.site_content enable row level security;
create policy "Anyone reads content" on public.site_content for select using (true);
create policy "Admins write content" on public.site_content for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create trigger site_content_touch before update on public.site_content for each row execute function public.touch_updated_at();

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  client_name text,
  category text,
  description text,
  thumbnail_url text,
  video_url text,
  platform text,
  views text,
  project_date date,
  featured boolean not null default true,
  published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.projects to anon, authenticated;
grant insert, update, delete on public.projects to authenticated;
grant all on public.projects to service_role;
alter table public.projects enable row level security;
create policy "Public reads published projects" on public.projects for select using (published = true);
create policy "Admins read all projects" on public.projects for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins write projects" on public.projects for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create trigger projects_touch before update on public.projects for each row execute function public.touch_updated_at();

create table public.contact_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  company text,
  service text,
  budget text,
  message text not null,
  status text not null default 'new',
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);
grant insert on public.contact_leads to anon, authenticated;
grant select, update, delete on public.contact_leads to authenticated;
grant all on public.contact_leads to service_role;
alter table public.contact_leads enable row level security;
create policy "Anyone submits leads" on public.contact_leads for insert to anon, authenticated
  with check (status = 'new' and is_read = false and length(name) between 1 and 120 and length(email) between 3 and 200 and length(message) between 1 and 5000);
create policy "Admins read leads" on public.contact_leads for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins update leads" on public.contact_leads for update to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins delete leads" on public.contact_leads for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

insert into public.site_content(key, value) values
('hero', '{"small_heading":"Hello, I''m","name_line1":"Mohith","name_line2":"Kumar","role":"Video Editor & Reels Creator","description":"I create high-retention reels and short-form videos that help creators, brands and businesses grow through better storytelling, editing and content strategy.","image_url":"","background_text":"EDITOR","tagline":"Turning ideas into scroll-stopping videos that get results.","stats":[{"value":"3+","label1":"Years","label2":"Experience"},{"value":"150+","label1":"Projects","label2":"Completed"},{"value":"50+","label1":"Happy","label2":"Clients"}],"primary_cta_text":"Let''s Create Your Reels","primary_cta_link":"/contact","secondary_cta_text":"Watch Showreel","secondary_cta_link":"/work"}'),
('contact', '{"email":"editsofmkk@gmail.com","alt_email":"boddulamohithkumar@gmail.com","phone":"+91 79959 90130","whatsapp":"+917995990130","location":"","business_hours":""}'),
('socials', '{"items":[{"platform":"Instagram","url":"https://www.instagram.com/mohithh_kumarrr/","active":true},{"platform":"Facebook","url":"https://www.facebook.com/mohithkumar.boddula/","active":true}]}');

insert into public.projects(title, views, sort_order, thumbnail_url) values
('Fitness Coach Reel','1.2M',1,''),('Travel Series','2.4M',2,''),('Restaurant Promo','1.1M',3,''),('Skincare Ad','900K',4,''),('Podcast Shorts','850K',5,'');

create policy "Admins read media" on storage.objects for select to authenticated using (bucket_id = 'media' and public.has_role(auth.uid(), 'admin'));
create policy "Admins upload media" on storage.objects for insert to authenticated with check (bucket_id = 'media' and public.has_role(auth.uid(), 'admin'));
create policy "Admins update media" on storage.objects for update to authenticated using (bucket_id = 'media' and public.has_role(auth.uid(), 'admin'));
create policy "Admins delete media" on storage.objects for delete to authenticated using (bucket_id = 'media' and public.has_role(auth.uid(), 'admin'));