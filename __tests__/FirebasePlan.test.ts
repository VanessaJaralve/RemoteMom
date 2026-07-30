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

const docPath = join(__dirname, '..', 'docs', 'Firebase_Auth_Firestore_Plan.md');

describe('Firebase Auth and Firestore planning artifact', () => {
  it('captures the future account sync plan without adding Firebase implementation', () => {
    expect(existsSync(docPath)).toBe(true);

    const doc = readFileSync(docPath, 'utf8');

    expect(doc).toContain('# RemoteMom Firebase Auth And Firestore Plan');
    expect(doc).toContain('Auth Strategy');
    expect(doc).toContain('Firestore Data Model');
    expect(doc).toContain('Security Rules Shape');
    expect(doc).toContain('Local-To-Cloud Migration');
    expect(doc).toContain('Do Not Build Yet');
  });
});
