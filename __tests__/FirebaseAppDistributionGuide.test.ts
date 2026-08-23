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

const guidePath = join(__dirname, '..', 'docs', 'RemoteMom_Firebase_App_Distribution_Beta_Guide.md');
const appConfigPath = join(__dirname, '..', 'app.json');

describe('RemoteMom Firebase App Distribution beta guide', () => {
  it('documents Firebase App Distribution as distribution-only beta infrastructure', () => {
    expect(existsSync(guidePath)).toBe(true);

    const guide = readFileSync(guidePath, 'utf8');
    const appConfig = readFileSync(appConfigPath, 'utf8');

    expect(guide).toContain('# RemoteMom Firebase App Distribution Beta Guide');
    expect(guide).toContain('distribution-only Firebase use');
    expect(guide).toContain('Spark plan');
    expect(guide).toContain('com.vanessajaralve.remotemom');
    expect(guide).toContain('App version: `0.1.1`');
    expect(guide).toContain('Android version code: `2`');
    expect(guide).toContain('db447bf4-41ae-48a3-8ad6-942b244cf43f');
    expect(guide).toContain('RemoteMom-0.1.1-beta.apk');
    expect(guide).toContain('RemoteMom Android Beta');
    expect(guide).toContain('trusted-android-beta');
    expect(guide).toContain('https://remote-mom.vercel.app/beta-feedback/');
    expect(guide).toContain('Please do not enter private medicine details');
    expect(guide).toContain('Do not add Firestore, Auth, notifications, multi-child UI, or partner sharing');
    expect(appConfig).toContain('"package": "com.vanessajaralve.remotemom"');
  });
});
