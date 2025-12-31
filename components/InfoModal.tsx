
import React from 'react';

interface InfoModalProps {
  title: string;
  content: string;
  onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ title, content, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200 transition-colors"
            aria-label={`Close ${title}`}
          >
            <i className="fa-solid fa-xmark text-slate-500"></i>
          </button>
        </div>
        
        <div className="p-8 text-sm text-slate-700 leading-relaxed max-h-[70vh] overflow-y-auto">
          <p>{content}</p>
        </div>

        <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button 
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-all active:scale-95"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;