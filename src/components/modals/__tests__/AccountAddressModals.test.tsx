import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AccountModal } from '../AccountModal';
import { AddressModal } from '../AddressModal';
import { useStore } from '@/store/useStore';

jest.mock('@/store/useStore', () => ({
  useStore: jest.fn()
}));

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: { signOut: jest.fn() },
    from: jest.fn().mockImplementation(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      single: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis()
    }))
  }
}));

const mockUser = {
  id: 'demo-user-123',
  email: 'admin@raveplus.com',
  name: 'Admin',
  phone: '08023427426',
  addresses: []
};

describe('Account & Address Modals', () => {
  const mockCloseAccount = jest.fn();
  const mockCloseAddress = jest.fn();
  const mockOpenAddress = jest.fn();
  const mockSetUser = jest.fn();

  beforeEach(() => {
    (useStore as unknown as jest.Mock).mockReturnValue({
      isAccountOpen: true,
      isAddressOpen: false,
      closeAccount: mockCloseAccount,
      closeAddress: mockCloseAddress,
      openAddress: mockOpenAddress,
      user: mockUser,
      setUser: mockSetUser
    });
    jest.clearAllMocks();
  });

  it('renders account overview and tab navigation', async () => {
    render(<AccountModal />);
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
  });

  it('renders profile tab correctly', () => {
    render(<AccountModal />);
    fireEvent.click(screen.getByText('profile'));
    expect(screen.getByDisplayValue('Admin')).toBeInTheDocument();
  });

  it('renders address modal and falls back properly on failed demo update', async () => {
    (useStore as unknown as jest.Mock).mockReturnValue({
      isAddressOpen: true,
      user: mockUser,
      setUser: mockSetUser,
      closeAddress: mockCloseAddress
    });
    
    const { supabase } = require('@/lib/supabase');
    supabase.from.mockReturnValueOnce({
      update: jest.fn().mockReturnValue({
        eq: jest.fn().mockRejectedValue(new Error('Failed to fetch'))
      })
    });

    render(<AddressModal />);
    expect(screen.getByText('New Shipping Address')).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText('Home'), { target: { value: 'Work' } });
    const form = screen.getByRole('button', { name: 'Save Address' }).closest('form');
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(mockSetUser).toHaveBeenCalled();
      expect(mockCloseAddress).toHaveBeenCalled();
    });
  });
});
