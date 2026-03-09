import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type User = {
  id: string;
  name: string;
  email: string;
  role?: 'admin' | 'customer';
  phone?: string;
  addresses?: any[];
  orders?: any[];
};

export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  permalink?: string;
};

export type CartItem = Product & { qty: number };

interface StoreState {
  // UI State
  isCartOpen: boolean;
  isLoginOpen: boolean;
  isSignupOpen: boolean;
  isAccountOpen: boolean;
  isAddressOpen: boolean;
  quickViewProduct: Product | null;

  toggleCart: () => void;
  openLogin: () => void;
  closeLogin: () => void;
  openSignup: () => void;
  closeSignup: () => void;
  openAccount: () => void;
  closeAccount: () => void;
  openAddress: () => void;
  closeAddress: () => void;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;

  // Cart State
  cart: CartItem[];
  addToCart: (product: Product, qty: number) => void;
  removeFromCart: (productId: string) => void;
  updateQty: (productId: string, delta: number) => void;
  cartTotal: () => number;
  clearCart: () => void;
  
  // Auth State
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // UI STATE
      isCartOpen: false,
      isLoginOpen: false,
      isSignupOpen: false,
      isAccountOpen: false,
      isAddressOpen: false,
      quickViewProduct: null,

      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
      openLogin: () => set({ isLoginOpen: true, isSignupOpen: false }),
      closeLogin: () => set({ isLoginOpen: false }),
      openSignup: () => set({ isSignupOpen: true, isLoginOpen: false }),
      closeSignup: () => set({ isSignupOpen: false }),
      openAccount: () => set({ isAccountOpen: true }),
      closeAccount: () => set({ isAccountOpen: false }),
      openAddress: () => set({ isAddressOpen: true }),
      closeAddress: () => set({ isAddressOpen: false }),
      openQuickView: (p) => set({ quickViewProduct: p }),
      closeQuickView: () => set({ quickViewProduct: null }),

      // CART STATE
      cart: [],
      addToCart: (p, qty) => set((state) => {
        const existing = state.cart.find((item) => item.id === p.id);
        if (existing) {
          return { cart: state.cart.map((item) => item.id === p.id ? { ...item, qty: item.qty + qty } : item) };
        }
        return { cart: [...state.cart, { ...p, qty }] };
      }),
      removeFromCart: (productId) => set((state) => ({ cart: state.cart.filter((item) => item.id !== productId) })),
      updateQty: (productId, delta) => set((state) => ({
        cart: state.cart.map(item =>
          item.id === productId ? { ...item, qty: Math.max(1, item.qty + delta) } : item
        )
      })),
      cartTotal: () => {
        const { cart } = get();
        return cart.reduce((total, item) => total + (item.price * item.qty), 0);
      },
      clearCart: () => set({ cart: [] }),

      // AUTH STATE
      user: null,
      setUser: (user) => set({ user }),
    }),
    {
      name: 'raveplus-storage',
      partialize: (state) => ({ cart: state.cart, user: state.user }), // only persist cart and user
    }
  )
);
