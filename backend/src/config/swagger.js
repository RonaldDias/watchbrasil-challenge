import swaggerJsdoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "WatchBrasil Task Manager API",
            version: "1.0.0",
            description: "API de gerenciamento de tarefas com colaboração e streaming",
        },
        servers: [{ url: "http://localhost:3000", description: "Servidor de desenvolvimento" }],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ["./src/docs/*.js"],
};

export default swaggerJsdoc(options);