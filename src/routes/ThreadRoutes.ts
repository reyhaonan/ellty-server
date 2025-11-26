import { Router, type Response } from "express";
import { ThreadService } from "@/services/ThreadService";
import type { AuthenticatedRequest, CreateThreadRequest } from "@/types";
import { requireAuth } from "@/middleware/auth";

export class ThreadRoutes {
  private router: Router;
  private threadService: ThreadService;

  constructor() {
    this.router = Router();
    this.threadService = new ThreadService();
    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.get("/", this.getAllThreads.bind(this));
    this.router.post("/", requireAuth, this.createThread.bind(this));
  }

  private async getAllThreads(_: AuthenticatedRequest, res: Response) {
    try {
      const threads = await this.threadService.getAllThreads();
      res.json({ success: true, data: { threads } });
    } catch (error) {
      console.error("Get threads error:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  }

  private async createThread(
    req: AuthenticatedRequest<any, CreateThreadRequest>,
    res: Response
  ) {
    try {
      const userId = req.session.userId!;
      const { startingNumber } = req.body;

      const thread = await this.threadService.createThread(userId, {
        startingNumber,
      });
      res.status(201).json({ success: true, data: { thread } });
    } catch (error) {
      console.error("Create thread error:", error);
      res.status(400).json({ success: false, error: (error as Error).message });
    }
  }

  getRouter() {
    return this.router;
  }
}
