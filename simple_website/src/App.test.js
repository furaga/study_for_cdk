import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Adam Jensen link', () => {
  render(<App />);
  const linkElement = screen.getByText(/Adam Jensen/i);
  expect(linkElement).toBeInTheDocument();
});
