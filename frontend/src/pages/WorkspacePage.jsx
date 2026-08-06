import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { 
  UploadCloud, File, X, Loader2, Check, FileText, LayoutDashboard, 
  Sparkles, AlertCircle, Award, Target, Briefcase, Zap, TrendingUp, 
  CheckCircle2, XCircle, AlertTriangle, ArrowRight, Star, ThumbsUp, 
  ThumbsDown, UserCheck, CheckSquare, ListChecks, Download, History, 
  BookOpen, Building, MessageSquare, BarChart, AlignLeft 
} from 'lucide-react';

const WorkspacePage = () => {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [previousResult, setPreviousResult] = useState(null);
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('previousAnalysisResult');
    if (saved) {
      try {
        setPreviousResult(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse previous result");
      }
    }
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
      setError('');
    } else {
      setError('Please upload a valid PDF file.');
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please upload a valid PDF file.');
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setError('Please upload a resume first.');
      return;
    }
    if (!jobDescription.trim()) {
      setError('Please paste a job description.');
      return;
    }

    setIsLoading(true);
    setError('');
    setResult(null);

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobDescription', jobDescription);

    try {
      const response = await axios.post('/api/analyze-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const newResult = response.data;
      
      if (result) {
        setPreviousResult(result);
        localStorage.setItem('previousAnalysisResult', JSON.stringify(result));
      } else if (previousResult) {
        localStorage.setItem('previousAnalysisResult', JSON.stringify(newResult));
      }

      setResult(newResult);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred during analysis.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const renderSkeleton = () => (
    <div className="space-y-6 animate-pulse">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-3">
            <div className="h-6 bg-gray-200 rounded w-full"></div>
            <div className="h-6 bg-gray-200 rounded w-5/6"></div>
            <div className="h-6 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderResults = () => {
    if (!result) return null;

    const { 
      matchScore = 0, summary = "", eligibility = { status: "Unknown", checks: [] }, 
      atsBreakdown = { format: 0, technical: 0, projects: 0, education: 0, keyword: 0, softSkills: 0 }, 
      skillsMatch = [], missingSkills = [], 
      actionPlan = [], scorePrediction = { current: 0, afterResume: 0, afterSkills: 0 }, 
      rewrites = [], verdict = { interviewChance: 0, opinion: "" }, 
      applyDecision = { decision: "UNKNOWN", reason: "" }, nextSteps = [],
      resumeText = "Resume text not available.",
      resumeHighlights = [], keywordDensity = [], recruiterReview = { strengths: [], weaknesses: [], finalRecommendation: "" },
      interviewPrep = [], learningResources = [], companyFit = { best: [], average: [], needsImprovement: [], explanation: "" },
      timeline = [], careerSummary = { readiness: 0, suitableRoles: [], salaryRange: "", overallRecommendation: "" }
    } = result;

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 print-container" id="printable-area">
        
        {/* DOWNLOAD BUTTON */}
        <div className="flex justify-end no-print">
          <button 
            onClick={handlePrint}
            className="inline-flex items-center justify-center rounded-xl text-sm font-semibold transition-all bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 h-10 px-4 shadow-sm hover:shadow"
          >
            <Download className="h-4 w-4 mr-2" />
            Download ATS Report
          </button>
        </div>

        {/* 9. SMART RESUME VERSION HISTORY */}
        {previousResult && previousResult.matchScore !== undefined && (
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl shadow-sm p-5 lg:p-6 flex items-center justify-between no-print">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <History className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-indigo-900">Version History Analysis</h3>
                <p className="text-xs text-indigo-700 mt-0.5">Comparing with your last uploaded resume</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm font-semibold">
              <div className="flex flex-col items-center">
                <span className="text-gray-500 text-xs">Previous</span>
                <span className="text-gray-900">{previousResult.matchScore}</span>
              </div>
              <ArrowRight className="h-4 w-4 text-indigo-300" />
              <div className="flex flex-col items-center">
                <span className="text-indigo-600 text-xs">Current</span>
                <span className="text-indigo-700 text-lg">{matchScore}</span>
              </div>
              <div className="flex flex-col items-center bg-white px-3 py-1 rounded-lg border border-indigo-100 shadow-sm">
                <span className="text-emerald-600 text-xs font-bold">
                  {matchScore > previousResult.matchScore ? `+${matchScore - previousResult.matchScore} Score` : 'No Change'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 10. SHOULD I APPLY? & 9. RECRUITER VERDICT */}
        <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm overflow-hidden transition-all hover:shadow-md flex flex-col md:flex-row page-break-inside-avoid">
          <div className="p-6 md:p-8 flex-1 flex flex-col justify-center border-b md:border-b-0 md:border-r border-gray-100">
            <h3 className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Recruiter Verdict</h3>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-5xl lg:text-6xl font-bold tracking-tighter text-indigo-600">{verdict.interviewChance}%</span>
              <span className="text-sm font-medium text-gray-400">Interview Chance</span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mt-2">
              {verdict.opinion || summary}
            </p>
          </div>
          <div className="p-6 md:p-8 flex-1 flex flex-col items-center justify-center bg-gray-50/50">
            <h3 className="text-xs font-semibold text-gray-500 mb-4 uppercase tracking-wider text-center">Should I Apply?</h3>
            {applyDecision.decision === 'YES' && (
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-3 shadow-sm border border-emerald-200">
                <ThumbsUp className="h-10 w-10 text-emerald-600" />
              </div>
            )}
            {applyDecision.decision === 'APPLY AFTER UPDATING RESUME' && (
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-3 shadow-sm border border-amber-200">
                <FileText className="h-10 w-10 text-amber-600" />
              </div>
            )}
            {applyDecision.decision === 'NO' && (
              <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mb-3 shadow-sm border border-rose-200">
                <ThumbsDown className="h-10 w-10 text-rose-600" />
              </div>
            )}
            <span className={`px-4 py-1.5 rounded-full text-sm font-bold border mb-2 ${
              applyDecision.decision === 'YES' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
              applyDecision.decision === 'NO' ? 'bg-rose-50 text-rose-700 border-rose-200' :
              'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
              {applyDecision.decision}
            </span>
            <p className="text-xs text-gray-500 text-center">{applyDecision.reason}</p>
          </div>
        </div>

        {/* 1. ELIGIBILITY CHECK */}
        <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm p-6 lg:p-8 transition-all hover:shadow-md page-break-inside-avoid">
           <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center">
                <UserCheck className="h-5 w-5 text-indigo-500 mr-2" />
                Eligibility Check
              </h3>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                eligibility.status === 'Eligible' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                eligibility.status === 'Not Eligible' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                {eligibility.status}
              </span>
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {eligibility.checks?.map((check, i) => (
                <div key={i} className="flex items-center text-sm">
                  {check.status ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mr-2.5 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-rose-500 mr-2.5 flex-shrink-0" />
                  )}
                  <span className={check.status ? 'text-gray-700' : 'text-gray-900 font-medium'}>{check.requirement}</span>
                </div>
              ))}
           </div>
        </div>

        {/* 1. ATS RESUME PREVIEW WITH AI HIGHLIGHTS */}
        <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm overflow-hidden transition-all hover:shadow-md page-break-inside-avoid">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center">
              <AlignLeft className="h-5 w-5 text-indigo-500 mr-2" />
              ATS Resume Preview & Highlights
            </h3>
          </div>
          <div className="flex flex-col md:flex-row h-96">
            <div className="flex-1 p-6 bg-gray-50 overflow-y-auto border-r border-gray-100">
              <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">
                {resumeText}
              </pre>
            </div>
            <div className="w-full md:w-80 bg-white p-6 overflow-y-auto">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">AI Highlights</h4>
              <div className="space-y-4">
                {resumeHighlights?.map((hl, i) => (
                  <div key={i} className={`p-3 rounded-xl border text-sm ${
                    hl.status === 'Green' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' :
                    hl.status === 'Red' ? 'bg-rose-50 border-rose-100 text-rose-800' :
                    'bg-amber-50 border-amber-100 text-amber-800'
                  }`}>
                    <span className="font-bold block mb-1">{hl.section}</span>
                    <span className="opacity-90">{hl.feedback}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 3. RECRUITER REVIEW PANEL */}
        <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm p-6 lg:p-8 transition-all hover:shadow-md page-break-inside-avoid">
           <h3 className="text-sm font-semibold text-gray-900 flex items-center mb-6">
              <FileText className="h-5 w-5 text-indigo-500 mr-2" />
              Recruiter Review Panel
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
             <div className="bg-emerald-50/30 p-5 rounded-xl border border-emerald-100">
               <h4 className="text-sm font-bold text-emerald-800 mb-3 flex items-center">
                 <ThumbsUp className="h-4 w-4 mr-2" /> Strengths
               </h4>
               <ul className="space-y-2">
                 {recruiterReview.strengths?.map((s, i) => (
                   <li key={i} className="flex text-sm text-gray-700"><Check className="h-4 w-4 text-emerald-500 mr-2 shrink-0 mt-0.5" />{s}</li>
                 ))}
               </ul>
             </div>
             <div className="bg-rose-50/30 p-5 rounded-xl border border-rose-100">
               <h4 className="text-sm font-bold text-rose-800 mb-3 flex items-center">
                 <ThumbsDown className="h-4 w-4 mr-2" /> Weaknesses
               </h4>
               <ul className="space-y-2">
                 {recruiterReview.weaknesses?.map((w, i) => (
                   <li key={i} className="flex text-sm text-gray-700"><X className="h-4 w-4 text-rose-500 mr-2 shrink-0 mt-0.5" />{w}</li>
                 ))}
               </ul>
             </div>
           </div>
           <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex items-center gap-3">
             <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
               <Sparkles className="h-5 w-5 text-indigo-600" />
             </div>
             <div>
               <span className="text-xs text-gray-500 block uppercase font-semibold">Final Recommendation</span>
               <span className="text-sm font-bold text-gray-900">{recruiterReview.finalRecommendation}</span>
             </div>
           </div>
        </div>

        {/* 2. ATS SCORE BREAKDOWN & 2. KEYWORD DENSITY */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 page-break-inside-avoid">
          <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm p-6 lg:p-8 transition-all hover:shadow-md">
             <h3 className="text-sm font-semibold text-gray-900 flex items-center mb-6">
                <Target className="h-5 w-5 text-indigo-500 mr-2" />
                ATS Score Breakdown
             </h3>
             <div className="space-y-4">
                {[
                  { label: 'Resume Formatting', score: atsBreakdown.format },
                  { label: 'Technical Skills', score: atsBreakdown.technical },
                  { label: 'Projects', score: atsBreakdown.projects },
                  { label: 'Education', score: atsBreakdown.education },
                  { label: 'Keyword Match', score: atsBreakdown.keyword },
                  { label: 'Soft Skills', score: atsBreakdown.softSkills },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs font-medium mb-1.5">
                      <span className="text-gray-700">{item.label}</span>
                      <span className="text-gray-900">{item.score}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div 
                        className="bg-indigo-500 h-2 rounded-full transition-all duration-1000" 
                        style={{ width: `${item.score || 0}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
          
          <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm p-6 lg:p-8 transition-all hover:shadow-md">
             <h3 className="text-sm font-semibold text-gray-900 flex items-center mb-6">
                <BarChart className="h-5 w-5 text-indigo-500 mr-2" />
                Keyword Density Analysis
             </h3>
             <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                {keywordDensity?.map((kw, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50/50">
                    <span className="text-sm font-medium text-gray-800">{kw.keyword}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500">{kw.mentions} mentions</span>
                      {kw.status ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <XCircle className="h-4 w-4 text-rose-500" />}
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* 3. RESUME VS JOB DESCRIPTION MATCH */}
        <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm p-6 lg:p-8 transition-all hover:shadow-md page-break-inside-avoid">
           <h3 className="text-sm font-semibold text-gray-900 flex items-center mb-6">
              <Briefcase className="h-5 w-5 text-indigo-500 mr-2" />
              Requirements Match
           </h3>
           <div className="border border-gray-200 rounded-xl overflow-hidden">
             <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                   <tr>
                      <th className="px-6 py-3 font-semibold">Requirement</th>
                      <th className="px-6 py-3 font-semibold text-right">Status</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {skillsMatch?.map((skill, i) => (
                    <tr key={i} className={`bg-white ${!skill.status ? 'bg-rose-50/30' : ''}`}>
                       <td className={`px-6 py-3 font-medium ${!skill.status ? 'text-rose-700' : 'text-gray-900'}`}>
                         {skill.skill}
                       </td>
                       <td className="px-6 py-3 text-right">
                         {skill.status ? '✅' : '❌'}
                       </td>
                    </tr>
                  ))}
                </tbody>
             </table>
           </div>
        </div>

        {/* 5. LEARNING RESOURCES */}
        {learningResources?.length > 0 && (
          <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm p-6 lg:p-8 transition-all hover:shadow-md page-break-inside-avoid">
             <h3 className="text-sm font-semibold text-gray-900 flex items-center mb-6">
                <BookOpen className="h-5 w-5 text-indigo-500 mr-2" />
                Learning Resources for Missing Skills
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {learningResources.map((lr, i) => (
                 <div key={i} className="border border-gray-200 rounded-xl p-4 bg-[#FAFAFA]">
                   <div className="flex justify-between items-center mb-3">
                     <span className="text-sm font-bold text-gray-900">{lr.skill}</span>
                     <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-700 px-2 py-0.5 rounded">{lr.estimatedTime}</span>
                   </div>
                   <ul className="space-y-1.5">
                     {lr.resources?.map((res, idx) => (
                       <li key={idx} className="text-xs text-indigo-600 flex items-center hover:underline cursor-pointer">
                         <span className="w-1 h-1 bg-indigo-400 rounded-full mr-2"></span> {res}
                       </li>
                     ))}
                   </ul>
                 </div>
               ))}
             </div>
          </div>
        )}

        {/* 4. AI INTERVIEW PREPARATION */}
        <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm p-6 lg:p-8 transition-all hover:shadow-md page-break-inside-avoid">
           <h3 className="text-sm font-semibold text-gray-900 flex items-center mb-6">
              <MessageSquare className="h-5 w-5 text-indigo-500 mr-2" />
              AI Interview Preparation
           </h3>
           <div className="space-y-3">
             {interviewPrep?.map((q, i) => (
               <div key={i} className="flex flex-col sm:flex-row justify-between sm:items-center p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-indigo-50/30 transition-colors gap-3">
                 <div>
                   <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">{q.category}</span>
                   <span className="text-sm font-medium text-gray-900">{q.question}</span>
                 </div>
                 <span className={`text-xs font-bold px-3 py-1 rounded-full border shrink-0 w-fit ${
                   q.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                   q.difficulty === 'Hard' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                   'bg-amber-50 text-amber-700 border-amber-200'
                 }`}>
                   {q.difficulty}
                 </span>
               </div>
             ))}
           </div>
        </div>

        {/* 6. COMPANY FIT ANALYSIS */}
        <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm p-6 lg:p-8 transition-all hover:shadow-md page-break-inside-avoid">
           <h3 className="text-sm font-semibold text-gray-900 flex items-center mb-6">
              <Building className="h-5 w-5 text-indigo-500 mr-2" />
              Company Fit Analysis
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
             <div className="border border-emerald-200 bg-emerald-50/30 rounded-xl p-4">
               <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-3 flex items-center"><CheckCircle2 className="w-4 h-4 mr-1.5"/> Best Match</h4>
               <ul className="space-y-1">{companyFit.best?.map((c,i)=><li key={i} className="text-sm font-medium text-gray-800">{c}</li>)}</ul>
             </div>
             <div className="border border-amber-200 bg-amber-50/30 rounded-xl p-4">
               <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-3 flex items-center"><CheckCircle2 className="w-4 h-4 mr-1.5"/> Average Match</h4>
               <ul className="space-y-1">{companyFit.average?.map((c,i)=><li key={i} className="text-sm font-medium text-gray-800">{c}</li>)}</ul>
             </div>
             <div className="border border-rose-200 bg-rose-50/30 rounded-xl p-4">
               <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider mb-3 flex items-center"><XCircle className="w-4 h-4 mr-1.5"/> Needs Improvement</h4>
               <ul className="space-y-1">{companyFit.needsImprovement?.map((c,i)=><li key={i} className="text-sm font-medium text-gray-800">{c}</li>)}</ul>
             </div>
           </div>
           <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
             <strong>AI Analysis:</strong> {companyFit.explanation}
           </p>
        </div>

        {/* 8. IMPROVEMENT TIMELINE */}
        <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm p-6 lg:p-8 transition-all hover:shadow-md page-break-inside-avoid">
           <h3 className="text-sm font-semibold text-gray-900 flex items-center mb-8">
              <TrendingUp className="h-5 w-5 text-indigo-500 mr-2" />
              Improvement Roadmap
           </h3>
           <div className="relative">
             <div className="absolute top-0 bottom-0 left-[15px] w-0.5 bg-indigo-100 z-0"></div>
             <div className="space-y-6">
               {timeline?.map((step, i) => (
                 <div key={i} className="flex gap-4 relative z-10">
                   <div className="w-8 h-8 rounded-full bg-indigo-50 border-2 border-indigo-500 flex items-center justify-center shrink-0">
                     <span className="text-xs font-bold text-indigo-600">{i+1}</span>
                   </div>
                   <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm flex-1 flex justify-between items-center">
                     <span className="text-sm font-semibold text-gray-800">{step.step}</span>
                     <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">{step.duration}</span>
                   </div>
                 </div>
               ))}
             </div>
           </div>
        </div>

        {/* 10. FINAL AI CAREER SUMMARY */}
        <div className="bg-gradient-to-br from-indigo-900 to-indigo-800 rounded-2xl shadow-lg p-6 lg:p-8 text-white page-break-inside-avoid">
           <h3 className="text-sm font-semibold text-indigo-200 flex items-center mb-6 uppercase tracking-wider">
              <Award className="h-5 w-5 text-indigo-300 mr-2" />
              Final Career Summary
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
             <div className="bg-white/10 rounded-xl p-5 backdrop-blur-sm border border-white/10">
               <span className="text-xs text-indigo-200 block mb-1">Current Readiness</span>
               <span className="text-3xl font-bold text-white">{careerSummary.readiness}%</span>
             </div>
             <div className="bg-white/10 rounded-xl p-5 backdrop-blur-sm border border-white/10 md:col-span-2">
               <span className="text-xs text-indigo-200 block mb-1">Expected Salary Range</span>
               <span className="text-3xl font-bold text-emerald-400">{careerSummary.salaryRange}</span>
             </div>
           </div>
           
           <div className="mb-6">
             <span className="text-xs text-indigo-200 block mb-2 uppercase tracking-wider font-semibold">Best Suitable Roles</span>
             <div className="flex flex-wrap gap-2">
               {careerSummary.suitableRoles?.map((role, i) => (
                 <span key={i} className="px-3 py-1.5 rounded-lg bg-indigo-500/30 border border-indigo-400/30 text-sm font-medium">
                   {role}
                 </span>
               ))}
             </div>
           </div>
           
           <div className="bg-white/5 rounded-xl p-5 border border-white/10">
             <h4 className="text-xs font-semibold text-indigo-200 uppercase tracking-wider mb-2">Overall Recommendation</h4>
             <p className="text-sm text-indigo-50 leading-relaxed font-medium">
               {careerSummary.overallRecommendation}
             </p>
           </div>
        </div>

      </div>
    );
  };

  return (
    <div className="flex-1 lg:grid lg:grid-cols-2 h-[calc(100vh-3.5rem)] overflow-hidden bg-white">
      {/* Left Column: Input Panel */}
      <div className="h-full overflow-y-auto border-r border-gray-200 p-6 lg:p-8 xl:p-12 no-print">
        <div className="max-w-xl mx-auto space-y-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">AI Career Assistant <span className="text-indigo-600 border border-indigo-200 bg-indigo-50 text-[10px] uppercase px-2 py-1 rounded-full align-middle ml-2">Premium</span></h1>
            <p className="text-sm text-gray-500 mt-2">Upload your resume and the target job description to get a complete, recruiter-grade analysis and interview roadmap.</p>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200/60 text-rose-700 text-sm flex items-start animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <span className="font-medium leading-relaxed">{error}</span>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2.5">Resume PDF</label>
              <div 
                className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 ${
                  isDragging ? 'border-indigo-500 bg-indigo-50/50 scale-[1.02]' : 'border-gray-200 bg-[#FAFAFA] hover:bg-gray-50 hover:border-gray-300'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="application/pdf"
                  className="hidden"
                  id="file-upload"
                />
                
                {!file ? (
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-12 h-12 bg-white border border-gray-200 shadow-sm rounded-xl flex items-center justify-center mb-4">
                      <UploadCloud className="h-6 w-6 text-gray-400" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">Upload your resume</h3>
                    <p className="text-xs text-gray-500 mb-5">Drag and drop your PDF here, or click to browse</p>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 h-9 px-4 shadow-sm hover:shadow"
                    >
                      Browse Files
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-4 shadow-sm max-w-sm mx-auto">
                    <div className="flex items-center space-x-4 overflow-hidden">
                      <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                        <File className="h-6 w-6" />
                      </div>
                      <div className="flex flex-col text-left overflow-hidden">
                        <span className="text-sm font-semibold text-gray-900 truncate">{file.name}</span>
                        <span className="text-xs text-gray-500 mt-0.5">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                    </div>
                    <button 
                      onClick={handleRemoveFile}
                      className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                      title="Remove file"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex justify-between items-end mb-2.5">
                <label className="block text-sm font-semibold text-gray-900">Job Description</label>
                <div className="flex items-center gap-3">
                  <span className={`text-xs ${jobDescription.length > 5000 ? 'text-amber-500' : 'text-gray-400'}`}>
                    {jobDescription.length} chars
                  </span>
                  {jobDescription && (
                    <button 
                      onClick={() => setJobDescription('')}
                      className="text-xs font-medium text-gray-400 hover:text-gray-900 transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description text here..."
                className="w-full h-48 lg:h-64 p-4 bg-[#FAFAFA] border border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all text-gray-900 text-sm leading-relaxed shadow-sm placeholder:text-gray-400"
              />
            </div>

            <div className="pt-2">
              <button
                onClick={handleSubmit}
                disabled={isLoading || !file || !jobDescription}
                className="w-full flex items-center justify-center rounded-xl text-sm font-semibold transition-all bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60 disabled:hover:bg-indigo-600 disabled:cursor-not-allowed h-12 shadow-sm hover:shadow-md"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2.5 h-5 w-5 animate-spin text-white/80" />
                    Generating Full Report...
                  </>
                ) : (
                  <>
                    Analyze Alignment ⚡
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Results Panel */}
      <div className="h-full overflow-y-auto bg-[#FAFAFA] p-6 lg:p-8 xl:p-12 relative border-t lg:border-t-0 border-gray-200 print-full-width" id="print-section">
        <style dangerouslySetInnerHTML={{__html: `
          @media print {
            body * { visibility: hidden; }
            #printable-area, #printable-area * { visibility: visible; }
            .no-print { display: none !important; }
            .print-full-width { 
               position: absolute; left: 0; top: 0; width: 100vw; 
               background: white !important; border: none !important;
            }
            .page-break-inside-avoid { page-break-inside: avoid; margin-bottom: 20px; }
          }
        `}} />
        <div className="max-w-2xl mx-auto h-full">
          {isLoading ? (
            <div className="h-full flex flex-col pt-2 no-print">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Analysis in Progress</h2>
              {renderSkeleton()}
            </div>
          ) : result ? (
            <div className="h-full flex flex-col pt-2">
              <h2 className="text-xl font-bold text-gray-900 mb-6 no-print">Career Analysis Results</h2>
              {renderResults()}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center px-4 py-12 lg:py-0 no-print">
              <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                <LayoutDashboard className="h-12 w-12 text-indigo-500" strokeWidth={1.5} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Ready to Analyze</h2>
              <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
                Upload your resume and provide a job description on the left. We'll generate a complete AI Career Action Plan.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkspacePage;
