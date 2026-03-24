import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/database.js";

export async function register(name, email, password) {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
        throw { status: 409, message: "Email já cadastrado" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
        }
    })

    return user;
};

export async function login(email, password) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        throw { status: 401, message: "Credenciais inválidas" };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw { status: 401, message: "Credenciais inválidas" };
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

    return { token, user: { id: user.id, name: user.name, email: user.email } };
}