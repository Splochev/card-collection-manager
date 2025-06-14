export interface IUser {
  id: number;
  email: string;
  password?: string;
  isVerified: boolean;
  firstName?: string;
  role: 'user' | 'admin';
}
