"use client";

import Image from "next/image";
import { Product, useStore } from "@/store/useStore";
import { motion, type Variants } from "framer-motion";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { openQuickView, addToCart, toggleCart } = useStore();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    toggleCart(); // Show cart after quick add
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 20, stiffness: 100 } }
  };

  return (
    <motion.div 
      variants={itemVariants}
      className="group product-card cursor-pointer"
      onClick={() => openQuickView(product)}
    >
      <div className="aspect-[4/5] image-container mb-6 shadow-md hover:shadow-2xl transition-all duration-500 relative overflow-hidden bg-neutral-100">
        <Image
          src={product.image || "/placeholder.jpg"}
          alt={product.name}
          fill
          className="product-image object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        <button 
          onClick={handleQuickAdd}
          className="absolute bottom-0 left-0 w-full py-5 bg-neutral-900/90 backdrop-blur-sm text-white text-[10px] uppercase tracking-[0.4em] opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0 z-10"
        >
          Reserve Item
        </button>
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between items-baseline gap-4">
          <h3 className="luxury-heading text-xl truncate">{product.name}</h3>
          <p className="text-orange-600 font-bold text-sm shrink-0">
            ₦{product.price.toLocaleString()}
          </p>
        </div>
        <span className="text-[9px] uppercase tracking-[0.3em] text-neutral-400 group-hover:text-orange-600 transition-colors inline-block">
          Tap for Details
        </span>
      </div>
    </motion.div>
  );
}
