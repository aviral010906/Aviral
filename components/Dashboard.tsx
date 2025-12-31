
import React, { useState } from 'react';

interface DashboardProps {
  onStart: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onStart }) => {
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const steps = [
    {
      title: "1. AI Deep Parse",
      desc: "Our neural engines break down your resume into core entities: experience, specific skills, and educational milestones.",
      icon: "fa-file-import"
    },
    {
      title: "2. ATS Simulation",
      desc: "We run your data through industry-standard filtering logic to see exactly how bots rank your current keyword density.",
      icon: "fa-robot"
    },
    {
      title: "3. Semantic Mapping",
      desc: "By comparing your profile against the job description, we identify missing critical concepts that recruiters expect to see.",
      icon: "fa-microchip"
    },
    {
      title: "4. Result Synthesis",
      desc: "The AI generates a tailored summary, enhanced impact bullets, and a custom skill-gap roadmap for your career pivot.",
      icon: "fa-pen-fancy"
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto py-12 px-4 animate-fade-in relative">
      <div className="flex flex-col lg:flex-row items-center gap-16 mb-24">
        <div className="flex-1 space-y-8 text-center lg:text-left">
           <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
              <i className="fa-solid fa-sparkles"></i>
              <span>Next-Gen AI Analysis</span>
           </div>
           <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-tight tracking-tight">
             Optimized Resumes for <span className="text-indigo-600">Dream Careers</span>
           </h1>
           <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
             This platform uses advanced language models to analyze job descriptions and optimize your resume for both human recruiters and automated filtering systems.
           </p>
           <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button 
                onClick={onStart}
                className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg flex items-center justify-center gap-3 active:scale-95 text-lg"
              >
                Get Started
                <i className="fa-solid fa-arrow-right"></i>
              </button>
              <button 
                onClick={() => setShowHowItWorks(true)}
                className="px-8 py-4 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-all"
              >
                How it works
              </button>
           </div>
        </div>

        <div className="flex-1 w-full max-w-lg hidden lg:block">
           <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-2xl relative">
              <div className="space-y-6">
                 <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <span className="font-bold text-slate-900">Analysis Preview</span>
                    <span className="px-2 py-1 bg-green-50 text-green-700 text-[10px] font-bold rounded uppercase">System Active</span>
                 </div>
                 <div className="space-y-4">
                    <div className="h-4 bg-slate-100 rounded w-full"></div>
                    <div className="h-4 bg-slate-100 rounded w-5/6"></div>
                    <div className="h-4 bg-slate-100 rounded w-4/6"></div>
                 </div>
                 <div className="grid grid-cols-2 gap-4 mt-8">
                    <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
                       <p className="text-3xl font-black text-indigo-600">98</p>
                       <p className="text-[10px] uppercase font-bold text-slate-400 mt-1">ATS Match</p>
                    </div>
                    <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
                       <p className="text-3xl font-black text-slate-900">A+</p>
                       <p className="text-[10px] uppercase font-bold text-slate-400 mt-1">Readability</p>
                    </div>
                 </div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-indigo-600/5 rounded-full blur-2xl"></div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         {[
           { icon: 'fa-brain', title: 'Smart Analysis', desc: 'Detailed parsing of skills, experience, and keywords using industry-specific data.' },
           { icon: 'fa-file-shield', title: 'ATS Optimized', desc: 'Formatting and density adjustments that ensure you clear the filtering bots.' },
           { icon: 'fa-route', title: 'Career Roadmaps', desc: 'Customized action plans to bridge your skills gap for any targeted role.' }
         ].map((item, idx) => (
           <div key={idx} className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-indigo-200 transition-colors group">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center text-2xl mb-6">
                <i className={`fa-solid ${item.icon}`}></i>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
              <p className="text-slate-600 leading-relaxed text-sm">{item.desc}</p>
           </div>
         ))}
      </div>

      {/* How it Works Modal */}
      {showHowItWorks && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">The CareerCraft Protocol</h2>
                <p className="text-sm text-slate-500">How we transform your application into a high-performance document</p>
              </div>
              <button 
                onClick={() => setShowHowItWorks(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200 transition-colors"
              >
                <i className="fa-solid fa-xmark text-slate-500"></i>
              </button>
            </div>
            
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {steps.map((step, idx) => (
                <div key={idx} className="flex gap-5">
                  <div className="w-14 h-14 shrink-0 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl">
                    <i className={`fa-solid ${step.icon}`}></i>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-900 text-lg">{step.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-8 bg-indigo-600 flex justify-center">
              <button 
                onClick={() => setShowHowItWorks(false)}
                className="px-12 py-3.5 bg-white text-indigo-600 font-bold rounded-2xl hover:bg-indigo-50 transition-all shadow-lg active:scale-95"
              >
                Start Optimization
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;