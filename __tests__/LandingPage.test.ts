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

  it('keeps the waitlist form local-only for this validation step', () => {
    const script = readFileSync(scriptPath, 'utf8');

    expect(script).toContain('localStorage.setItem');
    expect(script).toContain('remotemom:waitlist');
    expect(script).not.toContain('fetch(');
    expect(script).not.toContain('Firebase');
    expect(script).not.toContain('Stripe');
  });
});
