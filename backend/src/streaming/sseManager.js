const clients = new Map();

export function addClient(userId, res) {
    if (!clients.has(userId)) {
        clients.set(userId, []);
    }
    clients.get(userId).push(res);

    res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
    });

    res.write(`data: ${JSON.stringify({ type: "connected", message: "SSE conectado." })}\n\n`);

    res.on("close", () => {
        const userClients = clients.get(userId);
        clients.set(userId, userClients.filter((client) => client !== res));
    });
}

export function sendEvent(userId, event) {
    const userClients = clients.get(userId) || [];

    userClients.forEach((res) => {
        res.write(`data: ${JSON.stringify(event)}\n\n`);
    });
}