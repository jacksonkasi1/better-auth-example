import express from 'express';
import cors from 'cors';
import { auth } from './auth'; // Import your Better Auth instance
import { sessionMiddleware } from './middleware/sessionMiddleware'; // Import session middleware
import { toNodeHandler } from 'better-auth/node'; // Use toNodeHandler for Node.js-based frameworks
const app = express();
// Enable CORS for your frontend
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
// Parse incoming JSON requests
app.use(express.json());
// Apply session middleware to every request
app.use(sessionMiddleware);
// Handle authentication routes using toNodeHandler from Better Auth
app.all('/api/auth/*', toNodeHandler(auth)); // Mount the Better Auth handler
// Define a public API route (accessible to everyone)
app.get('/api/public-api', (req, res) => {
    res.json({
        message: 'This is public data accessible to anyone.',
    });
});
// Define a private API route (only accessible if authenticated)
// @ts-ignore
app.get('/api/private-api', (req, res) => {
    const session = req.session;
    // Check if the session or user is missing, respond with 401 Unauthorized
    if (!session || !session.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    // If session exists, return mock private API data
    res.json({
        message: 'This is private data, accessible only to authenticated users.',
        user: session.user,
    });
});
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
