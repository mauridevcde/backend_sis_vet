import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

// Extend the Request interface to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const VerifyAuthentication = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({
      mensaje: "Unauthorized",
    });

  const token = authHeader.split(" ")[1];

  if (!token)
    return res.status(401).json({
      mensaje: "Not token",
    });

  jwt.verify(token, process.env.SecretJWT as string, (err, user) => {
    if (err)
      return res.status(401).json({
        mensaje: "Unauthorized verify",
      });

    req.user = user;
    next();
  });
};
