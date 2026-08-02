import {
  classifyDueDate,
  getLocalDateKey,
  getSortMinutes,
  parseTimeToMinutes
} from '../src/utils/dateTime';

describe('date and time utilities', () => {
  const today = new Date(2026, 7, 2, 9, 30);

  it('parses common 12-hour times into minutes after midnight', () => {
    expect(parseTimeToMinutes('12:00 AM')).toBe(0);
    expect(parseTimeToMinutes('7:45 AM')).toBe(465);
    expect(parseTimeToMinutes('12:00 PM')).toBe(720);
    expect(parseTimeToMinutes('3:30 PM')).toBe(930);
    expect(parseTimeToMinutes('8 PM')).toBe(1200);
    expect(parseTimeToMinutes('not a time')).toBeNull();
  });

  it('returns local date keys without UTC shifting the day', () => {
    expect(getLocalDateKey(today)).toBe('2026-08-02');
  });

  it('classifies parseable due dates against the local day', () => {
    expect(classifyDueDate(undefined, today)).toBe('unscheduled');
    expect(classifyDueDate('2026-08-01', today)).toBe('overdue');
    expect(classifyDueDate('2026-08-02', today)).toBe('today');
    expect(classifyDueDate('2026-08-03', today)).toBe('future');
    expect(classifyDueDate('Tonight', today)).toBe('today');
  });

  it('uses a stable fallback for unparseable sort times', () => {
    expect(getSortMinutes('not a time', 'evening')).toBe(1050);
  });
});
