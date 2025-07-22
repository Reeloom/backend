import { HEADERS } from './headers';
import { HEADER_VALUES } from './headers';

describe('HEADERS constants', () => {
  it('should have all defined headers as strings', () => {
    expect(typeof HEADERS.CONTENT_TYPE).toBe('string');
    expect(typeof HEADERS.ACCESS_CONTROL_ALLOW_ORIGIN).toBe('string');
    expect(typeof HEADERS.ACCESS_CONTROL_ALLOW_METHODS).toBe('string');
    expect(typeof HEADERS.ACCESS_CONTROL_ALLOW_HEADERS).toBe('string');
    expect(typeof HEADERS.ACCESS_CONTROL_ALLOW_CREDENTIALS).toBe('string');
  });
});

describe('HEADER_VALUES constants', () => {
  it('should have all defined header values as strings', () => {
    expect(typeof HEADER_VALUES.LOCALHOST_3000).toBe('string');
    expect(typeof HEADER_VALUES.ALLOWED_METHODS).toBe('string');
    expect(typeof HEADER_VALUES.ALLOWED_HEADERS).toBe('string');
    expect(typeof HEADER_VALUES.ALLOW_CREDENTIALS).toBe('string');
  });
});
