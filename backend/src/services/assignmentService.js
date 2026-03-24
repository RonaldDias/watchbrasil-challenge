import prisma from "../config/database.js";
import { sendEvent } from "../streaming/sseManager.js";

export async function assignUser(userId, taskId, { email, role }) {
    const task = await prisma.task.findFirst({
        where: {
            id: taskId,
            creatorId: userId,
        },
    });

    if (!task) {
        throw { status: 404, message: "Tarefa não encontrada" };
    }

    const targetUser = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (!targetUser) {
        throw { status: 404, message: "Usuário não encontrado" };
    }

    const existing = await prisma.taskAssignment.findUnique({
        where: {
            taskId_userId: {
                taskId,
                userId: targetUser.id,
            },
        },
    });

    if (existing) {
        throw { status: 400, message: "Usuário já atribuído a esta tarefa" };
    }

    const assignment = await prisma.taskAssignment.create({
        data: {
            taskId,
            userId: targetUser.id,
            role: role || "COLLABORATOR",
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });

    sendEvent(targetUser.id, {
        type: "NEW_ASSIGNMENT",
        taskId,
        role: assignment.role,
    });

    return assignment;
}

export async function removeAssignment(userId, taskId, assignmentId) {
    const task = await prisma.task.findFirst({
        where: {
            id: taskId,
            creatorId: userId,
        },
    });

    if (!task) {
        throw { status: 404, message: "Tarefa não encontrada" };
    }

    const assignment = await prisma.taskAssignment.findFirst({
        where: {
            id: assignmentId,
            taskId,
        },
    });

    if (!assignment) {
        throw { status: 404, message: "Atribuição não encontrada" };
    }

    return prisma.taskAssignment.delete({
        where: {
            id: assignmentId,
        },
    });
}