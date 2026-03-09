"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const [stats, setStats] = useState({ sales: 0, orders: 0, products: 0, customers: 0 });
  const [orders, setOrders] = useState<any[]>([]);

  // Simple mock login for admin (in a real app, use Supabase Auth and RLS)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "admin@raveplus.com" && password === "raveadmin123") {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Invalid credentials");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setEmail("");
    setPassword("");
  };

  useEffect(() => {
    if (isAuthenticated) {
      // Mock fetching admin data
      setStats({ sales: 1250000, orders: 45, products: 12, customers: 18 });
      setOrders([
        { id: "ORD-001", customer: "Chioma Adeleke", date: "2026-03-01", total: 320000, status: "Processing" },
        { id: "ORD-002", customer: "Aisha Bello", date: "2026-03-02", total: 250000, status: "Shipped" }
      ]);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-500 to-pink-600">
        <div className="bg-white p-12 rounded-2xl shadow-2xl w-full max-w-md">
          <div className="text-center mb-8">
            <div className="fashion-logo text-4xl text-orange-600 mb-2">RavePlus</div>
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-500 text-sm mt-2">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                placeholder="admin@raveplus.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                placeholder="••••••••"
              />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg transition-colors">
              Sign In
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-800 font-mono">
              <strong>Demo Credentials:</strong><br/>
              Email: admin@raveplus.com<br/>
              Password: raveadmin123
            </p>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", icon: "📊", label: "Overview" },
    { id: "orders", icon: "📦", label: "Orders" },
    { id: "products", icon: "👗", label: "Products" },
    { id: "customers", icon: "👥", label: "Customers" },
    { id: "settings", icon: "⚙️", label: "Settings" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <div className="fashion-logo text-3xl text-orange-500">RavePlus</div>
          <p className="text-gray-400 text-xs mt-1">Admin Dashboard</p>
        </div>
        <nav className="p-4 space-y-2 flex-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors hover:bg-gray-800 ${activeTab === tab.id ? 'bg-orange-600 text-white' : ''}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-gray-400 hover:text-white transition-colors">
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8 w-full">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 capitalize">{activeTab}</h1>
          <p className="text-gray-500 mt-1">Manage your {activeTab} here.</p>
        </header>

        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard label="Total Sales" value={`₦${stats.sales.toLocaleString()}`} icon="💰" bg="bg-green-100" />
              <StatCard label="Total Orders" value={stats.orders} icon="📦" bg="bg-blue-100" />
              <StatCard label="Total Products" value={stats.products} icon="👗" bg="bg-purple-100" />
              <StatCard label="Total Customers" value={stats.customers} icon="👥" bg="bg-orange-100" />
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Orders</h2>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-sm text-gray-500">ID</th>
                    <th className="py-2 text-sm text-gray-500">Customer</th>
                    <th className="py-2 text-sm text-gray-500">Total</th>
                    <th className="py-2 text-sm text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="py-3 text-sm font-medium">{o.id}</td>
                      <td className="py-3 text-sm">{o.customer}</td>
                      <td className="py-3 text-sm font-bold text-orange-600">₦{o.total.toLocaleString()}</td>
                      <td className="py-3 text-sm">{o.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-gray-500">Full order management coming soon...</p>
          </div>
        )}

        {/* Placeholder for other tabs */}
        {(activeTab === "products" || activeTab === "customers" || activeTab === "settings") && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-gray-500">Tab view for {activeTab} coming soon...</p>
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({ label, value, icon, bg }: any) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
           <p className="text-gray-500 text-sm">{label}</p>
           <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
        </div>
        <div className={`${bg} p-3 rounded-lg`}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  );
}
