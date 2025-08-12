
import React from 'react';
async function fetchJob(id:string){
  const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + `/api/jobs/${id}`, { cache: 'no-store' });
  return res.json();
}
export default async function JobDetail({ params }: { params: { id: string } }){
  const { job, error } = await fetchJob(params.id);
  if (error) return <main className="container section"><p>Job sa nenašiel.</p></main>;
  return (
    <main className="container section">
      <h1 style={{color:'var(--accent)'}}>{job.title}</h1>
      <p className="muted">{job.location || '—'}</p>
      <div className="card" style={{marginTop:12}}><p>{job.description}</p></div>
      <div className="card" style={{marginTop:16}}><h3>Rýchla žiadosť (DEMO)</h3><button className="btn solid">Poslať životopis</button></div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
        '@context':'https://schema.org','@type':'JobPosting','title':job.title,'description':job.description,
        'employmentType': job.employment_type || 'FULL_TIME',
        'hiringOrganization':{'@type':'Organization','name':'TalentPort Employer'},
        'jobLocation':{'@type':'Place','address':{'@type':'PostalAddress','addressLocality':job.location||'','addressCountry':'SK'}},
        'baseSalary':{'@type':'MonetaryAmount','currency': job.currency || 'EUR','value':{'@type':'QuantitativeValue','minValue': job.salary_min || 0,'maxValue': job.salary_max || 0,'unitText':'MONTH'}}
      })}}/>
    </main>
  );
}
