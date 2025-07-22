import { EMAIL_REGEX, UUID_REGEX } from './regex';

describe('regex config', () => {
  it('should match valid email', () => {
    expect(EMAIL_REGEX.test('test@email.com')).toBe(true);
    expect(EMAIL_REGEX.test('invalid-email')).toBe(false);
  });

  it('should match valid uuid', () => {
    expect(UUID_REGEX.test('123e4567-e89b-12d3-a456-426614174000')).toBe(true);
    expect(UUID_REGEX.test('invalid-uuid')).toBe(false);
  });
});
