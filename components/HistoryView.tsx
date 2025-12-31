
import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { AnalysisResult, ResumeData } from '../types';

interface HistoryItem {
  id: string;
  job_title: string;
  created_at: string;
  job_description: string;
  resume_data: ResumeData;
  analysis_result: AnalysisResult;
}

interface HistoryViewProps {
  onSelect: (item: HistoryItem) => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ onSelect }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!session) throw new Error("Please sign in to view your history.");

      const { data, error: fetchError } = await supabase
        .from('analyses')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setHistory(data || []);
    } catch (err: any) {
      console.error("Fetch history error:", err);
      setError(err.message || "Failed to load history.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-6 animate-pulse">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl"></div>
        <div className="space-y-3 text-center">
          <div className="h-4 w-48 bg-slate-100 rounded-full mx-auto"></div>
          <div className="h-3 w-32 bg-slate-50 rounded-full mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-12 text-center bg-rose-50 border border-rose-100 rounded-3xl text-rose-600 max-w-2xl mx-auto my-12">
        <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-600">
           <i className="fa-solid fa-triangle-exclamation text-2xl"></i>
        </div>
        <h3 className="text-xl font-bold mb-2">Access Restricted</h3>
        <p className="font-medium opacity-80 mb-8">{error}</p>
        <button 
          onClick={fetchHistory} 
          className="px-8 py-3 bg-rose-600 text-white rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-rose-700 transition-all shadow-lg active:scale-95"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="p-20 text-center space-y-6">
        <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto text-slate-200 border border-slate-100">
          <i className="fa-solid fa-folder-open text-4xl"></i>
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Vault Empty</h3>
          <p className="text-slate-500 mt-2 max-w-sm mx-auto font-medium">Your career optimizations will appear here once you perform an analysis.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-3">
             <i className="fa-solid fa-box-archive"></i>
             Optimization History
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Your Vault</h2>
          <p className="text-slate-500 font-medium mt-1">Review and manage your past resume optimizations.</p>
        </div>
        <div className="text-slate-400 text-xs font-bold uppercase tracking-widest">
           {history.length} Record{history.length !== 1 ? 's' : ''} Found
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {history.map((item) => (
          <div 
            key={item.id} 
            onClick={() => onSelect(item)}
            className="group bg-white p-8 rounded-[2rem] border border-slate-200 hover:border-indigo-500 hover:shadow-2xl transition-all cursor-pointer relative flex flex-col h-full"
          >
            <div className="flex justify-between items-start mb-8">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-xl shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                <i className="fa-solid fa-file-contract"></i>
              </div>
            </div>

            <div className="space-y-2 flex-grow">
              <h3 className="text-xl font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2">
                {item.job_title}
              </h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>

            <div className="mt-10 pt-6 border-t border-slate-50 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">ATS Rank</span>
                <span className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {item.analysis_result.atsScore}%
                </span>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-sm">
                <i className="fa-solid fa-arrow-right text-xs"></i>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryView;
