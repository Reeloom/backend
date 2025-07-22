import { ERROR_NAMES } from './errors';

describe('ERROR_NAMES constants', () => {
  it('should have required error names defined as strings', () => {
    expect(typeof ERROR_NAMES.UserAlreadyExists).toBe('string');
    expect(typeof ERROR_NAMES.GoogleAuth).toBe('string');
  });
});
