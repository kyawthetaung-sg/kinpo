import express from "express";
import * as roleController from "../controllers/admin/roleController.js";
import * as userController from "../controllers/admin/userController.js";
import * as categoryController from "../controllers/admin/categoryController.js";
import * as gameController from "../controllers/admin/gameController.js";
import * as niuniuResultController from "../controllers/admin/niuniuResultController.js";

const router = express.Router();

router.get("/roles", roleController.getRoles);
router.post("/roles", roleController.createRole);
router.put("/roles/:id", roleController.updateRole);
router.get("/roles/:id", roleController.getRole);
router.delete("/roles/:id", roleController.deleteRole);

router.get("/users", userController.getUsers);
router.post("/users", userController.createUser);
router.put("/users/:id", userController.updateUser);
router.get("/users/:id", userController.getUser);
router.delete("/users/:id", userController.deleteUser);

router.get("/categories", categoryController.getCategories);
router.post("/categories", categoryController.createCategory);
router.put("/categories/:id", categoryController.updateCategory);
router.get("/categories/:id", categoryController.getCategory);
router.delete("/categories/:id", categoryController.deleteCategory);

router.get("/games", gameController.getGames);
router.post("/games", gameController.createGame);
router.put("/games/:id", gameController.updateGame);
router.get("/games/:id", gameController.getGame);
router.delete("/games/:id", gameController.deleteGame);

router.get("/niuniu_results", niuniuResultController.getNiuniuResults);
router.post("/niuniu_results", niuniuResultController.createNiuniuResult);
router.put("/niuniu_results/:id", niuniuResultController.updateNiuniuResult);
router.get("/niuniu_results/:id", niuniuResultController.getNiuniuResult);
router.delete("/niuniu_results/:id", niuniuResultController.deleteNiuniuResult);

export default router;
