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

    expect(html).toContain('Real collection form for MVP validation');
    expect(script).toContain('/api/validation');
    expect(script).toContain('fetch(validationEndpoint');
    expect(script).toContain('Saved as a backup on this device');
    expect(script).not.toContain('Local mock survey for MVP validation');
  });

  it('submits waitlist signups to a real collection endpoint', () => {
    const html = readFileSync(htmlPath, 'utf8');
    const script = readFileSync(scriptPath, 'utf8');

    expect(html).toContain('Real waitlist collection. Offline preview saves a local backup.');
    expect(script).toContain('/api/waitlist');
    expect(script).toContain('fetch(waitlistEndpoint');
    expect(script).toContain('remotemom:waitlist');
    expect(script).toContain('Saved as a backup on this device');
    expect(script).not.toContain('Firebase');
    expect(script).not.toContain('Stripe');
  });
});
