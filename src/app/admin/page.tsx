"use client";

import { useStore } from "@/store/useStore";

export default function AdminDashboard() {
  const { user } = useStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-6 border-b border-neutral-200">
        <h2 className="text-2xl font-light tracking-wide">Overview</h2>
        <div className="text-sm bg-orange-100 text-orange-800 px-3 py-1 rounded-full font-medium">
          Logged in as: {user?.email}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Placeholder Stat Cards */}
        <div className="bg-neutral-50 p-6 rounded-lg border border-neutral-100">
          <p className="text-sm text-neutral-500 uppercase tracking-widest font-bold">Total Sales</p>
          <p className="text-3xl mt-2 font-light">₦0</p>
        </div>
        <div className="bg-neutral-50 p-6 rounded-lg border border-neutral-100">
          <p className="text-sm text-neutral-500 uppercase tracking-widest font-bold">Orders</p>
          <p className="text-3xl mt-2 font-light">0</p>
        </div>
        <div className="bg-neutral-50 p-6 rounded-lg border border-neutral-100">
          <p className="text-sm text-neutral-500 uppercase tracking-widest font-bold">Customers</p>
          <p className="text-3xl mt-2 font-light">0</p>
        </div>
      </div>

      <div className="pt-8">
        <h3 className="text-xl font-light mb-4 tracking-wide">Recent Activity</h3>
        <p className="text-neutral-500 italic">No recent activity to display.</p>
      </div>
    </div>
  );
}
