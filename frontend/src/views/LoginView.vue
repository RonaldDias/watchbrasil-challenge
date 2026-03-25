<script setup>
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
const router = useRouter()
const auth = useAuthStore()
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
async function handleLogin() {
  try {
    loading.value = true
    error.value = ''
    await auth.login(email.value, password.value)
    router.push('/')
  } catch (e) {
    error.value = e.response?.data?.error || 'Erro ao fazer login'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-900">
    <div class="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md">
      <h1 class="text-3xl font-bold text-white text-center mb-2">WatchBrasil Tasks</h1>
      <p class="text-gray-400 text-center mb-8">Faça login para continuar</p>
      <div v-if="error" class="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-4">
        {{ error }}
      </div>
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm text-gray-300 mb-1">Email</label>
          <input
            v-model="email"
            type="email"
            required
            class="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            placeholder="seu@email.com"
          />
        </div>
        <div>
          <label class="block text-sm text-gray-300 mb-1">Senha</label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            placeholder="••••••"
          />
        </div>
        <button
          type="submit"
          :disabled="loading"
          class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50"
        >
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>
      <p class="text-gray-400 text-center mt-6">
        Não tem conta?
        <RouterLink to="/register" class="text-blue-400 hover:text-blue-300">Criar conta</RouterLink>
      </p>
    </div>
  </div>
</template>