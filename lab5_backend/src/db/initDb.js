const { run } = require("./dbClient");

async function initDb() {
    await run("PRAGMA foreign_keys = ON;"); 
    await run(`
        CREATE TABLE IF NOT EXISTS Users (
            id INTEGER PRIMARY KEY,
            email TEXT NOT NULL UNIQUE,
            name TEXT NOT NULL,
            createdAt TEXT NOT NULL
        );
    `);
    await run(`
        CREATE TABLE IF NOT EXISTS Reports (
            id INTEGER PRIMARY KEY,
            userId INTEGER NOT NULL,
            title TEXT NOT NULL,
            severity TEXT NOT NULL CHECK (severity IN ('Low', 'Medium', 'High', 'Critical')),
            status TEXT NOT NULL DEFAULT 'Open',
            createdAt TEXT NOT NULL,
            FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
        );
    `);
    await run(`
        CREATE TABLE IF NOT EXISTS Comments (
            id INTEGER PRIMARY KEY,
            reportId INTEGER NOT NULL,
            text TEXT NOT NULL,
            createdAt TEXT NOT NULL,
            FOREIGN KEY (reportId) REFERENCES Reports(id) ON DELETE CASCADE
        );
    `);
    const now = new Date().toISOString();
    await run(`INSERT OR IGNORE INTO Users (id, email, name, createdAt) VALUES (1, 'm1ke@univ.kiev.ua', 'Mykhailo', '${now}');`);
    await run(`INSERT OR IGNORE INTO Reports (id, userId, title, severity, status, createdAt) VALUES (1, 1, 'SQL Injection in Login', 'Critical', 'Open', '${now}');`);

    console.log("Схему БД ініціалізовано!");
}

module.exports = { initDb };
