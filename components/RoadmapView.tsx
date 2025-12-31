
import React, { useEffect } from 'react';
import { AnalysisResult } from '../types';

interface RoadmapViewProps {
  result: AnalysisResult;
}

const RoadmapView: React.FC<RoadmapViewProps> = ({ result }) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []); // Scroll to top when component mounts

  const formatUrl = (url: string) => {
    if (!url || typeof url !== 'string') return '#';
    if (url.startsWith('http')) return url;
    return `https://${url}`;
  };

  const weeklyRoadmap = Array.isArray(result?.weeklyRoadmap) ? result.weeklyRoadmap : [];
  const skillRoadmaps = Array.isArray(result?.skillRoadmaps) ? result.skillRoadmaps : [];

  if (weeklyRoadmap.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-32 text-center space-y-8">
        <div className="w-24 h-24 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto text-4xl">
          <i className="fa-solid fa-hourglass-start animate-pulse"></i>
        </div>
        <h2 className="text-3xl font-black text-slate-900">Roadmap Pending</h2>
        <p className="text-slate-50 font-medium">Our mentor is still architecting your specific growth path. Please try refreshing the analysis.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 space-y-16 animate-in fade-in slide-in-from-right-12 duration-1000 pb-20">
       <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-3 bg-slate-900 border border-slate-800 px-5 py-2 rounded-full shadow-lg mb-2">
             <i className="fa-solid fa-shield-halved text-indigo-400 text-xs"></i>
             <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Professional Execution Blueprint</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-tight">The Path to <span className="gradient-text italic">Excellence</span></h2>
          <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
            A rigorous {weeklyRoadmap.length}-week protocol to align your profile with industry expectations.
          </p>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6">
             <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-8">
                <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-4">Roadmap Specs</h4>
                <div className="space-y-6">
                   <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Intensity Level</span>
                      <span className="text-xl font-black italic text-indigo-600">High Impact</span>
                   </div>
                   <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Strategy Focus</span>
                      <span className="text-xl font-black italic text-purple-600">Enterprise Standard</span>
                   </div>
                </div>
             </div>
          </div>

          <div className="lg:col-span-3 space-y-12">
             <div className="relative border-l-2 border-slate-100 pl-8 lg:pl-12 space-y-16 py-6">
                {weeklyRoadmap.map((item, idx) => (
                   <div key={idx} className="relative animate-in slide-in-from-bottom-8" style={{ animationDelay: `${idx * 150}ms` }}>
                      <div className="absolute -left-[60px] lg:-left-[84px] top-0 w-12 h-12 lg:w-16 lg:h-16 bg-slate-900 rounded-2xl border-4 border-white flex items-center justify-center text-xl lg:text-2xl font-black italic text-white shadow-xl">
                         {idx + 1}
                      </div>
                      <div className="bg-white p-8 lg:p-10 rounded-3xl shadow-sm border border-slate-100 space-y-6 relative">
                         <div className="space-y-2">
                            <h4 className="text-xl lg:text-2xl font-black tracking-tight text-slate-900">{item?.week || `Week ${idx + 1}`}</h4>
                            <p className="text-xs font-black text-indigo-600 uppercase tracking-widest italic">{item?.goal || 'Core Milestone'}</p>
                         </div>
                         <p className="text-base text-slate-600 font-medium leading-relaxed">{item?.focus || 'Systematic skills development.'}</p>
                      </div>
                   </div>
                ))}
             </div>
          </div>
       </div>

       <div className="space-y-10 pt-6">
          <div className="flex items-center gap-6 px-4">
             <div className="w-2 h-12 bg-indigo-600 rounded-full"></div>
             <div>
                <h3 className="text-2xl lg:text-3xl font-black tracking-tight text-slate-900 uppercase">Skill <span className="text-indigo-600 italic">Deep-Dives</span></h3>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
             {skillRoadmaps.map((skill, idx) => (
                <div key={idx} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-8 flex flex-col">
                   <h4 className="text-lg lg:text-xl font-black tracking-tight text-slate-900 leading-tight">{skill?.skillName || 'Competency'}</h4>
                   <div className="bg-indigo-50/40 p-5 rounded-2xl border-l-4 border-indigo-500 italic text-sm font-semibold text-slate-700">
                     "{skill?.whyItMatters || 'Strategic importance defined by market demand.'}"
                   </div>
                   <div className="space-y-3 flex-grow">
                      {Array.isArray(skill?.resources) && skill.resources.map((res, rIdx) => (
                        <a key={rIdx} href={formatUrl(res?.url)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-xl hover:border-indigo-400 transition-all group">
                           <i className="fa-solid fa-arrow-up-right-from-square text-indigo-500 text-xs"></i>
                           <span className="text-[10px] font-black uppercase text-slate-800 truncate">{res?.title || 'Learning Resource'}</span>
                        </a>
                      ))}
                   </div>
                   <div className="pt-6 border-t border-slate-50">
                      <div className="bg-slate-900 p-6 rounded-2xl text-white">
                         <p className="text-[9px] font-black text-indigo-300 uppercase tracking-widest mb-2">Practice Task</p>
                         <p className="text-xs font-bold leading-relaxed">{skill?.practiceTask || 'Practical implementation challenge.'}</p>
                      </div>
                   </div>
                </div>
             ))}
          </div>
       </div>
    </div>
  );
};

export default RoadmapView;
