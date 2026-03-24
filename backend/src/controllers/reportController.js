import { getTaskReport } from "../services/reportService.js";

export async function report(req, res) {
    try {
        const data = await getTaskReport(req.userId);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}