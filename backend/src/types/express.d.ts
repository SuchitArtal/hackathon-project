import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtPayload & {
      userId: string;
    };
  }
}

export interface AuthenticatedRequest extends Request {
  user: JwtPayload & {
    userId: string;
  };
} 