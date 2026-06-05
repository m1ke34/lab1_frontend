const usersRepo = require("../repositories/usersRepo");

const getAll = async (req, res, next) => {
    try { res.status(200).json(await usersRepo.getAllUsers()); } 
    catch (err) { next(err); }
};

const create = async (req, res, next) => {
    try {
        if (!req.body.name) return res.status(400).json({ error: "Ім'я обов'язкове" });
        const newUser = await usersRepo.createUser(req.body.name);
        res.status(201).json(newUser);
    } catch (err) { next(err); }
};

const update = async (req, res, next) => {
    try {
        const updatedUser = await usersRepo.updateUser(req.params.id, req.body.name);
        res.status(200).json(updatedUser);
    } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
    try {
        await usersRepo.deleteUser(req.params.id);
        res.status(204).send();
    } catch (err) { next(err); }
};

module.exports = { getAll, create, update, remove };