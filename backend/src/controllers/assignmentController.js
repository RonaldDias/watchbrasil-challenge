import { assignUser, removeAssignment } from "../services/assignmentService.js";

export async function assign(req, res) {
    try {
        const assignment = await assignUser(req.userId, req.params.taskId, req.body);
        res.status(201).json(assignment);
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ error: error.message });
    }
}

export async function remove(req, res) {
    try {
        await removeAssignment(req.userId, req.params.taskId, req.params.id);
        res.status(204).send();
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ error: error.message });
    }
}