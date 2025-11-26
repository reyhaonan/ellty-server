import { Router } from "express";
import { AuthRoutes } from "./AuthRoutes";
import { ThreadRoutes } from "./ThreadRoutes";
import { MessageRoutes } from "./MessageRoutes";

const router = Router();

router.use("/auth", new AuthRoutes().getRouter());
router.use("/threads", new ThreadRoutes().getRouter());
router.use("/messages", new MessageRoutes().getRouter());

export default router;
