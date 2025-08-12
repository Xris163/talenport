create extension if not exists pg_trgm;
create index if not exists idx_jobs_title_trgm on public.jobs using gin (title gin_trgm_ops);
create index if not exists idx_jobs_desc_trgm on public.jobs using gin (description gin_trgm_ops);
create index if not exists idx_jobs_location_trgm on public.jobs using gin (location gin_trgm_ops);
create or replace function public.search_jobs(q text) returns setof public.jobs language sql stable as $$
  select * from public.jobs
  where status = 'published'
    and (title ilike '%'||q||'%' or location ilike '%'||q||'%' or similarity(title,q)>0.2 or similarity(description,q)>0.2)
  order by greatest(similarity(title,q), similarity(description,q)) desc
  limit 50;
$$;
create policy if not exists "resumes owner read" on storage.objects for select to authenticated using ( bucket_id = 'resumes' and (auth.uid()::text = split_part(name,'/',1)) );
create policy if not exists "resumes owner write" on storage.objects for insert to authenticated with check ( bucket_id = 'resumes' and (auth.uid()::text = split_part(name,'/',1)) );
create policy if not exists "resumes owner update" on storage.objects for update to authenticated using ( bucket_id = 'resumes' and (auth.uid()::text = split_part(name,'/',1)) ) with check ( bucket_id = 'resumes' and (auth.uid()::text = split_part(name,'/',1)) );
create policy if not exists "resumes owner delete" on storage.objects for delete to authenticated using ( bucket_id = 'resumes' and (auth.uid()::text = split_part(name,'/',1)) );
create policy if not exists "employer can read applicant cv" on storage.objects for select to authenticated using ( bucket_id = 'resumes' and exists ( select 1 from public.applications a join public.jobs j on j.id = a.job_id join public.companies c on c.id = j.company_id where a.cv_url like '%' || storage.folder(name) || '%' and c.owner_user_id = auth.uid() ) );
-- NOTE: create bucket 'resumes' (private) in Supabase Storage dashboard.
