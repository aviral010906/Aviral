
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import { decodeAudio } from '../services/geminiService';

interface InterviewSimulatorProps {
  jobTitle: string;
  jobDescription: string;
}

const InterviewSimulator: React.FC<InterviewSimulatorProps> = ({ jobTitle, jobDescription }) => {
  const [status, setStatus] = useState<'IDLE' | 'THINKING' | 'SPEAKING'>('IDLE');
  const [transcript, setTranscript] = useState<{ role: 'AI' | 'USER', text: string }[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startInterview = async () => {
    setStatus('THINKING');
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Act as a senior hiring manager interviewing for a ${jobTitle} role. Here is the JD: ${jobDescription}. Ask me one challenging behavioral or technical question to start. Keep it concise.`,
      });

      const question = response.text || "Tell me about a time you overcame a significant technical challenge.";
      setTranscript([{ role: 'AI', text: question }]);
      await playResponse(question);
    } catch (err) {
      console.error(err);
      setStatus('IDLE');
    }
  };

  const playResponse = async (text: string) => {
    setStatus('SPEAKING');
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } } },
        },
      });

      const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (audioData) {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const buffer = await decodeAudio(audioData, ctx);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.onended = () => setStatus('IDLE');
        source.start();
      } else {
        setStatus('IDLE');
      }
    } catch (err) {
      setStatus('IDLE');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 space-y-8 animate-fade-in">
      <div className="bg-slate-900 rounded-[2.5rem] p-12 text-white overflow-hidden relative">
        <div className="relative z-10 space-y-8">
          <div className="flex items-center gap-4">
            <div className={`w-3 h-3 rounded-full ${status === 'SPEAKING' ? 'bg-indigo-400 animate-ping' : 'bg-slate-700'}`}></div>
            <span className="text-xs font-black uppercase tracking-widest text-slate-400">AI Recruiter Presence</span>
          </div>

          <h2 className="text-4xl font-black italic">Practice Interview: <span className="text-indigo-400">{jobTitle}</span></h2>
          
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 min-h-[200px] flex flex-col justify-end space-y-4">
            {transcript.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'AI' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[80%] p-4 rounded-2xl text-sm font-medium ${msg.role === 'AI' ? 'bg-indigo-600' : 'bg-slate-800'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {transcript.length === 0 && (
              <p className="text-slate-400 text-center italic">Initialize your session to begin the mock interview.</p>
            )}
          </div>

          <div className="flex justify-center gap-4">
            {transcript.length === 0 ? (
              <button 
                onClick={startInterview}
                className="px-10 py-4 bg-indigo-600 rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-2xl"
              >
                Start Session
              </button>
            ) : (
              <div className="flex items-center gap-4">
                <button className="w-16 h-16 bg-rose-500 rounded-full flex items-center justify-center text-white text-xl shadow-lg hover:bg-rose-600 transition-all">
                  <i className="fa-solid fa-microphone"></i>
                </button>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Voice response enabled soon</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewSimulator;
