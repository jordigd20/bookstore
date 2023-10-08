export interface AuthUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'USER';
  cart: {
    id: number;
  };
}
