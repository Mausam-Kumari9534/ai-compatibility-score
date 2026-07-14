import React, { useState, useRef } from 'react';
import axios from 'axios';
import { UploadCloud, File, X, Loader2, Check, FileText, LayoutDashboard, Sparkles, AlertCircle } from 'lucide-react';

const WorkspacePage = () => {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  
  const fileInputRef = useRef(null);

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
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred during analysis.');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to render skeleton loader
  const renderSkeleton = () => (
    <div className="space-y-6 animate-pulse">
      {/* Score Card Skeleton */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="flex items-baseline gap-2 mb-4">
          <div className="h-16 bg-gray-200 rounded w-24"></div>
          <div className="h-6 bg-gray-200 rounded w-12"></div>
        </div>
        <div className="h-5 bg-gray-200 rounded-full w-24 mb-6"></div>
        <div className="space-y-2 pt-4 border-t border-gray-50">
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          <div className="h-3 bg-gray-200 rounded w-4/6"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Missing Skills Skeleton */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 bg-gray-50/50 flex items-center">
            <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="p-5 space-y-3">
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>

        {/* Matching Skills Skeleton */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 bg-gray-50/50 flex items-center">
            <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="p-5 flex flex-wrap gap-2">
            <div className="h-6 bg-gray-200 rounded w-16"></div>
            <div className="h-6 bg-gray-200 rounded w-20"></div>
            <div className="h-6 bg-gray-200 rounded w-14"></div>
            <div className="h-6 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      </div>

      {/* AI Feedback Skeleton */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 bg-gray-50/50 flex items-center">
          <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex gap-3">
            <div className="w-4 h-4 bg-gray-200 rounded mt-0.5"></div>
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-4/5"></div>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-4 h-4 bg-gray-200 rounded mt-0.5"></div>
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Helper to render Results
  const renderResults = () => {
    const { matchScore, matchingSkills, missingKeywords, summary, suggestions } = result;

    let scoreColor = 'text-emerald-600';
    let badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    let scoreText = 'Strong Match';
    
    if (matchScore < 50) {
      scoreColor = 'text-rose-600';
      badgeClass = 'bg-rose-50 text-rose-700 border-rose-200';
      scoreText = 'Weak Match';
    } else if (matchScore < 75) {
      scoreColor = 'text-amber-600';
      badgeClass = 'bg-amber-50 text-amber-700 border-amber-200';
      scoreText = 'Fair Match';
    }

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Score Card */}
        <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm p-6 lg:p-8 transition-all hover:shadow-md">
          <h3 className="text-xs font-semibold text-gray-500 mb-4 uppercase tracking-wider">Overall Compatibility</h3>
          
          <div className="flex items-baseline gap-2 mb-3">
            <span className={`text-6xl lg:text-7xl font-bold tracking-tighter ${scoreColor}`}>{matchScore}</span>
            <span className="text-xl font-medium text-gray-400">/ 100</span>
          </div>
          
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${badgeClass} mb-6`}>
            {scoreText}
          </div>

          <div className="pt-5 border-t border-gray-100">
            <p className="text-sm text-gray-600 leading-relaxed">
              {summary}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Missing Keywords */}
          <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-md">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center">
                <X className="h-4 w-4 text-rose-500 mr-2 stroke-[2.5]" />
                Missing Keywords
              </h3>
            </div>
            <div className="p-5 flex-1">
              {missingKeywords && missingKeywords.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {missingKeywords.map((keyword, i) => (
                    <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-rose-50 text-rose-700 border border-rose-100/50">
                      {keyword}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center py-4">
                  <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center mb-2">
                    <Check className="h-5 w-5 text-emerald-500" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">Excellent!</p>
                  <p className="text-xs text-gray-500 mt-1">No missing keywords.</p>
                </div>
              )}
            </div>
          </div>

          {/* Matching Skills */}
          <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-md">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center">
                <Check className="h-4 w-4 text-emerald-500 mr-2 stroke-[2.5]" />
                Matching Skills
              </h3>
            </div>
            <div className="p-5 flex-1">
              {matchingSkills && matchingSkills.length > 0 ? (
                <ul className="space-y-2.5">
                  {matchingSkills.map((skill, i) => (
                    <li key={i} className="flex items-start text-sm text-gray-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 mr-2.5 flex-shrink-0"></span>
                      <span className="leading-snug">{skill}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No significant matching skills found.</p>
              )}
            </div>
          </div>
        </div>

        {/* Suggestions */}
        <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm overflow-hidden transition-all hover:shadow-md">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center">
              <Sparkles className="h-4 w-4 text-indigo-500 mr-2" />
              Actionable AI Feedback
            </h3>
          </div>
          
          <div className="p-5 lg:p-6">
            {suggestions && suggestions.length > 0 ? (
              <ul className="space-y-4">
                {suggestions.map((suggestion, i) => (
                  <li key={i} className="flex text-sm text-gray-700 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                    <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-semibold text-xs mt-0.5 mr-3">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed pt-0.5">{suggestion}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No suggestions provided.</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 lg:grid lg:grid-cols-2 h-[calc(100vh-3.5rem)] overflow-hidden bg-white">
      {/* Left Column: Input Panel */}
      <div className="h-full overflow-y-auto border-r border-gray-200 p-6 lg:p-8 xl:p-12">
        <div className="max-w-xl mx-auto space-y-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">Workspace</h1>
            <p className="text-sm text-gray-500 mt-2">Upload your resume and the target job description to get a detailed compatibility analysis.</p>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200/60 text-rose-700 text-sm flex items-start animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <span className="font-medium leading-relaxed">{error}</span>
            </div>
          )}

          <div className="space-y-6">
            {/* Upload Container */}
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

            {/* Job Description Textarea */}
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

            {/* Submit Button */}
            <div className="pt-2">
              <button
                onClick={handleSubmit}
                disabled={isLoading || !file || !jobDescription}
                className="w-full flex items-center justify-center rounded-xl text-sm font-semibold transition-all bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60 disabled:hover:bg-indigo-600 disabled:cursor-not-allowed h-12 shadow-sm hover:shadow-md"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2.5 h-5 w-5 animate-spin text-white/80" />
                    Analyzing Alignment...
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
      <div className="h-full overflow-y-auto bg-[#FAFAFA] p-6 lg:p-8 xl:p-12 relative border-t lg:border-t-0 border-gray-200">
        <div className="max-w-xl mx-auto h-full">
          {isLoading ? (
            <div className="h-full flex flex-col pt-2">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Analysis in Progress</h2>
              {renderSkeleton()}
            </div>
          ) : result ? (
            <div className="h-full flex flex-col pt-2">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Analysis Results</h2>
              {renderResults()}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center px-4 py-12 lg:py-0">
              <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                <LayoutDashboard className="h-12 w-12 text-indigo-500" strokeWidth={1.5} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Ready to Analyze</h2>
              <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
                Upload your resume and provide a job description on the left. We'll extract your skills and compare them against the requirements.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkspacePage;
