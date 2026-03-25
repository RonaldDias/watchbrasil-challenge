<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'

const router = useRouter()
const auth = useAuthStore()

const tasks = ref([])
const categories = ref([])
const loading = ref(true)
const showModal = ref(false)
const filterStatus = ref('')
const filterPriority = ref('')

const form = ref({
  title: '',
  description: '',
  priority: 'MEDIUM',
  dueDate: '',
  categoryId: '',
})

const filteredTasks = computed(() => {
  return tasks.value.filter((t) => {
    if (filterStatus.value && t.status !== filterStatus.value) return false
    if (filterPriority.value && t.priority !== filterPriority.value) return false
    return true
  })
})

onMounted(async () => {
  try {
    const [tasksRes, catsRes] = await Promise.all([
      api.get('/tasks'),
      api.get('/categories'),
    ])
    tasks.value = tasksRes.data
    categories.value = catsRes.data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})

async function createTask() {
  try {
    const payload = { ...form.value }
    if (!payload.categoryId) delete payload.categoryId
    if (!payload.dueDate) delete payload.dueDate

    const { data } = await api.post('/tasks', payload)
    tasks.value.unshift(data)
    showModal.value = false
    form.value = { title: '', description: '', priority: 'MEDIUM', dueDate: '', categoryId: '' }
  } catch (e) {
    alert(e.response?.data?.error || 'Erro ao criar tarefa')
  }
}

async function deleteTask(id) {
  if (!confirm('Deletar esta tarefa?')) return
  await api.delete(`/tasks/${id}`)
  tasks.value = tasks.value.filter((t) => t.id !== id)
}

function handleLogout() {
  auth.logout()
  router.push('/login')
}

const statusLabels = {
  PENDING: 'Pendente',
  IN_PROGRESS: 'Em progresso',
  COMPLETED: 'Concluída',
  CANCELLED: 'Cancelada',
}

const statusColors = {
  PENDING: 'bg-yellow-500',
  IN_PROGRESS: 'bg-blue-500',
  COMPLETED: 'bg-green-500',
  CANCELLED: 'bg-red-500',
}

const priorityLabels = {
  LOW: 'Baixa',
  MEDIUM: 'Média',
  HIGH: 'Alta',
  URGENT: 'Urgente',
}
</script>

<template>
  <div class="min-h-screen bg-gray-900">
    <nav class="bg-gray-800 border-b border-gray-700 px-6 py-4 flex justify-between items-center">
      <RouterLink to="/" class="text-xl font-bold text-white">WatchBrasil Tasks</RouterLink>
      <div class="flex items-center gap-4">
        <RouterLink to="/" class="text-gray-300 hover:text-white transition">Dashboard</RouterLink>
        <button @click="handleLogout" class="text-red-400 hover:text-red-300 transition">Sair</button>
      </div>
    </nav>

    <div class="max-w-6xl mx-auto p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-white">Tarefas</h2>
        <button
          @click="showModal = true"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          + Nova tarefa
        </button>
      </div>

      <div class="flex gap-4 mb-6">
        <select v-model="filterStatus" class="bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2">
          <option value="">Todos os status</option>
          <option value="PENDING">Pendente</option>
          <option value="IN_PROGRESS">Em progresso</option>
          <option value="COMPLETED">Concluída</option>
          <option value="CANCELLED">Cancelada</option>
        </select>
        <select v-model="filterPriority" class="bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2">
          <option value="">Todas as prioridades</option>
          <option value="LOW">Baixa</option>
          <option value="MEDIUM">Média</option>
          <option value="HIGH">Alta</option>
          <option value="URGENT">Urgente</option>
        </select>
      </div>

      <div v-if="loading" class="text-gray-400 text-center py-12">Carregando...</div>

      <div v-else-if="filteredTasks.length === 0" class="text-gray-500 text-center py-12">
        Nenhuma tarefa encontrada.
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="task in filteredTasks"
          :key="task.id"
          class="flex items-center justify-between p-4 bg-gray-800 rounded-xl border border-gray-700 hover:border-gray-600 transition"
        >
          <div @click="router.push(`/tasks/${task.id}`)" class="flex-1 cursor-pointer">
            <p class="text-white font-medium">{{ task.title }}</p>
            <div class="flex gap-2 mt-1">
              <span class="text-gray-400 text-sm">{{ task.category?.name || 'Sem categoria' }}</span>
              <span class="text-gray-600">•</span>
              <span class="text-gray-400 text-sm">{{ priorityLabels[task.priority] }}</span>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <span :class="statusColors[task.status]" class="px-3 py-1 rounded-full text-xs text-white font-medium">
              {{ statusLabels[task.status] }}
            </span>
            <button @click="deleteTask(task.id)" class="text-red-400 hover:text-red-300 text-sm">✕</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-gray-800 p-6 rounded-2xl w-full max-w-lg border border-gray-700">
        <h3 class="text-xl font-bold text-white mb-4">Nova Tarefa</h3>
        <form @submit.prevent="createTask" class="space-y-4">
          <input
            v-model="form.title"
            required
            placeholder="Título"
            class="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <textarea
            v-model="form.description"
            placeholder="Descrição"
            rows="3"
            class="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          ></textarea>
          <div class="grid grid-cols-2 gap-4">
            <select v-model="form.priority" class="bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-3">
              <option value="LOW">Baixa</option>
              <option value="MEDIUM">Média</option>
              <option value="HIGH">Alta</option>
              <option value="URGENT">Urgente</option>
            </select>
            <select v-model="form.categoryId" class="bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-3">
              <option value="">Sem categoria</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
          </div>
          <input
            v-model="form.dueDate"
            type="date"
            class="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <div class="flex gap-3 justify-end">
            <button type="button" @click="showModal = false" class="px-4 py-2 text-gray-400 hover:text-white transition">
              Cancelar
            </button>
            <button type="submit" class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
              Criar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
