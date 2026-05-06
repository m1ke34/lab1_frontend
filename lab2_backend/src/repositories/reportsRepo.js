const { all, get, run } = require("../db/dbClient");

async function getAllReports() {
    return await all(`
        SELECT r.id, r.title, r.severity, r.status, u.name as reporter 
        FROM Reports r
        JOIN Users u ON r.userId = u.id
        ORDER BY r.id DESC LIMIT 10;
    `);
}

async function getReportById(id) {
    return await get(`SELECT * FROM Reports WHERE id = ${Number(id)};`);
}

async function createReport(userId, title, severity) {
    const now = new Date().toISOString();
    const sql = `INSERT INTO Reports (userId, title, severity, createdAt) VALUES (${Number(userId)}, '${title}', '${severity}', '${now}');`;
    const result = await run(sql);
    return await getReportById(result.lastID);
}

module.exports = { getAllReports, getReportById, createReport };