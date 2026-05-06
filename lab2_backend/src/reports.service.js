let reports = [
    { id: 1, title: "SQL Injection", severity: "High", status: "Open" },
    { id: 2, title: "XSS Vulnerability", severity: "Medium", status: "Open" }
];

const getAll = () => reports;

const getById = (id) => reports.find(r => r.id === parseInt(id));

const create = (dto) => {
    const newReport = {
        id: reports.length > 0 ? Math.max(...reports.map(r => r.id)) + 1 : 1,
        ...dto,
        status: "Open" 
    };
    reports.push(newReport);
    return newReport;
};

const remove = (id) => {
    const index = reports.findIndex(r => r.id === parseInt(id));
    if (index !== -1) {
        reports.splice(index, 1);
        return true;
    }
    return false;
};

module.exports = { getAll, getById, create, remove };
