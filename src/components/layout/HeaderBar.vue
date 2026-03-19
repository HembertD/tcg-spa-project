<template>
  <NLayoutHeader
    v-if="store.isAuthenticated"
    bordered
    style="padding: 0 24px; position: sticky; top: 0; z-index: 100"
  >
    <NSpace justify="space-between" align="center" style="height: 56px">
      <NSpace align="center" :size="16">
        <RouterLink to="/">TCG SPA</RouterLink>
        <NButton
          tag="a"
          :href="`${apiBaseUrl.replace('/api', '')}/api-docs`"
          target="_blank"
          text
          size="small"
        >
          API Docs
        </NButton>
        <NButton
          tag="a"
          href="https://making-rerun-61323218.figma.site/"
          target="_blank"
          text
          size="small"
        >
          Maquettes
        </NButton>
      </NSpace>
      <NSpace align="center" :size="16">
        <NText depth="3">{{ store.user?.username }}</NText>
        <NButton size="small" @click="handleLogout">Déconnexion</NButton>
      </NSpace>
    </NSpace>
  </NLayoutHeader>
</template>

<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'

import { useAuthStore } from '@/store/auth.store'

const router = useRouter()
const store = useAuthStore()
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string

const handleLogout = () => {
  store.signOut()
  router.push('/sign-in')
}
</script>
