export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col pt-32 px-4 md:px-12">
      <header className="mb-8">
        <h1 className="text-4xl font-light text-neutral-900 luxury-heading">Admin Dashboard</h1>
        <p className="text-neutral-500 mt-2">Manage orders, inventory, and users securely.</p>
      </header>
      
      <main className="flex-1 bg-white rounded-xl shadow-lg p-8 border border-neutral-200">
        {children}
      </main>
    </div>
  );
}
