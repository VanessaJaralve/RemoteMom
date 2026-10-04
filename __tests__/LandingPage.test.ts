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
const betaFeedbackHtmlPath = join(landingDir, 'beta-feedback', 'index.html');
const blackFridayHtmlPath = join(landingDir, 'black-friday', 'index.html');
const launchpadHtmlPath = join(landingDir, 'launchpad', 'index.html');
const launchpadDownloadHtmlPath = join(landingDir, 'launchpad', 'download', 'index.html');
const launchpadPdfPath = join(
  landingDir,
  'launchpad',
  'download',
  'remote-moms-work-fit-safety-starter-kit.pdf'
);
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
    expect(betaHtml).toContain('How the Android invite works');
    expect(betaHtml).toContain('same Google account');
    expect(betaHtml).toContain('Firebase App Tester');
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

  it('includes a separate beta feedback survey page with private APK handling', () => {
    expect(existsSync(betaFeedbackHtmlPath)).toBe(true);

    const feedbackHtml = readFileSync(betaFeedbackHtmlPath, 'utf8');
    const css = readFileSync(cssPath, 'utf8');
    const script = readFileSync(scriptPath, 'utf8');

    expect(feedbackHtml).toContain('RemoteMom beta feedback');
    expect(css).toContain('#feedback-title');
    expect(css).toContain('font-size: clamp(56px, 7vw, 108px)');
    expect(feedbackHtml).toContain('data-beta-feedback-form');
    expect(feedbackHtml).toContain('data-endpoint="/api/beta-feedback"');
    expect(feedbackHtml).toContain('name="installedAndOpened"');
    expect(feedbackHtml).toContain('name="todayHelped"');
    expect(feedbackHtml).toContain('name="mostUsefulFeature"');
    expect(feedbackHtml).toContain('name="oneChildEnough"');
    expect(feedbackHtml).toContain('name="nextPriority"');
    expect(feedbackHtml).toContain('name="useAgainTomorrow"');
    expect(feedbackHtml).toContain('Do not enter private medicine details.');
    expect(feedbackHtml).not.toContain('RemoteMom-0.1.0-beta.apk');
    expect(feedbackHtml).not.toContain('expo.dev/artifacts');
    expect(script).toContain('remotemom:beta-feedback');
    expect(script).toContain('data-beta-feedback-form');
    expect(script).toContain('/api/beta-feedback');
  });

  it('includes a separate Black Friday early-access beta page without payment collection', () => {
    expect(existsSync(blackFridayHtmlPath)).toBe(true);

    const campaignHtml = readFileSync(blackFridayHtmlPath, 'utf8');
    const css = readFileSync(cssPath, 'utf8');
    const script = readFileSync(scriptPath, 'utf8');

    expect(campaignHtml).toContain('Black Friday Early Access');
    expect(campaignHtml).toContain('early-access beta');
    expect(campaignHtml).toContain('founding mom benefits');
    expect(campaignHtml).toContain('not a full public launch yet');
    expect(campaignHtml).toContain('data-black-friday-form');
    expect(campaignHtml).toContain('data-endpoint="/api/black-friday"');
    expect(campaignHtml).toContain('name="androidPhone"');
    expect(campaignHtml).toContain('name="childrenCount"');
    expect(campaignHtml).toContain('name="biggestStruggle"');
    expect(campaignHtml).toContain('name="betaInterest"');
    expect(campaignHtml).toContain('RemoteMom organizes medicine routines only.');
    expect(campaignHtml).toContain('does not provide medical advice');
    expect(campaignHtml).not.toContain('Stripe');
    expect(campaignHtml).not.toContain('Buy now');
    expect(css).toContain('.campaign-hero');
    expect(script).toContain('remotemom:black-friday-early-access');
    expect(script).toContain('data-black-friday-form');
    expect(script).toContain('/api/black-friday');
  });

  it('includes a dedicated global Launchpad starter-kit funnel', () => {
    expect(existsSync(launchpadHtmlPath)).toBe(true);
    expect(existsSync(launchpadDownloadHtmlPath)).toBe(true);
    expect(existsSync(launchpadPdfPath)).toBe(true);

    const launchpadHtml = readFileSync(launchpadHtmlPath, 'utf8');
    const downloadHtml = readFileSync(launchpadDownloadHtmlPath, 'utf8');
    const script = readFileSync(scriptPath, 'utf8');

    expect(launchpadHtml).toContain('Build a remote-work path that fits your career and your family life.');
    expect(launchpadHtml).toContain("Remote Mom's Work Fit and Safety Starter Kit");
    expect(launchpadHtml).toContain('working mothers and career-returning moms');
    expect(launchpadHtml).not.toContain('Pinay Mom');
    expect(launchpadHtml).not.toContain('for the Philippines');
    expect(launchpadHtml).not.toContain('Filipino mothers');
    expect(launchpadHtml).toContain('data-launchpad-form');
    expect(launchpadHtml).toContain('data-endpoint="/api/launchpad-lead"');
    expect(launchpadHtml).toContain('name="name"');
    expect(launchpadHtml).toContain('name="email"');
    expect(launchpadHtml).toContain('name="currentStage"');
    expect(launchpadHtml).toContain('value="looking-for-remote-work"');
    expect(launchpadHtml).toContain('value="returning-after-career-break"');
    expect(launchpadHtml).toContain('value="already-working-remotely"');
    expect(launchpadHtml).toContain('value="exploring-both"');
    expect(launchpadHtml).toContain('name="biggestChallenge"');
    expect(launchpadHtml).toContain('Already working remotely');
    expect(launchpadHtml).toContain('Improve work-from-home boundaries and routines');
    expect(launchpadHtml).toContain(
      'does not guarantee employment, income, flexibility, or that a listing is safe'
    );
    expect(downloadHtml).toContain('Download your starter kit');
    expect(downloadHtml).toContain('remote-moms-work-fit-safety-starter-kit.pdf');
    expect(downloadHtml).toContain('Start with the path that matches your current stage');
    expect(downloadHtml).toContain('https://www.facebook.com/VanJaralve');
    expect(downloadHtml).toContain('https://www.instagram.com/vdjaralve/');
    expect(downloadHtml).toContain('/beta/');
    expect(script).toContain('remotemom:launchpad-leads');
    expect(script).toContain('data-launchpad-form');
    expect(script).toContain('/api/launchpad-lead');
    expect(script).toContain('utm_source');
    expect(script).toContain('utm_medium');
    expect(script).toContain('utm_campaign');
    expect(script).toContain("formData.get('currentStage')");
    expect(script).toContain("window.location.assign('./download/')");
  });
});
