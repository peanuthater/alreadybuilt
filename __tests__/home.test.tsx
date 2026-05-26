import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HomePage from '@/app/page';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

describe('HomePage', () => {
  it('renders the heading, textarea, and Analyze button', () => {
    render(<HomePage />);
    expect(screen.getByText(/Is your idea already built/i)).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /analyze/i })).toBeInTheDocument();
  });

  it('Analyze button is disabled when input is empty', () => {
    render(<HomePage />);
    expect(screen.getByRole('button', { name: /analyze/i })).toBeDisabled();
  });

  it('Analyze button is disabled when input is less than 20 characters', async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    await user.type(screen.getByRole('textbox'), 'too short');

    expect(screen.getByRole('button', { name: /analyze/i })).toBeDisabled();
  });

  it('Analyze button is enabled when input is 20 or more characters', async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    await user.type(screen.getByRole('textbox'), 'A detailed idea that is long enough to pass');

    expect(screen.getByRole('button', { name: /analyze/i })).toBeEnabled();
  });

  it('shows character count helper text while typing', async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    // Initially shows minimum requirement
    expect(screen.getByText(/Minimum 20 characters required/i)).toBeInTheDocument();

    // While under limit shows how many more are needed
    await user.type(screen.getByRole('textbox'), 'short');
    expect(screen.getByText(/more character/i)).toBeInTheDocument();
  });
});
