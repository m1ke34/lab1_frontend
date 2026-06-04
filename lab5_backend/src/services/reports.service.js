const { ApiError } = require("../middlewares/errorHandler");
const { report } = require("../routes/reports.routes");

let reports = [
    { id: 1, userId: 1, title: "SQL Injection", severity: "Critical", status: "Open" }
];
let nextId = 2;

const getAll = () => reports;

const getById = (id) => {
    const report = reports.find(r => r.id === parseInt(id));
    if (!report) throw new ApiError(404, "NOT_FOUND", "Репорт не знайдено");
    return report;
};

const create = (dto) => {
    const newReport = { id: nextId++, ...dto, status: "Open" };
    reports.push(newReport);
    return newReport;
};

const update = (id, dto) => {
    const index = reports.findIndex(r => r.id === parseInt(id));
    if (index === -1) throw new ApiError(404, "NOT_FOUND", "Репорт не знайдено");
    reports[index] = { ...reports[index], ...dto };
    return reports[index];
};

const remove = (id, currentUserId) => {
    const index = reports.findIndex(r => String(r.id) === String(id));
    if (index === -1) return;

    if (Number(reports[index].userId) !== Number(currentUserId)) {
        throw new Error("IDOR Protection: Ви не можете видалити чужий репорт!");
    }

    reports.splice(index, 1);
};

const getTopSeverity = () => {
    if (reports.length === 0) return null

    const counts = {}
    reports.forEach(report => {
        counts[report.severity] = (counts[report.severity] || 0) + 1
    })

    let maxSeverity = null;
    let maxCount = 0;

    for (const [severity, count] of Object.entries(counts)) {
        if (count > maxCount) {
            maxCount = count;
            maxSeverity = severity;
        }
    }

    return { severity: maxSeverity, count: maxCount };
}

module.exports = { getAll, getById, create, update, remove, getTopSeverity };


