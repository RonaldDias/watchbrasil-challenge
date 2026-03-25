<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const task = ref(null)
const loading = ref(true)
const commentText = ref('')
const assignEmail = ref('')

onMounted(async () => {
  try {
    const { data } = await api.get(`/tasks/${route.params.id}`)
    task.value = data
  } catch (e) {
    router.push('/tasks')
  } finally {
    loading.value = false
  }
})

async function updateStatus(status) {
  const { data } = await api.put(`/tasks/${task.value.id}`, { status })
  task.value.status = data.status
}

async function addComment() {
  if (!commentText.value.trim()) return
  const { data } = await api.post(`/tasks/${task.value.id}/comments`, { content: commentText.value })
  task.value.comments.push(data)
  commentText.value = ''
}

async function deleteComment(id) {
  await api.delete(`/tasks/${task.value.id}/comments/${id}`)
  task.value.comments = task.value.comments.filter((c) => c.id !== id)
}

async function assignUser() {
  if (!assignEmail.value.trim()) return
  try {
    const { data } = await api.post(`/tasks/${task.value.id}/assignments`, { email: assignEmail.value })
    task.value.assignments.push(data)
    assignEmail.value = ''
  } catch (e) {
    alert(e.response?.data?.error || 'Erro ao atribuir usuário')
  }
}

async function removeAssignment(id) {
  await api.delete(`/tasks/${task.value.id}/assignments/${id}`)
  task.value.assignments = task.value.assignments.filter((a) => a.id !== id)
}

function handleLogout() {
  auth.logout()
  router.push('/login')
}

const statusLabels = { PENDING: 'Pendente', IN_PROGRESS: 'Em progresso', COMPLETED: 'Concluída', CANCELLED: 'Cancelada' }
const statusColors = { PENDING: 'bg-yellow-500', IN_PROGRESS: 'bg-blue-500', COMPLETED: 'bg-green-500', CANCELLED: 'bg-red-500' }
const priorityLabels = { LOW: 'Baixa', MEDIUM: 'Média', HIGH: 'Alta', URGENT: 'Urgente' }
</script>

<template>
  <div class="min-h-screen bg-gray-900">
    <nav class="bg-gray-800 border-b border-gray-700 px-6 py-4 flex justify-between items-center">
      <RouterLink to="/" class="text-xl font-bold text-white">WatchBrasil Tasks</RouterLink>
      <div class="flex items-center gap-4">
        <RouterLink to="/tasks" class="text-gray-300 hover:text-white transition">Tarefas</RouterLink>
        <button @click="handleLogout" class="text-red-400 hover:text-red-300 transition">Sair</button>
      </div>
    </nav>

    <div class="max-w-4xl mx-auto p-6">
      <div v-if="loading" class="text-gray-400 text-center py-12">Carregando...</div>

      <div v-else-if="task">
        <div class="flex items-start justify-between mb-6">
          <div>
            <h2 class="text-2xl font-bold text-white">{{ task.title }}</h2>
            <p class="text-gray-400 mt-1">{{ task.description || 'Sem descrição' }}</p>
          </div>
          <span :class="statusColors[task.status]" class="px-3 py-1 rounded-full text-sm text-white font-medium">
            {{ statusLabels[task.status] }}
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div class="bg-gray-800 p-4 rounded-xl border border-gray-700">
            <p class="text-gray-400 text-sm">Prioridade</p>
            <p class="text-white font-medium">{{ priorityLabels[task.priority] }}</p>
          </div>
          <div class="bg-gray-800 p-4 rounded-xl border border-gray-700">
            <p class="text-gray-400 text-sm">Categoria</p>
            <p class="text-white font-medium">{{ task.category?.name || 'Sem categoria' }}</p>
          </div>
          <div class="bg-gray-800 p-4 rounded-xl border border-gray-700">
            <p class="text-gray-400 text-sm">Prazo</p>
            <p class="text-white font-medium">{{ task.dueDate ? new Date(task.dueDate).toLocaleDateString('pt-BR') : 'Sem prazo' }}</p>
          </div>
        </div>

        <div class="flex gap-2 mb-8">
          <button
            v-for="status in ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']"
            :key="status"
            @click="updateStatus(status)"
            :class="task.status === status ? statusColors[status] : 'bg-gray-700 hover:bg-gray-600'"
            class="px-4 py-2 text-white text-sm rounded-lg transition"
          >
            {{ statusLabels[status] }}
          </button>
        </div>

        <div class="bg-gray-800 rounded-xl border border-gray-700 p-6 mb-6">
          <h3 class="text-lg font-semibold text-white mb-4">Colaboradores</h3>
          <div class="flex gap-2 mb-4">
            <input
              v-model="assignEmail"
              placeholder="Email do colaborador"
              class="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
            <button @click="assignUser" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
              Atribuir
            </button>
          </div>
          <div v-if="task.assignments.length === 0" class="text-gray-500 text-sm">Nenhum colaborador</div>
          <div v-else class="space-y-2">
            <div v-for="a in task.assignments" :key="a.id" class="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
              <div>
                <span class="text-white">{{ a.user.name }}</span>
                <span class="text-gray-400 text-sm ml-2">{{ a.user.email }}</span>
              </div>
              <button @click="removeAssignment(a.id)" class="text-red-400 hover:text-red-300 text-sm">Remover</button>
            </div>
          </div>
        </div>

        <div class="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <h3 class="text-lg font-semibold text-white mb-4">Comentários</h3>
          <div class="flex gap-2 mb-4">
            <input
              v-model="commentText"
              placeholder="Adicionar comentário..."
              @keyup.enter="addComment"
              class="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
            <button @click="addComment" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
              Enviar
            </button>
          </div>
          <div v-if="task.comments.length === 0" class="text-gray-500 text-sm">Nenhum comentário</div>
          <div v-else class="space-y-3">
            <div v-for="c in task.comments" :key="c.id" class="p-3 bg-gray-700/50 rounded-lg">
              <div class="flex justify-between">
                <span class="text-blue-400 text-sm font-medium">{{ c.user.name }}</span>
                <button @click="deleteComment(c.id)" class="text-red-400 hover:text-red-300 text-xs">✕</button>
              </div>
              <p class="text-white mt-1">{{ c.content }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
