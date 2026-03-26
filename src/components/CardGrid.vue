<template>
  <div class="card-grid">
    <div class="grid">
      <CardInfo
        v-for="card in props.cards"
        :key="card.id"
        :card="card"
        size="sm"
        :selected="isSelected(card)"
        :disabled="isDisabled(card)"
        @click="handleCardClick(card)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type { Card } from '@/types'

import CardInfo from './CardInfo.vue'

const props = withDefaults(
  defineProps<{
    cards: Card[]
    modelValue: number[]
    maxSelected?: number
  }>(),
  {
    maxSelected: 6,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: number[]]
}>()

const selectedSet = computed(() => new Set(props.modelValue))

const isSelected = (card: Card) => selectedSet.value.has(card.id)

const canSelectMore = computed(
  () => props.modelValue.length < (props.maxSelected ?? 6),
)

const isDisabled = (card: Card) => !isSelected(card) && !canSelectMore.value

const handleCardClick = (card: Card) => {
  if (isDisabled(card)) return

  const newSelected = [...props.modelValue]
  const index = newSelected.indexOf(card.id)

  if (index > -1) {
    newSelected.splice(index, 1)
  } else {
    newSelected.push(card.id)
  }

  emit('update:modelValue', newSelected)
}
</script>

<style scoped>
.card-grid :deep(.grid) {
  display: grid !important;
  grid-template-columns: repeat(6, 1fr);
  gap: 1rem;
  padding: 1rem;
  max-height: 500px;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .card-grid :deep(.grid) {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 480px) {
  .card-grid :deep(.grid) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.card-grid :deep(.n-card) {
  height: 250px !important;
  cursor: pointer;
  transition: all 0.2s;
}

.card-grid :deep(.n-card:hover) {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2) !important;
}

.card-grid :deep(.n-image) {
  height: 120px !important;
  object-fit: cover;
}
</style>
