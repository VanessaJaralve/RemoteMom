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

const docPath = join(__dirname, '..', 'docs', 'Pricing_Tier_Validation.md');

describe('Pricing and tier validation artifact', () => {
  it('captures the RemoteMom pricing validation plan', () => {
    expect(existsSync(docPath)).toBe(true);

    const doc = readFileSync(docPath, 'utf8');

    expect(doc).toContain('# RemoteMom Pricing And Tier Validation');
    expect(doc).toContain('Free MVP');
    expect(doc).toContain('Premium');
    expect(doc).toContain('$4.99/month');
    expect(doc).toContain('$39/year');
    expect(doc).toContain('Interview Script');
    expect(doc).toContain('Decision Rules');
  });
});
