import verificationController from "../controllers/verificationController";
import Router from "koa-router";
import koaBody from "koa-body";

const router = new Router();

router.post("/verification", koaBody(), verificationController.verification);

export default router;
