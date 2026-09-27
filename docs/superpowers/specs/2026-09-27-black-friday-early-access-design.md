# Black Friday Early Access Design

## Goal

Create a separate Black Friday / Cyber Monday early-access beta page that recruits remote working moms without presenting RemoteMom as a finished paid product.

## Scope

The campaign lives at `/black-friday/` and uses the existing static landing-page stack. It collects name, email, Android phone availability, children count, biggest daily struggle, and beta-testing interest. It does not collect payments, add premium gating, or change the mobile app.

## Collection Flow

The page submits to `/api/black-friday`. The endpoint validates required fields, adds `submissionType: "black-friday-early-access"`, forwards to `VALIDATION_SUBMISSIONS_WEBHOOK_URL`, and requires `{ "ok": true }` from the destination before reporting success.

Google Apps Script routes that submission type into a `Black Friday Early Access` tab with columns for received time, submitted time, name, email, Android phone, children count, biggest struggle, beta interest, source, and raw payload.

## UX Principles

The page should feel calm, warm, and practical. Copy must clearly say this is early access and not a full public launch. Trust copy must mention Android-first beta, local-first app data, and medicine safety. The page should reuse the existing RemoteMom visual language so the site feels coherent.

## Non-Goals

Do not add Stripe, payments, coupons, automated invite sending, cloud sync, Firebase Auth, Firestore, notifications, or premium feature implementation.
