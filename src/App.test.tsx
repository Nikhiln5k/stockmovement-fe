import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders stock management login header', () => {
  render(<App />);
  const headerElement = screen.getByText(/Stock Management/i);
  expect(headerElement).toBeInTheDocument();
});
