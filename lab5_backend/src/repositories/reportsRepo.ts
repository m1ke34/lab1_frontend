const { all, get, run } = require("../db/dbClient");

async function getAllReports() {
    return await all(`
        SELECT r.id, r.title, r.severity, r.status, u.name as reporter 
        FROM Reports r
        JOIN Users u ON r.userId = u.id
        ORDER BY r.id DESC LIMIT 10;
    `);
}

async function getReportById(id: any) {
    return await get(`SELECT * FROM Reports WHERE id = ${Number(id)};`);
}

async function createReport(userId: any, title: string, severity: string) {
    const now = new Date().toISOString();
    const sql = `INSERT INTO Reports (userId, title, severity, createdAt) VALUES (${Number(userId)}, '${title}', '${severity}', '${now}');`;
    const result: any = await run(sql);
    return await getReportById(result.lastID);
}

async function deleteReport(id: any, currentUserId: any) {
    const sql = `DELETE FROM Reports WHERE id = ? AND userId = ?`;
    const result: any = await run(sql, [Number(id), Number(currentUserId)]);
    
    if (result.changes === 0) {
        throw new Error("IDOR Protection: Ви не можете видалити чужий репорт!");
    }
    return true;
}
module.exports = { getAllReports, getReportById, createReport, deleteReport };
