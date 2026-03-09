"use client";

import { useStore } from "@/store/useStore";
import { usePaystackPayment } from "react-paystack";

export default function CheckoutButton() {
  const { cart, cartTotal, toggleCart, clearCart, user, openLogin, openAddress, setUser } = useStore();

  const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxx';

  const config = {
    reference: 'RAVE-' + Date.now(),
    email: user?.email || '',
    amount: cartTotal() * 100, // Kobo
    publicKey: PAYSTACK_PUBLIC_KEY,
    currency: 'NGN',
    metadata: {
      custom_fields: [
        { display_name: 'Customer', variable_name: 'customer', value: user?.name || '' },
        { display_name: 'Items', variable_name: 'items', value: cart.map(i => `${i.name} x${i.qty}`).join(', ') }
      ]
    }
  };

  const initializePayment = usePaystackPayment(config);

  const handleCheckout = () => {
    if (cart.length === 0) return;

    if (!user) {
      alert('Please login or create an account to checkout');
      toggleCart();
      openLogin();
      return;
    }

    if (!user.addresses || user.addresses.length === 0) {
      alert('Please add a shipping address in your account before checkout.');
      toggleCart();
      openAddress();
      return;
    }

    const primaryAddress = user.addresses![0];

    initializePayment({
      onSuccess: (paymentResult: any) => {
        const order = {
          id: paymentResult.reference,
          date: new Date().toISOString(),
          items: [...cart],
          total: cartTotal(),
          status: 'Confirmed',
          paymentRef: paymentResult.reference,
          address: primaryAddress
        };
        
        setUser({ ...user, orders: [...(user.orders || []), order] });
        clearCart();
        toggleCart();
        alert('Masterpiece Reserved! Your order has been confirmed. Check your email for details.');
      },
      onClose: () => {
        alert('Transaction cancelled.');
      }
    });
  };

  return (
    <button 
      disabled={cart.length === 0}
      onClick={handleCheckout}
      className="w-full py-6 bg-neutral-900 text-white text-[10px] font-bold tracking-[0.5em] uppercase hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:hover:bg-neutral-900 active:scale-[0.98]"
    >
      Secure Checkout
    </button>
  );
}
