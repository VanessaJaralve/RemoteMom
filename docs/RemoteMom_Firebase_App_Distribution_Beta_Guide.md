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

The following values are recorded by the current repository configuration. They identify the source configuration reviewed on November 18. The Firebase versions/distribution metadata observed below do not by themselves establish the APK bytes, EAS build or source relationship.

- App name: `RemoteMom`
- Android package name: `com.vanessajaralve.remotemom`
- App version: `0.1.1`
- Android version code: `2`
- Current Expo owner: `vanessajaralve`
- EAS project ID: `8ae5a453-4596-4728-9b86-446cadabab75`

Important: Firebase package names are case-sensitive and cannot be changed for an app after registration.

## Recorded 0.1.1 Source APK

The original guide records this EAS internal APK package. Keep it as historical package evidence; reconcile the later 0.1.2 record and the observed Firebase releases with exact EAS artifacts and source before selecting a release:

- EAS build ID: `db447bf4-41ae-48a3-8ad6-942b244cf43f`
- EAS build page: `https://expo.dev/accounts/vanessajaralve/projects/remotemom/builds/db447bf4-41ae-48a3-8ad6-942b244cf43f`
- APK access: use the owner-controlled build page after reconciling the source and artifact metadata; direct download links are not published here.
- Local APK filename: `releases/android-sideload/RemoteMom-0.1.1-beta.apk`
- SHA-256: `e89c6c05c3a919ee526f101d0e12e6cef97d03b4a6ad0c4c85eee89b7fb77343`

The APK file is intentionally ignored by git and should not be committed.

## Source And Build Reconciliation — 2026-11-18

This read-only review is tracked in the approved source/build follow-up [issue #39](https://github.com/VanessaJaralve/RemoteMom/issues/39), currently **open at 3/7; Paused—originals unavailable** following Vanessa's November 18 confirmation below. Together with approved local-data protection [#38](https://github.com/VanessaJaralve/RemoteMom/issues/38), it completes the follow-up disposition for the **9/9 assessment** in [#17](https://github.com/VanessaJaralve/RemoteMom/issues/17). Historical completed build and beta records remain valid as records of the work reported at the time. The source and artifact used for each Firebase release must be identified separately from the version and distribution metadata now observed in the owner Console.

### Verified Repository And EAS Evidence

- Reviewed main: [`4e5f8dab2695120efd261f66ebd2ce98ee9af885`](https://github.com/VanessaJaralve/RemoteMom/commit/4e5f8dab2695120efd261f66ebd2ce98ee9af885). At this commit, `app.json` records version `0.1.1`, Android version code `2`, package `com.vanessajaralve.remotemom`, Expo owner `vanessajaralve` and EAS project ID `8ae5a453-4596-4728-9b86-446cadabab75`.
- In the original pre-fix review, all 15 retained non-main branches were behind that baseline main commit, with no commits ahead. No branch in that review supplied the missing later app controls.
- The July/August implementation history identifies [reminder-ready model fields and labels](https://github.com/VanessaJaralve/RemoteMom/commit/17eb7141f8c8511ea715e9f46d953d540929fbdc), [shared date/time utilities](https://github.com/VanessaJaralve/RemoteMom/commit/b017a2c18257f786e63147de0c24d1dd36ed8069), and [quick To-Do date / Child time / Health controls](https://github.com/VanessaJaralve/RemoteMom/commit/c1a912bf6d1b61e34d466b6a21d4eba00c3aa709).
- The August 15 calendar picker/alarm-style controls and September 13 reminder-time/Child frequency completion records first appear in the reviewed GitHub documentation history in [`4eae3422792478dd50457b54b0ffeded363e0d78`](https://github.com/VanessaJaralve/RemoteMom/commit/4eae3422792478dd50457b54b0ffeded363e0d78), committed September 27. That commit changes no `src/` app files. Current main still has the earlier simple controls. This is an unresolved source/build provenance mismatch; it does not prove that the historical work never existed or that a regression occurred.
- The live EAS share pages for both recorded builds below showed `@vanessajaralve/remotemom`, `APK`, `Android internal distribution build` and `Succeeded` on November 18. Those pages did not expose Git SHA, app version/build number, profile or build date. No APK was downloaded or installed during this earlier EAS share-page check.

| Historical package record | EAS build | Recorded SHA-256 | What is established |
| --- | --- | --- | --- |
| 0.1.1; guide/source preparation committed August 23 | [`db447bf4-41ae-48a3-8ad6-942b244cf43f`](https://expo.dev/accounts/vanessajaralve/projects/remotemom/builds/db447bf4-41ae-48a3-8ad6-942b244cf43f) | `e89c6c05c3a919ee526f101d0e12e6cef97d03b4a6ad0c4c85eee89b7fb77343` | The guide's historical artifact record and EAS success/package-type status. Firebase lists 0.1.1 (2) with prior invitation/acceptance/download activity. Exact artifact/hash/source identity was not reverified from bytes. |
| 0.1.2; checklist record dated September 13 | [`22e9fb3f-b612-454f-8c51-850b92044c83`](https://expo.dev/accounts/vanessajaralve/projects/remotemom/builds/22e9fb3f-b612-454f-8c51-850b92044c83) | `2a2f13cb7b07db8d0546497f227a0bf79bfdec26db66fc89a26cad7844e903e6` | The checklist historically reported ready for Firebase upload. The November 18 Console check now confirms a 0.1.2 (3) upload with no testers added. EAS success/package-type status is verified; exact artifact/hash/source identity remains unresolved. |

### Owner Expo Build Details — Follow-up After Sign-in

Vanessa's Expo sign-in resolved the earlier metadata-access block. The signed-in owner views established:

| Recorded build | Source reference and build metadata | Source/artifact availability |
| --- | --- | --- |
| 0.1.2 — `22e9fb3f-b612-454f-8c51-850b92044c83` | Succeeded; version **0.1.2 (3)**; profile `sideload-apk`; environment `preview`; SDK 57; EAS CLI 24.3.0. Literal commit label **`e2e39c5*`**, resolving in GitHub to [`e2e39c5f02f136ed2d362b4cfe3eaa40b11db099`](https://github.com/VanessaJaralve/RemoteMom/commit/e2e39c5f02f136ed2d362b4cfe3eaa40b11db099), **Prepare RemoteMom Android beta 0.1.1 APK**. Fingerprint: `004d0f74c5766f51b5e23a02c87e61cb332c2bad`. | Availability **Expired**; artifacts expired **September 27, 2026**; logs do not exist. Project archive content reports **Failed to load project metadata file**. |
| 0.1.1 — `db447bf4-41ae-48a3-8ad6-942b244cf43f` | Succeeded; profile `sideload-apk`; environment `preview`; SDK 57. Literal commit label **`8ce6012*`**, resolving in GitHub to [`8ce6012917db3ea9a69c4d8127ed2266edd0cc6c`](https://github.com/VanessaJaralve/RemoteMom/commit/8ce6012917db3ea9a69c4d8127ed2266edd0cc6c), **Add Firebase App Distribution beta guide**. Fingerprint: `dadf9e4e500b1f052f5accfe1eee8a5eb1089828`. | Availability **Expired**; artifacts expired **September 6, 2026**; logs do not exist. |

The asterisks above are recorded literally. Their meaning has not been verified from an authoritative
source or an explanatory UI field, so neither uncommitted changes nor their contents are asserted.
The reported Git references are established, but the exact uploaded source snapshot and any
uncommitted delta remain unproven; criterion 4 stays open.

For the 0.1.2 fingerprint, the retained Sources view contains Expo app configuration with
`com.vanessajaralve.remotemom`, version 0.1.2, versionCode 3, project ID
`8ae5a453-4596-4728-9b86-446cadabab75` and SDK 57. Its Builds 1 view links the exact build
`22e9fb3f-b612-454f-8c51-850b92044c83`. The referenced Git commit's
[app.json](https://github.com/VanessaJaralve/RemoteMom/blob/e2e39c5f02f136ed2d362b4cfe3eaa40b11db099/app.json)
is 0.1.1 (2), byte-identical to app.json at merged main `8cd714a9ca1a04d0471e5aed977677904b86c8e0`.
Its eas.json uses local version sourcing and the sideload-apk/internal/APK profile. The older
8ce6012 commit's app.json is 0.1.0 (1). These comparisons identify committed configuration differences;
they do not recover the uploaded JavaScript source or identify the missing calendar/reminder changes.
The retained fingerprint and configuration are **not an APK SHA-256 or a complete source archive**.
No download was attempted during this signed-in Expo follow-up.

### Firebase Release Metadata — Read November 18, 2026

A read-only review of the signed-in owner Console for the RemoteMom project found **two releases**:

| Firebase release | Listed timestamp | Observed distribution state |
| --- | --- | --- |
| **0.1.2 (3)** | September 13, 2026, **1:21:40 PM UTC+8** | Expanded Add testers pane reported **No testers added to this release**; the next control was to proceed to adding release notes. |
| **0.1.1 (2)** | August 23, 2026, **10:31:02 PM UTC+8** | Collapsed aggregate summary: **Invited 1 / Accepted 1 / Downloaded 1 / Feedback 0**. |

This establishes the newer upload and the older release's recorded distribution/download activity.
It does not match either Firebase release to exact EAS artifact bytes, a recorded hash or a source
snapshot, and it does not verify the version currently installed on a tester's device. Issue #39
therefore remains **3/7**: criterion 6 requires the release-to-artifact relationship, which is still
unresolved. No tester identities or private feedback were opened. The normal owner Firebase 0.1.2
Download release request was attempted; browser download capture timed out and reset without returning
a file path or inspectable bytes. No APK bytes were obtained for inspection and no APK was installed;
the checksum remains unverified. No retry, bypass, invitation, release or settings action occurred. Private account identifiers,
owner-console links and direct APK artifact links are not published here.

### Remaining Provenance Checks

**Owner confirmation — November 18, 2026:** Vanessa does not have the original RemoteMom 0.1.2 APK or the September 13,
2026 project folder/source archive. Issue #39 remains **open at 3/7; Paused—originals unavailable**.
Expo access is resolved, but the exact uploaded source, APK bytes/checksum and Firebase-to-EAS
artifact relationship remain unproven. The inspected expired/unavailable views did not supply this
evidence. The earlier requests to obtain and compare owner-retained originals are superseded by this
pause; no original-file task or further retrieval attempt is assigned.

1. The original **September 13 project folder or source archive** is unavailable. The exact uploaded
   snapshot and any uncommitted delta relative to `e2e39c5f02f136ed2d362b4cfe3eaa40b11db099` remain
   unproven; neither the literal asterisk nor retained fingerprint configuration establishes them.
2. The original **RemoteMom-0.1.2-beta.apk** is unavailable. Its bytes, actual version/build number
   and SHA-256 have not been reverified against the historical recorded hash
   `2a2f13cb7b07db8d0546497f227a0bf79bfdec26db66fc89a26cad7844e903e6`.
   Preserve the earlier Firebase capture timeout: no APK bytes were obtained for inspection and no APK
   was installed; the checksum remains unverified.
3. The exact APK/source relationship to the observed Firebase release and EAS build remains unresolved.
   Matching version labels, fingerprints or dates alone does not establish criterion 6. Current
   tester-device version remains unverified; no new recruitment task is created.
4. **Criteria 4–7 remain unpassed.** The completed metadata checks and historical records remain
   accepted within their original scope. A fresh build would not recover or verify the historical
   source snapshot or APK relationship.

This pause authorizes no new build, installation, tester invitation or release. The existing setup and distribution instructions below remain procedural reference; no new distribution took place in this review. [PR #40](https://github.com/VanessaJaralve/RemoteMom/pull/40) merged at `8cd714a9ca1a04d0471e5aed977677904b86c8e0`, and #38 is **closed at 8/8**. Its verified code head remains `79e3b9fa406a84b9a61c9081a0ff09c870f91d9e`. The actual corrected persistence adapter passed 26 cases; [CI run 44184433162 / job 134397033866](https://github.com/VanessaJaralve/RemoteMom/actions/runs/44184433162/job/134397033866) passed frozen install, 435 Jest tests across 34 suites, TypeScript and Android JavaScript/assets export. The baseline used nine actual-persistence cases with synthetic storage and modeled provider save selection; it was not a device run. The source fix preserves unsafe stored payloads, blocks unsafe restore edits/saves and provides read/save retries without cloud backup or logging private app content. These source checks do not prove that an existing APK includes the fix and are not a native build, installation or release.

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

After Vanessa sends your private Firebase App Distribution invitation:

1. Open the invitation email on your Android phone.
2. Sign in with Google and accept the invitation. The Google account you choose may differ from the email address that received the invitation.
3. Firebase App Tester is optional. If you use it, sign in with the **same Google account you used to accept the invitation**. Use that account when opening the invitation in your browser too.
4. In Firebase App Tester, choose **RemoteMom**, then **Download**. If you are using your browser, follow the download steps in the invitation.

RemoteMom is a calm daily command center for remote working moms. It brings to-dos, groceries, one child's schedule, and family medicine routines into one Today view so you do not have to carry everything in your head.

This is an early Android beta. The app stores your entries locally on your device. It is not backed up to RemoteMom cloud storage yet.

After trying it, please answer the short feedback form:

https://remote-mom.vercel.app/beta-feedback/

Please do not include private medicine details, child details, or sensitive family information in the feedback form.

## Installation Troubleshooting

If RemoteMom is missing, first check which Google account accepted the invitation, then use that account in Firebase App Tester or the browser. Matching only the email address that received the invitation is not enough if a different Google account accepted it.

If the app is still missing or the download cannot be completed, contact Vanessa at [vanessa.jaralve@gmail.com](mailto:vanessa.jaralve@gmail.com?subject=RemoteMom%20beta%20install%20help). Describe the step and error without sending passwords or private app entries. Joining the interest list does not automatically send a Firebase invitation.

Guidance checked on 2026-11-14 against Firebase's official [Android tester setup instructions](https://firebase.google.com/docs/app-distribution/get-set-up-as-a-tester?platform=android) and [App Distribution troubleshooting](https://firebase.google.com/docs/app-distribution/troubleshooting). Firebase App Distribution is only the installation/distribution channel; RemoteMom entries remain local to the device, with no app cloud backup added.

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
