"use client";

import { motion } from "framer-motion";

export function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.2, delayChildren: 0.1 } 
    }
  };

  const childVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <section className="h-screen flex flex-col items-center justify-center relative px-6 text-center bg-background overflow-hidden">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl space-y-8 z-10"
      >
        <motion.p variants={childVariants} className="text-neutral-400 font-medium tracking-[0.5em] uppercase text-xs">
          Embrace Your Inner <span className="text-orange-600">Royalty</span>
        </motion.p>
        
        <motion.h1 variants={childVariants} className="luxury-heading text-6xl md:text-9xl font-light text-neutral-900 leading-[0.9] tracking-tighter">
          Experience Luxury <br /> <span className="italic shimmer-text font-serif">Redefined.</span>
        </motion.h1>
        
        <motion.div variants={childVariants} className="pt-12 flex flex-col md:flex-row gap-4 justify-center">
          <a 
            href="#collections" 
            className="inline-block px-12 py-5 bg-neutral-900 text-white text-[10px] font-bold tracking-[0.4em] uppercase hover:bg-orange-600 transition-all shadow-2xl active:scale-[0.98]"
          >
            Shop the House
          </a>
          <a 
            href="https://wa.me/2348023427426" 
            target="_blank" 
            rel="noreferrer" 
            className="inline-block px-12 py-5 border border-neutral-900 text-neutral-900 text-[10px] font-bold tracking-[0.4em] uppercase hover:bg-neutral-900 hover:text-white transition-all active:scale-[0.98]"
          >
            WhatsApp
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
