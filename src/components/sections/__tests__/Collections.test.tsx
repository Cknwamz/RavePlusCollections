import { render, screen, waitFor } from '@testing-library/react';
import { Collections } from '../Collections';

// Mock global fetch
global.fetch = jest.fn();

describe('Collections Section', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('displays loading state initially', () => {
    // Setup fetch to be pending
    (fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));
    render(<Collections />);
    expect(screen.getByText('Connecting to the House of Fashion...')).toBeInTheDocument();
  });

  it('renders products successfully when Behold API returns data', async () => {
    const mockPosts = {
      posts: [
        {
          id: '123',
          caption: 'Special Dress ₦20,000',
          mediaUrl: '/test-image.jpg',
          permalink: 'https://insta'
        }
      ]
    };

    (fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockPosts)
    });

    // Assert via accessible roles which handle async states natively
    render(<Collections />);
    const heading = await screen.findByRole('heading', { name: /Special Dress/i }, { timeout: 3000 });
    expect(heading).toBeInTheDocument();
  });

  it('falls back to local data when API fails', async () => {
    (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));
    
    render(<Collections />);

    await waitFor(() => {
      expect(screen.getByText('Luxury Silk Boubou')).toBeInTheDocument();
      expect(screen.getByText('₦45,000')).toBeInTheDocument();
    });
  });
});
