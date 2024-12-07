import { User as PrismaUser } from '@prisma/client';

declare global {
  namespace Express {
    interface User extends PrismaUser {} // Extend Express.User with your Prisma User model
    interface Request {
      user?: User; // Add `user` property to Request
      isAuthenticated?: () => boolean; // Add `isAuthenticated` method
    }
  }
}
