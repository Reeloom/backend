import { BaseEntity } from '@/shared/domain/entities/BaseEntity';

export interface IRepository<T extends BaseEntity<any>> {
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  save(entity: T): Promise<T>;
  update(entity: T): Promise<T>;
  delete(id: string): Promise<void>;
}
