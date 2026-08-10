import React from 'react';
const MinimalTemplate = ({ data }) => (
  <div className="font-sans p-10 bg-white max-w-[210mm] mx-auto min-h-[297mm] text-gray-800 leading-snug border border-gray-200">
    <div className="mb-8">
      <h1 className="text-3xl font-light text-gray-900 tracking-wider uppercase mb-2">{data.personalInfo?.fullName || 'Your Name'}</h1>
      <div className="text-xs text-gray-500 uppercase tracking-widest flex gap-3 flex-wrap">
        <span>{data.personalInfo?.email}</span>
        {data.personalInfo?.phone && <span>| {data.personalInfo?.phone}</span>}
        {data.personalInfo?.location && <span>| {data.personalInfo?.location}</span>}
        {data.personalInfo?.linkedin && <span>| {data.personalInfo?.linkedin}</span>}
      </div>
    </div>
    
    {data.summary && (
      <div className="mb-6">
        <p className="text-sm text-gray-600 whitespace-pre-wrap">{data.summary}</p>
      </div>
    )}

    {data.experience?.length > 0 && (
      <div className="mb-8">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Experience</h2>
        {data.experience.map((exp, i) => (
          <div key={exp.id || i} className="mb-5 flex gap-6">
            <div className="w-1/4 shrink-0 text-xs text-gray-500 mt-1">{exp.startDate} — {exp.endDate}</div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">{exp.jobTitle}</h3>
              <div className="text-sm text-gray-600 mb-2">{exp.company}</div>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{exp.description}</p>
            </div>
          </div>
        ))}
      </div>
    )}

    {data.education?.length > 0 && (
      <div className="mb-8">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Education</h2>
        {data.education.map((edu, i) => (
          <div key={edu.id || i} className="mb-3 flex gap-6">
            <div className="w-1/4 shrink-0 text-xs text-gray-500 mt-1">{edu.startDate} — {edu.endDate}</div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">{edu.degree}</h3>
              <div className="text-sm text-gray-600">{edu.institution}</div>
            </div>
          </div>
        ))}
      </div>
    )}

    {data.projects?.length > 0 && (
      <div className="mb-8">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Projects</h2>
        {data.projects.map((proj, i) => (
          <div key={proj.id || i} className="mb-4">
            <h3 className="text-sm font-bold text-gray-900">{proj.title} {proj.link && <span className="text-xs font-normal text-gray-500 ml-2">({proj.link})</span>}</h3>
            <div className="text-xs text-gray-500 mb-1">{proj.technologies}</div>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{proj.description}</p>
          </div>
        ))}
      </div>
    )}

    {data.skills?.technical && (
      <div className="mb-8 flex gap-6">
        <div className="w-1/4 shrink-0 text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Skills</div>
        <div className="text-sm text-gray-700">{data.skills.technical} {data.skills.soft && `• ${data.skills.soft}`}</div>
      </div>
    )}

    {data.certifications?.length > 0 && (
      <div className="mb-8 flex gap-6">
        <div className="w-1/4 shrink-0 text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Certifications</div>
        <div className="space-y-2">
          {data.certifications.map((cert, i) => (
            <div key={cert.id || i}>
              <div className="text-sm font-bold text-gray-900">{cert.name}</div>
              <div className="text-xs text-gray-600">{cert.issuer} • {cert.date}</div>
            </div>
          ))}
        </div>
      </div>
    )}

    {data.achievements?.length > 0 && (
      <div className="mb-8 flex gap-6">
        <div className="w-1/4 shrink-0 text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Achievements</div>
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
          {data.achievements.map((ach, i) => (
            <li key={ach.id || i}>{ach.description}</li>
          ))}
        </ul>
      </div>
    )}

    {data.languages && (
      <div className="mb-8 flex gap-6">
        <div className="w-1/4 shrink-0 text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Languages</div>
        <div className="text-sm text-gray-700">{data.languages}</div>
      </div>
    )}
  </div>
);
export default MinimalTemplate;