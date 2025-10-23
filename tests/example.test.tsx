/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../src/App';

describe('App', () => {
  it('renders BugsBuzzy logo', () => {
    render(<App />);
    expect(screen.getByAltText('BugsBuzzy')).toBeInTheDocument();
  });
});
