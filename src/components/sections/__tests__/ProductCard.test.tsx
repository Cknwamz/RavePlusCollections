import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from '../ProductCard';
import { useStore } from '@/store/useStore';

// Mock the Zustand store
jest.mock('@/store/useStore', () => ({
  useStore: jest.fn()
}));

const mockProduct = {
  id: 'test-item',
  name: 'Test Silk Dress',
  price: 50000,
  description: 'Test description',
  image: '/test.jpg'
};

describe('ProductCard', () => {
  const mockOpenQuickView = jest.fn();
  const mockAddToCart = jest.fn();
  const mockToggleCart = jest.fn();

  beforeEach(() => {
    (useStore as unknown as jest.Mock).mockReturnValue({
      openQuickView: mockOpenQuickView,
      addToCart: mockAddToCart,
      toggleCart: mockToggleCart
    });
    jest.clearAllMocks();
  });

  it('renders product name and formatted price', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Test Silk Dress')).toBeInTheDocument();
    expect(screen.getByText('₦50,000')).toBeInTheDocument();
  });

  it('opens quick view modal on card click', () => {
    render(<ProductCard product={mockProduct} />);
    const card = screen.getByText('Test Silk Dress').closest('.product-card');
    fireEvent.click(card!);
    expect(mockOpenQuickView).toHaveBeenCalledWith(mockProduct);
  });

  it('adds item to cart when "Reserve Item" is clicked', () => {
    render(<ProductCard product={mockProduct} />);
    const reserveButton = screen.getByText('Reserve Item');
    fireEvent.click(reserveButton);
    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct, 1);
    expect(mockToggleCart).toHaveBeenCalled();
  });
});
