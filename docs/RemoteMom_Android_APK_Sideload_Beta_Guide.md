# RemoteMom Android APK Sideload Beta Guide

Use this guide when a tester should install RemoteMom directly on an Android phone without Expo Go and without paying for Google Play Console.

This path is Android-only. iPhone external install testing still requires Apple's paid developer program or another approved Apple distribution path.

## Current Beta Decision

RemoteMom can support a no-budget Android sideload beta by producing an APK file from the Expo project.

Use this only with trusted testers. Android will show security warnings because the app is installed outside Google Play.

Current APK package status:

- EAS build ID: `c517ff91-ac09-43c1-9447-5c62389e5524`
- EAS build page: `https://expo.dev/accounts/vanessajaralve/projects/remotemom/builds/c517ff91-ac09-43c1-9447-5c62389e5524`
- Local APK file: `releases/android-sideload/RemoteMom-0.1.0-beta.apk`
- Build account: Vanessa's personal Expo account, `vanessajaralve`
- Status: generated and file-verified; still requires Vanessa's own Android install smoke test before sharing

## What Was Prepared

- Android package identity: `com.vanessajaralve.remotemom`
- Android version code: `1`
- EAS build profile: `sideload-apk`
- APK holding folder: `releases/android-sideload/`
- Verified APK file: `releases/android-sideload/RemoteMom-0.1.0-beta.apk`
- Tester installation instructions
- Tester checklist and feedback questions

## Build The APK

This step uses EAS Build. Cloud EAS builds upload the project source and assets to Expo's build service so Expo can compile the APK. Only run the build after Vanessa approves that upload.

Run this from the RemoteMom project folder:

```bash
pnpm dlx eas-cli@latest login
pnpm dlx eas-cli@latest build --platform android --profile sideload-apk
```

When the build finishes, download the APK from the EAS build page.

Recommended filename:

```text
RemoteMom-0.1.0-beta.apk
```

Save the downloaded APK in:

```text
releases/android-sideload/
```

If Vanessa does not approve an EAS cloud upload, the safer alternative is a local Android build machine with Android Studio, Android SDK, a compatible JDK, and local native build tooling. That local route avoids sending source code to Expo, but it requires more setup than the current project environment has.

## Vanessa Pre-Share Check

Before sending the APK to anyone else:

1. Install the APK on your Android phone.
2. Open RemoteMom.
3. Add one To-Do due today.
4. Add one Grocery item and choose a category.
5. Add one Child Schedule item.
6. Add one Medicine entry and mark one time as taken.
7. Close and reopen the app.
8. Confirm the local entries are still there.
9. Confirm More > feedback does not crash.

Do not share the APK until this check passes on your own phone.

## Tester Install Message

Hi! Thank you for helping me test RemoteMom.

RemoteMom is a calm daily command center for remote working moms. It brings to-dos, groceries, one child's schedule, and family medicine routines into one Today view so you do not have to carry everything in your head.

This is an early Android-only test package, so it is not from Google Play yet. Android may ask you to allow installing from this source.

One important note: this is a one-child MVP for now. I am testing whether the daily Today view is useful first, and I am also validating whether multiple children, partner/caregiver sharing, or reminders should come next.

Please try this:

1. Download the APK file I send you.
2. Tap the APK on your Android phone.
3. If Android asks, allow install from this source.
4. Open RemoteMom.
5. Complete the short tester checklist below.
6. Send feedback from the More tab or message me what felt useful, confusing, or missing.

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

1. Were you comfortable installing the APK, or did the Android warning feel concerning?
2. What did you understand RemoteMom was for?
3. Which screen did you want to open first?
4. Which feature felt most useful today?
5. What felt confusing or too much?
6. Would you use this again tomorrow? Why or why not?
7. Was one child enough for this test, or would you need multiple children before using it weekly?
8. Which would matter more to you next: multiple children, sharing with a partner or caregiver, or reminders?
9. What would make RemoteMom feel worth paying for later?

## Success Criteria

The APK sideload beta is useful if:

- Vanessa can install and open the APK on her Android phone.
- At least 3 trusted testers can install the APK without a live setup call.
- At least 3 testers complete the full checklist.
- At least 2 testers say the Today view is understandable.
- Feedback identifies one repeated improvement area.

## Known Limitations

- APK sideloading can feel less trustworthy than installing from Google Play.
- Updates are manual; testers need a new APK for each version.
- This should not be posted publicly.
- Local entries are not synced or backed up.
- The APK must be tested by Vanessa before sharing.
- Generating the APK through EAS requires explicit approval because it uploads the project to Expo's build service.
