import prisma from "../config/database.js";

export async function createCategory(userId, { name, color }) {
    return prisma.category.create({
        data: {
            userId,
            name,
            color,
        },
    });
}

export async function getCategories(userId) {
    return prisma.category.findMany({
        where: {
            userId,
        },
        orderBy: {
            name: "asc",
        },
    });
}

export async function updateCategory(userId, categoryId, { name, color }) {
    const category = await prisma.category.findFirst({
        where: {
            userId,
            id: categoryId,
        },
    });

    if (!category) {
        throw { status: 404, message: "Categoria não encontrada." };
    }

    return prisma.category.update({
        where: {
            id: categoryId,
        },
        data: {
            name,
            color,
        },
    });
}

export async function deleteCategory(userId, categoryId) {
    const category = await prisma.category.findFirst({
        where: {
            userId,
            id: categoryId,
        },
    });

    if (!category) {
        throw { status: 404, message: "Categoria não encontrada." };
    }

    return prisma.category.delete({
        where: {
            id: categoryId,
        },
    });
}