/**
 * @openapi
 * /api/tasks/{taskId}/assignments:
 *   post:
 *     tags: [Collaboration]
 *     summary: Atribuir usuário a uma tarefa
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 example: colaborador@test.com
 *               role:
 *                 type: string
 *                 enum: [COLLABORATOR, VIEWER]
 *                 example: COLLABORATOR
 *     responses:
 *       201:
 *         description: Usuário atribuído
 *       404:
 *         description: Tarefa ou usuário não encontrado
 *
 * /api/tasks/{taskId}/assignments/{id}:
 *   delete:
 *     tags: [Collaboration]
 *     summary: Remover atribuição
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Atribuição removida
 *
 * /api/tasks/{taskId}/comments:
 *   post:
 *     tags: [Collaboration]
 *     summary: Adicionar comentário
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content]
 *             properties:
 *               content:
 *                 type: string
 *                 example: Preciso de ajuda nesta tarefa
 *     responses:
 *       201:
 *         description: Comentário criado
 *   get:
 *     tags: [Collaboration]
 *     summary: Listar comentários de uma tarefa
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de comentários
 *
 * /api/tasks/{taskId}/comments/{id}:
 *   delete:
 *     tags: [Collaboration]
 *     summary: Deletar comentário (apenas o autor)
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Comentário deletado
 *
 * /api/reports:
 *   get:
 *     tags: [Reports]
 *     summary: Relatório de tarefas do usuário
 *     responses:
 *       200:
 *         description: Relatório com totais por status, prioridade e tarefas atrasadas
 *
 * /api/stream:
 *   get:
 *     tags: [Streaming]
 *     summary: Conexão SSE para notificações em tempo real
 *     description: Mantém conexão aberta para receber eventos (NEW_COMMENT, NEW_ASSIGNMENT)
 *     responses:
 *       200:
 *         description: Stream de eventos SSE
 */
