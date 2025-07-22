import { PASSWORD_MIN_LENGTH, PASSWORD_SALT_ROUNDS } from './security';

describe('security config', () => {
  it('should have valid password min length and salt rounds', () => {
    expect(typeof PASSWORD_MIN_LENGTH).toBe('number');
    expect(PASSWORD_MIN_LENGTH).toBeGreaterThanOrEqual(6);
    expect(typeof PASSWORD_SALT_ROUNDS).toBe('number');
    expect(PASSWORD_SALT_ROUNDS).toBeGreaterThanOrEqual(1);
  });
});
