"use client";

import { useStore } from "@/store/useStore";
import { X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function AddressModal() {
  const { isAddressOpen, closeAddress, user, setUser } = useStore();
  const [loading, setLoading] = useState(false);

  const handleSaveAddress = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const newAddress = {
      label: formData.get("label"),
      street: formData.get("street"),
      city: formData.get("city"),
      state: formData.get("state"),
      country: formData.get("country"),
      secondaryPhone: formData.get("secondaryPhone")
    };

    const currentAddresses = user.addresses || [];
    const updatedAddresses = [...currentAddresses, newAddress];

    try {
      await supabase.from("users").update({ addresses: updatedAddresses }).eq("id", user.id);
      setUser({ ...user, addresses: updatedAddresses });
      closeAddress();
    } catch (err: any) {
      if (err.message?.includes('Failed to fetch') || err.message?.includes('URL constructor')) {
        // Fallback for demo mode
        setUser({ ...user, addresses: updatedAddresses });
        closeAddress();
      } else {
        console.error(err);
        alert("Error saving address");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isAddressOpen && user && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-neutral-900/60 backdrop-blur-md z-[80] flex items-center justify-center p-6"
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white w-full max-w-lg p-12 relative shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <button onClick={closeAddress} className="absolute top-6 right-6 text-neutral-400 hover:text-neutral-900 transition-colors">
              <X className="w-6 h-6" />
            </button>
            <div className="text-center space-y-6">
              <h3 className="luxury-heading text-3xl font-light">New Shipping Address</h3>
              <form onSubmit={handleSaveAddress} className="space-y-4 pt-6 text-left">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-neutral-400 block mb-1">Address Label</label>
                  <input name="label" type="text" placeholder="Home" required className="w-full border-b border-neutral-200 py-3 outline-none focus:border-orange-600 transition-colors" />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-neutral-400 block mb-1">Street Address</label>
                  <input name="street" type="text" placeholder="123 Luxury Lane" required className="w-full border-b border-neutral-200 py-3 outline-none focus:border-orange-600 transition-colors" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-neutral-400 block mb-1">City</label>
                    <input name="city" type="text" placeholder="Lagos" required className="w-full border-b border-neutral-200 py-3 outline-none focus:border-orange-600 transition-colors" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-neutral-400 block mb-1">State</label>
                    <input name="state" type="text" placeholder="Lagos State" required className="w-full border-b border-neutral-200 py-3 outline-none focus:border-orange-600 transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-neutral-400 block mb-1">Country</label>
                  <input name="country" type="text" defaultValue="Nigeria" required className="w-full border-b border-neutral-200 py-3 outline-none focus:border-orange-600 transition-colors" />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-neutral-400 block mb-1">Secondary Phone (Optional)</label>
                  <input name="secondaryPhone" type="tel" placeholder="+234..." className="w-full border-b border-neutral-200 py-3 outline-none focus:border-orange-600 transition-colors" />
                </div>
                <button type="submit" disabled={loading} className="w-full py-5 mt-6 bg-neutral-900 text-white text-[10px] font-bold tracking-[0.4em] uppercase hover:bg-orange-600 transition-all disabled:opacity-50 active:scale-[0.98]">
                  Save Address
                </button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
