import Router from "koa-router";
import verificationRouter from "./verification";
import duifeneRouter from "./duifene";

const router = new Router();

router
  .use(verificationRouter.routes())
  .use(verificationRouter.allowedMethods());
router.use(duifeneRouter.routes()).use(duifeneRouter.allowedMethods());

export default router;
