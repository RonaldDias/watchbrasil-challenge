<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'

const router = useRouter()
const auth = useAuthStore()
const report = ref(null)
const recentTasks = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const [reportRes, tasksRes] = await Promise.all([
      api.get('/reports'),
      api.get('/tasks'),
    ])
    report.value = reportRes.data
    recentTasks.value = tasksRes.data.slice(0, 5)
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})

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
</script>

<template>
  <div class="min-h-screen bg-gray-900">
    <nav class="bg-gray-800 border-b border-gray-700 px-6 py-4 flex justify-between items-center">
      <h1 class="text-xl font-bold text-white">WatchBrasil Tasks</h1>
      <div class="flex items-center gap-4">
        <RouterLink to="/tasks" class="text-gray-300 hover:text-white transition">Tarefas</RouterLink>
        <button @click="handleLogout" class="text-red-400 hover:text-red-300 transition">Sair</button>
      </div>
    </nav>

    <div class="max-w-6xl mx-auto p-6">
      <h2 class="text-2xl font-bold text-white mb-6">Dashboard</h2>

      <div v-if="loading" class="text-gray-400 text-center py-12">Carregando...</div>

      <div v-else>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div class="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <p class="text-gray-400 text-sm">Total de tarefas</p>
            <p class="text-3xl font-bold text-white mt-1">{{ report?.total || 0 }}</p>
          </div>
          <div class="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <p class="text-gray-400 text-sm">Pendentes</p>
            <p class="text-3xl font-bold text-yellow-400 mt-1">{{ report?.byStatus?.PENDING || 0 }}</p>
          </div>
          <div class="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <p class="text-gray-400 text-sm">Concluídas</p>
            <p class="text-3xl font-bold text-green-400 mt-1">{{ report?.byStatus?.COMPLETED || 0 }}</p>
          </div>
          <div class="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <p class="text-gray-400 text-sm">Atrasadas</p>
            <p class="text-3xl font-bold text-red-400 mt-1">{{ report?.overdue || 0 }}</p>
          </div>
        </div>

        <div class="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-white">Tarefas recentes</h3>
            <RouterLink to="/tasks" class="text-blue-400 hover:text-blue-300 text-sm">Ver todas →</RouterLink>
          </div>

          <div v-if="recentTasks.length === 0" class="text-gray-500 text-center py-8">
            Nenhuma tarefa ainda. Crie a primeira!
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="task in recentTasks"
              :key="task.id"
              @click="router.push(`/tasks/${task.id}`)"
              class="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-700 transition"
            >
              <div>
                <p class="text-white font-medium">{{ task.title }}</p>
                <p class="text-gray-400 text-sm">{{ task.category?.name || 'Sem categoria' }}</p>
              </div>
              <span :class="statusColors[task.status]" class="px-3 py-1 rounded-full text-xs text-white font-medium">
                {{ statusLabels[task.status] }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
