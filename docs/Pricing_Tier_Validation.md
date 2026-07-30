# RemoteMom Pricing And Tier Validation

## Goal

Validate whether RemoteMom can become a focused paid niche app before building Firebase Auth, Firestore sync, payments, or premium feature gates.

The next business question is not "Can we build premium?" It is "Which outcome would a remote working mom pay to make easier?"

## Current Product Position

RemoteMom is a local-first mobile MVP for remote working moms who need one calm daily command center for:

- Work tasks
- One child's schedule
- Grocery needs
- Family health and medicine routines
- A daily Today Dashboard that combines the above

The strongest paid-value surface is the Today Dashboard because it turns separate lists into daily clarity.

## Market Context

Use these only as pricing anchors, not as products to copy.

- Cozi Gold lists $39 USD/year and applies to everyone in the account. Cozi's FAQ says Gold includes ad-free use, mobile month view, extra reminders, event notifications, calendar search, and priority support.
- FamilyWall Premium is listed in app-store materials at $44.99/year for the US, with monthly pricing shown as $7.99/month on the App Store and $4.99/month in some Google Play listings for the US/Canada.
- Todoist Pro is listed at $7/month or $60/year, with yearly billing equivalent to $5/month.

RemoteMom should not compete as a general family organizer. The wedge is narrower: a day-planning command center for remote working moms.

Sources checked on 2026-07-31:

- Cozi FAQ: https://www.cozi.com/faq/
- Cozi Gold: https://www.cozi.com/cozi-gold/
- FamilyWall Premium: https://www.familywall.com/premium.html
- FamilyWall App Store listing: https://apps.apple.com/us/app/familywall-family-organizer/id496889629
- FamilyWall Google Play listing: https://play.google.com/store/apps/details?id=com.familywall
- Todoist pricing FAQ: https://www.todoist.com/help/articles/todoist-plans-pricing-and-billing-faq-Vq2z0HWL6

## Recommended Tier Hypothesis

### Free MVP

Free should prove the daily habit without giving away the strongest expansion features.

Include:

- One child
- Local-only data
- Today Dashboard
- To-Dos
- Grocery List
- Kid Schedule
- Medicine Tracker
- Manual reminder-ready labels
- Edit, delete, and local persistence

Do not include:

- Multiple children
- Partner/family sharing
- Cloud backup
- Device notifications
- Calendar sync
- Premium routine templates

### Premium

Premium should be positioned as "less mental load across the family day," not as more lists.

Candidate paid features:

- Multiple children
- Cloud backup and cross-device sync
- Partner or caregiver sharing
- Real reminders and medicine alerts
- Google Calendar sync
- Morning/evening planning prompts
- Priority and overdue smart summaries
- Exportable weekly family view

## Price Points To Test

Test willingness to pay before implementing billing.

### Option A: Accessible Subscription

- $4.99/month
- $39/year

Why test it: It sits near family organizer pricing and feels low-risk for a parent if the app becomes a daily habit.

### Option B: Stronger Niche Subscription

- $6.99/month
- $59/year

Why test it: It tests whether the remote-working-mom niche values the command-center framing enough to pay closer to productivity-app pricing.

### Option C: Founding Member Annual

- $29/year for early users

Why test it: It creates a low-friction validation offer before the product has cloud sync or notifications.

## Validation Questions

### Primary Assumptions

1. Remote working moms feel enough daily pain around context-switching to want a dedicated command center.
2. One-child free use is enough to demonstrate value.
3. Multiple children, sharing, reminders, and sync are natural premium boundaries.
4. Users prefer a calm daily view over a full family operating system.
5. A yearly price around $39 is acceptable if the app saves daily planning stress.

### Interview Script

Ask 8 to 12 target users. Keep the conversation under 20 minutes.

1. What do you currently use to manage work tasks, child schedule, groceries, and medicine?
2. Where do things fall through the cracks most often?
3. When during the day do you feel most overloaded?
4. If one screen showed your work, child, grocery, and health priorities for today, would that be useful?
5. Which premium feature would matter most: multiple children, sharing, reminders, calendar sync, or cloud backup?
6. Would one-child local use feel fair for a free version?
7. Would you pay $4.99/month or $39/year if RemoteMom became part of your daily routine?
8. Would $6.99/month or $59/year feel reasonable, expensive, or unrealistic?
9. What would need to be true before you trusted the app with family health or schedule information?
10. Would you join a founding member offer at $29/year before all premium features are live?

## Survey Copy

Use this for a Google Form, Tally, or waitlist follow-up.

### Positioning Prompt

RemoteMom is a calm daily command center for remote working moms. It brings work tasks, one child's schedule, groceries, and medicine routines into one Today view.

### Multiple Choice Questions

1. Which part of your day is hardest to keep organized?
   - Work priorities
   - Child schedule
   - Groceries/meals
   - Medicine/health routines
   - All of the above

2. Which premium feature would you pay for first?
   - Multiple children
   - Partner/caregiver sharing
   - Real reminders
   - Calendar sync
   - Cloud backup

3. Which price feels reasonable if the app becomes useful daily?
   - I would only use a free version
   - $4.99/month
   - $39/year
   - $6.99/month
   - $59/year

4. Would you join a founding member offer at $29/year?
   - Yes
   - Maybe
   - No

## Decision Rules

Proceed to Firebase Auth + Firestore planning only if at least two of these are true:

- 10 or more target users join the waitlist or agree to follow up.
- 5 or more target users say the Today Dashboard solves a real daily pain.
- 3 or more target users say they would pay at least $39/year.
- Multiple children, sharing, reminders, or sync appears in the top two requested premium features.
- At least 2 users say they would consider a $29 founding member annual offer.

If these are not true, refine positioning and landing copy before building cloud infrastructure.

## Recommended Next Action

Create a simple validation form connected to the landing page. Use it to capture:

- Name
- Email
- Number of children
- Hardest daily organization area
- Most valuable premium feature
- Price comfort level
- Permission for a 15-minute interview

Keep the app local until enough evidence supports cloud sync and premium gates.
