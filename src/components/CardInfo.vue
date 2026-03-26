<template>
  <div class="rounded-2xl transition-all duration-300">
    <NCard
      :class="[
        'cursor-pointer transition-all duration-300',
        sizeClasses,
        selected ? 'card-selected' : '',
        disabled ? 'opacity-60 grayscale cursor-not-allowed' : '',
      ]"
      class="!rounded-2xl"
      hoverable
      @click="handleClick"
    >
      <template #cover>
        <NImage
          :src="card.imgUrl"
          :alt="card.name"
          object-fit="cover"
          class="w-full h-36 sm:h-44 md:h-52"
          fallback-src="https://via.placeholder.com/300x200?text=?"
        />
      </template>

      <template #default>
        <div class="p-3 space-y-2">
          <div class="flex items-center gap-2">
            <NTag type="info" size="small" class="font-mono">
              #{{ card.pokedexNumber.toString().padStart(3, '0') }}
            </NTag>
          </div>

          <div class="font-bold text-lg truncate">
            {{ card.name }}
          </div>

          <div>
            <NTag
              size="small"
              round
              class="text-white font-bold"
              :style="{ backgroundColor: typeColor }"
            >
              {{ card.type }}
            </NTag>
          </div>

          <div class="flex justify-between text-sm font-semibold">
            <span class="flex items-center gap-1"> ❤️ {{ card.hp }} </span>
            <span class="flex items-center gap-1"> ⚔️ {{ card.attack }} </span>
          </div>
        </div>
      </template>
    </NCard>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { useColors } from '@/composables/useColors'
import type { Card } from '@/types'

const props = withDefaults(
  defineProps<{
    card: Card
    size?: 'sm' | 'md'
    selected?: boolean
    disabled?: boolean
  }>(),
  {
    size: 'md',
    selected: false,
    disabled: false,
  },
)

const emit = defineEmits<{ click: [id: number] }>()

const { getTypeColor } = useColors()

const typeColor = computed(() => getTypeColor(props.card.type))

const sizeClasses = computed(() => ({
  'w-52': props.size === 'sm',
  'w-72': props.size === 'md',
}))

const handleClick = () => {
  if (!props.disabled) emit('click', props.card.id)
}
</script>

<style scoped>
.card-selected {
  background-color: #cffafe !important;
  border: 4px solid #22d3ee !important;
}
.card-selected :deep(.n-card__content) {
  background-color: #cffafe !important;
}
</style>
