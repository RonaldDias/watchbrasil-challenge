import { addComment, getComments, deleteComment } from "../services/commentService.js";

export async function create(req, res) {
    try {
        const comment = await addComment(req.userId, req.params.taskId, req.body);
        res.status(201).json(comment);
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ error: error.message });
    }
}

export async function list(req, res) {
    try {
        const comments = await getComments(req.params.taskId);
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function remove(req, res) {
    try {
        await deleteComment(req.userId, req.params.id);
        res.status(204).send();
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ error: error.message });
    }
}