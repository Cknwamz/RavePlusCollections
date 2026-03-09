"use client";

import { useStore } from "@/store/useStore";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { AnimatePresence, motion } from "framer-motion";

export function AccountModal() {
  const { isAccountOpen, closeAccount, user, setUser, openAddress } = useStore();
  const [activeTab, setActiveTab] = useState<"orders" | "addresses" | "profile">("orders");
  const [orders, setOrders] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);

  useEffect(() => {
    if (isAccountOpen && user) {
      loadUserInfo();
    }
  }, [isAccountOpen, user]);

  const loadUserInfo = async () => {
    if (!user) return;
    try {
      const { data: userRecord } = await supabase.from('users').select('*').eq('id', user.id).single();
      if (userRecord) {
        setUser(userRecord);
        setAddresses(userRecord.addresses || []);
      }
      
      const { data: userOrders } = await supabase.from('orders').select('*').eq('customer_id', user.id).order('created_at', { ascending: false });
      if (userOrders) setOrders(userOrders);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    closeAccount();
  };

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    const formData = new FormData(e.currentTarget);
    const updates = {
      name: formData.get("name") as string,
      phone: formData.get("phone") as string
    };
    await supabase.from("users").update(updates).eq("id", user.id);
    setUser({ ...user, ...updates });
    alert("Profile Updated.");
  };

  return (
    <AnimatePresence>
      {isAccountOpen && user && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-neutral-900/60 backdrop-blur-md z-[70] flex items-center justify-center p-6"
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto relative shadow-2xl"
          >
            <button onClick={closeAccount} className="absolute top-6 right-6 z-10 text-neutral-400 hover:text-neutral-900 transition-colors hover:rotate-90 duration-300">
              <X className="w-6 h-6" />
            </button>
            
            <div className="p-12">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="luxury-heading text-4xl mb-2">Welcome Back</h2>
                  <p className="text-neutral-400">{user.email}</p>
                </div>
                <button onClick={handleLogout} className="text-xs uppercase tracking-widest text-neutral-400 hover:text-red-600 transition-colors">
                  Logout
                </button>
              </div>
              
              <div className="flex border-b mb-8 relative">
                {["orders", "addresses", "profile"].map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab as any)} 
                    className={`tab-btn px-6 py-3 text-sm font-bold uppercase tracking-widest transition-colors relative ${activeTab === tab ? "text-orange-600" : "text-neutral-400 hover:text-neutral-900"}`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <motion.div 
                        layoutId="activeTabIndicator"
                        className="absolute bottom-0 left-0 w-full h-[2px] bg-orange-600" 
                      />
                    )}
                  </button>
                ))}
              </div>
              
              <motion.div 
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === "orders" && (
                  <div>
                    <h3 className="luxury-heading text-2xl mb-6">Order History</h3>
                    <div className="space-y-4">
                      {orders.length === 0 ? <p className="text-neutral-500 text-sm">No orders found.</p> : orders.map(o => (
                        <div key={o.id} className="p-4 border border-neutral-100 flex justify-between items-center hover:shadow-md transition-shadow bg-white">
                          <div>
                            <p className="font-bold text-sm">Order #{o.id}</p>
                            <p className="text-xs text-neutral-400">{new Date(o.created_at).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-orange-600 font-bold">₦{o.total?.toLocaleString()}</p>
                            <p className="text-[10px] uppercase text-neutral-400">{o.status}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {activeTab === "addresses" && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="luxury-heading text-2xl">Saved Addresses</h3>
                      <button onClick={openAddress} className="text-xs uppercase tracking-widest text-orange-600 font-bold hover:text-neutral-900 transition-colors">
                        + Add New
                      </button>
                    </div>
                    <div className="space-y-4">
                      {addresses.length === 0 ? <p className="text-neutral-500 text-sm">No addresses saved.</p> : addresses.map((addr: any, i) => (
                        <div key={i} className="p-4 border border-neutral-100 hover:shadow-md transition-shadow bg-white">
                          <p className="font-bold text-sm uppercase">{addr.label}</p>
                          <p className="text-sm text-neutral-500 mt-1">{addr.street}, {addr.city}, {addr.state}, {addr.country}</p>
                          {addr.secondaryPhone && <p className="text-xs text-neutral-400 mt-1">Alt Phone: {addr.secondaryPhone}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {activeTab === "profile" && (
                  <div>
                    <h3 className="luxury-heading text-2xl mb-6">Profile Settings</h3>
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                      <div>
                        <label className="text-xs uppercase tracking-widest text-neutral-400 block mb-2">Full Name</label>
                        <input name="name" defaultValue={user.name} required className="w-full border-b border-neutral-200 py-3 outline-none focus:border-orange-600 transition-colors" />
                      </div>
                      <div>
                        <label className="text-xs uppercase tracking-widest text-neutral-400 block mb-2">Phone Number</label>
                        <input name="phone" type="tel" defaultValue={user.phone} required className="w-full border-b border-neutral-200 py-3 outline-none focus:border-orange-600 transition-colors" />
                      </div>
                      <button type="submit" className="px-8 py-4 bg-neutral-900 text-white text-[10px] font-bold tracking-[0.4em] uppercase hover:bg-orange-600 transition-all active:scale-[0.98]">
                        Save Changes
                      </button>
                    </form>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
