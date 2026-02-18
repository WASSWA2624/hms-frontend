import {
  humanizeDisplayText,
  humanizeIdentifier,
  isTechnicalIdentifier,
} from '@utils';

describe('displayIdentity utils', () => {
  it('flags UUID values as technical identifiers', () => {
    expect(isTechnicalIdentifier('123e4567-e89b-12d3-a456-426614174000')).toBe(true);
  });

  it('flags long alphanumeric tokens as technical identifiers', () => {
    expect(isTechnicalIdentifier('ak_9f8e7d6c5b4a3f2e1d0c')).toBe(true);
  });

  it('does not flag readable long slugs without digits', () => {
    expect(isTechnicalIdentifier('north-wing-administration-office')).toBe(false);
  });

  it('hides technical identifiers from direct display', () => {
    expect(humanizeIdentifier('123e4567-e89b-12d3-a456-426614174000')).toBe('');
  });

  it('keeps readable labels for display', () => {
    expect(humanizeIdentifier('Central Operations')).toBe('Central Operations');
  });

  it('removes embedded technical IDs from mixed display text', () => {
    const value = 'Facility 123e4567-e89b-12d3-a456-426614174000';
    expect(humanizeDisplayText(value)).toBe('Facility');
  });
});
