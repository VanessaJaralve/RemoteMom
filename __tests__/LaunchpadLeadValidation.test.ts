declare function require(moduleName: string): any;
declare const __dirname: string;
const validation = require('../landing/launchpad/lead-validation.js');
const { readFileSync } = require('fs');
const { join } = require('path');
const { runInNewContext } = require('vm');

describe('Shared Launchpad lead validation', () => {
  const validLead = {
    name: 'Maria', email: 'maria@example.com',
    currentStage: 'looking-for-remote-work',
    biggestChallenge: 'finding-legitimate-opportunities'
  };

  it.each([
    'maria@example.com',
    '  Maria.Tag+Kit@Careers.Example.CO.UK  ',
    'first_last@sub-domain.example.org',
    "o'neil@example.ie",
    'person@xn--bcher-kva.example',
    'person@example.xn--p1ai',
    'a'.repeat(64) + '@example.com',
    'a'.repeat(64) + '@' + 'b'.repeat(63) + '.' + 'c'.repeat(63) + '.' + 'd'.repeat(61)
  ])('accepts practical public email syntax without mailbox verification: %s', (email) => {
    expect(validation.validateLead({ ...validLead, email })).toBe(null);
  });

  it.each([
    'maria', 'maria@', '@example.com', 'maria@@example.com',
    'm aria@example.com', 'maria@exam ple.com', 'maria\n@example.com',
    '.maria@example.com', 'maria.@example.com', 'ma..ria@example.com',
    'maria@example', 'maria@.example.com', 'maria@example..com', 'maria@example.com.',
    'maria@-example.com', 'maria@example-.com', 'maria@exam_ple.com',
    'maria@localhost', 'maria@127.0.0.1', 'maria@example.c',
    'maria@' + 'a'.repeat(64) + '.com',
    'a'.repeat(65) + '@example.com',
    'a'.repeat(64) + '@' + 'b'.repeat(63) + '.' + 'c'.repeat(63) + '.' + 'd'.repeat(62)
  ])('rejects malformed public email syntax: %s', (email) => {
    expect(validation.validateLead({ ...validLead, email })).toEqual({
      field: 'email', error: 'Please enter a valid email address.'
    });
  });

  it('returns the required-fields message for blank email', () => {
    expect(validation.validateLead({ ...validLead, email: '  ' })).toEqual({
      field: 'email', error: 'Please add your name, email, current stage, and biggest challenge.'
    });
  });

  it('validates trimmed values without changing the caller data', () => {
    const lead = {
      ...validLead, name: ' Maria ', email: ' Maria+kit@Example.COM ',
      currentStage: ' looking-for-remote-work ',
      biggestChallenge: ' finding-legitimate-opportunities '
    };
    const original = { ...lead };
    expect(validation.validateLead(lead)).toBe(null);
    expect(lead).toEqual(original);
  });

  it('exposes equivalent validation and unchanged options to browser and CommonJS callers', () => {
    const source = readFileSync(join(__dirname, '../landing/launchpad/lead-validation.js'), 'utf8');
    const context: any = { window: {} };
    runInNewContext(source, context);
    const browserValidation = context.window.RemoteMomLaunchpadValidation;

    expect(browserValidation.allowedCurrentStages).toEqual([
      'looking-for-remote-work', 'returning-after-career-break',
      'already-working-remotely', 'exploring-both'
    ]);
    expect(browserValidation.allowedChallenges).toEqual([
      'choosing-the-right-role', 'finding-legitimate-opportunities',
      'resume-or-portfolio', 'family-compatible-schedule', 'returning-after-career-gap'
    ]);
    expect(browserValidation.allowedCurrentStages).toEqual(validation.allowedCurrentStages);
    expect(browserValidation.allowedChallenges).toEqual(validation.allowedChallenges);
    for (const lead of [
      validLead, null, [], {}, { ...validLead, email: 'wrong@@example.com' },
      { ...validLead, currentStage: 'unknown' }, { ...validLead, biggestChallenge: 'unknown' },
      { ...validLead, name: { value: 'nested' } }, { ...validLead, utmSource: ['nested'] }
    ]) {
      expect(browserValidation.validateLead(lead)).toEqual(validation.validateLead(lead));
    }
  });
});
