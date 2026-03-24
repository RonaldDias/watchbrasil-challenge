/**
 * @openapi
 * /api/tasks:
 *   post:
 *     tags: [Tasks]
 *     summary: Criar tarefa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *                 example: Finalizar desafio
 *               description:
 *                 type: string
 *                 example: Terminar backend e frontend
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH, URGENT]
 *                 example: HIGH
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-03-28T00:00:00Z"
 *               categoryId:
 *                 type: string
 *                 example: uuid-da-categoria
 *     responses:
 *       201:
 *         description: Tarefa criada
 *       400:
 *         description: Categoria não pertence ao usuário
 *   get:
 *     tags: [Tasks]
 *     summary: Listar tarefas (com filtros opcionais)
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, IN_PROGRESS, COMPLETED, CANCELLED]
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [LOW, MEDIUM, HIGH, URGENT]
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de tarefas
 *
 * /api/tasks/{id}:
 *   get:
 *     tags: [Tasks]
 *     summary: Buscar tarefa por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tarefa encontrada
 *       404:
 *         description: Tarefa não encontrada
 *   put:
 *     tags: [Tasks]
 *     summary: Atualizar tarefa
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [PENDING, IN_PROGRESS, COMPLETED, CANCELLED]
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH, URGENT]
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               categoryId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tarefa atualizada
 *       404:
 *         description: Tarefa não encontrada
 *   delete:
 *     tags: [Tasks]
 *     summary: Deletar tarefa
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Tarefa deletada
 *       404:
 *         description: Tarefa não encontrada
 */
