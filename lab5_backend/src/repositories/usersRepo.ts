import { all, get, run } from "../db/dbClient";

async function getAllUsers() {
    return await all(`SELECT * FROM Users ORDER BY id DESC`);
}

async function getUserById(id: any) {
    return await get(`SELECT * FROM Users WHERE id = ${Number(id)}`);
}

async function createUser(name: string) {
    const fakeEmail = `user_${Date.now()}@demo.com`; 
    const createdAt = new Date().toISOString();
    
    const sql = `INSERT INTO Users (name, email, createdAt) VALUES ('${name}', '${fakeEmail}', '${createdAt}')`;
    const result: any = await run(sql);
    return await getUserById(result.lastID);
}

async function updateUser(id: any, name: string) {
    const sql = `UPDATE Users SET name = '${name}' WHERE id = ${Number(id)}`;
    await run(sql);
    return await getUserById(id);
}

async function deleteUser(id: any) {
    const sql = `DELETE FROM Users WHERE id = ${Number(id)}`;
    return await run(sql);
}

export { getAllUsers, getUserById, createUser, updateUser, deleteUser };
