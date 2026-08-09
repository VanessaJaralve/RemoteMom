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

const docPath = join(__dirname, '..', 'docs', 'RemoteMom_Expo_Go_Beta_Guide.md');

describe('RemoteMom Expo Go beta guide', () => {
  it('captures the no-budget beta testing path', () => {
    expect(existsSync(docPath)).toBe(true);

    const doc = readFileSync(docPath, 'utf8');

    expect(doc).toContain('# RemoteMom Expo Go Beta Guide');
    expect(doc).toContain('no-budget RemoteMom beta path');
    expect(doc).toContain('pnpm start -- --tunnel');
    expect(doc).toContain('Tester Checklist');
    expect(doc).toContain('Today Dashboard');
    expect(doc).toContain('Local entries are not synced or backed up');
    expect(doc).toContain('Invite a small group of trusted testers first');
  });
});
