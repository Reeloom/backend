import { IDomainEvent } from '@/shared/domain/events/IDomainEvent';

export interface IEventHandler<T extends IDomainEvent> {
  handle(event: T): Promise<void>;
}

export abstract class DomainEventHandler<T extends IDomainEvent>
  implements IEventHandler<T>
{
  abstract handle(event: T): Promise<void>;
}
