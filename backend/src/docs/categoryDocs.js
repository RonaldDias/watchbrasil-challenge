/**
 * @openapi
 * /api/categories:
 *   post:
 *     tags: [Categories]
 *     summary: Criar categoria
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, color]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Trabalho
 *               color:
 *                 type: string
 *                 example: "#FF5733"
 *     responses:
 *       201:
 *         description: Categoria criada
 *   get:
 *     tags: [Categories]
 *     summary: Listar categorias do usuário
 *     responses:
 *       200:
 *         description: Lista de categorias
 *
 * /api/categories/{id}:
 *   put:
 *     tags: [Categories]
 *     summary: Atualizar categoria
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
 *               name:
 *                 type: string
 *               color:
 *                 type: string
 *     responses:
 *       200:
 *         description: Categoria atualizada
 *       404:
 *         description: Categoria não encontrada
 *   delete:
 *     tags: [Categories]
 *     summary: Deletar categoria
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Categoria deletada
 *       404:
 *         description: Categoria não encontrada
 */
