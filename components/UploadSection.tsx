
import React from 'react';

interface UploadSectionProps {
  resumeText: string;
  setResumeText: (val: string) => void;
  jobTitle: string;
  setJobTitle: (val: string) => void;
  jobDescription: string;
  setJobDescription: (val: string) => void;
  onAnalyze: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  loading: boolean;
}

const UploadSection: React.FC<UploadSectionProps> = ({ 
  resumeText, setResumeText, jobTitle, setJobTitle, jobDescription, setJobDescription, onAnalyze, onFileChange, loading 
}) => {
  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8 animate-fade-in">
      <div className="mb-10">
        <h2 className="text-3xl font-extrabold text-slate-900">Upload & Analyze</h2>
        <p className="text-slate-500 mt-2">Fill in your details below to start the intelligence process.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Step 1: Resume */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full">
           <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-lg flex items-center justify-center font-bold">1</div>
              <h3 className="text-xl font-bold text-slate-900">Your Resume</h3>
           </div>

           <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 hover:border-indigo-300 transition-all mb-6">
              <div className="flex flex-col items-center justify-center p-6 text-center">
                <i className="fa-solid fa-cloud-arrow-up text-3xl text-slate-400 mb-3"></i>
                <p className="text-sm font-bold text-slate-700">Click to upload PDF/DOCX</p>
                <p className="text-xs text-slate-400 mt-1">Or drag and drop</p>
              </div>
              <input type="file" className="hidden" onChange={onFileChange} />
           </label>

           <div className="flex-1 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Or Paste Resume Content</span>
                <span className="text-[10px] text-slate-400">Min 100 characters</span>
              </div>
              <textarea 
                className="w-full flex-1 p-5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm text-slate-700 min-h-[250px] resize-none transition-all"
                placeholder="Experience, Skills, Education..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />
           </div>
        </div>

        {/* Step 2: Target */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full">
           <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-lg flex items-center justify-center font-bold">2</div>
              <h3 className="text-xl font-bold text-slate-900">Target Role</h3>
           </div>

           <div className="space-y-6 flex-1 flex flex-col">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Job Title</label>
                <input 
                  type="text"
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-900"
                  placeholder="e.g. Senior Product Manager"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2 flex-1 flex flex-col">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Job Description</label>
                <textarea 
                  className="w-full flex-1 p-5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm text-slate-700 min-h-[310px] resize-none transition-all"
                  placeholder="Paste the target job posting details..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>
           </div>
        </div>
      </div>

      <div className="flex flex-col items-center py-10">
        <button 
          onClick={onAnalyze}
          disabled={loading}
          className="px-16 py-4 bg-indigo-600 text-white font-bold text-xl rounded-xl shadow-xl hover:bg-indigo-700 active:scale-95 transition-all flex items-center gap-4 disabled:opacity-50"
        >
          {loading ? (
            <i className="fa-solid fa-circle-notch animate-spin"></i>
          ) : (
            <>
              Run Deep Analysis
              <i className="fa-solid fa-magnifying-glass-chart"></i>
            </>
          )}
        </button>
        <p className="mt-4 text-xs text-slate-400 font-medium">Processing takes roughly 3-5 seconds</p>
      </div>
    </div>
  );
};

export default UploadSection;
