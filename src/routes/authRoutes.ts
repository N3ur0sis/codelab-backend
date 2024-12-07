import { Router } from 'express';
import passport from 'passport';

const router = Router();

/**
 * Start GitHub authentication.
 */
router.get(
  '/auth/github',
  passport.authenticate('github', { scope: ['user:email'] }),
);

/**
 * Handle GitHub OAuth callback.
 */
router.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect(process.env.FRONTEND_URL || 'http://localhost:3000/dashboard');
  },
);

/**
 * Logout user and destroy session.
 */
router.get('/auth/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }

    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to destroy session' });
      }
      res.clearCookie('connect.sid');
      res.status(200).json({ message: 'Logged out successfully' });
    });
  });
});

export default router;
