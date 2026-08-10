import React from 'react';
const SoftwareEngineerTemplate = ({ data }) => (
  <div className="font-mono p-8 bg-gray-50 max-w-[210mm] mx-auto min-h-[297mm] text-gray-800 text-sm border border-gray-200">
    <div className="mb-6 border-b-2 border-indigo-500 pb-4">
      <h1 className="text-3xl font-bold text-gray-900">const developer = "{data.personalInfo?.fullName || 'Your Name'}";</h1>
      <div className="mt-2 text-indigo-700">
        <a href={`mailto:${data.personalInfo?.email}`} className="mr-4 hover:underline">{data.personalInfo?.email}</a>
        <a href={data.personalInfo?.github} className="mr-4 hover:underline">{data.personalInfo?.github}</a>
        <a href={data.personalInfo?.linkedin} className="hover:underline">{data.personalInfo?.linkedin}</a>
      </div>
    </div>
    
    <div className="space-y-6">
        {data.skills?.technical && (
        <section>
            <h2 className="font-bold text-lg text-indigo-600 mb-2">{'<TechnicalSkills />'}</h2>
            <p className="whitespace-pre-wrap bg-gray-200 p-3 rounded">{data.skills.technical}</p>
        </section>
        )}
        {data.experience?.length > 0 && (
        <section>
            <h2 className="font-bold text-lg text-indigo-600 mb-3">{'<Experience />'}</h2>
            {data.experience.map((exp, i) => (
            <div key={exp.id || i} className="mb-4 pl-4 border-l-2 border-indigo-200">
                <div className="flex justify-between font-bold">
                <span>{exp.jobTitle} @ {exp.company}</span>
                <span className="text-gray-500">{exp.startDate} - {exp.endDate}</span>
                </div>
                <p className="mt-2 whitespace-pre-wrap">{exp.description}</p>
            </div>
            ))}
        </section>
        )}
        {data.projects?.length > 0 && (
        <section>
            <h2 className="font-bold text-lg text-indigo-600 mb-3">{'<Projects />'}</h2>
            <div className="grid grid-cols-2 gap-4 print-block">
                {data.projects.map((proj, i) => (
                <div key={proj.id || i} className="bg-white p-4 rounded border border-gray-200">
                    <div className="font-bold text-md">{proj.title}</div>
                    <div className="text-xs text-indigo-500 mb-2">{proj.technologies}</div>
                    <p className="text-sm">{proj.description}</p>
                </div>
                ))}
            </div>
        </section>
        )}
        {data.education?.length > 0 && (
        <section>
            <h2 className="font-bold text-lg text-indigo-600 mb-3">{'<Education />'}</h2>
            {data.education.map((edu, i) => (
            <div key={edu.id || i} className="mb-3 pl-4 border-l-2 border-indigo-200">
                <div className="flex justify-between font-bold">
                <span>{edu.degree} @ {edu.institution}</span>
                <span className="text-gray-500">{edu.startDate} - {edu.endDate}</span>
                </div>
                {edu.score && <div className="text-sm mt-1">Score: {edu.score}</div>}
            </div>
            ))}
        </section>
        )}
        {data.certifications?.length > 0 && (
        <section>
            <h2 className="font-bold text-lg text-indigo-600 mb-3">{'<Certifications />'}</h2>
            <div className="pl-4 border-l-2 border-indigo-200 space-y-2">
            {data.certifications.map((cert, i) => (
                <div key={cert.id || i}>
                    <div className="font-bold">{cert.name} <span className="font-normal text-gray-500">| {cert.issuer}</span></div>
                    <div className="text-gray-500">{cert.date}</div>
                </div>
            ))}
            </div>
        </section>
        )}
        {data.achievements?.length > 0 && (
        <section>
            <h2 className="font-bold text-lg text-indigo-600 mb-3">{'<Achievements />'}</h2>
            <ul className="list-disc list-inside bg-gray-200 p-3 rounded space-y-1">
            {data.achievements.map((ach, i) => (
                <li key={ach.id || i}>{ach.description}</li>
            ))}
            </ul>
        </section>
        )}
        {data.languages && (
        <section>
            <h2 className="font-bold text-lg text-indigo-600 mb-2">{'<Languages />'}</h2>
            <p className="whitespace-pre-wrap bg-gray-200 p-3 rounded">{data.languages}</p>
        </section>
        )}
    </div>
  </div>
);
export default SoftwareEngineerTemplate;