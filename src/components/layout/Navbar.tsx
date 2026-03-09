"use client";

import { useStore } from "@/store/useStore";
import { ShoppingBag, ShieldCheck } from "lucide-react";
import Link from "next/link";

export function Navbar() {
  const { toggleCart, openLogin, openAccount, user, cart } = useStore();

  const handleAccountClick = () => {
    if (user) {
      openAccount();
    } else {
      openLogin();
    }
  };

  const totalItems = cart.reduce((total, item) => total + item.qty, 0);

  return (
    <nav className="fixed top-0 w-full z-40 px-8 py-6 flex justify-between items-center bg-white/10 backdrop-blur-lg border-b border-white/20">
      <div 
        className="fashion-logo text-3xl md:text-5xl text-neutral-900 cursor-pointer" 
        onClick={() => window.scrollTo(0,0)}
      >
        RavePlus<span className="text-orange-600">Collections</span>
      </div>
      
      <div className="flex items-center gap-4 md:gap-8">
        <button 
          onClick={handleAccountClick} 
          className="text-[10px] uppercase tracking-[0.4em] font-bold text-neutral-500 hover:text-orange-600 transition-colors hidden md:block"
        >
          {user ? 'Account' : 'Login'}
        </button>
        
        {user?.role === 'admin' && (
          <Link href="/admin" className="text-[10px] uppercase tracking-[0.4em] font-bold text-orange-600 hover:text-orange-800 transition-colors hidden md:block flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            Admin
          </Link>
        )}
        
        <button onClick={toggleCart} className="relative p-2 group">
          <ShoppingBag className="w-8 h-8 group-hover:text-orange-600 transition-colors" strokeWidth={1} />
          {totalItems > 0 && (
            <span className="absolute top-1 right-1 bg-orange-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
}
