
import React, { useState } from 'react';
import { AnalysisResult } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { generateVoiceBriefing, decodeAudio } from '../services/geminiService';

interface AnalysisViewProps {
  result: AnalysisResult;
  onReset: () => void;
  onViewResume: () => void;
  onActionPlan: () => void;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ result, onReset, onViewResume, onActionPlan }) => {
  const [isPlayingBrief, setIsPlayingBrief] = useState(false);

  const chartData = [
    { name: 'Match', value: result.keywordMatchScore },
    { name: 'Gap', value: Math.max(0, 100 - result.keywordMatchScore) },
  ];

  const radarData = [
    { subject: 'ATS Logic', A: result.atsScore, fullMark: 100 },
    { subject: 'Readability', A: result.readabilityScore, fullMark: 100 },
    { subject: 'Impact', A: result.quantifiedImpactScore || 70, fullMark: 100 },
    { subject: 'Format', A: result.formattingHealthScore || 80, fullMark: 100 },
    { subject: 'Keywords', A: result.keywordMatchScore, fullMark: 100 },
  ];

  const COLORS = ['#4f46e5', '#f1f5f9'];

  const handlePlayBriefing = async () => {
    if (isPlayingBrief) return;
    setIsPlayingBrief(true);
    try {
      const audioData = await generateVoiceBriefing(result.voiceBriefingText);
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const buffer = await decodeAudio(audioData, ctx);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.onended = () => setIsPlayingBrief(false);
      source.start();
    } catch (err) {
      console.error("Audio failed", err);
      setIsPlayingBrief(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4 space-y-10 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-[10px] font-black uppercase tracking-widest">
            <i className="fa-solid fa-circle-check"></i>
            Optimization Complete
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Executive Dashboard</h2>
          <p className="text-slate-500 font-medium">Strategic alignment analysis for your next career move.</p>
        </div>
        <div className="flex gap-3 flex-wrap">
           <button 
             onClick={handlePlayBriefing}
             disabled={isPlayingBrief}
             className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-black transition-all flex items-center gap-2 shadow-lg disabled:opacity-50"
           >
             <i className={`fa-solid ${isPlayingBrief ? 'fa-spinner animate-spin' : 'fa-play-circle'}`}></i>
             AI Coach Briefing
           </button>
           <button 
             onClick={onViewResume}
             className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg"
           >
             <i className="fa-solid fa-file-pdf"></i>
             Optimized Resume
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Stats Card */}
        <div className="lg:col-span-4 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center space-y-8">
           <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest text-center">ATS Match Compatibility</h3>
           <div className="relative w-full aspect-square max-w-[220px]">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie data={chartData} innerRadius="75%" outerRadius="100%" paddingAngle={5} dataKey="value" stroke="none" cornerRadius={6}>
                   {chartData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                   ))}
                 </Pie>
               </PieChart>
             </ResponsiveContainer>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <p className="text-5xl font-black text-indigo-600">{result.keywordMatchScore}%</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Total Alignment</p>
             </div>
           </div>
           <div className="w-full space-y-3">
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
                <span>Formatting Health</span>
                <span className="text-slate-900">{result.formattingHealthScore}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500" style={{ width: `${result.formattingHealthScore}%` }}></div>
              </div>
           </div>
        </div>

        {/* Diagnostic Chart */}
        <div className="lg:col-span-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
           <div className="flex justify-between items-center mb-10">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Diagnostic Breakdown</h3>
              <div className="flex gap-4">
                 <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div> Current
                 </div>
              </div>
           </div>
           <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11, fontWeight: '800' }} />
                  <Radar name="Score" dataKey="A" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.15} />
                </RadarChart>
              </ResponsiveContainer>
           </div>
        </div>
      </div>

      {/* Critical Gaps Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-sm font-black text-rose-500 uppercase tracking-widest flex items-center gap-2">
               <i className="fa-solid fa-triangle-exclamation"></i>
               Critical Missing Keywords
            </h3>
            <div className="flex flex-wrap gap-2">
               {(result.missingKeywords || []).map((keyword, i) => (
                  <span key={i} className="px-4 py-2 bg-rose-50 text-rose-700 text-xs font-bold rounded-xl border border-rose-100">
                     {keyword}
                  </span>
               ))}
            </div>
         </div>

         <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-sm font-black text-indigo-500 uppercase tracking-widest flex items-center gap-2">
               <i className="fa-solid fa-sparkles"></i>
               AI Optimized Summary
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed italic font-medium">
               "{result.tailoredSummary}"
            </p>
         </div>
      </div>

      {/* STAR Implementation Preview */}
      <div className="bg-indigo-600 rounded-[2.5rem] p-10 lg:p-16 text-white relative overflow-hidden group">
         <div className="relative z-10 space-y-10">
            <div className="space-y-4">
               <h3 className="text-3xl font-black italic tracking-tight">STAR Impact Reconstruction</h3>
               <p className="text-indigo-100 font-medium max-w-xl">We've transformed your experience bullets to highlight quantified impact—the #1 thing modern recruiters look for.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {(result.enhancedBullets || []).slice(0, 2).map((bullet, idx) => (
                  <div key={idx} className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                     <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-white text-indigo-600 flex items-center justify-center shrink-0 font-black text-xs">
                           {idx + 1}
                        </div>
                        <p className="text-sm font-semibold leading-relaxed">{bullet}</p>
                     </div>
                  </div>
               ))}
            </div>

            <button 
              onClick={onActionPlan}
              className="mt-6 px-10 py-4 bg-white text-indigo-600 font-black rounded-2xl hover:bg-indigo-50 transition-all shadow-2xl flex items-center gap-3 active:scale-95"
            >
              Bridge Your Skill Gaps
              <i className="fa-solid fa-arrow-right"></i>
            </button>
         </div>
         <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-white/5 rounded-full blur-[100px] pointer-events-none"></div>
      </div>
    </div>
  );
};

export default AnalysisView;
