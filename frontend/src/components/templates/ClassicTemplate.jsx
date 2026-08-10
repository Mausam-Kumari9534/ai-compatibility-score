import React from 'react';
const ClassicTemplate = ({ data }) => (
  <div className="font-serif p-8 bg-white max-w-[210mm] mx-auto min-h-[297mm] text-gray-900 leading-tight border border-gray-200">
    <div className="text-center mb-6">
      <h1 className="text-4xl font-bold mb-2 uppercase">{data.personalInfo?.fullName || 'Your Name'}</h1>
      <p className="text-sm">
        {data.personalInfo?.email} • {data.personalInfo?.phone} • {data.personalInfo?.location}
        {data.personalInfo?.linkedin && <span> • {data.personalInfo?.linkedin}</span>}
      </p>
    </div>
    
    {data.summary && (
      <div className="mb-4">
        <h2 className="text-lg font-bold border-b-2 border-gray-900 mb-2 uppercase">Professional Summary</h2>
        <p className="text-sm text-justify whitespace-pre-wrap">{data.summary}</p>
      </div>
    )}

    {data.experience?.length > 0 && (
      <div className="mb-4">
        <h2 className="text-lg font-bold border-b-2 border-gray-900 mb-2 uppercase">Experience</h2>
        {data.experience.map((exp, i) => (
          <div key={exp.id || i} className="mb-3">
            <div className="flex justify-between font-bold text-sm">
              <span>{exp.jobTitle} - {exp.company}</span>
              <span>{exp.startDate} - {exp.endDate}</span>
            </div>
            <div className="text-sm italic mb-1">{exp.location}</div>
            <p className="text-sm whitespace-pre-wrap">{exp.description}</p>
          </div>
        ))}
      </div>
    )}

    {data.education?.length > 0 && (
      <div className="mb-4">
        <h2 className="text-lg font-bold border-b-2 border-gray-900 mb-2 uppercase">Education</h2>
        {data.education.map((edu, i) => (
          <div key={edu.id || i} className="mb-2">
            <div className="flex justify-between font-bold text-sm">
              <span>{edu.degree}</span>
              <span>{edu.startDate} - {edu.endDate}</span>
            </div>
            <div className="text-sm">{edu.institution} {edu.score ? `• GPA/Score: ${edu.score}` : ''}</div>
          </div>
        ))}
      </div>
    )}

    {data.projects?.length > 0 && (
      <div className="mb-4">
        <h2 className="text-lg font-bold border-b-2 border-gray-900 mb-2 uppercase">Projects</h2>
        {data.projects.map((proj, i) => (
          <div key={proj.id || i} className="mb-2">
            <div className="flex justify-between font-bold text-sm">
              <span>{proj.title}</span>
              {proj.link && <span className="font-normal text-blue-600">{proj.link}</span>}
            </div>
            <div className="text-sm italic mb-1">{proj.technologies}</div>
            <p className="text-sm whitespace-pre-wrap">{proj.description}</p>
          </div>
        ))}
      </div>
    )}

    {data.skills?.technical && (
      <div className="mb-4">
        <h2 className="text-lg font-bold border-b-2 border-gray-900 mb-2 uppercase">Skills</h2>
        <p className="text-sm"><span className="font-bold">Technical:</span> {data.skills.technical}</p>
        {data.skills?.soft && <p className="text-sm"><span className="font-bold">Soft Skills:</span> {data.skills.soft}</p>}
      </div>
    )}

    {data.certifications?.length > 0 && (
      <div className="mb-4">
        <h2 className="text-lg font-bold border-b-2 border-gray-900 mb-2 uppercase">Certifications</h2>
        {data.certifications.map((cert, i) => (
          <div key={cert.id || i} className="mb-2">
            <div className="flex justify-between font-bold text-sm">
              <span>{cert.name}</span>
              <span>{cert.date}</span>
            </div>
            <div className="text-sm">{cert.issuer}</div>
          </div>
        ))}
      </div>
    )}

    {data.achievements?.length > 0 && (
      <div className="mb-4">
        <h2 className="text-lg font-bold border-b-2 border-gray-900 mb-2 uppercase">Achievements</h2>
        <ul className="list-disc list-inside text-sm">
          {data.achievements.map((ach, i) => (
            <li key={ach.id || i} className="mb-1">{ach.description}</li>
          ))}
        </ul>
      </div>
    )}

    {data.languages && (
      <div className="mb-4">
        <h2 className="text-lg font-bold border-b-2 border-gray-900 mb-2 uppercase">Languages</h2>
        <p className="text-sm">{data.languages}</p>
      </div>
    )}
  </div>
);
export default ClassicTemplate;