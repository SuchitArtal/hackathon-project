import express, { Response, NextFunction, Request } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { AuthenticatedRequest } from '../types/express';
import { logger } from '../index';

const router = express.Router();
const prisma = new PrismaClient();

// Middleware to verify JWT
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    (req as AuthenticatedRequest).user = decoded as JwtPayload & { userId: string };
    next();
  });
};

// Get all roadmaps for a user
router.get('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const authenticatedReq = req as AuthenticatedRequest;
    const roadmaps = await prisma.roadmap.findMany({
      where: {
        userId: authenticatedReq.user.userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    logger.info(`Fetching roadmaps for user: ${authenticatedReq.user.userId}`);
    res.json(roadmaps);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Error fetching roadmaps' });
  }
});

// Create new roadmap
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const authenticatedReq = req as AuthenticatedRequest;
    const { title, content } = req.body;

    const roadmap = await prisma.roadmap.create({
      data: {
        userId: authenticatedReq.user.userId,
        title: String(title),
        content: String(content)
      } as any // Using type assertion as a temporary fix
    });

    logger.info(`Roadmap created for user: ${authenticatedReq.user.userId}`);
    res.status(201).json(roadmap);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Error creating roadmap' });
  }
});

// Get specific roadmap
router.get('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const authenticatedReq = req as AuthenticatedRequest;
    const roadmap = await prisma.roadmap.findUnique({
      where: {
        id: req.params.id,
        userId: authenticatedReq.user.userId
      }
    });

    if (!roadmap) {
      return res.status(404).json({ error: 'Roadmap not found' });
    }

    logger.info(`Fetching roadmap for user: ${authenticatedReq.user.userId}`);
    res.json(roadmap);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Error fetching roadmap' });
  }
});

// Update roadmap
router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const authenticatedReq = req as AuthenticatedRequest;
    const { title, content } = req.body;

    const roadmap = await prisma.roadmap.update({
      where: {
        id: req.params.id,
        userId: authenticatedReq.user.userId
      },
      data: {
        title: String(title),
        content: String(content)
      } as any // Using type assertion as a temporary fix
    });

    logger.info(`Roadmap updated for user: ${authenticatedReq.user.userId}`);
    res.json(roadmap);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Error updating roadmap' });
  }
});

export default router; 