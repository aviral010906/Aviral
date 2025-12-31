
import React, { useEffect } from 'react';
import { ResumeData, AnalysisResult } from '../types';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface ResumePreviewProps {
  data: ResumeData;
  analysis: AnalysisResult;
  onBack: () => void;
  loggedInUserName?: string | null; // New prop for logged-in user's name
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ data, analysis, onBack, loggedInUserName }) => {
  useEffect(() => {
    const originalTitle = document.title;
    const displayName = loggedInUserName || data.name || "Candidate Elite";
    const safeName = displayName.replace(/\s+/g, '_');
    document.title = `${safeName}_Optimized_Resume`;
    return () => {
      document.title = originalTitle;
    };
  }, [data.name, loggedInUserName]);

  const handleDownload = async () => {
    const resumeDocument = document.getElementById('resume-document');
    if (resumeDocument) {
      const displayName = loggedInUserName || data.name || "Candidate Elite";
      const safeName = displayName.replace(/\s+/g, '_');

      // Temporarily adjust styles for better PDF rendering
      const originalStyles = {
          padding: resumeDocument.style.padding,
          margin: resumeDocument.style.margin,
          boxShadow: resumeDocument.style.boxShadow,
          border: resumeDocument.style.border,
          minHeight: resumeDocument.style.minHeight,
          width: resumeDocument.style.width,
          maxWidth: resumeDocument.style.maxWidth,
          backgroundColor: resumeDocument.style.backgroundColor,
      };
      
      resumeDocument.style.padding = '0';
      resumeDocument.style.margin = '0';
      resumeDocument.style.boxShadow = 'none';
      resumeDocument.style.border = 'none';
      // Set to A4 width, height will be auto calculated by html2canvas
      resumeDocument.style.width = '210mm'; 
      resumeDocument.style.maxWidth = '210mm'; 
      resumeDocument.style.minHeight = 'auto'; 
      resumeDocument.style.backgroundColor = 'white'; // Ensure white background for PDF

      try {
        const canvas = await html2canvas(resumeDocument, {
          scale: 2, // Increase scale for better resolution
          useCORS: true, 
          logging: false,
          windowWidth: resumeDocument.scrollWidth,
          windowHeight: resumeDocument.scrollHeight,
          backgroundColor: null, // Let the background of the element apply
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4'); // 'p' for portrait, 'mm' for millimeters, 'a4' for A4 size

        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        pdf.save(`${safeName}_Optimized_Resume.pdf`);
      } catch (err) {
        console.error("Error generating PDF:", err);
        alert("Failed to generate PDF. Please try again.");
      } finally {
        // Restore original styles
        for (const style in originalStyles) {
            // @ts-ignore
            resumeDocument.style[style] = originalStyles[style];
        }
      }
    }
  };

  // Merge Skills for full coverage
  const allSkills = Array.from(new Set([
    ...(data.skills || []), 
    ...(analysis.matchedSkills || [])
  ])).filter(Boolean).slice(0, 20);

  // Experience with AI-Enhanced fallback
  const experienceList = data.experience && data.experience.length > 0 
    ? data.experience 
    : [
        {
          role: "Industry Specialist",
          company: "Current Corporation",
          duration: "2020 - Present",
          description: ["Proven track record of delivering high-performance solutions and operational leadership."]
        }
      ];

  const displayName = loggedInUserName || data.name || "Candidate Elite";

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 flex justify-between items-center print:hidden px-4 sm:px-0">
        <button 
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm"
        >
          <i className="fa-solid fa-arrow-left text-xs"></i>
          Back to Analysis
        </button>
        <button 
          onClick={handleDownload}
          className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-black transition-all shadow-xl active:scale-95"
        >
          <i className="fa-solid fa-file-pdf text-xs"></i> {/* Changed icon to PDF */}
          Download PDF
        </button>
      </div>

      <div className="bg-white shadow-[0_0_80px_rgba(0,0,0,0.06)] w-full mx-auto print:shadow-none print:m-0 print:w-full min-h-[11in] flex flex-col border border-slate-100" id="resume-document">
        
        {/* Modern Professional Header */}
        <header className="bg-slate-900 text-white p-12 md:p-16 flex flex-col md:flex-row justify-between items-center md:items-end gap-8">
          <div className="space-y-4 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-tight">
              {displayName} {/* Use loggedInUserName or fallback */}
            </h1>
            <div className="h-1.5 w-24 bg-indigo-500 mx-auto md:ml-0"></div>
            <p className="text-indigo-400 font-bold text-lg tracking-[0.2em] uppercase">Executive Professional</p>
          </div>
          <div className="flex flex-col gap-3 text-xs font-bold text-slate-300 md:text-right uppercase tracking-widest">
            {data.email && (
              <div className="flex items-center md:justify-end gap-3">
                <span>{data.email}</span>
                <i className="fa-solid fa-envelope text-indigo-500 w-4"></i>
              </div>
            )}
            {data.phone && (
              <div className="flex items-center md:justify-end gap-3">
                <span>{data.phone}</span>
                <i className="fa-solid fa-phone text-indigo-500 w-4"></i>
              </div>
            )}
            <div className="flex items-center md:justify-end gap-3">
              <span>Linkedin Networked</span>
              <i className="fa-brands fa-linkedin text-indigo-500 w-4"></i>
            </div>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row flex-grow">
          {/* Enhanced Profile Sidebar */}
          <aside className="w-full lg:w-1/3 bg-slate-50 p-12 border-r border-slate-100 space-y-12">
            <section>
              <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                Profile Strategy
                <div className="h-[1px] bg-indigo-200 flex-grow"></div>
              </h2>
              <p className="text-slate-600 leading-relaxed text-[13px] font-medium italic">
                {analysis.tailoredSummary || data.summary || "Strategically aligned professional focused on operational excellence and high-impact industry solutions."}
              </p>
            </section>

            <section>
              <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                Core Expertise
                <div className="h-[1px] bg-indigo-200 flex-grow"></div>
              </h2>
              <div className="flex flex-wrap gap-2">
                {allSkills.map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-white border border-slate-200 text-slate-800 text-[10px] font-bold uppercase tracking-wider rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                Education
                <div className="h-[1px] bg-indigo-200 flex-grow"></div>
              </h2>
              <div className="space-y-6">
                {(data.education && data.education.length > 0 ? data.education : [{ degree: "Bachelor of Science", institution: "Regional University", year: "2019" }]).map((edu, i) => (
                  <div key={i} className="space-y-1">
                    <h3 className="font-bold text-slate-900 text-xs uppercase leading-tight">{edu.degree}</h3>
                    <p className="text-[11px] text-indigo-600 font-bold italic">{edu.institution}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">{edu.year}</p>
                  </div>
                ))}
              </div>
            </section>
          </aside>

          {/* Impact-Driven Experience Body */}
          <main className="w-full lg:w-2/3 p-12 md:p-16 space-y-12">
            <section>
              <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] mb-10 flex items-center gap-4">
                Professional Trajectory
                <div className="h-[1px] bg-slate-200 flex-grow"></div>
              </h2>
              <div className="space-y-12">
                {experienceList.map((exp, i) => (
                  <div key={i} className="relative">
                    <div className="flex flex-col sm:flex-row justify-between items-baseline mb-4 gap-2">
                      <div className="space-y-1">
                        <h3 className="text-xl font-black text-slate-900">{exp.role}</h3>
                        <p className="text-sm font-bold text-indigo-600 uppercase tracking-widest">{exp.company}</p>
                      </div>
                      <span className="text-[10px] font-black text-slate-400 border border-slate-100 px-3 py-1 rounded-full uppercase tracking-tighter">
                        {exp.duration}
                      </span>
                    </div>
                    
                    <ul className="space-y-4">
                      {/* Use AI-enhanced bullets for the first experience if available */}
                      {(i === 0 && analysis.enhancedBullets && analysis.enhancedBullets.length > 0 ? analysis.enhancedBullets : (exp.description || [])).map((bullet, idx) => (
                        <li key={idx} className="flex gap-4 text-slate-700 text-[13.5px] leading-relaxed font-medium">
                          <span className="text-indigo-500 mt-2 shrink-0">
                            <i className="fa-solid fa-circle text-[5px]"></i>
                          </span>
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          </main>
        </div>

        <footer className="mt-auto bg-slate-50 p-6 text-[9px] text-slate-400 text-center uppercase tracking-[0.4em] font-bold border-t border-slate-100">
          Curated via CareerCraft Intelligent Optimization Engine
        </footer>
      </div>

      <style>{`
        @media print {
          @page { margin: 0; size: auto; }
          body { background: white !important; margin: 0 !important; }
          #resume-document { box-shadow: none !important; border: none !important; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default ResumePreview;