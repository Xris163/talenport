-- Create private bucket 'resumes' (run in Supabase SQL editor)
-- If bucket exists, this will do nothing in UI; otherwise create via dashboard.
-- RLS policies for Storage objects (works with authenticated users + employer access)
create policy if not exists "resumes owner read" on storage.objects for select to authenticated using (
  bucket_id = 'resumes' and (auth.uid()::text = split_part(name, '/', 1))
);
create policy if not exists "resumes owner write" on storage.objects for insert to authenticated with check (
  bucket_id = 'resumes' and (auth.uid()::text = split_part(name, '/', 1))
);
create policy if not exists "resumes owner update" on storage.objects for update to authenticated using (
  bucket_id = 'resumes' and (auth.uid()::text = split_part(name, '/', 1))
) with check (
  bucket_id = 'resumes' and (auth.uid()::text = split_part(name, '/', 1))
);
create policy if not exists "resumes owner delete" on storage.objects for delete to authenticated using (
  bucket_id = 'resumes' and (auth.uid()::text = split_part(name, '/', 1))
);
-- Employer (company owner) can read applicant CVs related to their jobs
create policy if not exists "employer can read applicant cv" on storage.objects for select to authenticated using (
  bucket_id = 'resumes' and exists (
    select 1
    from public.applications a
    join public.jobs j on j.id = a.job_id
    join public.companies c on c.id = j.company_id
    where a.cv_url like '%' || storage.folder(name) || '%'
      and c.owner_user_id = auth.uid()
  )
);
