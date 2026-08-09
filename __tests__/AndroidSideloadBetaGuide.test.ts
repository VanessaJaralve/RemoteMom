declare const __dirname: string;
declare function require(moduleName: 'fs'): {
  existsSync: (path: string) => boolean;
  readFileSync: (path: string, encoding: string) => string;
};
declare function require(moduleName: 'path'): {
  join: (...paths: string[]) => string;
};

const { existsSync, readFileSync } = require('fs');
const { join } = require('path');

const guidePath = join(__dirname, '..', 'docs', 'RemoteMom_Android_APK_Sideload_Beta_Guide.md');
const appConfigPath = join(__dirname, '..', 'app.json');
const easConfigPath = join(__dirname, '..', 'eas.json');
const releaseReadmePath = join(__dirname, '..', 'releases', 'android-sideload', 'README.md');

describe('RemoteMom Android APK sideload beta package', () => {
  it('documents the Android-only sideload beta path', () => {
    expect(existsSync(guidePath)).toBe(true);
    expect(existsSync(releaseReadmePath)).toBe(true);

    const guide = readFileSync(guidePath, 'utf8');

    expect(guide).toContain('# RemoteMom Android APK Sideload Beta Guide');
    expect(guide).toContain('without Expo Go');
    expect(guide).toContain('Android-only');
    expect(guide).toContain("Only run the build after Vanessa approves that upload");
    expect(guide).toContain('RemoteMom-0.1.0-beta.apk');
    expect(guide).toContain('Vanessa Pre-Share Check');
    expect(guide).toContain('Tester Install Message');
    expect(guide).toContain('Local entries are not synced or backed up');
  });

  it('configures an internal EAS APK build profile', () => {
    const appConfig = readFileSync(appConfigPath, 'utf8');
    const easConfig = readFileSync(easConfigPath, 'utf8');

    expect(appConfig).toContain('"package": "com.vanessajaralve.remotemom"');
    expect(appConfig).toContain('"versionCode": 1');
    expect(easConfig).toContain('"sideload-apk"');
    expect(easConfig).toContain('"distribution": "internal"');
    expect(easConfig).toContain('"buildType": "apk"');
  });
});
