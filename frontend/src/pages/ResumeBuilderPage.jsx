import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useReactToPrint } from 'react-to-print';
import Editor from '../components/builder/Editor';
import ClassicTemplate from '../components/templates/ClassicTemplate';
import ModernTemplate from '../components/templates/ModernTemplate';
import MinimalTemplate from '../components/templates/MinimalTemplate';
import ProfessionalTemplate from '../components/templates/ProfessionalTemplate';
import SoftwareEngineerTemplate from '../components/templates/SoftwareEngineerTemplate';
import { Save, Download, FileUp, Loader2, FileText } from 'lucide-react';

const emptyResume = {
    personalInfo: { fullName: '', email: '', phone: '', location: '', linkedin: '' },
    summary: '',
    experience: [],
    education: [],
    projects: [],
    skills: { technical: '', soft: '' },
    certifications: [],
    achievements: [],
    languages: '',
    links: []
};

export default function ResumeBuilderPage() {
    const [data, setData] = useState(emptyResume);
    const [template, setTemplate] = useState('Modern');
    const [isSaving, setIsSaving] = useState(false);
    const [isParsing, setIsParsing] = useState(false);
    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Resume',
    });

    const handleDocxExport = () => {
        if (!componentRef.current) return;
        const html = componentRef.current.innerHTML;
        const blob = new Blob(['\ufeff', html], {
            type: 'application/msword'
        });
        const url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);
        const link = document.createElement('a');
        link.href = url;
        link.download = (data.personalInfo?.fullName || 'Resume') + '.doc';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleAutoFill = async (e) => {
        const file = e.target.files[0];
        if(!file) return;
        setIsParsing(true);
        const formData = new FormData();
        formData.append('resume', file);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('/api/resume-builder/autofill', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Ensure IDs exist for DND
            const parsed = res.data;
            if(parsed.experience) parsed.experience = parsed.experience.map(e => ({...e, id: Math.random().toString()}));
            if(parsed.education) parsed.education = parsed.education.map(e => ({...e, id: Math.random().toString()}));
            if(parsed.projects) parsed.projects = parsed.projects.map(e => ({...e, id: Math.random().toString()}));
            if(parsed.certifications) parsed.certifications = parsed.certifications.map(e => ({...e, id: Math.random().toString()}));
            if(parsed.achievements) parsed.achievements = parsed.achievements.map(e => ({...e, id: Math.random().toString()}));
            if(parsed.links) parsed.links = parsed.links.map(e => ({...e, id: Math.random().toString()}));
            setData(parsed);
        } catch (err) {
            console.error(err);
            alert('Failed to parse resume');
        } finally {
            setIsParsing(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/resume-builder/drafts', { ...data, template, title: data.personalInfo.fullName + ' Resume' }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Draft Saved Successfully!');
        } catch (err) {
            console.error(err);
            alert('Failed to save draft');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] bg-gray-100 overflow-hidden">
            {/* Toolbar */}
            <div className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center z-10 shrink-0">
                <div className="flex items-center gap-4">
                    <h1 className="font-bold text-gray-900 text-lg">AI Resume Builder</h1>
                    <select value={template} onChange={e => setTemplate(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-gray-50 focus:outline-none">
                        <option value="Modern">Modern Template</option>
                        <option value="Classic">Classic Template</option>
                        <option value="Minimal">Minimal Template</option>
                        <option value="Professional">Professional Template</option>
                        <option value="SoftwareEngineer">Software Engineer Template</option>
                    </select>
                </div>
                <div className="flex items-center gap-3">
                    <label className="cursor-pointer inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 h-9 px-4 shadow-sm">
                        {isParsing ? <Loader2 className="w-4 h-4 animate-spin mr-2"/> : <FileUp className="w-4 h-4 mr-2" />} Auto Fill PDF
                        <input type="file" accept="application/pdf" className="hidden" onChange={handleAutoFill} />
                    </label>
                    <button onClick={handleSave} disabled={isSaving} className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 h-9 px-4 shadow-sm">
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2"/> : <Save className="w-4 h-4 mr-2" />} Save Draft
                    </button>
                    <button onClick={handleDocxExport} className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 h-9 px-4 shadow-sm">
                        <FileText className="w-4 h-4 mr-2" /> Download DOC
                    </button>
                    <button onClick={handlePrint} className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors bg-indigo-600 text-white hover:bg-indigo-700 h-9 px-4 shadow-sm">
                        <Download className="w-4 h-4 mr-2" /> Download PDF
                    </button>
                </div>
            </div>

            {/* Split View */}
            <div className="flex-1 flex overflow-hidden relative">
                {/* Editor Pane */}
                <div className="w-1/2 overflow-y-auto p-6 bg-gray-50 border-r border-gray-200 custom-scrollbar">
                    <Editor data={data} setData={setData} onSave={handleSave} />
                </div>
                
                {/* Preview Pane */}
                <div className="w-1/2 overflow-y-auto p-6 bg-gray-200/50 flex justify-center custom-scrollbar">
                    <div className="scale-[0.85] origin-top shadow-xl transition-all">
                        <div ref={componentRef} className="bg-white">
                            {template === 'Classic' && <ClassicTemplate data={data} />}
                            {template === 'Modern' && <ModernTemplate data={data} />}
                            {template === 'Minimal' && <MinimalTemplate data={data} />}
                            {template === 'Professional' && <ProfessionalTemplate data={data} />}
                            {template === 'SoftwareEngineer' && <SoftwareEngineerTemplate data={data} />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}