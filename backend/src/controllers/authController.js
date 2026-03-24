import { register, login } from "../services/authService.js";

export async function registerController(req, res) {
    try {
        const { name, email, password } = req.body;
        const user = await register(name, email, password);

        res.status(201).json(user);

    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ message: error.message });
    }
}

export async function loginController(req, res) {
    try {
        const { email, password } = req.body;
        const result = await login(email, password);

        res.json(result);

    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ error: error.message });
    }
}