"use client";

import { useStore } from "@/store/useStore";
import { useState } from "react";
import { X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { AnimatePresence, motion } from "framer-motion";

export function AuthModals() {
  const { isLoginOpen, isSignupOpen, closeLogin, closeSignup, openLogin, openSignup, setUser } = useStore();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      const { data: userData } = await supabase.from("users").select("*").eq("id", data.user.id).single();
      if (userData) setUser(userData);
      else setUser({ id: data.user.id, email, name: email.split("@")[0] });
      
      closeLogin();
    } catch (err: any) {
      if (err.message.includes('Failed to fetch') || err.message.includes('URL constructor')) {
        // Fallback demo login if Supabase isn't configured
        setUser({ id: 'demo-user-123', email, name: email.split("@")[0], addresses: [] });
        closeLogin();
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name, phone } }
      });
      if (error) throw error;
      
      if (data.user) {
        const newUser = { id: data.user.id, email, name, phone, addresses: [] };
        await supabase.from("users").insert(newUser);
        setUser(newUser);
        closeSignup();
      }
    } catch (err: any) {
      if (err.message.includes('Failed to fetch') || err.message.includes('URL constructor')) {
        // Fallback demo signup
        setUser({ id: 'demo-user-123', email, name, phone, addresses: [] });
        closeSignup();
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { type: "spring" as any, damping: 25, stiffness: 300 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
  };

  return (
    <AnimatePresence>
      {(isLoginOpen || isSignupOpen) && (
        <motion.div 
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="fixed inset-0 bg-neutral-900/60 backdrop-blur-md z-[70] flex items-center justify-center p-6"
        >
          {isLoginOpen && (
            <motion.div 
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white w-full max-w-lg p-12 relative shadow-2xl"
            >
              <button onClick={closeLogin} className="absolute top-6 right-6 text-neutral-400 hover:text-neutral-900 transition-colors">
                <X className="w-6 h-6" />
              </button>
              <div className="text-center space-y-6">
                <div className="fashion-logo text-4xl">RavePlus<span className="text-orange-600">Collections</span></div>
                <h3 className="luxury-heading text-3xl font-light">Welcome Back</h3>
                <form onSubmit={handleLogin} className="space-y-4 pt-6 text-left">
                  <input type="email" placeholder="Email Address" value={email} onChange={(e)=>setEmail(e.target.value)} required className="w-full border-b border-neutral-200 py-4 outline-none focus:border-orange-600 transition-colors" />
                  <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} required className="w-full border-b border-neutral-200 py-4 outline-none focus:border-orange-600 transition-colors" />
                  {error && <div className="text-red-500 text-xs text-center">{error}</div>}
                  <button type="submit" disabled={loading} className="w-full py-5 bg-neutral-900 text-white text-[10px] font-bold tracking-[0.4em] uppercase hover:bg-orange-600 transition-all disabled:opacity-50 active:scale-[0.98]">Sign In</button>
                </form>
                <p className="text-[10px] text-neutral-400 uppercase tracking-widest pt-4">
                  Don't have an account? <button onClick={openSignup} className="text-orange-600 font-bold underline transition-colors hover:text-neutral-900">Create Account</button>
                </p>
              </div>
            </motion.div>
          )}

          {isSignupOpen && (
            <motion.div 
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white w-full max-w-lg p-12 relative shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <button onClick={closeSignup} className="absolute top-6 right-6 text-neutral-400 hover:text-neutral-900 transition-colors">
                <X className="w-6 h-6" />
              </button>
              <div className="text-center space-y-6">
                <div className="fashion-logo text-4xl">RavePlus<span className="text-orange-600">Collections</span></div>
                <h3 className="luxury-heading text-3xl font-light">Join the House</h3>
                <form onSubmit={handleSignup} className="space-y-4 pt-6 text-left">
                  <input type="text" placeholder="Full Name" value={name} onChange={(e)=>setName(e.target.value)} required className="w-full border-b border-neutral-200 py-4 outline-none focus:border-orange-600 transition-colors" />
                  <input type="email" placeholder="Email Address" value={email} onChange={(e)=>setEmail(e.target.value)} required className="w-full border-b border-neutral-200 py-4 outline-none focus:border-orange-600 transition-colors" />
                  <input type="tel" placeholder="Phone Number" value={phone} onChange={(e)=>setPhone(e.target.value)} required className="w-full border-b border-neutral-200 py-4 outline-none focus:border-orange-600 transition-colors" />
                  <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} required minLength={6} className="w-full border-b border-neutral-200 py-4 outline-none focus:border-orange-600 transition-colors" />
                  {error && <div className="text-red-500 text-xs text-center">{error}</div>}
                  <button type="submit" disabled={loading} className="w-full py-5 bg-neutral-900 text-white text-[10px] font-bold tracking-[0.4em] uppercase hover:bg-orange-600 transition-all disabled:opacity-50 active:scale-[0.98]">Create Account</button>
                </form>
                <p className="text-[10px] text-neutral-400 uppercase tracking-widest pt-4">
                  Already have an account? <button onClick={openLogin} className="text-orange-600 font-bold underline transition-colors hover:text-neutral-900">Sign In</button>
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
