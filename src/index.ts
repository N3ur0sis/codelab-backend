import app from './app.js';

const PORT = process.env.PORT || 4000;

/**
 * Starts the Express server.
 */
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
