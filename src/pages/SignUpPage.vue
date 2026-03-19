<template>
  <NForm class="sign-up-form" @submit.prevent="handleSignUp">
    <NText size="large" strong>Créer un compte</NText>
    <NFormItem label="Nom utilisateur" required>
      <NInput
        v-model:value="username"
        round
        type="text"
        placeholder="Nom de l'utilisateur"
      />
    </NFormItem>
    <NFormItem label="Email" required>
      <NInput v-model:value="email" round type="text" placeholder="Email" />
    </NFormItem>
    <NFormItem label="Mot de passe" required>
      <NInput
        v-model:value="password"
        round
        type="password"
        show-password-on="mousedown"
        placeholder="Password"
      />
    </NFormItem>
    <NButton
      type="primary"
      round
      :loading="store.loading"
      :disabled="store.loading"
      attr-type="submit"
      >S'inscrire</NButton
    >
  </NForm>
  <p>Déjà inscrit ? <RouterLink to="/sign-in">cliquez ici</RouterLink></p>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

import { useAuthStore } from '@/store/auth.store'

const router = useRouter()
const store = useAuthStore()

const username = ref('')
const email = ref('')
const password = ref('')

watch(
  () => store.error,
  (newError) => {
    if (newError) {
      ;(window as unknown).$message?.error(newError)
      store.clearError()
    }
  },
)

const handleSignUp = async () => {
  await store.signUp({
    username: username.value,
    email: email.value,
    password: password.value,
  })
  if (!store.error && store.isAuthenticated) {
    router.push('/')
  }
}
</script>

<style scoped>
.sign-up-form {
  max-width: 420px;
  margin: 2rem auto;
  padding: 2rem;
  background: var(--n-color-2, #fff);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.sign-up-form :deep(.n-text) {
  text-align: center;
  text-transform: uppercase;
}

.sign-up-form :deep(.n-form-item) {
  width: 100%;
}

.sign-up-form :deep(.n-input) {
  width: 100%;
}

.sign-up-form :deep(.n-input__input) {
  font-size: 1rem;
  padding: 0.75rem;
}

.sign-up-form :deep(.n-input--focus .n-input__input),
.sign-up-form :deep(.n-input__input:focus) {
  box-shadow: 0 0 0 3px var(--n-primary-color-hover, rgba(34, 157, 255, 0.3));
}

.sign-up-form :deep(.n-button) {
  width: 100%;
  margin-top: 0.5rem;
  height: 48px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.sign-up-form :deep(.n-button:hover) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.sign-up-form :deep(.router-link) {
  color: var(--n-primary-color, #2080f0);
  text-decoration: none;
  cursor: pointer;
  font-weight: 500;
}

.sign-up-form :deep(.router-link:hover) {
  text-decoration: underline;
  color: var(--n-primary-color-hover, #4098fc);
}

p {
  text-align: center;
  margin-top: 1rem;
}

@media (max-width: 480px) {
  .sign-up-form {
    margin: 1rem;
    padding: 1.5rem;
    max-width: none;
  }
}
</style>
