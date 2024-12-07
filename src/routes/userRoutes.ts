import { Router, Request, Response } from 'express';

const router = Router();

// Route to get the authenticated user
router.get('/api/user', (req: Request, res: Response): void => {
  // Check if the user is authenticated
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    res.status(401).send('Not authenticated');
    return;
  }

  // Check if user data is present
  if (!req.user) {
    res.status(400).send('User data missing');
    return;
  }

  // Respond with the user data
  res.status(200).json(req.user);
});

export default router;
