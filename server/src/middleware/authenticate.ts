import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (req.path === '/me') {
    // Block if not authenticated for /me
    if (!auth) return res.status(401).json({ error: 'No token.' });
    try {
      const decoded = jwt.verify(auth.replace('Bearer ', ''), JWT_SECRET);
      (req as any).user = decoded;
      next();
    } catch {
      res.status(401).json({ error: 'Invalid token.' });
    }
  } else {
    // Non-blocking for other routes
    if (auth) {
      try {
        const decoded = jwt.verify(auth.replace('Bearer ', ''), JWT_SECRET);
        (req as any).user = decoded;
        (req as any).isAuthenticated = true;
      } catch {
        (req as any).isAuthenticated = false;
      }
    } else {
      (req as any).isAuthenticated = false;
    }
    next();
  }
}
