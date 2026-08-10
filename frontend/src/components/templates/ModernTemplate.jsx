import React from 'react';
const ModernTemplate = ({ data }) => (
  <div className="font-sans p-8 bg-white max-w-[210mm] mx-auto min-h-[297mm] text-gray-800 leading-relaxed border border-gray-200">
    <div className="flex items-end justify-between mb-8 pb-4 border-b-4 border-indigo-600">
      <div>
        <h1 className="text-5xl font-black text-gray-900 tracking-tight">{data.personalInfo?.fullName || 'Your Name'}</h1>
        <p className="text-md text-indigo-600 font-bold mt-1 tracking-widest uppercase">Professional Resume</p>
      </div>
      <div className="text-right text-sm text-gray-500 font-medium space-y-0.5">
        <div>{data.personalInfo?.email}</div>
        <div>{data.personalInfo?.phone}</div>
        <div>{data.personalInfo?.location}</div>
        {data.personalInfo?.linkedin && <div>{data.personalInfo?.linkedin}</div>}
      </div>
    </div>
    
    <div className="grid grid-cols-3 gap-8 print-block">
      <div className="col-span-2 space-y-6">
        {data.summary && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center"><span className="w-6 h-0.5 bg-indigo-600 mr-3"></span>Summary</h2>
            <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">{data.summary}</p>
          </section>
        )}
        {data.experience?.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center"><span className="w-6 h-0.5 bg-indigo-600 mr-3"></span>Experience</h2>
            {data.experience.map((exp, i) => (
              <div key={exp.id || i} className="mb-5 relative pl-4 border-l-2 border-gray-200">
                <div className="absolute w-2 h-2 bg-indigo-600 rounded-full -left-[5px] top-1.5"></div>
                <h3 className="text-md font-bold text-gray-900">{exp.jobTitle}</h3>
                <div className="text-sm font-semibold text-indigo-600 mb-1">{exp.company} | {exp.startDate} - {exp.endDate}</div>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{exp.description}</p>
              </div>
            ))}
          </section>
        )}
      </div>
      <div className="col-span-1 space-y-6">
        {data.skills?.technical && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-gray-100 pb-2">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.technical.split(',').map((skill, i) => (
                <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded">{skill.trim()}</span>
              ))}
            </div>
          </section>
        )}
        {data.education?.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-gray-100 pb-2">Education</h2>
            {data.education.map((edu, i) => (
              <div key={edu.id || i} className="mb-3">
                <h3 className="text-sm font-bold text-gray-900">{edu.degree}</h3>
                <div className="text-xs text-indigo-600 font-medium mb-1">{edu.institution}</div>
                <div className="text-xs text-gray-500">{edu.startDate} - {edu.endDate}</div>
              </div>
            ))}
          </section>
        )}
        {data.languages && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-gray-100 pb-2">Languages</h2>
            <p className="text-sm text-gray-700">{data.languages}</p>
          </section>
        )}
      </div>
    </div>
    
    {(data.projects?.length > 0 || data.certifications?.length > 0 || data.achievements?.length > 0) && (
      <div className="mt-6 border-t-2 border-gray-100 pt-6 grid grid-cols-2 gap-8 print-block">
        {data.projects?.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center"><span className="w-6 h-0.5 bg-indigo-600 mr-3"></span>Projects</h2>
            {data.projects.map((proj, i) => (
              <div key={proj.id || i} className="mb-4">
                <h3 className="text-md font-bold text-gray-900">{proj.title}</h3>
                <div className="text-xs text-indigo-600 font-medium mb-1">{proj.technologies} {proj.link && `| ${proj.link}`}</div>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{proj.description}</p>
              </div>
            ))}
          </section>
        )}
        <div>
          {data.certifications?.length > 0 && (
            <section className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-gray-100 pb-2">Certifications</h2>
              {data.certifications.map((cert, i) => (
                <div key={cert.id || i} className="mb-2">
                  <div className="text-sm font-bold text-gray-900">{cert.name}</div>
                  <div className="text-xs text-gray-600">{cert.issuer} • {cert.date}</div>
                </div>
              ))}
            </section>
          )}
          {data.achievements?.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-gray-100 pb-2">Achievements</h2>
              <ul className="list-disc list-inside text-sm text-gray-700">
                {data.achievements.map((ach, i) => (
                  <li key={ach.id || i} className="mb-1">{ach.description}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    )}
  </div>
);
export default ModernTemplate;