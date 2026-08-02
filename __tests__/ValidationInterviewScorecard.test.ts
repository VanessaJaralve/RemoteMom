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

const docPath = join(__dirname, '..', 'docs', 'Validation_Interview_Script_Scorecard.md');

describe('RemoteMom validation interview script and scorecard', () => {
  it('includes the lightweight interview script and scoring rubric', () => {
    expect(existsSync(docPath)).toBe(true);

    const doc = readFileSync(docPath, 'utf8');

    expect(doc).toContain('RemoteMom Interview Script');
    expect(doc).toContain('Ask These Questions In Order');
    expect(doc).toContain('Validation Scorecard');
    expect(doc).toContain('Pain strength');
    expect(doc).toContain('Willingness to pay');
    expect(doc).toContain('Decision Thresholds');
    expect(doc).toContain('Follow-up Message Template');
  });
});
