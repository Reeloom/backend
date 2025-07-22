import { ValueObject } from './ValueObject';

describe('ValueObject', () => {
  class TestVO extends ValueObject<{ value: string }> {
    constructor(value: string) {
      super({ value });
    }
  }

  it('should compare equality by value', () => {
    const vo1 = new TestVO('abc');
    const vo2 = new TestVO('abc');
    const vo3 = new TestVO('def');
    expect(vo1.equals(vo2)).toBe(true);
    expect(vo1.equals(vo3)).toBe(false);
  });

  it('should be immutable', () => {
    const vo = new TestVO('immutable');
    expect(() => {
      // @ts-expect-error Teste de imutabilidade: forçando erro de atribuição
      vo.props.value = 'changed';
    }).toThrow();
  });
});
