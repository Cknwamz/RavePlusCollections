"use client";

import { useStore } from "@/store/useStore";
import { X, Minus, Plus } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function QuickViewModal() {
  const { quickViewProduct, closeQuickView, addToCart, toggleCart } = useStore();
  const [qty, setQty] = useState(1);

  // Reset quantity when modal opens
  useEffect(() => {
    if (quickViewProduct) setQty(1);
  }, [quickViewProduct]);

  const handleAddToCart = () => {
    if(!quickViewProduct) return;
    addToCart(quickViewProduct, qty);
    closeQuickView();
    toggleCart(); // Open cart to confirm addition
  };

  return (
    <AnimatePresence>
      {quickViewProduct && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-neutral-900/90 backdrop-blur-xl z-[100] flex items-center justify-center p-4 md:p-12"
          onClick={closeQuickView}
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white w-full max-w-6xl max-h-[90vh] overflow-hidden relative shadow-2xl flex flex-col md:flex-row" 
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={closeQuickView} className="absolute top-6 right-6 z-50 text-neutral-400 hover:text-neutral-900 hover:rotate-90 transition-all duration-300">
              <X className="w-8 h-8" strokeWidth={1} />
            </button>
            
            <div className="w-full md:w-2/3 bg-neutral-100 flex items-center justify-center p-4 md:p-8 h-[50vh] md:h-auto min-h-[400px] relative">
              <Image 
                src={quickViewProduct.image || "/placeholder.jpg"} 
                alt={quickViewProduct.name} 
                fill
                className="object-contain p-8"
              />
            </div>
            
            <div className="w-full md:w-1/3 p-12 flex flex-col justify-center space-y-8 overflow-y-auto bg-white">
              <div>
                <motion.h2 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="luxury-heading text-4xl mb-4"
                >
                  {quickViewProduct.name}
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-orange-600 text-2xl font-bold"
                >
                  ₦{quickViewProduct.price.toLocaleString()}
                </motion.p>
              </div>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-neutral-500 leading-relaxed text-sm"
              >
                {quickViewProduct.description}
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="pt-8 space-y-6"
              >
                <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-bold">Quantity</span>
                  <div className="flex items-center gap-6">
                    <button onClick={() => setQty(Math.max(1, qty - 1))} className="text-neutral-500 hover:text-orange-600 transition-colors">
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="font-bold w-4 text-center">{qty}</span>
                    <button onClick={() => setQty(qty + 1)} className="text-neutral-500 hover:text-orange-600 transition-colors">
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
      
                <button 
                  onClick={handleAddToCart}
                  className="w-full py-6 bg-neutral-900 text-white text-[10px] font-bold tracking-[0.5em] uppercase hover:bg-orange-600 transition-colors active:scale-[0.98]"
                >
                  Add to House
                </button>
                
                {quickViewProduct.permalink && (
                  <a 
                    href={quickViewProduct.permalink} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="block text-center text-[10px] uppercase tracking-widest text-neutral-400 hover:text-neutral-900 transition-colors mt-4"
                  >
                    View Original Post
                  </a>
                )}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
