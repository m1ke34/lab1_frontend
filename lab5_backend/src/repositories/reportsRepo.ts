import { all, get, run } from "../db/dbClient";

async function getAllUsers() {
    return await all(`SELECT * FROM Users ORDER BY id DESC`);
}

async function getUserById(id: any) {
    return await get(`SELECT * FROM Users WHERE id = ?`, [Number(id)]);
}

async function createUser(name: string) {
    const sql = `INSERT INTO Users (name) VALUES (?)`;
    const result: any = await run(sql, [name]);
    return await getUserById(result.lastID);
}

async function updateUser(id: any, name: string) {
    const sql = `UPDATE Users SET name = ? WHERE id = ?`;
    await run(sql, [name, Number(id)]);
    return await getUserById(id);
}

async function deleteUser(id: any) {
    const sql = `DELETE FROM Users WHERE id = ?`;
    return await run(sql, [Number(id)]);
}

export { getAllUsers, getUserById, createUser, updateUser, deleteUser };