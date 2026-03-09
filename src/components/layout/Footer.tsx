export function Footer() {
  return (
    <footer className="py-32 px-12 bg-neutral-900 text-white relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
        <div className="space-y-6">
          <div className="fashion-logo text-4xl">
            RavePlus<span className="text-orange-600">Collections</span>
          </div>
          <p className="text-neutral-400 text-sm max-w-xs">Handcrafted luxury in Lagos.</p>
        </div>
        
        <div className="space-y-6">
          <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-orange-600">Concierge</h4>
          <ul className="text-neutral-400 text-sm space-y-4">
            <li>
              <a href="https://wa.me/2348023427426" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                WhatsApp: +234 802 342 7426
              </a>
            </li>
            <li>
              <a href="https://instagram.com/ravepluscollection" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                Instagram: @ravepluscollection
              </a>
            </li>
          </ul>
        </div>
        
        <div className="space-y-6 md:text-right">
          <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-orange-600">Studio</h4>
          <p className="text-neutral-400 text-sm">Lagos, Nigeria</p>
        </div>
      </div>
    </footer>
  );
}
