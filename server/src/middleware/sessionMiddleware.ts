import { Request, Response, NextFunction } from 'express';  // Import Express types
import { auth } from '../auth.ts';  // Import your Better Auth instance

// Define the session interface (if needed, based on Better Auth session structure)
interface Session {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  sessionToken: string;
  expiresAt: string;
}

// Extend Express Request to include session
declare global {
  namespace Express {
    interface Request {
      session?: Session | null;
    }
  }
}

// Define the middleware
export const sessionMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Fetch the session using headers (which might include cookies or tokens)
    const session = await auth.api.getSession({
      headers: new Headers(req.headers as Record<string, string>)
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
    } else {
      req.session = null;
    }

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Error in sessionMiddleware:', error);
    // Handle error
    res.status(500).json({ error: 'Failed to retrieve session' });
  }
};
