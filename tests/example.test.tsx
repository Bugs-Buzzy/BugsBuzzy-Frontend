/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../src/App';

describe('App', () => {
  it('renders main brand heading', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: /BugsBuzzy/i })).toBeInTheDocument();
  });
});
