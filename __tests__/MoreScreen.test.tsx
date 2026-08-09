import React from 'react';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';

import { MoreScreen } from '../src/screens/MoreScreen';

describe('MoreScreen privacy and feedback', () => {
  it('explains local-first privacy in plain language', async () => {
    const { getByText } = await render(<MoreScreen />);

    expect(getByText('Privacy & Feedback')).toBeOnTheScreen();
    expect(getByText('Your app data stays on this device for now.')).toBeOnTheScreen();
    expect(getByText('RemoteMom does not provide medical advice.')).toBeOnTheScreen();
    expect(
      getByText(
        "Waitlist, validation, and feedback responses may be saved in Vanessa's Google Sheet so the beta can improve without collecting your private app entries."
      )
    ).toBeOnTheScreen();
  });

  it('opens a feedback email without attaching sensitive app data', async () => {
    const openFeedbackUrl = jest.fn();
    const { getByLabelText } = await render(<MoreScreen openFeedbackUrl={openFeedbackUrl} />);

    await act(async () => {
      fireEvent.press(getByLabelText('Send RemoteMom beta feedback'));
    });

    expect(openFeedbackUrl).toHaveBeenCalledWith(
      expect.stringContaining('mailto:vanessa.jaralve@gmail.com')
    );
    expect(openFeedbackUrl).toHaveBeenCalledWith(
      expect.stringContaining('subject=RemoteMom%20beta%20feedback')
    );
    expect(openFeedbackUrl).toHaveBeenCalledWith(expect.not.stringContaining('medicine'));
    expect(openFeedbackUrl).toHaveBeenCalledWith(expect.not.stringContaining('task'));
  });

  it('shows a calm fallback when the feedback email action cannot open', async () => {
    const openFeedbackUrl = jest.fn().mockRejectedValue(new Error('No email app'));
    const { getByLabelText, getByText } = await render(
      <MoreScreen openFeedbackUrl={openFeedbackUrl} />
    );

    await act(async () => {
      fireEvent.press(getByLabelText('Send RemoteMom beta feedback'));
    });

    await waitFor(() => {
      expect(
        getByText('Could not open your email app. Please email vanessa.jaralve@gmail.com.')
      ).toBeOnTheScreen();
    });
  });
});
