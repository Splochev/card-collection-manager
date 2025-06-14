export interface IAuthenticatedUser {
  id: number;
  email: string;
  isVerified: boolean;
  firstName?: string;
}
