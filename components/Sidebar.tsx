
import React from 'react';
import { AppState } from '../types';

interface SidebarProps {
  activeState: AppState;
  onNavigate: (state: AppState) => void;
  hasResult: boolean;
  isAuthenticated: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activeState, onNavigate, hasResult, isAuthenticated }) => {
  const menuItems = [
    { id: AppState.IDLE, icon: 'fa-house', label: 'Home' },
    { id: AppState.UPLOADING, icon: 'fa-plus', label: 'Start Analysis' },
    { id: AppState.RESULT, icon: 'fa-chart-simple', label: 'My Report', disabled: !hasResult },
    { id: AppState.ROADMAP, icon: 'fa-map', label: 'Action Plan', disabled: !hasResult },
    { id: AppState.HISTORY, icon: 'fa-clock-rotate-left', label: 'History', hidden: !isAuthenticated },
  ];

  return (
    <aside className="w-full md:w-64 bg-white border-r border-slate-200 h-full flex flex-col z-50">
      <div className="p-8 border-b border-slate-100 flex items-center gap-3 cursor-pointer" onClick={() => onNavigate(AppState.IDLE)}>
        <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-sm shadow-lg">
          <i className="fa-solid fa-bolt-lightning"></i>
        </div>
        <span className="text-xl font-black text-slate-900 tracking-tighter italic uppercase">Career<span className="text-indigo-600">Craft</span></span>
      </div>

      <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-3 mb-4">Platform</p>
        {menuItems.filter(item => !item.hidden).map((item) => (
          <button
            key={item.id}
            disabled={item.disabled}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[13px] transition-all ${
              activeState === item.id 
                ? 'bg-indigo-50 text-indigo-700 font-bold shadow-sm' 
                : item.disabled ? 'opacity-30 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-50 font-medium'
            }`}
          >
            <i className={`fa-solid ${item.icon} w-5 text-center`}></i>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
