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

const landingDir = join(__dirname, '..', 'landing');
const htmlPath = join(landingDir, 'index.html');
const betaHtmlPath = join(landingDir, 'beta', 'index.html');
const cssPath = join(landingDir, 'styles.css');
const scriptPath = join(landingDir, 'waitlist.js');
const mockupPath = join(landingDir, 'remotemom-dashboard-mockup.png');

describe('RemoteMom landing page', () => {
  it('includes a focused waitlist page for niche validation', () => {
    expect(existsSync(htmlPath)).toBe(true);
    expect(existsSync(cssPath)).toBe(true);
    expect(existsSync(scriptPath)).toBe(true);
    expect(existsSync(mockupPath)).toBe(true);

    const html = readFileSync(htmlPath, 'utf8');

    expect(html).toContain('RemoteMom');
    expect(html).toContain('A calm daily command center for remote working moms.');
    expect(html).toContain('Join the waitlist');
    expect(html).toContain('name="name"');
    expect(html).toContain('name="email"');
    expect(html).toContain('remotemom-dashboard-mockup.png');
  });

  it('includes validation survey fields for MVP demand signals', () => {
    const html = readFileSync(htmlPath, 'utf8');
    const script = readFileSync(scriptPath, 'utf8');

    expect(html).toContain('Help validate the MVP');
    expect(html).toContain('name="childrenCount"');
    expect(html).toContain('name="hardestArea"');
    expect(html).toContain('name="premiumFeature"');
    expect(html).toContain('name="priceComfort"');
    expect(html).toContain('name="interviewPermission"');
    expect(html).toContain('$39/year');
    expect(script).toContain('remotemom:validation-survey');
  });

  it('submits validation answers to a real collection endpoint', () => {
    const html = readFileSync(htmlPath, 'utf8');
    const script = readFileSync(scriptPath, 'utf8');

    expect(html).toContain('Your answers help decide what RemoteMom should become next.');
    expect(script).toContain('/api/validation');
    expect(script).toContain('fetch(validationEndpoint');
    expect(script).toContain('Saved as a backup on this device');
    expect(html).not.toContain('Real collection form for MVP validation');
    expect(script).not.toContain('Local mock survey for MVP validation');
  });

  it('submits waitlist signups to a real collection endpoint', () => {
    const html = readFileSync(htmlPath, 'utf8');
    const script = readFileSync(scriptPath, 'utf8');

    expect(html).toContain('Join the early list and I will send updates as RemoteMom takes shape.');
    expect(script).toContain('/api/waitlist');
    expect(script).toContain('fetch(waitlistEndpoint');
    expect(script).toContain('remotemom:waitlist');
    expect(script).toContain('Saved as a backup on this device');
    expect(html).not.toContain('Real waitlist collection');
    expect(html).not.toContain('Offline preview saves a local backup');
    expect(html).not.toContain('Focused MVP validation before payments.');
    expect(html).toContain('Built with care for remote working moms.');
    expect(script).not.toContain('Firebase');
    expect(script).not.toContain('Stripe');
  });

  it('includes plain-language privacy and beta feedback paths', () => {
    const html = readFileSync(htmlPath, 'utf8');

    expect(html).toContain('Privacy in plain language');
    expect(html).toContain('The mobile MVP keeps app data on your device.');
    expect(html).toContain('RemoteMom is an organization tool, not medical advice.');
    expect(html).toContain('Send beta feedback');
    expect(html).toContain('mailto:vanessa.jaralve@gmail.com');
  });

  it('includes a separate Android beta recruitment page without a public APK link', () => {
    expect(existsSync(betaHtmlPath)).toBe(true);

    const betaHtml = readFileSync(betaHtmlPath, 'utf8');
    const normalizedBetaHtml = betaHtml.replace(/\s+/g, ' ');

    expect(betaHtml).toContain('Help test RemoteMom for Android');
    expect(betaHtml).toContain('Join the Android beta interest list.');
    expect(betaHtml).toContain('data-endpoint="/api/waitlist"');
    expect(betaHtml).toContain('../styles.css');
    expect(betaHtml).toContain('../waitlist.js');
    expect(betaHtml).toContain('../remotemom-dashboard-mockup.png');
    expect(betaHtml).toContain(
      'Was one child enough for this test, or would you need multiple children before using it weekly?'
    );
    expect(betaHtml).toContain('sharing with a partner or caregiver');
    expect(betaHtml).toContain('RemoteMom organizes medicine routines only.');
    expect(normalizedBetaHtml).toContain('not backed up to RemoteMom cloud storage');
    expect(betaHtml).not.toContain('RemoteMom-0.1.0-beta.apk');
    expect(betaHtml).not.toContain('expo.dev/artifacts');
  });
});
