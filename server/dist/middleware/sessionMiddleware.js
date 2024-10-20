import { auth } from '../auth'; // Import your Better Auth instance
// Define the middleware
export const sessionMiddleware = async (req, res, next) => {
    try {
        // Fetch the session using headers (which might include cookies or tokens)
        const session = await auth.api.getSession({
            headers: new Headers(req.headers)
        });
        // Attach the session object to the request
        if (session) {
            req.session = {
                user: {
                    id: session.user.id,
                    name: session.user.name,
                    email: session.user.email,
                    image: session.user.image,
                },
                sessionToken: session.session.id,
                expiresAt: session.session.expiresAt.toISOString(),
            };
        }
        else {
            req.session = null;
        }
        // Proceed to the next middleware or route handler
        next();
    }
    catch (error) {
        console.error('Error in sessionMiddleware:', error);
        // Handle error
        res.status(500).json({ error: 'Failed to retrieve session' });
    }
};
