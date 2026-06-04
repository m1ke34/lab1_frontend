const ApiError = require("../utils/ApiError");

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

const remove = (id) => {
    const index = reports.findIndex(r => r.id === parseInt(id));
    if (index === -1) throw new ApiError(404, "NOT_FOUND", "Репорт не знайдено");
    
    reports.splice(index, 1);
    return true;
};

module.exports = { getAll, getById, create, update, remove };
