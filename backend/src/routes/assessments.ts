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

// Get all assessments for a user
router.get('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const authenticatedReq = req as AuthenticatedRequest;
    const assessments = await prisma.assessment.findMany({
      where: {
        userId: authenticatedReq.user.userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    logger.info(`Fetching assessments for user: ${authenticatedReq.user.userId}`);
    res.json(assessments);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Error fetching assessments' });
  }
});

// Create new assessment
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const authenticatedReq = req as AuthenticatedRequest;
    const { score, skillGaps } = req.body;

    const assessment = await prisma.assessment.create({
      data: {
        userId: authenticatedReq.user.userId,
        score,
        skillGaps
      }
    });

    res.status(201).json(assessment);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Error creating assessment' });
  }
});

// Get specific assessment
router.get('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const authenticatedReq = req as AuthenticatedRequest;
    const assessment = await prisma.assessment.findUnique({
      where: {
        id: req.params.id,
        userId: authenticatedReq.user.userId
      }
    });

    if (!assessment) {
      return res.status(404).json({ error: 'Assessment not found' });
    }

    res.json(assessment);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Error fetching assessment' });
  }
});

export default router; 