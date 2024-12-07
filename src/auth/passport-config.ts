import passport from 'passport';
import { PrismaClient, User } from '@prisma/client';
import { Strategy as GitHubStrategy, Profile } from 'passport-github2';

// Declare a global variable for PrismaClient
let prisma: PrismaClient;

/**
 * Validates environment variables and ensures they are defined.
 * @throws Error if any required environment variable is missing.
 */
const validateEnv = (): void => {
  const requiredEnv = [
    'GITHUB_CLIENT_ID',
    'GITHUB_CLIENT_SECRET',
    'GITHUB_CALLBACK_URL',
  ];
  for (const envVar of requiredEnv) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }
};

/**
 * Initialize Passport with a Prisma client and configure GitHub OAuth strategy.
 * @param prismaClient The PrismaClient instance for database access.
 */
export const initializePassport = (prismaClient: PrismaClient): void => {
  // Validate environment variables
  validateEnv();

  // Assign the Prisma client to the global variable
  prisma = prismaClient;

  // Configure GitHub OAuth strategy
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        callbackURL: process.env.GITHUB_CALLBACK_URL!,
      },
      async (
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: (error: any, user?: User | false) => void,
      ) => {
        try {
          // Check if the user already exists in the database
          let user = await prisma.user.findUnique({
            where: { providerId: profile.id },
          });

          // If the user doesn't exist, create a new one
          if (!user) {
            user = await prisma.user.create({
              data: {
                username: profile.username || `github_${profile.id}`,
                email: profile.emails?.[0]?.value || null,
                avatarUrl: profile.photos?.[0]?.value || null,
                provider: 'github',
                providerId: profile.id,
                accessToken,
              },
            });
          }

          // Pass the user to the next middleware
          done(null, user);
        } catch (err) {
          console.error('Error during GitHub OAuth strategy:', err);
          done(err, false);
        }
      },
    ),
  );

  // Serialize the user ID into the session
  passport.serializeUser((user: User, done) => {
    done(null, user.id);
  });

  // Deserialize the user ID from the session and fetch user data
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { id } });
      done(null, user || false);
    } catch (err) {
      console.error('Error deserializing user:', err);
      done(err, false);
    }
  });
};

export default passport;
