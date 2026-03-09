"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "./ProductCard";
import { Product } from "@/store/useStore";
import { motion } from "framer-motion";

const INSTAGRAM_FEED_URL = 'https://feeds.behold.so/TDdo656OMW8LTIsK0I0m'; 

function parsePriceFromCaption(caption: string | undefined): number {
  if (!caption) return 0;
  // Match exact Naira marks "₦ 45,000" or "N45000"
  const nairaMatch = caption.match(/[₦N]\s?(\d{1,3}(?:,\d{3})*)/);
  if (nairaMatch) return parseInt(nairaMatch[1].replace(/,/g, '')) || 0;
  
  // Match shorthand like "45k" or "45K"
  const kMatch = caption.match(/(\d+)\s?[kK]/);
  if (kMatch) return parseInt(kMatch[1]) * 1000;
  
  return 0;
}

export function Collections() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInstagramProducts() {
      const fallback: Product[] = [
        { id: 'insta-1', name: 'Luxury Silk Boubou', price: 45000, image: '', description: 'Handcrafted luxury ₦45,000' },
        { id: 'insta-2', name: 'Royal Gold Agbada', price: 85000, image: '', description: 'Embrace royalty ₦85,000' },
        { id: 'insta-3', name: 'Ankara Couture', price: 32000, image: '', description: 'Modern chic ₦32,000' }
      ];

      try {
        const response = await fetch(INSTAGRAM_FEED_URL);
        const data = await response.json();
        const posts = Array.isArray(data) ? data : (data.posts || []);
        
        if (posts.length === 0) {
          setProducts(fallback);
        } else {
          const formattedProducts: Product[] = posts.map((post: any) => ({
            id: post.id,
            name: post.caption ? post.caption.split('\n')[0].substring(0, 30) : 'RavePlus Exclusive',
            price: parsePriceFromCaption(post.caption),
            image: post.mediaUrl || post.media_url,
            description: post.caption || '',
            permalink: post.permalink
          }));
          setProducts(formattedProducts);
        }
      } catch (error) {
        console.error("Failed to load Instagram feed:", error);
        setProducts(fallback);
      } finally {
        setLoading(false);
      }
    }

    loadInstagramProducts();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <section id="collections" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-8">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="luxury-heading text-5xl font-light mb-16 text-center"
        >
          The Masterpieces
        </motion.h2>
        
        {loading ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center flex-col items-center py-24 gap-4"
          >
            <div className="animate-spin w-12 h-12 border-t-2 border-orange-600 border-solid rounded-full"></div>
            <p className="text-neutral-400 italic">Connecting to the House of Fashion...</p>
          </motion.div>
        ) : products.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="col-span-full py-20 text-center text-neutral-400 italic"
          >
            The collection is currently backstage.
          </motion.div>
        ) : (
          <motion.div 
            key="products-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
          >
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
