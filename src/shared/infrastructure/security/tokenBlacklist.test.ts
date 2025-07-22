import { tokenBlacklist } from './tokenBlacklist';

describe('tokenBlacklist', () => {
  it('should add, check and clear token from blacklist', () => {
    const token = 'test-token';
    expect(tokenBlacklist.has(token)).toBe(false);
    tokenBlacklist.add(token);
    expect(tokenBlacklist.has(token)).toBe(true);
    tokenBlacklist.clear();
    expect(tokenBlacklist.has(token)).toBe(false);
  });
});
