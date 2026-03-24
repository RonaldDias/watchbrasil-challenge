import prisma from "../config/database.js";
import { sendEvent } from "../streaming/sseManager.js";

export async function addComment(userId, taskId, { content }) {
    const task = await prisma.task.findFirst({
        where: {
            id: taskId,
        },
    });

    if (!task) {
        throw { status: 404, message: "Tarefa não encontrada" };
    }

    const comment = await prisma.taskComment.create({
        data: {
            taskId,
            userId,
            content,
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });

    if (task.creatorId !== userId) {
        sendEvent(task.creatorId, {
            type: "NEW_COMMENT",
            taskId,
            comment,
        });
    }

    return comment;
}

export async function getComments(taskId) {
    return prisma.taskComment.findMany({
        where: {
            taskId,
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
        orderBy: {
            createdAt: "asc",
        },
    });
}

export async function deleteComment(userId, commentId) {
    const comment = await prisma.taskComment.findFirst({
        where: {
            id: commentId,
            userId,
        },
    });

    if (!comment) {
        throw { status: 404, message: "Comentário não encontrado" };
    }

    return prisma.taskComment.delete({
        where: {
            id: commentId,
        },
    });
}