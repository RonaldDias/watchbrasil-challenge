import { describe, expect, jest } from "@jest/globals"

const mockPrisma = {
    task: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
    },
    category: {
        findFirst: jest.fn(),
    }
}

jest.unstable_mockModule("../config/database.js", () => ({
    default: mockPrisma
}))

jest.unstable_mockModule("../streaming/sseManager.js", () => ({
    sendEvent: jest.fn()
}))

const { createTask, updateTask, deleteTask, getTasks } = await import("../services/taskService.js")

describe("Task Service", () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe("createTask", () => {
        it("deve criar tarefa sem categoria", async () => {
            mockPrisma.task.create.mockResolvedValue({
                id: "task-1",
                title: "Tarefa",
                status: "PENDING",
                category: null
            })

            const result = await createTask("user-1", { title: "Tarefa" })

            expect(result.title).toBe("Tarefa")
            expect(mockPrisma.category.findFirst).not.toHaveBeenCalled()
        })

        it("deve validar se categoria pertence ao usuário", async () => {
            mockPrisma.category.findFirst.mockResolvedValue(null)

            await expect(createTask("user-1", { title: "Tarefa", categoryId: "cat-fake" }))
                .rejects.toMatchObject({ status: 404 })
        })

        it("deve criar tarefa com categoria válida", async () => {
            mockPrisma.category.findFirst.mockResolvedValue({ id: "cat-1" })
            mockPrisma.task.create.mockResolvedValue({
                id: "task-1",
                title: "Tarefa",
                categoryId: "cat-1",
                category: { id: "cat-1", name: "Trabalho" }
            })

            const result = await createTask("user-1", { 
                title: "Tarefa", categoryId: "cat-1" })

            expect(result.categoryId).toBe("cat-1")
        })
    })

    describe("getTasks", () => {
        it("deve listar tarefas com filtros", async () => {
            mockPrisma.task.findMany.mockResolvedValue([
                {
                    id: "task-1",
                    title: "Tarefa 1",
                    status: "PENDING",
                }
            ])

            const result = await getTasks("user-1", { status: "PENDING" })

            expect(result).toHaveLength(1)
            expect(mockPrisma.task.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({
                        status: "PENDING"
                    })
                })
            )
        })
    })

    describe("deleteTask", () => {
        it("deve deletar tarefa", async () => {
            mockPrisma.task.findFirst.mockResolvedValue({
                id: "task-1",
            })
            mockPrisma.task.delete.mockResolvedValue({
                id: "task-1",
            })
            
            const result = await deleteTask("user-1", "task-1")

            expect(result.id).toBe("task-1")
        })

        it("deve retornar erro se tarefa não existir", async () => {
            mockPrisma.task.findFirst.mockResolvedValue(null)

            await expect(deleteTask("user-1", "fake-id"))
                .rejects.toMatchObject({ status: 404 })
        })
    })
})