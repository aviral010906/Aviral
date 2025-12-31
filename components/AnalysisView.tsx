
import React from 'react';
import { AnalysisResult } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';

interface AnalysisViewProps {
  result: AnalysisResult;
  onReset: () => void;
  onViewResume: () => void;
  onActionPlan: () => void;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ result, onReset, onViewResume, onActionPlan }) => {
  const chartData = [
    { name: 'Match', value: result.keywordMatchScore },
    { name: 'Gap', value: Math.max(0, 100 - result.keywordMatchScore) },
  ];

  const radarData = [
    { subject: 'ATS Score', A: result.atsScore, fullMark: 100 },
    { subject: 'Readability', A: result.readabilityScore, fullMark: 100 },
    { subject: 'Keywords', A: result.keywordMatchScore, fullMark: 100 },
    { subject: 'Impact', A: result.recruiterSimulationScore || 85, fullMark: 100 },
  ];

  const COLORS = ['#4f46e5', '#f1f5f9'];

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4 space-y-10 animate-fade-in pb-20">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900">Analysis Complete</h2>
          <p className="text-slate-500 mt-1">Here is how your profile aligns with the target role.</p>
        </div>
        <div className="flex gap-3">
           <button 
             onClick={onViewResume}
             className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-2"
           >
             <i className="fa-solid fa-file-lines"></i>
             View Optimized CV
           </button>
           <button 
             onClick={onReset}
             className="px-6 py-3 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-all"
           >
             New Analysis
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Core Match Chart */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center">
           <h3 className="text-lg font-bold text-slate-900 mb-8 w-full">Keyword Match Rate</h3>
           <div className="relative w-full aspect-square max-w-[200px] mb-8">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie data={chartData} innerRadius="75%" outerRadius="100%" paddingAngle={5} dataKey="value" stroke="none" cornerRadius={4}>
                   {chartData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                   ))}
                 </Pie>
               </PieChart>
             </ResponsiveContainer>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <p className="text-4xl font-extrabold text-indigo-600">{result.keywordMatchScore}%</p>
             </div>
           </div>
           <p className="text-sm text-center text-slate-500 leading-relaxed">
             Your profile matches the essential terminology required for this position.
           </p>
        </div>

        {/* Detailed Stats */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
           <h3 className="text-lg font-bold text-slate-900 mb-8">Diagnostic Breakdown</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                 {[
                   { label: 'ATS Formatting', value: result.atsScore, color: 'bg-indigo-600' },
                   { label: 'Content Readability', value: result.readabilityScore, color: 'bg-indigo-400' },
                   { label: 'Market Impact', value: result.recruiterSimulationScore || 85, color: 'bg-indigo-800' }
                 ].map((stat, i) => (
                   <div key={i} className="space-y-2">
                      <div className="flex justify-between items-end">
                         <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">{stat.label}</span>
                         <span className="text-lg font-bold text-slate-900">{stat.value}%</span>
                      </div>
                      <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                         <div className={`h-full ${stat.color} transition-all duration-700`} style={{ width: `${stat.value}%` }}></div>
                      </div>
                   </div>
                 ))}
              </div>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} />
                    <Radar name="Score" dataKey="A" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.1} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
           </div>
        </div>
      </div>

      {/* Narrative Section */}
      <div className="bg-white p-10 rounded-2xl border border-slate-200 shadow-sm space-y-8">
         <div>
            <h3 className="text-xl font-bold text-slate-900">Executive Summary Optimization</h3>
            <p className="text-slate-500 mt-1">AI-reconstructed profile summary for maximum impact.</p>
         </div>
         
         <div className="p-6 bg-slate-50 border border-slate-100 rounded-xl italic text-slate-700 leading-relaxed">
            "{result.tailoredSummary}"
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(result.enhancedBullets || []).slice(0, 4).map((bullet, idx) => (
              <div key={idx} className="flex gap-4 p-5 bg-white border border-slate-100 rounded-xl items-start">
                 <div className="w-6 h-6 bg-indigo-50 text-indigo-600 rounded flex items-center justify-center shrink-0 mt-1">
                    <i className="fa-solid fa-check text-xs"></i>
                 </div>
                 <p className="text-sm text-slate-700">{bullet}</p>
              </div>
            ))}
         </div>
      </div>

      {/* CTA */}
      <div className="bg-slate-900 rounded-2xl p-10 text-center text-white space-y-6">
         <h3 className="text-2xl font-bold">Ready to take action?</h3>
         <p className="text-slate-400 max-w-xl mx-auto">We've identified your skill gaps and created a personalized roadmap to help you bridge them.</p>
         <button 
           onClick={onActionPlan}
           className="px-10 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg inline-flex items-center gap-3 active:scale-95"
         >
           View Strategic Path
           <i className="fa-solid fa-arrow-right"></i>
         </button>
      </div>
    </div>
  );
};

export default AnalysisView;
