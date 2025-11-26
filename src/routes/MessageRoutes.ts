import { Router, type Response } from "express";
import { MessageService } from "@/services/MessageService";
import type { AuthenticatedRequest, CreateMessageRequest } from "@/types";
import { requireAuth } from "@/middleware/auth";

export class MessageRoutes {
  private router: Router;
  private messageService: MessageService;

  constructor() {
    this.router = Router();
    this.messageService = new MessageService();
    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.get("/", this.getMessages.bind(this));
    this.router.post("/", requireAuth, this.createMessage.bind(this));
  }

  private async getMessages(
    req: AuthenticatedRequest<
      any,
      any,
      {
        threadId: string;
      }
    >,
    res: Response
  ) {
    try {
      const { threadId } = req.query;

      const threadIdNum = parseInt(threadId as string);
      if (!threadIdNum || isNaN(threadIdNum)) {
        return res
          .status(400)
          .json({ success: false, error: "A valid threadId is required" });
      }

      const result = await this.messageService.getMessages(threadIdNum);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error("Get messages error:", error);
      if (
        error instanceof Error &&
        (error.message.includes("required") ||
          error.message.includes("greater"))
      ) {
        return res.status(400).json({ success: false, error: error.message });
      }
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  }

  private async createMessage(
    req: AuthenticatedRequest<any, CreateMessageRequest>,
    res: Response
  ) {
    try {
      const userId = req.session.userId!;
      const data = req.body;

      const message = await this.messageService.createMessage(userId, data);
      res.status(201).json({ success: true, data: { message } });
    } catch (error) {
      console.error("Create message error:", error);
      res.status(400).json({ success: false, error: (error as Error).message });
    }
  }

  getRouter() {
    return this.router;
  }
}
