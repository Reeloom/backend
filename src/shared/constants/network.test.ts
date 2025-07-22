import { NETWORK } from './network';

describe('NETWORK constants', () => {
  it('should have BIND_ADDRESS defined as string', () => {
    expect(typeof NETWORK.BIND_ADDRESS).toBe('string');
  });
});
