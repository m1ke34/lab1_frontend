const express = require("express");
const router = express.Router();
const reportsController = require("../controllers/reports.controller");

router.get("/", reportsController.getAll);
router.get("/stats/top-severity", reportsController.getTopSeverity);
router.get("/:id", reportsController.getById); 
router.post("/", reportsController.create);
router.put("/:id", reportsController.update);
router.delete("/:id", reportsController.remove);

export default router;

