import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Collections } from "@/components/sections/Collections";
import { CartDrawer } from "@/components/modals/CartDrawer";
import { AuthModals } from "@/components/modals/AuthModals";
import { AccountModal } from "@/components/modals/AccountModal";
import { AddressModal } from "@/components/modals/AddressModal";
import { QuickViewModal } from "@/components/modals/QuickViewModal";

export default function Home() {
  return (
    <main className="relative bg-background min-h-screen">
      <Navbar />
      
      {/* Sections */}
      <Hero />
      <Collections />
      
      {/* Modals & Overlays */}
      <CartDrawer />
      <AuthModals />
      <AccountModal />
      <AddressModal />
      <QuickViewModal />

      <Footer />
    </main>
  );
}
