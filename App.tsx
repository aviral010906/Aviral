
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
  const [showContactModal, setShowContactModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoModalContent, setInfoModalContent] = useState<{ title: string; content: string } | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loggedInUserName, setLoggedInUserName] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsAuthenticated(true);
        setLoggedInUserName(session.user.user_metadata.full_name || session.user.email);
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setIsAuthenticated(true);
        setLoggedInUserName(session.user.user_metadata.full_name || session.user.email);
        setShowLoginModal(false);
      } else {
        setIsAuthenticated(false);
        setLoggedInUserName(null);
        setAppState(AppState.IDLE);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleAnalyze = async () => {
    if (!resumeText.trim() || !jobTitle.trim() || !jobDescription.trim()) {
      setError("Please provide your resume, job title, and description.");
      return;
    }
    setAppState(AppState.ANALYZING);
    setError(null);
    try {
      const currentParsed = await parseResumeText(resumeText);
      setParsedData(currentParsed);
      const result = await analyzeResume(currentParsed, jobTitle, jobDescription);
      setAnalysisResult(result);
      setAppState(AppState.RESULT);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('analyses').insert([{
          user_id: user.id,
          job_title: jobTitle,
          job_description: jobDescription,
          resume_data: currentParsed,
          analysis_result: result
        }]);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred.");
      setAppState(AppState.UPLOADING);
    }
  };

  const navigateTo = (state: AppState) => {
    setAppState(state);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">
      <Header 
        isAuthenticated={isAuthenticated} 
        userName={loggedInUserName}
        onOpenLoginModal={() => setShowLoginModal(true)}
        onLogout={() => supabase.auth.signOut()} 
        onNavigate={navigateTo}
      />

      <div className="flex flex-col md:flex-row flex-grow overflow-hidden">
        <Sidebar 
          activeState={appState} 
          onNavigate={navigateTo} 
          hasResult={!!analysisResult} 
          isAuthenticated={isAuthenticated} 
        />
        
        <main className="flex-1 relative overflow-y-auto bg-white md:rounded-tl-[2.5rem] shadow-inner p-6 lg:p-12">
          {error && (
            <div className="mb-6 bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-xl flex justify-between items-center">
              <p className="text-sm font-bold text-rose-700">{error}</p>
              <button onClick={() => setError(null)}><i className="fa-solid fa-xmark"></i></button>
            </div>
          )}

          {appState === AppState.IDLE && <Dashboard onStart={() => setAppState(AppState.UPLOADING)} />}
          {appState === AppState.UPLOADING && (
            <UploadSection 
              resumeText={resumeText} setResumeText={setResumeText} 
              jobTitle={jobTitle} setJobTitle={setJobTitle} 
              jobDescription={jobDescription} setJobDescription={setJobDescription} 
              onAnalyze={handleAnalyze} onFileChange={() => {}} loading={false}
            />
          )}
          {appState === AppState.ANALYZING && (
            <div className="flex flex-col items-center justify-center h-full gap-8">
              <div className="w-24 h-24 border-8 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
              <p className="text-xl font-black text-slate-900 italic tracking-tight">Synthesizing Career Strategy...</p>
            </div>
          )}
          {appState === AppState.RESULT && analysisResult && (
            <AnalysisView 
              result={analysisResult} onReset={() => setAppState(AppState.IDLE)} 
              onViewResume={() => setAppState(AppState.VIEWING_RESUME)} 
              onActionPlan={() => setAppState(AppState.ROADMAP)}
            />
          )}
          {appState === AppState.VIEWING_RESUME && parsedData && analysisResult && (
            <ResumePreview data={parsedData} analysis={analysisResult} onBack={() => setAppState(AppState.RESULT)} />
          )}
          {appState === AppState.ROADMAP && analysisResult && <RoadmapView result={analysisResult} />}
          {appState === AppState.HISTORY && <HistoryView onSelect={(item) => {
            setAnalysisResult(item.analysis_result);
            setParsedData(item.resume_data);
            setAppState(AppState.RESULT);
          }} />}
        </main>
      </div>
      
      <Footer onNavigate={navigateTo} hasResult={!!analysisResult} onOpenContactModal={() => setShowContactModal(true)} onOpenInfoModal={(t, c) => { setInfoModalContent({title: t, content: c}); setShowInfoModal(true); }} />
      {showContactModal && <ContactModal onClose={() => setShowContactModal(false)} />}
      {showInfoModal && infoModalContent && <InfoModal title={infoModalContent.title} content={infoModalContent.content} onClose={() => setShowInfoModal(false)} />}
      {showLoginModal && <LoginPage onClose={() => setShowLoginModal(false)} />}
    </div>
  );
};

export default App;
