import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any; // Replace `any` with the actual type of `user` if known
    }
  }
}