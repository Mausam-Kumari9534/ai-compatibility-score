import React from 'react';
const ProfessionalTemplate = ({ data }) => (
  <div className="font-serif p-10 bg-white max-w-[210mm] mx-auto min-h-[297mm] text-gray-900 leading-relaxed border border-gray-200">
    <div className="text-center mb-8 border-b-2 border-gray-800 pb-6">
      <h1 className="text-4xl font-bold tracking-tight mb-3">{data.personalInfo?.fullName || 'Your Name'}</h1>
      <div className="text-sm text-gray-600 flex justify-center gap-4 flex-wrap">
        <span>{data.personalInfo?.email}</span>
        <span>•</span>
        <span>{data.personalInfo?.phone}</span>
        <span>•</span>
        <span>{data.personalInfo?.location}</span>
      </div>
    </div>
    
    <div className="space-y-6">
        {data.summary && (
        <section>
            <h2 className="text-lg font-bold uppercase tracking-widest border-b border-gray-300 mb-3">Professional Profile</h2>
            <p className="text-sm whitespace-pre-wrap">{data.summary}</p>
        </section>
        )}
        {data.experience?.length > 0 && (
        <section>
            <h2 className="text-lg font-bold uppercase tracking-widest border-b border-gray-300 mb-4">Professional Experience</h2>
            {data.experience.map((exp, i) => (
            <div key={exp.id || i} className="mb-4">
                <div className="flex justify-between font-bold text-md">
                <span>{exp.jobTitle}, {exp.company}</span>
                <span>{exp.startDate} - {exp.endDate}</span>
                </div>
                <div className="text-sm italic mb-2">{exp.location}</div>
                <p className="text-sm whitespace-pre-wrap">{exp.description}</p>
            </div>
            ))}
        </section>
        )}
        {data.education?.length > 0 && (
        <section>
            <h2 className="text-lg font-bold uppercase tracking-widest border-b border-gray-300 mb-4">Education</h2>
            {data.education.map((edu, i) => (
            <div key={edu.id || i} className="mb-3">
                <div className="flex justify-between font-bold text-md">
                <span>{edu.degree}</span>
                <span>{edu.startDate} - {edu.endDate}</span>
                </div>
                <div className="text-sm">{edu.institution} {edu.score && `• ${edu.score}`}</div>
            </div>
            ))}
        </section>
        )}
        
        {data.projects?.length > 0 && (
        <section>
            <h2 className="text-lg font-bold uppercase tracking-widest border-b border-gray-300 mb-4">Projects</h2>
            {data.projects.map((proj, i) => (
            <div key={proj.id || i} className="mb-4">
                <div className="flex justify-between font-bold text-md">
                <span>{proj.title}</span>
                {proj.link && <span className="text-sm font-normal text-blue-600">{proj.link}</span>}
                </div>
                <div className="text-sm italic mb-2">{proj.technologies}</div>
                <p className="text-sm whitespace-pre-wrap">{proj.description}</p>
            </div>
            ))}
        </section>
        )}
        
        {data.skills?.technical && (
        <section>
            <h2 className="text-lg font-bold uppercase tracking-widest border-b border-gray-300 mb-3">Skills</h2>
            <p className="text-sm"><span className="font-bold">Technical:</span> {data.skills.technical}</p>
            {data.skills?.soft && <p className="text-sm mt-1"><span className="font-bold">Soft Skills:</span> {data.skills.soft}</p>}
        </section>
        )}

        {data.certifications?.length > 0 && (
        <section>
            <h2 className="text-lg font-bold uppercase tracking-widest border-b border-gray-300 mb-3">Certifications</h2>
            <div className="space-y-2">
            {data.certifications.map((cert, i) => (
                <div key={cert.id || i}>
                <div className="flex justify-between font-bold text-sm">
                    <span>{cert.name}</span>
                    <span>{cert.date}</span>
                </div>
                <div className="text-sm text-gray-700">{cert.issuer}</div>
                </div>
            ))}
            </div>
        </section>
        )}

        {data.achievements?.length > 0 && (
        <section>
            <h2 className="text-lg font-bold uppercase tracking-widest border-b border-gray-300 mb-3">Achievements</h2>
            <ul className="list-disc list-inside text-sm space-y-1">
            {data.achievements.map((ach, i) => (
                <li key={ach.id || i}>{ach.description}</li>
            ))}
            </ul>
        </section>
        )}

        {data.languages && (
        <section>
            <h2 className="text-lg font-bold uppercase tracking-widest border-b border-gray-300 mb-3">Languages</h2>
            <p className="text-sm">{data.languages}</p>
        </section>
        )}
    </div>
  </div>
);
export default ProfessionalTemplate;