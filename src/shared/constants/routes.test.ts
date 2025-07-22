import { ROUTES } from './routes';

describe('ROUTES', () => {
  it('should have Google and Instagram auth routes', () => {
    expect(typeof ROUTES.AUTH.GOOGLE.REDIRECT).toBe('string');
    expect(typeof ROUTES.AUTH.GOOGLE.CALLBACK).toBe('string');
    expect(typeof ROUTES.AUTH.INSTAGRAM.REDIRECT).toBe('string');
    expect(typeof ROUTES.AUTH.INSTAGRAM.CALLBACK).toBe('string');
  });
});
