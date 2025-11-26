import type { Request } from "express";
import { Session } from "express-session";

export interface CreateUserRequest {
  username: string;
}

export interface CreateThreadRequest {
  startingNumber: string;
}

export interface CreateMessageRequest {
  threadId: number;
  parentMessageId?: number;
  operation: "add" | "sub" | "mul" | "div";
  operand: string;
}

export interface AuthenticatedRequest<TParams = any, TBody = any, TQuery = any>
  extends Request<TParams, any, TBody, TQuery> {
  session: Session & {
    userId?: number;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}
