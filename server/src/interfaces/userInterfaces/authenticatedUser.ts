export interface AuthenticatedUser {
  id: number;
  email: string;
  isVerified: boolean;
  firstName?: string;
}
