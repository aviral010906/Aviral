
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import UploadSection from './components/UploadSection';
import AnalysisView from './components/AnalysisView';
import ResumePreview from './components/ResumePreview';
import RoadmapView from './components/RoadmapView';
import HistoryView from './components/HistoryView';
import Footer from './components/Footer';
import ContactModal from './components/ContactModal';
import InfoModal from './components/InfoModal';
import Header from './components/Header';
import LoginPage from './components/LoginPage';
import { AppState, ResumeData, AnalysisResult } from './types';
import { parseResumeText, analyzeResume } from './services/geminiService';
import { supabase } from './services/supabase';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [resumeText, setResumeText] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [parsedData, setParsedData] = useState<ResumeData | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingStartTime, setLoadingStartTime] = useState<number | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoModalContent, setInfoModalContent] = useState<{ title: string; content: string } | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginModalMode, setLoginModalMode] = useState<'auth' | 'recovery'>('auth');
  const [loggedInUserName, setLoggedInUserName] = useState<string | null>(null);

  // Supabase session initialization and listener
  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsAuthenticated(true);
        setLoggedInUserName(session.user.user_metadata.full_name || session.user.email);
      }
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setLoginModalMode('recovery');
        setShowLoginModal(true);
      }

      if (session) {
        setIsAuthenticated(true);
        setLoggedInUserName(session.user.user_metadata.full_name || session.user.email);
        // Only close if we're not explicitly in recovery mode handled by the modal
        if (event !== 'PASSWORD_RECOVERY') {
          setShowLoginModal(false);
        }
      } else {
        setIsAuthenticated(false);
        setLoggedInUserName(null);
        setAppState(AppState.IDLE); // Reset to idle on sign out
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    let timer: number;
    if (appState === AppState.ANALYZING && loadingStartTime) {
      timer = window.setInterval(() => {
        const duration = (Date.now() - loadingStartTime) / 1000;
        if (duration > 15 && duration < 16) {
          setError("The AI engine is deep-parsing your experience...");
          setTimeout(() => setError(null), 3000);
        }
        if (duration > 35 && duration < 36) {
          setError("Synthesizing your career roadmap. Almost done...");
          setTimeout(() => setError(null), 3000);
        }
        if (duration > 60) {
          setError("Request timed out. This can happen with very large job descriptions. Please try a more concise version.");
          setAppState(AppState.UPLOADING);
          setLoadingStartTime(null);
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [appState, loadingStartTime]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = (event.target?.result as string) || '';
        setResumeText(text);
        const data = await parseResumeText(text);
        setParsedData(data);
      } catch (err) {
        console.warn("Background parse failed.");
      }
    };
    reader.readAsText(file);
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim() || !jobDescription.trim() || !jobTitle.trim()) {
      setError("Please provide your resume, the job title, and the job description.");
      return;
    }
    
    setAppState(AppState.ANALYZING);
    setLoadingStartTime(Date.now());
    setError(null);
    
    try {
      let currentData = parsedData;
      if (!currentData || !currentData.name || currentData.name === "Candidate Elite") {
        currentData = await parseResumeText(resumeText);
        setParsedData(currentData);
      }
      
      const result = await analyzeResume(currentData, jobTitle, jobDescription);
      
      if (result) {
        setAnalysisResult(result);
        
        // Persist to Supabase if authenticated
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { error: insertError } = await supabase
            .from('analyses')
            .insert([
              {
                user_id: user.id,
                job_title: jobTitle,
                job_description: jobDescription,
                resume_data: currentData,
                analysis_result: result
              }
            ]);
          
          if (insertError) {
            console.error("Database persistence error:", insertError.message);
          }
        }
        
        setAppState(AppState.RESULT);
      } else {
        throw new Error("Analysis engine returned no data.");
      }
    } catch (err: any) {
      console.error("Analysis Error:", err);
      setError(err.message || "An unexpected error occurred. Please try again.");
      setAppState(AppState.UPLOADING);
    } finally {
      setLoadingStartTime(null);
    }
  };

  const navigateTo = (state: AppState) => {
    if ((state === AppState.RESULT || state === AppState.ROADMAP) && !analysisResult) return;
    setAppState(state);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const reset = () => {
    setAppState(AppState.IDLE);
    setAnalysisResult(null);
    setParsedData(null);
    setError(null);
    setResumeText('');
    setJobTitle('');
    setJobDescription('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenInfoModal = (title: string, content: string) => {
    setInfoModalContent({ title, content });
    setShowInfoModal(true);
  };

  const handleOpenLoginModal = () => {
    setLoginModalMode('auth');
    setShowLoginModal(true);
  };

  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
    setLoginModalMode('auth');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    reset();
  };

  const handleSelectHistoricalAnalysis = (item: any) => {
    setAnalysisResult(item.analysis_result);
    setParsedData(item.resume_data);
    setJobTitle(item.job_title);
    setJobDescription(item.job_description);
    setAppState(AppState.RESULT);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  return (
    <div className="flex flex-col min-h-screen bg-[#fdfcff] text-slate-800">
      <Header 
        isAuthenticated={isAuthenticated} 
        userName={loggedInUserName}
        onOpenLoginModal={handleOpenLoginModal}
        onLogout={handleLogout} 
        onNavigate={navigateTo}
      />

      <div className="flex flex-col md:flex-row flex-grow overflow-hidden">
        <Sidebar activeState={appState} onNavigate={navigateTo} hasResult={!!analysisResult} isAuthenticated={isAuthenticated} />
        
        <main className="flex-1 relative overflow-y-auto bg-[#fdfcff] p-6 lg:p-12">
          {error && (
            <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-white border border-rose-200 text-rose-600 px-8 py-5 rounded-[2.5rem] flex items-center gap-5 shadow-2xl animate-in slide-in-from-top-12 max-w-xl w-[90%]">
              <i className="fa-solid fa-circle-exclamation text-xl shrink-0"></i>
              <span className="text-sm font-bold flex-1">{error}</span>
              <button onClick={() => setError(null)} className="hover:bg-rose-50 p-2 rounded-full transition-colors">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          )}

          {appState === AppState.IDLE && (
            <Dashboard onStart={() => navigateTo(AppState.UPLOADING)} />
          )}

          {appState === AppState.UPLOADING && (
            <UploadSection 
              resumeText={resumeText} 
              setResumeText={setResumeText} 
              jobTitle={jobTitle} 
              setJobTitle={setJobTitle} 
              jobDescription={jobDescription} 
              setJobDescription={setJobDescription} 
              onAnalyze={handleAnalyze} 
              onFileChange={handleFileUpload}
              loading={false}
            />
          )}

          {appState === AppState.ANALYZING && (
            <div className="flex flex-col items-center justify-center min-h-full gap-16 animate-in fade-in zoom-in-95 py-20">
               <div className="relative">
                  <div className="w-56 h-56 border-8 border-indigo-50 border-t-indigo-600 rounded-full animate-spin"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 bg-white rounded-full flex items-center justify-center shadow-2xl border border-indigo-50">
                     <i className="fa-solid fa-brain text-6xl text-indigo-500 animate-pulse"></i>
                  </div>
               </div>
               <div className="text-center space-y-6">
                  <h2 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter italic">Intelligence <br/>Pipeline Active</h2>
                  <div className="flex flex-col gap-3">
                     <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[10px]">Processing strategic alignment for:</p>
                     <p className="text-indigo-600 font-black italic text-xl uppercase tracking-tight">{jobTitle || 'High Performance Role'}</p>
                  </div>
               </div>
               <button 
                 onClick={() => {
                   setAppState(AppState.UPLOADING);
                   setLoadingStartTime(null);
                 }}
                 className="text-[10px] font-black uppercase text-slate-300 hover:text-rose-500 tracking-[0.3em] transition-all border-b-2 border-transparent hover:border-rose-100"
               >
                 Cancel Operation
               </button>
            </div>
          )}

          {appState === AppState.RESULT && analysisResult && (
            <AnalysisView 
              result={analysisResult} 
              onReset={reset} 
              onViewResume={() => navigateTo(AppState.VIEWING_RESUME)} 
              onActionPlan={() => navigateTo(AppState.ROADMAP)}
            />
          )}

          {appState === AppState.VIEWING_RESUME && parsedData && analysisResult && (
            <ResumePreview 
              data={parsedData} 
              analysis={analysisResult} 
              onBack={() => navigateTo(AppState.RESULT)} 
              loggedInUserName={loggedInUserName}
            />
          )}

          {appState === AppState.ROADMAP && analysisResult && (
            <RoadmapView result={analysisResult} />
          )}

          {appState === AppState.HISTORY && (
            <HistoryView onSelect={handleSelectHistoricalAnalysis} />
          )}
        </main>
      </div>
      
      <Footer 
        onNavigate={navigateTo} 
        hasResult={!!analysisResult} 
        onOpenContactModal={() => setShowContactModal(true)} 
        onOpenInfoModal={handleOpenInfoModal}
      />

      {showContactModal && (
        <ContactModal onClose={() => setShowContactModal(false)} />
      )}

      {showInfoModal && infoModalContent && (
        <InfoModal 
          title={infoModalContent.title} 
          content={infoModalContent.content} 
          onClose={() => setShowInfoModal(false)} 
        />
      )}

      {showLoginModal && (
        <LoginPage onClose={handleCloseLoginModal} mode={loginModalMode} />
      )}
    </div>
  );
};

export default App;
