# RemoteMom Firebase App Distribution Beta Guide

Use this guide to distribute the Android beta through Firebase App Distribution without paying for Google Play Console and without adding Firebase cloud sync.

This is a distribution-only Firebase use. It does not add Firebase Authentication, Firestore, Cloud Storage, notifications, analytics, or cloud backup to the RemoteMom app.

## Current Decision

RemoteMom should use Firebase App Distribution as the next Android beta distribution path.

Why this is better than private APK links:

- Testers receive an official invite email.
- Vanessa can see invite and download status.
- Tester access is limited to invited emails or tester groups.
- The APK does not need to be posted publicly.
- New builds can be uploaded when the app changes.
- The existing beta feedback page can remain the structured feedback path.

Firebase App Distribution is listed by Firebase as a no-cost product. Keep the project on the Spark plan unless a future approved task explicitly adds paid Firebase services.

## Required App Identity

Use these exact values when registering the Android app in Firebase:

- App name: `RemoteMom`
- Android package name: `com.vanessajaralve.remotemom`
- App version: `0.1.1`
- Android version code: `2`
- Current Expo owner: `vanessajaralve`
- EAS project ID: `8ae5a453-4596-4728-9b86-446cadabab75`

Important: Firebase package names are case-sensitive and cannot be changed for an app after registration.

## Source APK

Use the latest EAS internal APK build for Firebase App Distribution:

- EAS build ID: `db447bf4-41ae-48a3-8ad6-942b244cf43f`
- EAS build page: `https://expo.dev/accounts/vanessajaralve/projects/remotemom/builds/db447bf4-41ae-48a3-8ad6-942b244cf43f`
- EAS APK artifact: `https://expo.dev/artifacts/eas/IoXroXzpER-S0SuxwnPLTDu93Q_Bf3ph-Cc_rCoxO-k.apk`
- Local APK filename: `releases/android-sideload/RemoteMom-0.1.1-beta.apk`
- SHA-256: `e89c6c05c3a919ee526f101d0e12e6cef97d03b4a6ad0c4c85eee89b7fb77343`

The APK file is intentionally ignored by git and should not be committed.

## Firebase Console Setup

1. Open Firebase Console.
2. Create a new project named `RemoteMom`.
3. Keep the project on the Spark plan.
4. Register an Android app.
5. Enter the package name exactly:

```text
com.vanessajaralve.remotemom
```

6. Use app nickname `RemoteMom Android Beta`.
7. Skip adding Analytics unless a future privacy-approved task explicitly adds analytics.
8. Do not add the Firebase SDK to the app for this distribution-only beta.
9. Open App Distribution in the Firebase Console.
10. Select the RemoteMom Android app and click Get started.

## Upload And Distribute The APK

1. In Firebase App Distribution, open Releases.
2. Upload the APK file.
3. Create a tester group named `trusted-android-beta`.
4. Add tester email addresses.
5. Add release notes.
6. Click Distribute.

Recommended release notes:

```text
RemoteMom Android beta 0.1.1

Thank you for helping test RemoteMom. This early beta is local-first and supports one child for now.

Please try:
1. Open Today.
2. Add and complete one To-Do.
3. Add and check one Grocery item.
4. Add one Child Schedule item.
5. Add one Medicine routine and mark one time as taken.
6. Close and reopen the app to confirm your entries stay on your device.

After testing, please send feedback here:
https://remote-mom.vercel.app/beta-feedback/

Please do not enter private medicine details in the feedback form. RemoteMom organizes routines only and does not provide medical advice.
```

## Tester Message

Hi! Thank you for helping test RemoteMom.

You should receive a Firebase App Distribution invite by email. Please open it on your Android phone, sign in with Google if asked, and install the RemoteMom beta.

RemoteMom is a calm daily command center for remote working moms. It brings to-dos, groceries, one child's schedule, and family medicine routines into one Today view so you do not have to carry everything in your head.

This is an early Android beta. The app stores your entries locally on your device. It is not backed up to RemoteMom cloud storage yet.

After trying it, please answer the short feedback form:

https://remote-mom.vercel.app/beta-feedback/

Please do not include private medicine details, child details, or sensitive family information in the feedback form.

## What To Track In Firebase

Track only distribution readiness signals:

- Invited testers
- Accepted invitations
- Downloaded build
- Tester install issues
- Tester feedback submitted through the beta feedback page

Do not track task names, medicine names, dosage details, child details, grocery contents, or other sensitive app content.

## Success Criteria

The Firebase beta distribution step is successful if:

- Vanessa can upload the existing APK to Firebase App Distribution.
- At least 5 trusted testers receive the invite.
- At least 3 testers accept the invite and download the build.
- At least 3 testers submit the beta feedback form.
- No tester reports that install trust or onboarding is too confusing.

## Known Limitations

- This is Android-only.
- iPhone beta distribution still requires an Apple-approved distribution path.
- App entries remain local-only and are not backed up.
- Firebase App Distribution does not replace the beta feedback form.
- Firebase App Distribution does not prove willingness to pay.
- New RemoteMom builds must be uploaded again when the app changes.

## Next Step After Setup

After the first Firebase distribution is sent, review:

1. Who accepted the invite.
2. Who downloaded the build.
3. Who submitted feedback.
4. Whether the Today Dashboard helped testers understand what needed attention.
5. Whether multiple children, sharing, or reminders were repeatedly requested.

Do not add Firestore, Auth, notifications, multi-child UI, or partner sharing until beta feedback supports that decision.
