<template>
  <button class="grid gap-32 grid-flow-col justify-between items-start p-32 text-left rounded-30 border-1 border-grey-200 border-opacity-0 hover:border-opacity-100 transition-border duration-200">
    <div class="grid gap-10 max-w-640">
      <div class="grid gap-10 grid-flow-col items-center justify-start">
        <div class="w-24 h-24 bg-grey-200 rounded-full" />
        <div class="text-grey-100">
          <span class="typo-text-semibold">{{ name }} by</span>
          {{ ' ' }}
          <span class="text-white typo-text-medium">{{ truncate(author) }} by</span>
          {{ ' ' }}
          <span class="typo-text-regular">Core</span>
        </div>
      </div>
      <h2 class="text-white typo-title-s">
        {{ title }}
      </h2>
      <p class="overflow-hidden text-grey-100 typo-paragraph">
        {{ truncatedDescription }}
      </p>
      <div class="text-grey-100 typo-caption">
        <span
          :class="{
            'text-success': votesStatus.type === 'for',
            'text-error': votesStatus.type === 'against',
            'text-white': votesStatus.type === 'abstain',
          }"
        >
          {{ capitalize(votesStatus.type) }} - {{ votesStatus.total }}
        </span>
        {{ ' ' }}
        {{ name }}
      </div>
    </div>
    <UtilsChip :version="status === 'Active' ? 'success' : 'error'">
      {{ status }}
    </UtilsChip>
  </button>
</template>

<script setup lang="ts">
import { capitalize, truncate } from '@/assets/scripts/helpers'

type Props = {
  name: string
  title: string
  author: string
  status: 'Active' | 'Closed'
  description: string
  votes: {
    for: number
    against: number
    abstain: number
  }
}

type VoteStatus = {
  type: keyof Props['votes']
  total: Props['votes'][keyof Props['votes']]
}

const props = defineProps<Props>()

const truncatedDescription = computed<string>(
  () => (props.description.split(' ').length > 25
    ? `${props.description.split(' ').filter((_, i) => i < 25).join(' ')}…`
    : props.description),
)

const votesStatus = computed<VoteStatus>(
  () => Object.entries(props.votes)
    .reduce((accu, [type, total]) => (total > accu.total ? { type, total } : accu), { type: 'for', total: props.votes.for }) as VoteStatus,
)
</script>
