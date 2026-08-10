import React, { useState } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { GripVertical, Trash2, Plus, Sparkles, Loader2, Save } from 'lucide-react';

export default function ResumeEditor({ data, setData, onSave }) {
    const [rewriting, setRewriting] = useState(null);

    const handleChange = (section, field, value) => {
        setData(prev => ({
            ...prev,
            [section]: { ...prev[section], [field]: value }
        }));
    };

    const handleArrayChange = (section, index, field, value) => {
        const newArray = [...data[section]];
        newArray[index][field] = value;
        setData(prev => ({ ...prev, [section]: newArray }));
    };

    const addArrayItem = (section, emptyItem) => {
        setData(prev => ({
            ...prev,
            [section]: [...(prev[section] || []), { ...emptyItem, id: Date.now().toString() }]
        }));
    };

    const removeArrayItem = (section, index) => {
        const newArray = [...data[section]];
        newArray.splice(index, 1);
        setData(prev => ({ ...prev, [section]: newArray }));
    };

    const handleDragEnd = (result, section) => {
        if (!result.destination) return;
        const items = Array.from(data[section]);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setData(prev => ({ ...prev, [section]: items }));
    };

    const handleAiRewrite = async (text, setter, type) => {
        if (!text) return;
        setRewriting(type);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('/api/resume-builder/rewrite', { text, type }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setter(res.data.rewritten);
        } catch (error) {
            console.error(error);
            alert('AI Rewrite failed.');
        } finally {
            setRewriting(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Personal Info */}
            <div className="bg-white p-5 rounded-xl border shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                    <input className="border p-2 rounded text-sm w-full" placeholder="Full Name" value={data.personalInfo.fullName} onChange={e => handleChange('personalInfo', 'fullName', e.target.value)} />
                    <input className="border p-2 rounded text-sm w-full" placeholder="Email" value={data.personalInfo.email} onChange={e => handleChange('personalInfo', 'email', e.target.value)} />
                    <input className="border p-2 rounded text-sm w-full" placeholder="Phone" value={data.personalInfo.phone} onChange={e => handleChange('personalInfo', 'phone', e.target.value)} />
                    <input className="border p-2 rounded text-sm w-full" placeholder="Location" value={data.personalInfo.location} onChange={e => handleChange('personalInfo', 'location', e.target.value)} />
                </div>
            </div>

            {/* Summary */}
            <div className="bg-white p-5 rounded-xl border shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-900">Professional Summary</h3>
                    <button onClick={() => handleAiRewrite(data.summary, (val) => setData(p => ({...p, summary: val})), 'summary')} className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg flex items-center font-medium hover:bg-indigo-100">
                        {rewriting === 'summary' ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Sparkles className="w-3 h-3 mr-1" />} AI Rewrite
                    </button>
                </div>
                <textarea rows="4" className="border p-3 rounded text-sm w-full" placeholder="Write a short summary..." value={data.summary} onChange={e => setData(p => ({...p, summary: e.target.value}))}></textarea>
            </div>

            {/* Experience (Drag and Drop) */}
            <div className="bg-white p-5 rounded-xl border shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">Experience</h3>
                <DragDropContext onDragEnd={(res) => handleDragEnd(res, 'experience')}>
                    <Droppable droppableId="experienceList">
                        {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                                {data.experience?.map((exp, index) => (
                                    <Draggable key={exp.id} draggableId={exp.id} index={index}>
                                        {(provided) => (
                                            <div ref={provided.innerRef} {...provided.draggableProps} className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex gap-3">
                                                <div {...provided.dragHandleProps} className="pt-2 text-gray-400 hover:text-gray-600 cursor-grab"><GripVertical className="w-5 h-5" /></div>
                                                <div className="flex-1 space-y-3">
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <input className="border p-2 rounded text-sm w-full" placeholder="Job Title" value={exp.jobTitle} onChange={e => handleArrayChange('experience', index, 'jobTitle', e.target.value)} />
                                                        <input className="border p-2 rounded text-sm w-full" placeholder="Company" value={exp.company} onChange={e => handleArrayChange('experience', index, 'company', e.target.value)} />
                                                    </div>
                                                    <textarea rows="3" className="border p-3 rounded text-sm w-full" placeholder="Job Description (bullet points)" value={exp.description} onChange={e => handleArrayChange('experience', index, 'description', e.target.value)}></textarea>
                                                    <div className="flex justify-between items-center">
                                                        <button onClick={() => handleAiRewrite(exp.description, (val) => handleArrayChange('experience', index, 'description', val), 'experience')} className="text-xs text-indigo-600 flex items-center hover:underline">
                                                            {rewriting === 'experience' ? 'Rewriting...' : <><Sparkles className="w-3 h-3 mr-1" /> AI Enhance</>}
                                                        </button>
                                                        <button onClick={() => removeArrayItem('experience', index)} className="text-xs text-rose-500 flex items-center hover:underline"><Trash2 className="w-3 h-3 mr-1" /> Remove</button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
                <button onClick={() => addArrayItem('experience', { jobTitle:'', company:'', description:'' })} className="mt-4 w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 flex items-center justify-center"><Plus className="w-4 h-4 mr-2" /> Add Experience</button>
            </div>
            
            {/* Skills */}
            <div className="bg-white p-5 rounded-xl border shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">Skills</h3>
                <div className="space-y-3">
                    <textarea rows="2" className="border p-3 rounded text-sm w-full" placeholder="Technical (e.g. React, Node.js, Python...)" value={data.skills?.technical || ''} onChange={e => handleChange('skills', 'technical', e.target.value)}></textarea>
                    <textarea rows="2" className="border p-3 rounded text-sm w-full" placeholder="Soft Skills (e.g. Leadership, Communication...)" value={data.skills?.soft || ''} onChange={e => handleChange('skills', 'soft', e.target.value)}></textarea>
                </div>
            </div>

            {/* Education */}
            <div className="bg-white p-5 rounded-xl border shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">Education</h3>
                <div className="space-y-4">
                    {data.education?.map((edu, index) => (
                        <div key={edu.id || index} className="border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <input className="border p-2 rounded text-sm w-full" placeholder="Degree" value={edu.degree || ''} onChange={e => handleArrayChange('education', index, 'degree', e.target.value)} />
                                <input className="border p-2 rounded text-sm w-full" placeholder="Institution" value={edu.institution || ''} onChange={e => handleArrayChange('education', index, 'institution', e.target.value)} />
                                <input className="border p-2 rounded text-sm w-full" placeholder="Start Date" value={edu.startDate || ''} onChange={e => handleArrayChange('education', index, 'startDate', e.target.value)} />
                                <input className="border p-2 rounded text-sm w-full" placeholder="End Date" value={edu.endDate || ''} onChange={e => handleArrayChange('education', index, 'endDate', e.target.value)} />
                            </div>
                            <div className="flex justify-end items-center">
                                <button onClick={() => removeArrayItem('education', index)} className="text-xs text-rose-500 flex items-center hover:underline"><Trash2 className="w-3 h-3 mr-1" /> Remove</button>
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={() => addArrayItem('education', { degree:'', institution:'', startDate:'', endDate:'' })} className="mt-4 w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 flex items-center justify-center"><Plus className="w-4 h-4 mr-2" /> Add Education</button>
            </div>

            {/* Projects */}
            <div className="bg-white p-5 rounded-xl border shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">Projects</h3>
                <div className="space-y-4">
                    {data.projects?.map((proj, index) => (
                        <div key={proj.id || index} className="border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <input className="border p-2 rounded text-sm w-full" placeholder="Project Title" value={proj.title || ''} onChange={e => handleArrayChange('projects', index, 'title', e.target.value)} />
                                <input className="border p-2 rounded text-sm w-full" placeholder="Link" value={proj.link || ''} onChange={e => handleArrayChange('projects', index, 'link', e.target.value)} />
                            </div>
                            <input className="border p-2 rounded text-sm w-full" placeholder="Technologies" value={proj.technologies || ''} onChange={e => handleArrayChange('projects', index, 'technologies', e.target.value)} />
                            <textarea rows="2" className="border p-3 rounded text-sm w-full" placeholder="Description" value={proj.description || ''} onChange={e => handleArrayChange('projects', index, 'description', e.target.value)}></textarea>
                            <div className="flex justify-end items-center">
                                <button onClick={() => removeArrayItem('projects', index)} className="text-xs text-rose-500 flex items-center hover:underline"><Trash2 className="w-3 h-3 mr-1" /> Remove</button>
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={() => addArrayItem('projects', { title:'', technologies:'', description:'', link:'' })} className="mt-4 w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 flex items-center justify-center"><Plus className="w-4 h-4 mr-2" /> Add Project</button>
            </div>

            {/* Certifications */}
            <div className="bg-white p-5 rounded-xl border shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">Certifications</h3>
                <div className="space-y-4">
                    {data.certifications?.map((cert, index) => (
                        <div key={cert.id || index} className="border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <input className="border p-2 rounded text-sm w-full" placeholder="Certification Name" value={cert.name || ''} onChange={e => handleArrayChange('certifications', index, 'name', e.target.value)} />
                                <input className="border p-2 rounded text-sm w-full" placeholder="Issuer" value={cert.issuer || ''} onChange={e => handleArrayChange('certifications', index, 'issuer', e.target.value)} />
                            </div>
                            <input className="border p-2 rounded text-sm w-full" placeholder="Date" value={cert.date || ''} onChange={e => handleArrayChange('certifications', index, 'date', e.target.value)} />
                            <div className="flex justify-end items-center">
                                <button onClick={() => removeArrayItem('certifications', index)} className="text-xs text-rose-500 flex items-center hover:underline"><Trash2 className="w-3 h-3 mr-1" /> Remove</button>
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={() => addArrayItem('certifications', { name:'', issuer:'', date:'' })} className="mt-4 w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 flex items-center justify-center"><Plus className="w-4 h-4 mr-2" /> Add Certification</button>
            </div>

            {/* Achievements */}
            <div className="bg-white p-5 rounded-xl border shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">Achievements</h3>
                <div className="space-y-4">
                    {data.achievements?.map((ach, index) => (
                        <div key={ach.id || index} className="border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-3">
                            <textarea rows="2" className="border p-3 rounded text-sm w-full" placeholder="Achievement description" value={ach.description || ''} onChange={e => handleArrayChange('achievements', index, 'description', e.target.value)}></textarea>
                            <div className="flex justify-end items-center">
                                <button onClick={() => removeArrayItem('achievements', index)} className="text-xs text-rose-500 flex items-center hover:underline"><Trash2 className="w-3 h-3 mr-1" /> Remove</button>
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={() => addArrayItem('achievements', { description:'' })} className="mt-4 w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 flex items-center justify-center"><Plus className="w-4 h-4 mr-2" /> Add Achievement</button>
            </div>

            {/* Languages */}
            <div className="bg-white p-5 rounded-xl border shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">Languages</h3>
                <textarea rows="2" className="border p-3 rounded text-sm w-full" placeholder="English, Spanish, etc." value={data.languages || ''} onChange={e => setData(prev => ({...prev, languages: e.target.value}))}></textarea>
            </div>
        </div>
    );
}