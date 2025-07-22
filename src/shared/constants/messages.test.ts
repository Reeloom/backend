import { MESSAGES } from './messages';

describe('MESSAGES constants', () => {
  it('should have required messages defined as strings', () => {
    expect(typeof MESSAGES.INVALID_PASSWORD).toBe('string');
    expect(typeof MESSAGES.INVALID_EMAIL).toBe('string');
    expect(typeof MESSAGES.USER_ALREADY_EXISTS).toBe('string');
    expect(typeof MESSAGES.USER_NOT_FOUND).toBe('string');
    expect(typeof MESSAGES.INVALID_TOKEN).toBe('string');
  });

  it('should have all messages as strings', () => {
    Object.values(MESSAGES).forEach((msg) => expect(typeof msg).toBe('string'));
  });
});
