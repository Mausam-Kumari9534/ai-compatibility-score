import React, { useState, useRef } from 'react';
import { Sparkles, FileText, Mic, CheckSquare, RefreshCw, Loader2, Download, Copy, X, CheckCircle2, Circle } from 'lucide-react';
import axios from 'axios';
import { jsPDF } from 'jspdf';

const TakeActionSection = ({ resumeText, jobDescription, onReAnalyze }) => {
  const [activeTab, setActiveTab] = useState(null); // 'optimize', 'coverLetter', 'interview', 'checklist', 'reAnalyze'
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  
  // Checklist State
  const [checklist, setChecklist] = useState({
    resumeUpdated: false,
    eligibilityVerified: false,
    keywordsReviewed: false,
    githubWorking: false,
    projectsWorking: false,
    contactCorrect: false,
    atsFriendly: false,
    coverLetterPrepared: false,
    interviewPrepCompleted: false
  });

  // ReAnalyze State
  const fileInputRef = useRef(null);

  const fetchActionData = async (endpoint, type) => {
    setActiveTab(type);
    if (data && data.type === type) return; // Already loaded
    
    setLoading(true);
    setData(null);
    try {
      const response = await axios.post(`/api/action/${endpoint}`, {
        resumeText,
        jobDescription
      });
      setData({ type, result: response.data });
    } catch (err) {
      console.error(err);
      alert("Failed to generate. Please try again.");
      setActiveTab(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const handleDownloadPDF = (title, text) => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(title, 20, 20);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    
    const splitText = doc.splitTextToSize(text, 170);
    doc.text(splitText, 20, 30);
    
    doc.save(`${title.replace(/\s+/g, '_')}.pdf`);
  };

  const toggleChecklist = (key) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const isChecklistComplete = Object.values(checklist).every(v => v);

  const renderOptimize = () => {
    if (loading) return <div className="flex items-center justify-center p-8"><Loader2 className="animate-spin text-blue-500 h-8 w-8" /></div>;
    if (!data || data.type !== 'optimize') return null;

    const { summary, experience, projects, skills } = data.result;

    const generateText = () => {
      let txt = "OPTIMIZED RESUME CONTENT\n\n";
      if (summary) txt += `SUMMARY:\n${summary.after}\n\n`;
      if (skills) txt += `SKILLS:\n${skills.after}\n\n`;
      if (experience) {
        txt += `EXPERIENCE:\n`;
        experience.forEach(exp => {
          txt += `${exp.role} at ${exp.company}\n`;
          exp.bullets.forEach(b => txt += `- ${b.after}\n`);
          txt += `\n`;
        });
      }
      if (projects) {
        txt += `PROJECTS:\n`;
        projects.forEach(proj => {
          txt += `${proj.name}\n`;
          proj.bullets.forEach(b => txt += `- ${b.after}\n`);
          txt += `\n`;
        });
      }
      return txt;
    };

    return (
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mt-4 animate-in fade-in slide-in-from-top-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-xl text-gray-800">✨ Optimized Resume Content</h3>
          <div className="flex gap-2">
            <button onClick={() => handleCopy(generateText())} className="btn-secondary text-sm px-3 py-1.5 flex items-center gap-2">
              <Copy className="h-4 w-4" /> Copy All
            </button>
            <button onClick={() => handleDownloadPDF("Optimized Resume Content", generateText())} className="btn-primary text-sm px-3 py-1.5 flex items-center gap-2">
              <Download className="h-4 w-4" /> Download PDF
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {summary && (
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Professional Summary</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="bg-red-50 p-3 rounded-lg border border-red-100"><span className="text-red-700 font-semibold text-xs mb-1 block">BEFORE</span>{summary.before || 'Not available in your resume.'}</div>
                <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100"><span className="text-emerald-700 font-semibold text-xs mb-1 block">AFTER</span>{summary.after}</div>
              </div>
            </div>
          )}

          {experience && experience.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Experience</h4>
              {experience.map((exp, i) => (
                <div key={i} className="mb-4">
                  <h5 className="font-medium text-gray-600 text-sm mb-2">{exp.role} - {exp.company}</h5>
                  <div className="space-y-2">
                    {exp.bullets.map((b, j) => (
                      <div key={j} className="grid md:grid-cols-2 gap-4 text-sm">
                        <div className="bg-red-50 p-2 rounded-lg border border-red-100">{b.before}</div>
                        <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-100">{b.after}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderCoverLetter = () => {
    if (loading) return <div className="flex items-center justify-center p-8"><Loader2 className="animate-spin text-blue-500 h-8 w-8" /></div>;
    if (!data || data.type !== 'coverLetter') return null;

    const { coverLetter } = data.result;

    return (
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mt-4 animate-in fade-in slide-in-from-top-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-xl text-gray-800">📨 Your Personalized Cover Letter</h3>
          <div className="flex gap-2">
            <button onClick={() => handleCopy(coverLetter)} className="btn-secondary text-sm px-3 py-1.5 flex items-center gap-2">
              <Copy className="h-4 w-4" /> Copy
            </button>
            <button onClick={() => handleDownloadPDF("Cover Letter", coverLetter)} className="btn-primary text-sm px-3 py-1.5 flex items-center gap-2">
              <Download className="h-4 w-4" /> Download PDF
            </button>
          </div>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg whitespace-pre-wrap font-serif text-gray-800 leading-relaxed border border-gray-200">
          {coverLetter}
        </div>
      </div>
    );
  };

  const renderInterview = () => {
    if (loading) return <div className="flex items-center justify-center p-8"><Loader2 className="animate-spin text-blue-500 h-8 w-8" /></div>;
    if (!data || data.type !== 'interview') return null;

    const { questions } = data.result;
    
    // Group by category
    const categories = ["Technical", "HR", "Project", "Coding"];
    
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mt-4 animate-in fade-in slide-in-from-top-4">
        <h3 className="font-bold text-xl text-gray-800 mb-6">🎤 Interview Preparation</h3>
        
        <div className="space-y-8">
          {categories.map(cat => {
            const catQs = questions.filter(q => q.category === cat);
            if (catQs.length === 0) return null;
            return (
              <div key={cat}>
                <h4 className="font-semibold text-lg text-blue-600 mb-3 border-b pb-2">{cat} Questions</h4>
                <div className="space-y-4">
                  {catQs.map((q, i) => (
                    <div key={i} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                      <div className="flex justify-between items-start gap-4 mb-2">
                        <p className="font-semibold text-gray-800">Q: {q.question}</p>
                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${q.difficulty === 'Hard' ? 'bg-red-100 text-red-700' : q.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                          {q.difficulty}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mb-3">
                        <span className="font-medium text-gray-700">Why this is asked:</span> {q.why}
                      </div>
                      <div className="text-sm bg-blue-50 p-3 rounded border border-blue-100 text-blue-900">
                        <span className="font-medium block mb-1">Suggested Answer Approach:</span>
                        {q.suggestedAnswer}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderChecklist = () => {
    if (activeTab !== 'checklist') return null;

    const checklistItems = [
      { id: 'resumeUpdated', label: 'Resume updated for this JD' },
      { id: 'eligibilityVerified', label: 'Required eligibility criteria verified' },
      { id: 'keywordsReviewed', label: 'Missing important keywords reviewed' },
      { id: 'githubWorking', label: 'GitHub links working' },
      { id: 'projectsWorking', label: 'Project links working' },
      { id: 'contactCorrect', label: 'Contact information correct' },
      { id: 'atsFriendly', label: 'Resume is ATS-friendly' },
      { id: 'coverLetterPrepared', label: 'Cover letter prepared' },
      { id: 'interviewPrepCompleted', label: 'Interview preparation completed' },
    ];

    return (
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mt-4 animate-in fade-in slide-in-from-top-4 max-w-2xl mx-auto">
        <h3 className="font-bold text-xl text-gray-800 mb-2">✅ Final Application Checklist</h3>
        <p className="text-gray-500 text-sm mb-6">Review these steps before submitting your application.</p>
        
        <div className="space-y-3">
          {checklistItems.map(item => (
            <label key={item.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer border border-transparent hover:border-gray-100 transition-colors">
              <input type="checkbox" checked={checklist[item.id]} onChange={() => toggleChecklist(item.id)} className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300" />
              <span className={`text-sm ${checklist[item.id] ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{item.label}</span>
            </label>
          ))}
        </div>

        <div className={`mt-8 p-4 rounded-xl text-center font-semibold text-lg flex items-center justify-center gap-2 ${isChecklistComplete ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'}`}>
          {isChecklistComplete ? (
            <><CheckCircle2 className="w-6 h-6" /> 🟢 You are ready to apply!</>
          ) : (
            <><Circle className="w-6 h-6" /> 🟡 Complete the remaining steps before applying</>
          )}
        </div>
      </div>
    );
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onReAnalyze(e.target.files[0]);
    }
  };

  const renderReAnalyze = () => {
    if (activeTab !== 'reAnalyze') return null;

    return (
      <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm mt-4 text-center max-w-xl mx-auto animate-in fade-in slide-in-from-top-4">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <RefreshCw className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="font-bold text-xl text-gray-800 mb-2">Analyze Updated Resume</h3>
        <p className="text-gray-600 text-sm mb-6">
          Upload your newly optimized resume. We'll use the SAME Job Description to show you how much your score has improved!
        </p>
        
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept=".pdf,.doc,.docx" 
          className="hidden" 
        />
        
        <button 
          onClick={() => fileInputRef.current.click()}
          className="w-full btn-primary py-3 rounded-xl font-semibold shadow-md flex justify-center items-center gap-2"
        >
          <RefreshCw className="w-5 h-5" /> Upload & Re-Analyze
        </button>
      </div>
    );
  };

  return (
    <div className="mt-12 mb-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center gap-3">
          🚀 Take Action
        </h2>
        <p className="text-gray-500 mt-2">Improve your resume and prepare for this specific job.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        <button 
          onClick={() => fetchActionData('optimize-resume', 'optimize')}
          className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-3 transition-all ${activeTab === 'optimize' ? 'bg-blue-50 border-blue-200 shadow-inner' : 'bg-white hover:bg-gray-50 border-gray-200 shadow-sm hover:shadow'}`}
        >
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-semibold text-gray-700 text-sm text-center">✨ Optimize My Resume</span>
        </button>

        <button 
          onClick={() => fetchActionData('generate-cover-letter', 'coverLetter')}
          className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-3 transition-all ${activeTab === 'coverLetter' ? 'bg-blue-50 border-blue-200 shadow-inner' : 'bg-white hover:bg-gray-50 border-gray-200 shadow-sm hover:shadow'}`}
        >
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
            <FileText className="w-5 h-5" />
          </div>
          <span className="font-semibold text-gray-700 text-sm text-center">📨 Generate Cover Letter</span>
        </button>

        <button 
          onClick={() => fetchActionData('prepare-interview', 'interview')}
          className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-3 transition-all ${activeTab === 'interview' ? 'bg-blue-50 border-blue-200 shadow-inner' : 'bg-white hover:bg-gray-50 border-gray-200 shadow-sm hover:shadow'}`}
        >
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
            <Mic className="w-5 h-5" />
          </div>
          <span className="font-semibold text-gray-700 text-sm text-center">🎤 Prepare for Interview</span>
        </button>

        <button 
          onClick={() => setActiveTab('checklist')}
          className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-3 transition-all ${activeTab === 'checklist' ? 'bg-blue-50 border-blue-200 shadow-inner' : 'bg-white hover:bg-gray-50 border-gray-200 shadow-sm hover:shadow'}`}
        >
          <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
            <CheckSquare className="w-5 h-5" />
          </div>
          <span className="font-semibold text-gray-700 text-sm text-center">✅ Ready to Apply?</span>
        </button>

        <button 
          onClick={() => setActiveTab('reAnalyze')}
          className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-3 transition-all ${activeTab === 'reAnalyze' ? 'bg-blue-50 border-blue-200 shadow-inner' : 'bg-white hover:bg-gray-50 border-gray-200 shadow-sm hover:shadow'}`}
        >
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <RefreshCw className="w-5 h-5" />
          </div>
          <span className="font-semibold text-gray-700 text-sm text-center">🔄 Analyze Updated Resume</span>
        </button>
      </div>

      {renderOptimize()}
      {renderCoverLetter()}
      {renderInterview()}
      {renderChecklist()}
      {renderReAnalyze()}

    </div>
  );
};

export default TakeActionSection;
