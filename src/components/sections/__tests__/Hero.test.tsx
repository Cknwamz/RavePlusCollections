import { render, screen } from '@testing-library/react';
import { Hero } from '../Hero';
import { describe } from 'node:test';

describe('Hero Section', () => {
  it('renders main luxury headers properly', () => {
    render(<Hero />);
    
    // Check main text chunks
    expect(screen.getByText(/Embrace Your Inner/i)).toBeInTheDocument();
    expect(screen.getByText(/Experience Luxury/i)).toBeInTheDocument();
  });

  it('contains the call-to-action buttons', () => {
    render(<Hero />);
    
    const shopBtn = screen.getByText('Shop the House');
    expect(shopBtn).toBeInTheDocument();
    expect(shopBtn.closest('a')).toHaveAttribute('href', '#collections');

    const waBtn = screen.getByText('WhatsApp');
    expect(waBtn).toBeInTheDocument();
    expect(waBtn.closest('a')).toHaveAttribute('href', 'https://wa.me/2348023427426');
  });
});
