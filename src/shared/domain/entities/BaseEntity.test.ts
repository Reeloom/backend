import { BaseEntity } from './BaseEntity';

class TestEntity extends BaseEntity<unknown> {
  protected generateId(): string {
    return 'test-id';
  }
}

describe('BaseEntity', () => {
  it('should create an entity with an id', () => {
    const entity = new TestEntity({}, 'id');
    expect(entity.id).toBe('id');
  });
});
