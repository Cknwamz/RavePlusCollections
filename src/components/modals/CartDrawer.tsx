"use client";

import { useStore } from "@/store/useStore";
import { X, Minus, Plus } from "lucide-react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";

const CheckoutButton = dynamic(() => import("./CheckoutButton"), { ssr: false });

export function CartDrawer() {
  const { isCartOpen, toggleCart, cart, cartTotal, updateQty, removeFromCart } = useStore();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-50 cursor-pointer"
            onClick={toggleCart}
          />
          
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 w-full max-w-md h-full bg-white z-[60] shadow-2xl flex flex-col"
          >
            <div className="p-8 border-b border-neutral-100 flex justify-between items-center">
              <h2 className="luxury-heading text-2xl">Your Selection</h2>
              <button onClick={toggleCart} className="text-neutral-400 hover:text-neutral-900 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {cart.length === 0 ? (
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-neutral-400 text-center text-sm uppercase tracking-widest mt-12"
                >
                  Your house is empty
                </motion.p>
              ) : (
                <AnimatePresence>
                  {cart.map(item => (
                    <motion.div 
                      key={item.id} 
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex gap-6 items-center border-b border-neutral-50 pb-6"
                    >
                      <div className="cart-item-frame relative w-20 h-24">
                        <Image src={item.image || "/placeholder.jpg"} alt={item.name} fill className="object-contain" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <h4 className="font-bold text-sm tracking-wide">{item.name}</h4>
                        <p className="text-orange-600 text-sm font-bold">₦{item.price.toLocaleString()}</p>
                        
                        <div className="flex items-center gap-4 pt-2">
                          <button onClick={() => updateQty(item.id, -1)} className="text-neutral-400 hover:text-orange-600 transition-colors">
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-xs font-bold w-4 text-center">{item.qty}</span>
                          <button onClick={() => updateQty(item.id, 1)} className="text-neutral-400 hover:text-orange-600 transition-colors">
                            <Plus className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => removeFromCart(item.id)} 
                            className="ml-auto text-[10px] uppercase tracking-wider text-neutral-400 hover:text-red-500"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
            
            <div className="p-8 border-t border-neutral-100 space-y-6 bg-white">
              <div className="flex justify-between items-end">
                <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-400">Total</span>
                <span className="luxury-heading text-3xl text-neutral-900">₦{cartTotal().toLocaleString()}</span>
              </div>
              <CheckoutButton />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
