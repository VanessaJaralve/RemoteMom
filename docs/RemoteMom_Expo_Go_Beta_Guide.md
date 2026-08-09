# RemoteMom Expo Go Beta Guide

Use this guide for the no-budget RemoteMom beta path.

This path does not require Apple Developer Program, TestFlight, Google Play Console, or paid app-store setup. It is best for a small trusted beta group while RemoteMom is still validating whether the Today-first workflow reduces mental load for remote working moms.

## Current Beta Decision

RemoteMom will use Expo Go for the next beta step because there is no current budget for paid Apple or Google developer accounts.

This is a temporary beta approach. TestFlight and Google Play testing remain future options when budget is available and the app has stronger validation signals.

## What This Beta Tests

The Expo Go beta should answer:

- Can a new tester understand RemoteMom quickly?
- Does the Today Dashboard feel like the natural starting point?
- Can the tester add and complete items without help?
- Does local data survive closing and reopening the app?
- Which module feels most useful: To-Dos, Grocery, Child Schedule, or Medicine?
- Would the tester want to use this again tomorrow?

## What This Beta Does Not Test

This beta does not test:

- App Store or Google Play install flow
- Paid subscriptions
- Push notifications
- Firebase cloud backup
- Shared family access
- Multiple-child premium features
- Public app-store discovery

## Vanessa Setup Steps

1. Open the RemoteMom project on the development computer.
2. Start the Expo development server:

```bash
pnpm start -- --tunnel
```

3. Wait for the Expo QR code to appear.
4. Keep the development computer awake while testers are trying the app.
5. Send testers the invite message below and the current QR code or Expo link.

If tunnel mode is unavailable or unstable, use the LAN QR code only with testers on the same Wi-Fi network.

## Tester Instructions

Hi! Thank you for helping me test RemoteMom.

RemoteMom is a calm daily command center for remote working moms. It brings to-dos, groceries, one child's schedule, and family medicine reminders into one Today view so you do not have to carry everything in your head.

This is an early no-budget beta, so it opens through Expo Go instead of the app store.

One important note: this is a one-child MVP for now. I am testing whether the daily Today view is useful first, and I am also validating whether multiple children, partner/caregiver sharing, or reminders should come next.

Please try this:

1. Install Expo Go from the Google Play Store or App Store.
2. Open Expo Go.
3. Scan the QR code I send you.
4. Try the short test checklist below.
5. Send feedback from the More tab or message me what felt useful, confusing, or missing.

Important note: this beta stores your entries locally on your device. It is not backed up to RemoteMom cloud storage yet. RemoteMom organizes medicine routines only and does not provide medical advice.

## Tester Checklist

Ask each tester to spend 10 to 15 minutes on these flows:

1. Open RemoteMom and look at Today.
2. Add one To-Do due today, then mark it complete from Today.
3. Add one Grocery item, choose a category, then check it off.
4. Add one Child Schedule item for today.
5. Add one Medicine entry for Mom or Child, then mark one scheduled time as taken.
6. Close and reopen the app, then check whether the entries are still there.
7. Send feedback from the More tab.

## Follow-Up Questions

After testing, ask:

1. What did you understand RemoteMom was for?
2. Which screen did you want to open first?
3. Which feature felt most useful today?
4. What felt confusing or too much?
5. Would you use this again tomorrow? Why or why not?
6. What is one thing that would make this more valuable for your daily life?
7. Was one child enough for this test, or would you need multiple children before using it weekly?
8. Which would matter more to you next: multiple children, sharing with a partner or caregiver, or reminders?
9. What would make RemoteMom feel worth paying for later?

## Success Criteria

The Expo Go beta is useful if:

- At least 5 testers can open the app without a long setup call.
- At least 3 testers complete the full checklist.
- At least 3 testers say the Today view is understandable.
- At least 2 testers say they would try using it again tomorrow.
- Feedback identifies one repeated improvement area.

## Known Limitations

- Expo Go testing is less polished than an app-store beta.
- Testers may need help installing Expo Go or scanning the QR code.
- The app is only available while the development server is running.
- Local entries are not synced or backed up.
- The beta should only be shared with trusted testers for now.

## Next Step After This Beta

Invite a small group of trusted testers first. Start with 5 testers before trying to reach 10 to 30 people.

If testers can open the app and complete the checklist, move into beta learning:

- Track who tested.
- Record whether they completed the checklist.
- Capture their strongest pain point.
- Decide the next product fix based on repeated feedback.
