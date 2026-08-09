# RemoteMom Android Sideload Beta Package

Place generated Android APK files in this folder when preparing a trusted tester package.

Recommended filename:

```text
RemoteMom-0.1.0-beta.apk
```

Do not commit APK binaries unless the project explicitly decides to store beta artifacts in GitHub. APK files can become large and should usually be shared through a private link with trusted testers.

The build configuration lives in `eas.json` under the `sideload-apk` profile.
