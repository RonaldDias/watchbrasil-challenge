import { createCategory, getCategories, updateCategory, deleteCategory } from "../services/categoryService.js";

export async function create(req, res) {
    try {
        const category = await createCategory(req.userId, req.body);
        res.status(201).json(category);
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ error: error.message });
    }
}

export async function list(req, res) {
    try {
        const categories = await getCategories(req.userId);
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function update(req, res) {
    try {
        const category = await updateCategory(req.userId, req.params.id, req.body);
        res.json(category);
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ error: error.message });
    }
}

export async function remove(req, res) {
    try {
        await deleteCategory(req.userId, req.params.id);
        res.status(204).send();
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ error: error.message });
    }
}