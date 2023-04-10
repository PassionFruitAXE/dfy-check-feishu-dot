import duifeneRouterController from "../controllers/duifeneController";
import Router from "koa-router";
import koaBody from "koa-body";

const router = new Router();

router.get("/duifene/check/:checkincode", duifeneRouterController.check);

router.post("/duifene/addUser", koaBody(), duifeneRouterController.addUser);
router.delete(
  "/duifene/deleteUser/:loginname",
  duifeneRouterController.deleteUser,
);
router.put(
  "/duifene/updateUser",
  koaBody(),
  duifeneRouterController.updateUser,
);
router.get("/duifene/getUser", duifeneRouterController.getUsers);

export default router;
