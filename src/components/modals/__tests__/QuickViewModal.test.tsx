import { render, screen, fireEvent } from '@testing-library/react';
import { QuickViewModal } from '../QuickViewModal';
import { useStore } from '@/store/useStore';

jest.mock('@/store/useStore', () => ({
  useStore: jest.fn()
}));

const mockProduct = {
  id: 'qv-1',
  name: 'QuickView Item',
  price: 90000,
  description: 'A beautiful quick view item',
  image: '/test.jpg',
  permalink: 'https://instagram.com/p/123'
};

describe('QuickViewModal', () => {
  const mockClose = jest.fn();
  const mockAddToCart = jest.fn();
  const mockToggleCart = jest.fn();

  beforeEach(() => {
    (useStore as unknown as jest.Mock).mockReturnValue({
      quickViewProduct: mockProduct,
      closeQuickView: mockClose,
      addToCart: mockAddToCart,
      toggleCart: mockToggleCart
    });
    jest.clearAllMocks();
  });

  it('renders product details and instagram link correctly', () => {
    render(<QuickViewModal />);
    
    expect(screen.getByText('QuickView Item')).toBeInTheDocument();
    expect(screen.getByText('₦90,000')).toBeInTheDocument();
    expect(screen.getByText('A beautiful quick view item')).toBeInTheDocument();
    
    const instaLink = screen.getByText('View Original Post');
    expect(instaLink).toBeInTheDocument();
    expect(instaLink.closest('a')).toHaveAttribute('href', 'https://instagram.com/p/123');
  });

  it('adds item to cart with correct quantity and triggers cart open', () => {
    render(<QuickViewModal />);
    
    // Increment quantity
    // Using buttons: [close, minus, plus, Add to House]
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[2]); // plus button -> qty=2

    const addBtn = screen.getByText('Add to House');
    fireEvent.click(addBtn);

    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct, 2);
    expect(mockClose).toHaveBeenCalled();
    expect(mockToggleCart).toHaveBeenCalled();
  });
});
