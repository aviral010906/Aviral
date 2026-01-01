
import React, { useEffect } from 'react';
import { ResumeData, AnalysisResult } from '../types';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface ResumePreviewProps {
  data: ResumeData;
  analysis: AnalysisResult;
  onBack: () => void;
  loggedInUserName?: string | null;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ data, analysis, onBack, loggedInUserName }) => {
  const displayName = loggedInUserName || data.name || "Candidate Elite";

  const handleDownload = async () => {
    const resumeDocument = document.getElementById('resume-document');
    if (!resumeDocument) return;

    const safeName = displayName.replace(/\s+/g, '_');
    
    // Preparation for PDF capture
    const originalStyles = resumeDocument.getAttribute('style') || '';
    resumeDocument.style.width = '800px';
    resumeDocument.style.padding = '40px';
    resumeDocument.style.boxShadow = 'none';
    resumeDocument.style.border = 'none';

    try {
      const canvas = await html2canvas(resumeDocument, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width / 3, canvas.height / 3]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 3, canvas.height / 3);
      pdf.save(`${safeName}_CareerCraft_Optimized.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      resumeDocument.setAttribute('style', originalStyles);
    }
  };

  const experienceList = data.experience || [];
  const allSkills = Array.from(new Set([...(data.skills || []), ...(analysis.matchedSkills || [])])).slice(0, 18);

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10 flex justify-between items-center px-4 md:px-0">
        <button 
          onClick={onBack}
          className="px-6 py-3 rounded-2xl text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
        >
          <i className="fa-solid fa-arrow-left"></i>
          Back to Insights
        </button>
        <button 
          onClick={handleDownload}
          className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-sm font-black flex items-center gap-3 hover:bg-black transition-all shadow-xl active:scale-95"
        >
          <i className="fa-solid fa-download"></i>
          Export ATS-Optimized PDF
        </button>
      </div>

      <div 
        id="resume-document"
        className="bg-white p-12 md:p-20 shadow-[0_0_100px_rgba(0,0,0,0.05)] border border-slate-100 min-h-[1100px] flex flex-col font-serif"
        style={{ fontFamily: "'Times New Roman', serif" }} // Standard ATS font
      >
        {/* Simple, ATS-Friendly Header */}
        <header className="border-b-2 border-slate-900 pb-10 text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold uppercase tracking-tighter text-slate-900">{displayName}</h1>
          <div className="flex justify-center gap-4 text-sm font-semibold text-slate-600 uppercase tracking-widest">
            {data.email && <span>{data.email}</span>}
            {data.phone && <span>• {data.phone}</span>}
          </div>
          <p className="text-xs font-bold text-indigo-600 uppercase tracking-[0.3em]">Senior Professional Profile</p>
        </header>

        <div className="space-y-12">
          {/* Summary */}
          <section className="space-y-4">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] border-b border-slate-200 pb-2">Professional Summary</h2>
            <p className="text-base text-slate-700 leading-relaxed">
              {analysis.tailoredSummary || data.summary}
            </p>
          </section>

          {/* Core Competencies */}
          <section className="space-y-4">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] border-b border-slate-200 pb-2">Technical Core Competencies</h2>
            <div className="grid grid-cols-3 gap-y-2">
              {allSkills.map((skill, i) => (
                <div key={i} className="text-sm text-slate-700 font-medium">• {skill}</div>
              ))}
            </div>
          </section>

          {/* Professional Experience */}
          <section className="space-y-8">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] border-b border-slate-200 pb-2">Professional Experience</h2>
            <div className="space-y-10">
              {experienceList.map((exp, i) => (
                <div key={i} className="space-y-4">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-lg font-bold text-slate-900 uppercase">{exp.role}</h3>
                    <span className="text-sm font-bold text-slate-500 uppercase">{exp.duration}</span>
                  </div>
                  <p className="text-sm font-bold text-indigo-700 italic">{exp.company}</p>
                  
                  <ul className="space-y-3 pl-4">
                    {(i === 0 && analysis.enhancedBullets ? analysis.enhancedBullets : (exp.description || [])).map((bullet, idx) => (
                      <li key={idx} className="text-sm text-slate-700 leading-relaxed list-disc">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Education */}
          <section className="space-y-4">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] border-b border-slate-200 pb-2">Education & Certifications</h2>
            <div className="space-y-4">
              {(data.education || []).map((edu, i) => (
                <div key={i} className="flex justify-between items-baseline">
                  <div>
                    <span className="font-bold text-slate-900 uppercase">{edu.degree}</span>
                    <span className="text-slate-500 ml-2">| {edu.institution}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-400">{edu.year}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <footer className="mt-auto pt-20 text-[10px] text-slate-300 text-center uppercase tracking-[0.5em] font-bold italic">
          Optimized for ATS Integrity via CareerCraft AI
        </footer>
      </div>
    </div>
  );
};

export default ResumePreview;
