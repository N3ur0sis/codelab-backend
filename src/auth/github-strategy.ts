import { PrismaClient, User } from '@prisma/client';
import passport from 'passport';
import { Strategy as GitHubStrategy, Profile } from 'passport-github2';

const prisma = new PrismaClient();

/**
 * Configure GitHub OAuth strategy.
 */
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL:
        process.env.GITHUB_CALLBACK_URL ||
        'http://localhost:4000/auth/github/callback',
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: (error: any, user?: User | false) => void,
    ) => {
      try {
        // Check if the user already exists
        let user = await prisma.user.findUnique({
          where: { providerId: profile.id },
        });

        // If not, create a new user
        if (!user) {
          user = await prisma.user.create({
            data: {
              username: profile.username!,
              email: profile.emails?.[0]?.value || null,
              avatarUrl: profile.photos?.[0]?.value || null,
              provider: 'github',
              providerId: profile.id,
              accessToken, // Store securely or avoid saving in database
            },
          });
        }

        done(null, user);
      } catch (err) {
        console.error('GitHub strategy error:', err);
        done(err, false);
      }
    },
  ),
);

export default passport;
