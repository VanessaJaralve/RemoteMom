import React from 'react';
import { render } from '@testing-library/react-native';

import App from '../App';
import { LIFE_AREA_COLORS } from '../src/constants/colors';

describe('Working Mom Command Center app shell', () => {
  it('renders the five bottom tab labels from the project brief', async () => {
    const { getByText } = await render(<App />);

    expect(getByText('Today')).toBeOnTheScreen();
    expect(getByText('Health')).toBeOnTheScreen();
    expect(getByText('Kid')).toBeOnTheScreen();
    expect(getByText('Grocery')).toBeOnTheScreen();
    expect(getByText('To-Dos')).toBeOnTheScreen();
  });

  it('starts on the Today placeholder screen', async () => {
    const { getByText } = await render(<App />);

    expect(getByText('Today Dashboard')).toBeOnTheScreen();
    expect(getByText('Placeholder timeline for daily priorities.')).toBeOnTheScreen();
  });

  it('exports the exact life-area color system from the project brief', () => {
    expect(LIFE_AREA_COLORS).toEqual({
      work: '#1F2D50',
      kid: '#E0654D',
      health: '#C9A227',
      household: '#6B6B6B'
    });
  });
});
