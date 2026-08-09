const { mkdirSync, readFileSync } = require('fs');
const { join, resolve } = require('path');
const { pathToFileURL } = require('url');

const { chromium } = require('playwright');

const rootDir = resolve(__dirname);
const sourcePath = join(rootDir, 'app-screenshots.html');
const outputDir = join(rootDir, 'output');

const SHOTS = [
  'today-dashboard',
  'to-dos',
  'grocery',
  'child-schedule',
  'health'
];

const SHOT_TITLES = {
  'today-dashboard': 'Today Dashboard',
  'to-dos': 'To-Dos',
  grocery: 'Grocery',
  'child-schedule': 'Child Schedule',
  health: 'Medicine Tracker'
};

async function main() {
  mkdirSync(outputDir, { recursive: true });

  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({
    deviceScaleFactor: 1,
    viewport: { width: 2200, height: 1100 }
  });

  await page.goto(pathToFileURL(sourcePath).href, { waitUntil: 'load' });

  for (const shotName of SHOTS) {
    const locator = page.locator(`[data-shot="${shotName}"]`);
    await locator.screenshot({
      animations: 'disabled',
      path: join(outputDir, `${shotName}.png`)
    });
  }

  const contactPage = await browser.newPage({
    deviceScaleFactor: 1,
    viewport: { width: 1680, height: 1000 }
  });

  const contactCards = SHOTS.map((shotName) => {
    const imageBuffer = readFileSync(join(outputDir, `${shotName}.png`));
    const imageUrl = `data:image/png;base64,${imageBuffer.toString('base64')}`;

    return `<article class="card"><img src="${imageUrl}" alt="${SHOT_TITLES[shotName]} screenshot" /><h2>${SHOT_TITLES[shotName]}</h2></article>`;
  }).join('');

  await contactPage.setContent(`<!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>RemoteMom contact-sheet</title>
        <style>
          * { box-sizing: border-box; }
          body {
            background: #f7f4ef;
            color: #222222;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            margin: 0;
            padding: 40px;
            width: 1600px;
          }
          h1 {
            color: #1f2d50;
            font-size: 42px;
            line-height: 48px;
            margin: 0 0 10px;
          }
          p {
            color: #6b6b6b;
            font-size: 20px;
            margin: 0 0 28px;
          }
          .grid {
            display: grid;
            gap: 22px;
            grid-template-columns: repeat(5, 1fr);
          }
          .card {
            background: #ffffff;
            border: 1px solid #e4ded4;
            border-radius: 16px;
            overflow: hidden;
            padding: 14px;
          }
          img {
            border-radius: 28px;
            display: block;
            width: 100%;
          }
          h2 {
            color: #1f2d50;
            font-size: 18px;
            margin: 12px 0 0;
          }
        </style>
      </head>
      <body data-shot="contact-sheet">
        <h1>RemoteMom MVP Screenshot Set</h1>
        <p>Today-first local mobile MVP for remote working moms.</p>
        <section class="grid">${contactCards}</section>
      </body>
    </html>`, { waitUntil: 'load' });
  await contactPage.locator('[data-shot="contact-sheet"]').screenshot({
    animations: 'disabled',
    path: join(outputDir, 'contact-sheet.png')
  });

  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
