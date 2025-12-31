
import React from 'react';
import { AppState } from '../types';

interface HeaderProps {
  isAuthenticated: boolean;
  userName?: string | null;
  onOpenLoginModal: () => void;
  onLogout: () => void;
  onNavigate: (state: AppState) => void;
}

const Header: React.FC<HeaderProps> = ({ isAuthenticated, userName, onOpenLoginModal, onLogout, onNavigate }) => {
  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end h-20 items-center">
          <div className="flex items-center gap-6">
             {isAuthenticated ? (
               <div className="flex items-center gap-6">
                 <div className="flex items-center gap-2">
                   <div className="w-8 h-8 bg-indigo-50 rounded-full flex items-center justify-center">
                      <i className="fa-solid fa-user-check text-indigo-600 text-xs"></i>
                   </div>
                   <span className="text-slate-700 font-bold text-sm">{userName || 'Member'}</span>
                 </div>
                 <button
                   onClick={onLogout}
                   className="text-slate-500 hover:text-indigo-600 font-black text-[11px] uppercase tracking-widest transition-colors px-4 py-2 flex items-center gap-2"
                 >
                   <i className="fa-solid fa-right-from-bracket"></i>
                   Sign Out
                 </button>
               </div>
             ) : (
               <button
                 onClick={onOpenLoginModal}
                 className="text-slate-500 hover:text-indigo-600 font-black text-[11px] uppercase tracking-widest transition-colors px-4 py-2 flex items-center gap-2"
               >
                 <i className="fa-solid fa-user"></i>
                 Sign In
               </button>
             )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
