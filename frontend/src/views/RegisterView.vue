<script setup>
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
const router = useRouter()
const auth = useAuthStore()
const name = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const success = ref(false)
const loading = ref(false)
async function handleRegister() {
  try {
    loading.value = true
    error.value = ''
    await auth.register(name.value, email.value, password.value)
    success.value = true
    setTimeout(() => router.push('/login'), 1500)
  } catch (e) {
    error.value = e.response?.data?.error || 'Erro ao criar conta'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-900">
    <div class="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md">
      <h1 class="text-3xl font-bold text-white text-center mb-2">Criar Conta</h1>
      <p class="text-gray-400 text-center mb-8">Cadastre-se para gerenciar suas tarefas</p>
      <div v-if="error" class="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-4">
        {{ error }}
      </div>
      <div v-if="success" class="bg-green-500/10 border border-green-500 text-green-400 px-4 py-3 rounded-lg mb-4">
        Conta criada! Redirecionando para login...
      </div>
      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label class="block text-sm text-gray-300 mb-1">Nome</label>
          <input
            v-model="name"
            type="text"
            required
            class="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            placeholder="Seu nome"
          />
        </div>
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
            minlength="6"
            class="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            placeholder="Mínimo 6 caracteres"
          />
        </div>
        <button
          type="submit"
          :disabled="loading"
          class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50"
        >
          {{ loading ? 'Criando...' : 'Criar conta' }}
        </button>
      </form>
      <p class="text-gray-400 text-center mt-6">
        Já tem conta?
        <RouterLink to="/login" class="text-blue-400 hover:text-blue-300">Fazer login</RouterLink>
      </p>
    </div>
  </div>
</template>