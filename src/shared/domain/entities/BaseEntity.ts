export abstract class BaseEntity<T> {
  protected readonly _id: string;
  protected readonly _createdAt: Date;
  protected readonly _updatedAt: Date;
  protected props: T;

  constructor(props: T, id?: string, createdAt?: Date, updatedAt?: Date) {
    this.props = props;
    this._id = id || this.generateId();
    this._createdAt = createdAt || new Date();
    this._updatedAt = updatedAt || new Date();
  }

  get id(): string {
    return this._id;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  protected abstract generateId(): string;

  public equals(entity?: BaseEntity<T>): boolean {
    if (entity === null || entity === undefined) {
      return false;
    }

    if (this === entity) {
      return true;
    }

    return this._id === entity._id;
  }
}
