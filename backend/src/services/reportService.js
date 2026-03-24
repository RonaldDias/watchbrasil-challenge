import prisma from "../config/database.js";

export async function getTaskReport(userId) {
    const [total, byStatus, byPriority, overdue] = await Promise.all([
        prisma.task.count({ where: { creatorId: userId } }),

        prisma.task.groupBy({
            by: ['status'],
            where: { creatorId: userId },
            _count: true
        }),
        prisma.task.groupBy({
            by: ['priority'],
            where: { creatorId: userId },
            _count: true
        }),
        prisma.task.count({
            where: {
                creatorId: userId,
                status: {
                    not: 'COMPLETED'
                },
                dueDate: {
                    lt: new Date()
                }
            }
        })
    ]);
    return {
        total,
        overdue,
        byStatus: byStatus.reduce((acc, item) => {
            acc[item.status] = item._count;
            return acc;
        }, {}),
        byPriority: byPriority.reduce((acc, item) => {
            acc[item.priority] = item._count;
            return acc;
        }, {}),

    };
}