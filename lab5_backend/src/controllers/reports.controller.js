const reportsService = require("../services/reports.service");
const { ApiError } = require("../middlewares/errorHandler");
const getAll = (req, res, next) => {
    try {
        res.status(200).json(reportsService.getAll());
    } catch (err) { next(err); }
};

const getById = (req, res, next) => {
    try {
        res.status(200).json(reportsService.getById(req.params.id));
    } catch (err) { next(err); }
};

const create = (req, res, next) => {
    try {
        const { title, severity, userId } = req.body;
        const errors = [];

        if (!title || typeof title !== "string" || title.length < 3) {
            errors.push({ field: "title", message: "Назва є обов'язковою (мінімум 3 символи)" });
        }
        if (!severity || !["Low", "Medium", "High", "Critical"].includes(severity)) {
            errors.push({ field: "severity", message: "Поле severity має бути: Low, Medium, High або Critical" });
        }
        if (!userId || typeof userId !== "number") {
            errors.push({ field: "userId", message: "userId є обов'язковим числом" });
        }

        if (errors.length > 0) {
            throw new ApiError(400, "VALIDATION_ERROR", "Невалідні дані запиту", errors);
        }

        const newItem = reportsService.create({ title, severity, userId });
        res.status(201).json(newItem);
    } catch (err) { next(err); }
};

const update = (req, res, next) => {
    try {
        const updatedItem = reportsService.update(req.params.id, req.body);
        res.status(200).json(updatedItem);
    } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
    try {
        const currentUserId = 1;
        await reportsService.remove(req.params.id, currentUserId);
        res.status(204).send();
    } catch (err) { 
        next(new ApiError(403, "FORBIDDEN", err.message)); 
    }
};

const getTopSeverity = (req, res, next) => {
    try {
        const result = reportsService.getTopSeverity();
        if (!result) {
            return res.status(200).json({ message: "Немає репортів для аналізу" });
        }
        res.status(200).json(result);
    } catch (err) { next(err); }
};

module.exports = { getAll, getById, create, update, remove, getTopSeverity };

