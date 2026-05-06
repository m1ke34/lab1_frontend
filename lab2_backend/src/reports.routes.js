const express = require("express");
const router = express.Router();
const reportsController = require("../controllers/reports.controller");

router.get("/", reportsController.getAll);
router.get("/:id", reportsController.getById);
router.post("/", reportsController.create);
router.delete("/:id", reportsController.remove);

module.exports = router;
