import { describe, expect, it, jest } from "@jest/globals"

const mockPrisma = {
    user: {
        findUnique: jest.fn(),
        create: jest.fn(),
    }
}

jest.unstable_mockModule("../config/database.js", () => ({
    default: mockPrisma
}))

const mockBcrypt = {
    hash: jest.fn(),
    compare: jest.fn()
};
jest.unstable_mockModule("bcryptjs", () => ({
    default: mockBcrypt
}))

const mockJwt = {
    sign: jest.fn(),
}
jest.unstable_mockModule("jsonwebtoken", () => ({
    default: mockJwt
}))

const { register, login } = await import("../services/authService.js")

describe("Auth Service", () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe("register", () => {
        it("deve criar um novo usuário com sucesso", async () => {
            
            mockPrisma.user.findUnique.mockResolvedValue(null)
            mockBcrypt.hash.mockResolvedValue("hashed123")
            mockPrisma.user.create.mockResolvedValue({
                id: "uuid-1",
                name: "Ronald",
                email: "ronald@test.com",
                createdAt: new Date()
            })

            const result = await register("Ronald", "ronald@test.com", "123456")

            expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
                where: { email: "ronald@test.com" }
            })
            expect(mockBcrypt.hash).toHaveBeenCalledWith("123456", 10)
            expect(result.name).toBe("Ronald")
        })

        it("deve retornar erro se o email já existir", async () => {
            mockPrisma.user.findUnique.mockResolvedValue({
                id: "exists"
            })

            await expect(register("Ronald", "ronald@test.com", "123456"))
                .rejects.toMatchObject({ status: 409 })
        })
    })

    describe("login", () => {
        it("deve retornar token com credenciais válidas", async () => {
            mockPrisma.user.findUnique.mockResolvedValue({
                id: "uuid-1",
                name: "Ronald",
                email: "ronald@test.com",
                passwordHash: "hashed123"
            })
            mockBcrypt.compare.mockResolvedValue(true)
            mockJwt.sign.mockReturnValue("fake-token")

            const result = await login("ronald@test.com", "123456")

            expect(result.token).toBe("fake-token");
            expect(result.user.email).toBe("ronald@test.com")   
        })

        it("deve rejeitar email inexistente", async () => {
            mockPrisma.user.findUnique.mockResolvedValue(null)

            await expect(login("naoexiste@test.com", "123456"))
                .rejects.toMatchObject({ status: 401 })
        })

        it("deve rejeitar senha incorreta", async () => {
            mockPrisma.user.findUnique.mockResolvedValue({
                id: "uuid-1",
                password: "hashed123"
            })
            mockBcrypt.compare.mockResolvedValue(false)

            await expect(login("ronald@test.com", "errada"))
                .rejects.toMatchObject({ status: 401 })
        })
    })
})