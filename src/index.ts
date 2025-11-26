import express from "express";
import session from "express-session";
import routes from "@/routes";
import cors from "cors";
import { env } from "@/config/env";

const app = express();

const corsOptions = {
  origin: env.CORS_ORIGIN.split(",").map((s) => s.trim()),
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: "lax",
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

declare module "express-session" {
  interface SessionData {
    userId?: number;
  }
}

app.use("/api", routes);

app.get("/health", (_, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use(
  (
    err: Error,
    _: express.Request,
    res: express.Response,
    _n: express.NextFunction
  ) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
);

// 404 handler
app.use((_, res) => {
  res.status(404).json({ success: false, error: "Not found" });
});

const PORT = env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`CORS: ${env.CORS_ORIGIN}`);
  console.log(`NODE_ENV: ${env.NODE_ENV}`);
});
