import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env';

export interface AuthRequest extends Request {
  userId?: number;
  user?: {
    id: number;
    email: string;
    isAdmin?: boolean;
  };
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] }) as {
      id: number;
      email: string;
      isAdmin?: boolean;
    };
    
    req.userId = decoded.id;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

// Use after authMiddleware. Relies on isAdmin baked into the JWT at login
// time — if an admin flag is revoked, it only takes effect once the user's
// current token expires (max 7 days) or they log in again.
export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ error: 'Acesso restrito a administradores' });
  }
  next();
}

export function generateToken(userId: number, email: string, isAdmin: boolean = false): string {
  return jwt.sign(
    { id: userId, email, isAdmin },
    JWT_SECRET,
    { expiresIn: '7d', algorithm: 'HS256' }
  );
}
