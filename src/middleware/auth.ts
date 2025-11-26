import type { Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "@/types";

export const requireAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.session.userId) {
    return res
      .status(401)
      .json({ success: false, error: "Authentication required" });
  }
  next();
};
