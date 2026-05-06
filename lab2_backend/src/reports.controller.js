const reportsService = require("../services/reports.service");

const getAll = (req, res) => {
    res.status(200).json(reportsService.getAll());
};

const getById = (req, res) => {
    const item = reportsService.getById(req.params.id);
    if (!item) return res.status(404).json({ error: "Не знайдено" });
    res.status(200).json(item);
};

const create = (req, res) => {
    if (!req.body.title || req.body.title.length < 3) {
        return res.status(400).json({ error: "Назва має бути мін. 3 символи" });
    }
    const newItem = reportsService.create(req.body);
    res.status(201).json(newItem); // 201 Created
};

const remove = (req, res) => {
    const success = reportsService.remove(req.params.id);
    if (!success) return res.status(404).json({ error: "Не знайдено" });
    res.status(204).send(); // 204 No Content
};

module.exports = { getAll, getById, create, remove };
