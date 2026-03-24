import { createTask, getTasks, getTaskById, updateTask, deleteTask } from "../services/taskService.js";

export async function create(req, res) {
    try {
        const task = await createTask(req.userId, req.body);
        res.status(201).json(task);
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ error: error.message });
    }
}

export async function list(req, res) {
    try {
        const tasks = await getTasks(req.userId, req.query);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function getById(req, res) {
    try {
        const task = await getTaskById(req.userId, req.params.id);
        res.json(task);
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ error: error.message });
    }
}

export async function update(req, res) {
    try {
        const task = await updateTask(req.userId, req.params.id, req.body);
        res.json(task);
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ error: error.message });
    }
}

export async function remove(req, res) {
    try {
        await deleteTask(req.userId, req.params.id);
        res.status(204).send();
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ error: error.message });
    }
}