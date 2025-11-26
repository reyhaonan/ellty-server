import { Router, type Request, type Response } from "express";
import { AuthService } from "@/services/AuthService";
import type {
  AuthenticatedRequest,
  RegisterRequest,
  LoginRequest,
} from "@/types";

export class AuthRoutes {
  private router: Router;
  private authService: AuthService;

  constructor() {
    this.router = Router();
    this.authService = new AuthService();
    this.setupRoutes();
  }

  private setupRoutes() {
    this.router.post("/register", this.register.bind(this));
    this.router.post("/login", this.login.bind(this));
    this.router.post("/logout", this.logout.bind(this));
    this.router.get("/me", this.getCurrentUser.bind(this));
  }

  private async register(req: Request, res: Response) {
    try {
      const data: RegisterRequest = req.body;
      const { password, ...user } = await this.authService.register(data);

      res.status(201).json({ success: true, data: { user } });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(400).json({ success: false, error: (error as Error).message });
    }
  }

  private async login(req: Request, res: Response) {
    try {
      const data: LoginRequest = req.body;
      const user = await this.authService.login(data);

      (req as AuthenticatedRequest).session.userId = user.id;

      res.json({ success: true, data: { user } });
    } catch (error) {
      console.error("Login error:", error);
      res.status(401).json({ success: false, error: (error as Error).message });
    }
  }

  private async logout(req: AuthenticatedRequest, res: Response) {
    req.session.destroy((err) => {
      if (err) {
        return res
          .status(500)
          .json({ success: false, error: "Failed to logout" });
      }
      res.json({ success: true });
    });
  }

  private async getCurrentUser(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.session.userId) {
        return res
          .status(401)
          .json({ success: false, error: "Not authenticated" });
      }

      const user = await this.authService.getUserById(req.session.userId);
      res.json({ success: true, data: { user } });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(404).json({ success: false, error: (error as Error).message });
    }
  }

  getRouter() {
    return this.router;
  }
}
