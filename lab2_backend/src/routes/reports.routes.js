const express = require("express");
const router = express.Router();
const repo = require("../repositories/reportsRepo");

router.get("/", async (req, res, next) => {
    try { res.json({ data: await repo.getAllReports() }); } catch (e) { next(e); }
});

router.post("/", async (req, res, next) => {
    try {
        const { userId, title, severity } = req.body;
        if (!userId || !title || !severity) return res.status(400).json({ error: "Всі поля обов'язкові" });
        const created = await repo.createReport(userId, title, severity);
        res.status(201).json({ data: created });
    } catch (e) { next(e); }
});

module.exports = router;