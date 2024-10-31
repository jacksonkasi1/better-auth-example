// Define User and Session types manually based on expected structure
export type User = {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  image?: string | undefined;
} | null;
export type Session = {
  id: string;
  userId: string;
  expiresAt: Date;
  ipAddress?: string | undefined;
  userAgent?: string | undefined;
} | null;
