import express from "express";
const usersController = require("../controllers/users.controller");

const router = express.Router();

router.get("/", usersController.getAll);
router.post("/", usersController.create);
router.put("/:id", usersController.update);
router.delete("/:id", usersController.remove);

export default router;
