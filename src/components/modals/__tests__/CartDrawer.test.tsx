import { render, screen, fireEvent } from '@testing-library/react';
import { CartDrawer } from '../CartDrawer';
import { useStore } from '@/store/useStore';

jest.mock('@/store/useStore', () => ({
  useStore: jest.fn()
}));

const mockInitializePayment = jest.fn();

jest.mock('react-paystack', () => ({
  usePaystackPayment: () => mockInitializePayment
}));

const mockItems = [{
  id: 'item-1',
  name: 'Gold Watch',
  price: 250000,
  qty: 2,
  description: 'Luxury',
  image: '/test.jpg'
}];

describe('CartDrawer', () => {
  const mockToggleCart = jest.fn();
  const mockUpdateQty = jest.fn();
  const mockRemoveFromCart = jest.fn();
  const mockClearCart = jest.fn();
  const mockOpenLogin = jest.fn();
  const mockOpenAddress = jest.fn();

  beforeEach(() => {
    (useStore as unknown as jest.Mock).mockReturnValue({
      isCartOpen: true,
      toggleCart: mockToggleCart,
      cart: mockItems,
      cartTotal: () => 135000,
      updateQty: mockUpdateQty,
      removeFromCart: mockRemoveFromCart,
      clearCart: mockClearCart,
      openLogin: mockOpenLogin,
      openAddress: mockOpenAddress,
      user: {
        id: '123',
        name: 'Test Setup',
        email: 'test@setup.com',
        addresses: [{ label: 'Home', address: '123 Mock Ln' }]
      }
    });
    jest.clearAllMocks();
  });

  it('renders cart items when open', () => {
    render(<CartDrawer />);
    expect(screen.getByText('Your Selection')).toBeInTheDocument();
    expect(screen.getByText('Gold Watch')).toBeInTheDocument();
    expect(screen.getByText('₦250,000')).toBeInTheDocument();
  });

  it('calculates total accurately', () => {
    render(<CartDrawer />);
    const totalEl = screen.getByText('₦135,000');
    expect(totalEl).toBeInTheDocument();
  });

  it('handles quantity increment', () => {
    render(<CartDrawer />);
    // Select the plus button. In our UI, it's represented as + or icon. 
    // We can find by testing library since we used lucide icon or raw html tags but we can use generic matchers.
    // The previous implementation used <Plus />. We can click by traversing or specific aria roles.
    // Let's find the toggle buttons via testid or role. Since it's a small app, we can find buttons and click the 2nd one.
    const buttons = screen.getAllByRole('button');
    // Button list: [close, minus, plus, remove, secure checkout]
    fireEvent.click(buttons[2]); // the plus button
    expect(mockUpdateQty).toHaveBeenCalledWith('item-1', 1);
  });

  it('renders empty state correctly', () => {
    (useStore as unknown as jest.Mock).mockReturnValue({
      isCartOpen: true,
      toggleCart: mockToggleCart,
      cart: [],
      cartTotal: jest.fn().mockReturnValue(0),
      updateQty: mockUpdateQty,
      removeFromCart: mockRemoveFromCart,
      clearCart: mockClearCart
    });

    render(<CartDrawer />);
    expect(screen.getByText('Your house is empty')).toBeInTheDocument();
    expect(screen.getByText('Secure Checkout')).toBeDisabled();
  });

  it('disables checkout button when cart is empty', () => {
    (useStore as unknown as jest.Mock).mockReturnValue({
      isCartOpen: true,
      cart: [],
      cartTotal: () => 0,
      updateQty: mockUpdateQty,
      removeFromCart: mockRemoveFromCart,
      toggleCart: mockToggleCart,
      clearCart: mockClearCart
    });

    render(<CartDrawer />);
    
    const checkoutBtn = screen.getByRole('button', { name: /Secure Checkout/i });
    expect(checkoutBtn).toBeDisabled();
  });

  it('triggers Paystack modal on Secure Checkout', () => {
    render(<CartDrawer />);
    
    const checkoutBtn = screen.getByRole('button', { name: /Secure Checkout/i });
    fireEvent.click(checkoutBtn);
    
    expect(mockInitializePayment).toHaveBeenCalled();
  });
});
