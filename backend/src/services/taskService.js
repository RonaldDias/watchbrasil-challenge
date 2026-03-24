import prisma from "../config/database.js";

export async function createTask(userId, { title, description, priority, dueDate, categoryId }) {
    if (categoryId) {
        const category = await prisma.category.findFirst({
            where: {
                id: categoryId,
                userId,
            },
        });
        if (!category) {
            throw { status: 404, message: "Categoria não pertence ao usuário" };
        }
    }
    return prisma.task.create({
        data: {
            title,
            description,
            priority,
            dueDate: dueDate ? new Date(dueDate) : null,
            categoryId,
            creatorId: userId,
        },
        include: {
            category: true,
        },
    });
}

export async function getTasks(userId, { status, priority, categoryId }) {
    const where = {
        creatorId: userId,
    };
    if (status) {
        where.status = status;
    }
    if (priority) {
        where.priority = priority;
    }
    if (categoryId) {
        where.categoryId = categoryId;
    }
    return prisma.task.findMany({
        where,
        include: {
            category: true,
            assignments: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}

export async function getTaskById(userId, taskId) {
    const task = await prisma.task.findFirst({
        where: {
            id: taskId,
            creatorId: userId,
        },
        include: {
            category: true,
            assignments: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            },
            comments: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "asc",
                },
            },
        },
    });
    if (!task) {
        throw { status: 404, message: "Tarefa não encontrada" };
    }
    return task;
}

export async function updateTask(userId, taskId, data) {
    const task = await prisma.task.findFirst({
        where: {
            id: taskId,
            creatorId: userId,
        },
    });
    if (!task) {
        throw { status: 404, message: "Tarefa não encontrada" };
    }
    if (data.categoryId) {
        const category = await prisma.category.findFirst({
            where: {
                id: data.categoryId,
                userId,
            },
        });
        if (!category) {
            throw { status: 404, message: "Categoria não pertence ao usuário" };
        }
    }
    if (data.dueDate) {
        data.dueDate = new Date(data.dueDate);
    }
    return prisma.task.update({
        where: {
            id: taskId,
        },
        data,
        include: { category: true }
    });
}

export async function deleteTask(userId, taskId) {
    const task = await prisma.task.findFirst({
        where: {
            id: taskId,
            creatorId: userId,
        },
    });
    if (!task) {
        throw { status: 404, message: "Tarefa não encontrada" };
    }
    return prisma.task.delete({
        where: {
            id: taskId,
        },
    });
}