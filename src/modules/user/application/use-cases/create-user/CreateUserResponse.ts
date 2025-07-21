export interface CreateUserResponse {
  id: string;
  email: string;
  name?: string;
  isActive: boolean;
  createdAt: Date;
}
