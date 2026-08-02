import React from 'react';
import { render } from '@testing-library/react-native';

import App from '../App';
import { LIFE_AREA_COLORS } from '../src/constants/colors';

describe('Working Mom Command Center app shell', () => {
  it('renders the core bottom tab labels and the beta trust area', async () => {
    const { getAllByText, getByText } = await render(<App />);

    expect(getAllByText('Today').length).toBeGreaterThan(0);
    expect(getAllByText('Health').length).toBeGreaterThan(0);
    expect(getAllByText('Kid').length).toBeGreaterThan(0);
    expect(getAllByText('Grocery').length).toBeGreaterThan(0);
    expect(getByText('To-Dos')).toBeOnTheScreen();
    expect(getByText('More')).toBeOnTheScreen();
  });

  it('starts on the Today Dashboard screen', async () => {
    const { getByText } = await render(<App />);

    expect(getByText('Daily command center')).toBeOnTheScreen();
    expect(getByText('Morning')).toBeOnTheScreen();
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
