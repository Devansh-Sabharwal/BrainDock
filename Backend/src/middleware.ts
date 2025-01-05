import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET||'random';
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

const auth = (req: Request, res: Response, next: NextFunction):void => {
  if (req.path === '/api/v1/content/tag' && req.method === 'POST') {
    return next(); // Skip middleware for this route
  }
  const authHeader = req.headers.authorization as string;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Authorization token missing or malformed' });
        return;
    }

    const token = authHeader.split(' ')[1];
  try {
    // Verify the JWT token
    const decodedData = jwt.verify(token, JWT_SECRET) as JwtPayload;

    // If the decoded data has an `id` property, assign it to `req.userId`
    if (decodedData) {
      req.userId = decodedData.id;
      next(); // Proceed to the next middleware
    } else {
      res.status(403).json({message:"Invalid Token"});
    }
  } catch (err) {

    res.status(403).json({message:"Invalid Token"});

  }
};

export default auth;
