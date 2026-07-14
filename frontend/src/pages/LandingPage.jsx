import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Target, Zap } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="flex flex-col flex-1 items-center bg-white pb-24">
      {/* Hero Section */}
      <div className="max-w-5xl w-full px-4 sm:px-6 lg:px-8 pt-32 pb-20 text-center">
        <div className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-[13px] font-medium text-gray-600 mb-8">
          <span className="flex h-2 w-2 rounded-full bg-indigo-600 mr-2"></span>
          AI-Powered Resume Analysis
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-6">
          Align your resume with <br className="hidden md:block"/>
          <span className="text-indigo-600">job requirements.</span>
        </h1>
        
        <p className="max-w-2xl text-[17px] text-gray-500 mx-auto leading-relaxed mb-10">
          Upload your resume, paste any job description, and receive an instant compatibility score with actionable feedback to help you land the interview.
        </p>
        
        <div className="flex items-center justify-center gap-4">
          <Link 
            to="/upload" 
            className="inline-flex items-center justify-center rounded-md text-[15px] font-medium transition-colors bg-gray-900 text-white hover:bg-gray-800 h-11 px-6 shadow-sm"
          >
            Analyze Resume
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <a 
            href="#how-it-works" 
            className="inline-flex items-center justify-center rounded-md text-[15px] font-medium transition-colors border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 h-11 px-6 shadow-sm"
          >
            Learn More
          </a>
        </div>
      </div>

      {/* Features Grid */}
      <div id="how-it-works" className="max-w-5xl w-full px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-gray-200 p-8 rounded-xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <div className="w-10 h-10 rounded-md bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-5">
              <FileText className="h-5 w-5 text-indigo-600" />
            </div>
            <h3 className="text-[16px] font-semibold text-gray-900 mb-2">1. Upload Resume</h3>
            <p className="text-[14px] text-gray-500 leading-relaxed">Simply upload your current resume in PDF format. We handle text extraction locally and securely.</p>
          </div>
          
          <div className="border border-gray-200 p-8 rounded-xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <div className="w-10 h-10 rounded-md bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-5">
              <Target className="h-5 w-5 text-indigo-600" />
            </div>
            <h3 className="text-[16px] font-semibold text-gray-900 mb-2">2. Job Description</h3>
            <p className="text-[14px] text-gray-500 leading-relaxed">Copy and paste the full job description from any job board to provide context for the AI.</p>
          </div>

          <div className="border border-gray-200 p-8 rounded-xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <div className="w-10 h-10 rounded-md bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-5">
              <Zap className="h-5 w-5 text-indigo-600" />
            </div>
            <h3 className="text-[16px] font-semibold text-gray-900 mb-2">3. Instant Analysis</h3>
            <p className="text-[14px] text-gray-500 leading-relaxed">Our AI compares the texts and provides a match score along with precise actionable suggestions.</p>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="w-full max-w-5xl px-4 sm:px-6 lg:px-8 mt-32 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center text-[13px] text-gray-500">
        <p>&copy; {new Date().getFullYear()} MatchAI Inc.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <span className="hover:text-gray-900 cursor-pointer transition-colors">Privacy Policy</span>
          <span className="hover:text-gray-900 cursor-pointer transition-colors">Terms of Service</span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
