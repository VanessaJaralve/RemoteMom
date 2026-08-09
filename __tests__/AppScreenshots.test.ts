declare const __dirname: string;
declare function require(moduleName: 'fs'): {
  existsSync: (path: string) => boolean;
  readFileSync: (path: string, encoding?: 'utf8') => Uint8Array | string;
};
declare function require(moduleName: 'path'): {
  join: (...paths: string[]) => string;
};

const { existsSync, readFileSync } = require('fs');
const { join } = require('path');

const screenshotsDir = join(__dirname, '..', 'screenshots');
const htmlPath = join(screenshotsDir, 'app-screenshots.html');
const generatorPath = join(screenshotsDir, 'generate-screenshots.js');
const outputDir = join(screenshotsDir, 'output');

const screenshotFiles = [
  'today-dashboard.png',
  'to-dos.png',
  'grocery.png',
  'child-schedule.png',
  'health.png',
  'contact-sheet.png'
];

function isPng(path: string) {
  const bytes = readFileSync(path) as Uint8Array;

  return (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  );
}

describe('RemoteMom app screenshot kit', () => {
  it('documents the screenshot source and generator', () => {
    const html = readFileSync(htmlPath, 'utf8') as string;
    const generator = readFileSync(generatorPath, 'utf8') as string;

    expect(html).toContain('RemoteMom App Screenshots');
    expect(html).toContain('Manage the day without carrying it all in your head.');
    expect(html).toContain('Today Dashboard');
    expect(html).toContain('Universal To-Do List');
    expect(html).toContain('Grocery List');
    expect(html).toContain("Kid's Schedule");
    expect(html).toContain('Medicine Tracker');
    expect(generator).toContain('today-dashboard');
    expect(generator).toContain('contact-sheet');
  });

  it('includes generated PNG screenshots for the core MVP screens', () => {
    for (const fileName of screenshotFiles) {
      const filePath = join(outputDir, fileName);

      expect(existsSync(filePath)).toBe(true);
      expect(isPng(filePath)).toBe(true);
    }
  });
});
