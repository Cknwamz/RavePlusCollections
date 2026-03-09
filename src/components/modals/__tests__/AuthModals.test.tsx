import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthModals } from '../AuthModals';
import { useStore } from '@/store/useStore';

jest.mock('@/store/useStore', () => ({
  useStore: jest.fn()
}));

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn()
    },
    from: jest.fn()
  }
}));

describe('AuthModals', () => {
  const mockCloseLogin = jest.fn();
  const mockCloseSignup = jest.fn();
  const mockOpenSignup = jest.fn();
  const mockOpenLogin = jest.fn();
  const mockSetUser = jest.fn();

  beforeEach(() => {
    (useStore as unknown as jest.Mock).mockReturnValue({
      isLoginOpen: true,
      isSignupOpen: false,
      closeLogin: mockCloseLogin,
      closeSignup: mockCloseSignup,
      openSignup: mockOpenSignup,
      openLogin: mockOpenLogin,
      setUser: mockSetUser
    });
    jest.clearAllMocks();
  });

  it('renders login modal when isLoginOpen is true', () => {
    render(<AuthModals />);
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email Address')).toBeInTheDocument();
    expect(screen.getByText('Don\'t have an account?')).toBeInTheDocument();
  });

  it('switches to signup modal when clicking Create Account', () => {
    render(<AuthModals />);
    const registerBtn = screen.getByText('Create Account');
    fireEvent.click(registerBtn);
    expect(mockOpenSignup).toHaveBeenCalled();
  });

  it('handles mock login explicitly and sets fallback user on fetch failure', async () => {
    const { supabase } = require('@/lib/supabase');
    // Simulate what happens when the Supabase URL isn't configured
    supabase.auth.signInWithPassword.mockRejectedValue(new Error('Failed to fetch'));

    render(<AuthModals />);
    
    // Fill form
    fireEvent.change(screen.getByPlaceholderText('Email Address'), { target: { value: 'admin@raveplus.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    
    // Submit
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(mockSetUser).toHaveBeenCalledWith(expect.objectContaining({
        email: 'admin@raveplus.com'
      }));
      expect(mockCloseLogin).toHaveBeenCalled();
    });
  });

  it('renders signup modal when isSignupOpen is true', () => {
    (useStore as unknown as jest.Mock).mockReturnValue({
      isLoginOpen: false,
      isSignupOpen: true,
      closeLogin: mockCloseLogin,
      closeSignup: mockCloseSignup,
      openSignup: mockOpenSignup,
      openLogin: mockOpenLogin,
      setUser: mockSetUser
    });

    render(<AuthModals />);
    expect(screen.getByText('Join the House')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument();
  });
});
