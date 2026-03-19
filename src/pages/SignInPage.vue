<template>
  <NForm class="sign-in-form" @submit.prevent="handleSignIn">
    <NText size="large" strong>Se connecter</NText>
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
      >Se connecter</NButton
    >
  </NForm>
  <p>Pas encore inscrit ? <RouterLink to="/sign-up">cliquez ici</RouterLink></p>
</template>

<script setup lang="ts">
import { useMessage } from 'naive-ui'
import { ref, watch } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

import { useAuthStore } from '@/store/auth.store'

const router = useRouter()
const store = useAuthStore()

const message = useMessage()

const email = ref('')
const password = ref('')

watch(
  () => store.error,
  (newError) => {
    if (newError !== null) {
      message.error(newError)
      store.clearError()
    }
  },
)

const handleSignIn = async () => {
  await store.signIn({
    email: email.value,
    password: password.value,
  })
  if (!store.error && store.isAuthenticated) {
    router.push('/')
  }
}
</script>

<style scoped>
.sign-in-form {
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

.sign-in-form :deep(.n-text) {
  text-align: center;
  text-transform: uppercase;
}

.sign-in-form :deep(.n-form-item) {
  width: 100%;
}

.sign-in-form :deep(.n-input) {
  width: 100%;
}

.sign-in-form :deep(.n-input__input) {
  font-size: 1rem;
  padding: 0.75rem;
}

.sign-in-form :deep(.n-input--focus .n-input__input),
.sign-in-form :deep(.n-input__input:focus) {
  box-shadow: 0 0 0 3px var(--n-primary-color-hover, rgba(34, 157, 255, 0.3));
}

.sign-in-form :deep(.n-button) {
  width: 100%;
  margin-top: 0.5rem;
  height: 48px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.sign-in-form :deep(.n-button:hover) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.sign-in-form :deep(.router-link) {
  color: var(--n-primary-color, #2080f0);
  text-decoration: none;
  cursor: pointer;
  font-weight: 500;
}

.sign-in-form :deep(.router-link:hover) {
  text-decoration: underline;
  color: var(--n-primary-color-hover, #4098fc);
}

p {
  text-align: center;
  margin-top: 1rem;
}

@media (max-width: 480px) {
  .sign-in-form {
    margin: 1rem;
    padding: 1.5rem;
    max-width: none;
  }
}
</style>
