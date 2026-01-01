
import React, { useState } from 'react';

interface DashboardProps {
  onStart: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onStart }) => {
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  return (
    <div className="w-full max-w-7xl mx-auto py-12 px-6 lg:px-12 animate-fade-in">
      <div className="flex flex-col lg:flex-row items-center gap-20 mb-32">
        <div className="flex-1 space-y-10 text-center lg:text-left">
           <div className="inline-flex items-center gap-3 bg-indigo-50 border border-indigo-100 text-indigo-700 px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-widest shadow-sm">
              <i className="fa-solid fa-sparkles"></i>
              <span>Now Powered by Gemini 3 Pro</span>
           </div>
           <h1 className="text-6xl lg:text-8xl font-black text-slate-900 leading-[0.95] tracking-tighter italic">
             Land Your <br/> <span className="text-indigo-600">Dream Role.</span>
           </h1>
           <p className="text-xl text-slate-500 max-w-xl leading-relaxed font-medium">
             CareerCraft uses world-class neural engines to reconstruct your professional profile for both top-tier recruiters and complex ATS filters.
           </p>
           <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start pt-4">
              <button 
                onClick={onStart}
                className="px-10 py-5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-[0_20px_40px_-15px_rgba(79,70,229,0.3)] flex items-center justify-center gap-4 active:scale-95 text-lg group"
              >
                Analyze My Resume
                <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
              </button>
              <button 
                onClick={() => setShowHowItWorks(true)}
                className="px-10 py-5 bg-white text-slate-900 font-black rounded-2xl border-2 border-slate-100 hover:border-indigo-100 hover:bg-slate-50 transition-all text-lg shadow-sm"
              >
                Learn the Protocol
              </button>
           </div>
           
           <div className="flex items-center justify-center lg:justify-start gap-8 pt-8 opacity-40 grayscale group hover:grayscale-0 transition-all duration-700">
              <i className="fa-brands fa-google text-2xl"></i>
              <i className="fa-brands fa-amazon text-2xl"></i>
              <i className="fa-brands fa-microsoft text-2xl"></i>
              <i className="fa-brands fa-apple text-2xl"></i>
           </div>
        </div>

        <div className="flex-1 w-full max-w-xl hidden lg:block relative">
           <div className="absolute inset-0 bg-indigo-500/20 blur-[120px] rounded-full"></div>
           <div className="relative bg-white border border-slate-200 rounded-[3rem] p-12 shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-700 overflow-hidden">
              <div className="space-y-8">
                 <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                       <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                       <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                       <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                    </div>
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Real-time Analysis</span>
                 </div>
                 
                 <div className="space-y-4">
                    <div className="h-2.5 bg-slate-100 rounded-full w-full"></div>
                    <div className="h-2.5 bg-slate-100 rounded-full w-5/6"></div>
                    <div className="h-2.5 bg-indigo-600 rounded-full w-4/6"></div>
                 </div>

                 <div className="grid grid-cols-2 gap-6 mt-12">
                    <div className="p-8 bg-slate-50 rounded-3xl text-center border border-slate-100">
                       <p className="text-5xl font-black text-indigo-600">92</p>
                       <p className="text-[10px] uppercase font-black text-slate-400 mt-2 tracking-widest">ATS Match</p>
                    </div>
                    <div className="p-8 bg-slate-50 rounded-3xl text-center border border-slate-100">
                       <p className="text-5xl font-black text-slate-900">A+</p>
                       <p className="text-[10px] uppercase font-black text-slate-400 mt-2 tracking-widest">Readability</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
         {[
           { icon: 'fa-microchip', title: 'Gemini 3 Pro Core', desc: 'Advanced neural analysis of skills, experience gaps, and semantic alignment.' },
           { icon: 'fa-shield-halved', title: 'ATS Sanitization', desc: 'Automated formatting that ensures your documents are 100% OCR readable.' },
           { icon: 'fa-bullseye', title: 'Quantified Impact', desc: 'Reconstruction of your career history using high-impact STAR metrics.' }
         ].map((item, idx) => (
           <div key={idx} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 hover:border-indigo-200 transition-all group shadow-sm hover:shadow-xl">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform">
                <i className={`fa-solid ${item.icon}`}></i>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight italic">{item.title}</h3>
              <p className="text-slate-500 leading-relaxed font-medium">{item.desc}</p>
           </div>
         ))}
      </div>

      {showHowItWorks && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-200">
            <div className="p-12 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <div>
                <h2 className="text-3xl font-black text-slate-900 italic tracking-tighter">The CareerCraft Protocol</h2>
                <p className="text-slate-500 font-bold uppercase text-[11px] tracking-widest mt-1">High-performance engineering for your career</p>
              </div>
              <button 
                onClick={() => setShowHowItWorks(false)}
                className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-slate-200 transition-colors"
              >
                <i className="fa-solid fa-xmark text-slate-500 text-xl"></i>
              </button>
            </div>
            
            <div className="p-12 grid grid-cols-1 md:grid-cols-2 gap-12">
              {[
                { title: "Deep Entity Extraction", icon: "fa-binary", desc: "We decompose your resume into semantic entities across experience and education." },
                { title: "Semantic Gap Mapping", icon: "fa-code-compare", desc: "Compare your profile against job descriptions to find critical missing terminology." },
                { title: "Impact Quantization", icon: "fa-chart-line", desc: "Rewrite bullets to emphasize results over responsibilities." },
                { title: "Voice Coach Briefing", icon: "fa-waveform-lines", desc: "Receive a personalized audio summary of your strategic next steps." }
              ].map((step, idx) => (
                <div key={idx} className="flex gap-6">
                  <div className="w-16 h-16 shrink-0 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl font-black">
                    {idx + 1}
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-black text-slate-900 text-xl italic">{step.title}</h3>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-12 bg-indigo-600 flex justify-center">
              <button 
                onClick={() => setShowHowItWorks(false)}
                className="px-16 py-5 bg-white text-indigo-600 font-black rounded-2xl hover:bg-indigo-50 transition-all shadow-2xl active:scale-95 text-lg"
              >
                Initialize My Analysis
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
