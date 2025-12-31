
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

interface LoginPageProps {
  onClose: () => void;
  mode?: 'auth' | 'recovery';
}

const LoginPage: React.FC<LoginPageProps> = ({ onClose, mode = 'auth' }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(mode === 'recovery');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (mode === 'recovery') {
      setIsResettingPassword(true);
      setIsForgotPassword(false);
      setIsSignUp(false);
    }
  }, [mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);
    
    try {
      if (isResettingPassword) {
        // Step 2: Finalize the password update
        const { error: updateError } = await supabase.auth.updateUser({
          password: password,
        });
        if (updateError) throw updateError;
        setMessage("Success! Your password has been updated. You are now logged in.");
        setTimeout(onClose, 2500);
      } else if (isForgotPassword) {
        // Step 1: Send the recovery email
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin,
        });
        if (resetError) throw resetError;
        setMessage("A secure recovery link has been sent to your email. Please check your inbox.");
      } else if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            },
          },
        });
        if (signUpError) throw signUpError;
        setMessage("Registration successful! Check your email for the confirmation link.");
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
      }
    } catch (err: any) {
      setError(err.message || "An authentication error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleForgotPassword = () => {
    setIsForgotPassword(!isForgotPassword);
    setIsSignUp(false);
    setIsResettingPassword(false);
    setError(null);
    setMessage(null);
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setIsForgotPassword(false);
    setIsResettingPassword(false);
    setError(null);
    setMessage(null);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {isResettingPassword ? 'New Password' : (isForgotPassword ? 'Reset Password' : (isSignUp ? 'Create account' : 'Welcome back'))}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {isResettingPassword 
                ? 'Create a secure new password for your account'
                : (isForgotPassword 
                  ? 'Enter your email to receive a recovery link' 
                  : (isSignUp ? 'Start your journey today' : 'Please enter your details to sign in'))}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200 transition-colors"
            aria-label="Close login/signup form"
          >
            <i className="fa-solid fa-xmark text-slate-500"></i>
          </button>
        </div>

        <div className="px-8 pt-4 space-y-3">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-bold animate-in slide-in-from-top-2">
              <i className="fa-solid fa-circle-exclamation mr-2"></i>
              {error}
            </div>
          )}
          {message && (
            <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-600 text-xs font-bold animate-in slide-in-from-top-2">
              <i className="fa-solid fa-circle-check mr-2"></i>
              {message}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {isSignUp && (
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Full Name</label>
              <input 
                type="text" 
                required
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          {!isResettingPassword && (
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Email Address</label>
              <input 
                type="email" 
                required
                placeholder="name@company.com"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          )}

          {!isForgotPassword && (
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-slate-700">
                  {isResettingPassword ? 'New Password' : 'Password'}
                </label>
                {!isSignUp && !isResettingPassword && (
                  <button 
                    type="button" 
                    onClick={toggleForgotPassword}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <input 
                type="password" 
                required
                placeholder="••••••••••••"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-md flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
          >
            {isLoading ? (
              <i className="fa-solid fa-circle-notch animate-spin"></i>
            ) : (
              isResettingPassword ? 'Set New Password' : (isForgotPassword ? 'Send Recovery Link' : (isSignUp ? 'Sign Up' : 'Sign In'))
            )}
          </button>
          
          {(isForgotPassword || (isResettingPassword && !message)) && (
            <button 
              type="button" 
              onClick={() => {
                setIsForgotPassword(false);
                setIsResettingPassword(false);
                setError(null);
                setMessage(null);
              }}
              className="w-full text-center text-sm font-semibold text-slate-500 hover:text-slate-700 py-1 transition-colors"
            >
              <i className="fa-solid fa-arrow-left mr-2 text-xs"></i>
              Back to Sign In
            </button>
          )}
        </form>

        {!isResettingPassword && (
          <div className="mt-4 text-center pt-6 border-t border-slate-100 pb-8">
            <button 
              onClick={toggleMode}
              className="text-sm text-slate-600"
            >
              {isSignUp ? 'Already have an account?' : "Don't have an account?"} 
              <span className="text-indigo-600 font-bold ml-1 hover:underline underline-offset-4">
                {isSignUp ? 'Sign In' : 'Create an account'}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
