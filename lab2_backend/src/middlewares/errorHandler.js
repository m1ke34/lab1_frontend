function errorHandler(err, req, res, next) {
    const msg = String(err && err.message ? err.message : err);
    
    if (msg.includes("UNIQUE constraint failed")) return res.status(409).json({ error: "Такий запис вже існує (Конфлікт)" });
    if (msg.includes("NOT NULL constraint failed") || msg.includes("CHECK constraint failed")) return res.status(400).json({ error: "Некоректні дані" });
    
    console.error(err);
    res.status(500).json({ error: "Внутрішня помилка сервера" });
}
module.exports = { errorHandler };