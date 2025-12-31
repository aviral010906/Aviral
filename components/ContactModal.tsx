
import React, { useState } from 'react';
import { supabase } from '../services/supabase';

interface ContactModalProps {
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const { error: insertError } = await supabase
        .from('contact_messages')
        .insert([
          { 
            name, 
            email, 
            message 
          }
        ]);

      if (insertError) throw insertError;

      setSubmitSuccess(true);
      // Automatically close modal after a short delay on success
      setTimeout(onClose, 2000); 
    } catch (err: any) {
      console.error("Submission error:", err);
      setError(err.message || "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Contact CareerCraft</h2>
            <p className="text-sm text-slate-500">We'd love to hear from you!</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200 transition-colors"
            aria-label="Close contact form"
          >
            <i className="fa-solid fa-xmark text-slate-500"></i>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-bold animate-in fade-in">
              <i className="fa-solid fa-circle-exclamation mr-2"></i>
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="contact-name" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <i className="fa-solid fa-user text-indigo-500"></i> Your Name
            </label>
            <input 
              type="text" 
              id="contact-name"
              required
              placeholder="John Doe"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="contact-email" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <i className="fa-solid fa-envelope text-indigo-500"></i> Your Email
            </label>
            <input 
              type="email" 
              id="contact-email"
              required
              placeholder="name@example.com"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="contact-message" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <i className="fa-solid fa-comment-dots text-indigo-500"></i> Your Message
            </label>
            <textarea 
              id="contact-message"
              required
              placeholder="Type your message here..."
              rows={5}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm text-slate-700 resize-y transition-all"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isSubmitting || submitSuccess}
              className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-md flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <i className="fa-solid fa-circle-notch animate-spin"></i> Sending...
                </>
              ) : submitSuccess ? (
                <>
                  <i className="fa-solid fa-check-circle"></i> Sent!
                </>
              ) : (
                <>
                  Send Message <i className="fa-solid fa-paper-plane"></i>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactModal;
