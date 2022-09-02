<template>
  <article class="grid gap-32 grid-cols-1fr-auto justify-between items-start p-32 text-left rounded-30 border-1 border-grey-200 border-opacity-0 hover:border-opacity-100 transition-border duration-200">
    <div class="grid gap-10 max-w-640">
      <div class="grid gap-10 grid-flow-col items-center justify-start">
        <UtilsJazzicon
          class="flex justify-center items-center"
          :address="creator"
          :diameter="24"
        />
        <div class="text-white">
          <component
            :is="isFull ? 'h1' : 'h2'"
            class="inline typo-title-l"
          >
            {{ title }}
          </component>
          {{ ' ' }}
          <span class="text-grey-100 typo-text-semibold">by</span>
          {{ ' ' }}
          <span class="text-primary typo-text-medium">{{ /hx[a-f0-9]{40,40}/.test(creator) ? truncate(creator) : creator }}</span>
        </div>
      </div>
      <p
        v-if="discussion"
        class="text-grey-100 typo-text-semibold"
      >
        Discussion: <NuxtLink
          class="text-primary"
          :to="discussion"
          target="_blank"
        >
          {{ discussion }}
        </NuxtLink>
      </p>
      <VMdPreview
        v-if="isFull"
        :text="truncatedDescription"
        class="mt-10"
      />
      <p
        v-else
        class="overflow-hidden text-grey-100 typo-paragraph"
      >
        {{ truncatedDescription }}
      </p>
      <div
        v-if="totalCounts && !isFull"
        class="grid grid-cols-auto-1fr items-center gap-24"
      >
        <span
          class="typo-caption"
          :class="{
            'text-success': votesStatus.choice === 'for',
            'text-error': votesStatus.choice === 'against',
            'text-white': votesStatus.choice === 'abstain',
          }"
        >
          {{ capitalize(votesStatus.choice) }}: {{ votesStatus.count }}
        </span>
        <DisplaysStatProgress
          is-minified
          is-rounded
          :version="progressVersion"
          :choice="votesStatus.choice"
          :count="votesStatus.count"
          :ratio="votesStatus.ratio"
        />
      </div>
    </div>
    <UtilsChip :version="status === 'Active' ? 'success' : 'error'">
      {{ status }}
    </UtilsChip>
  </article>
</template>

<script setup lang="ts">
import VMdPreview from '@kangc/v-md-editor/lib/preview'
import githubTheme from '@kangc/v-md-editor/lib/theme/github'
import hljs from 'highlight.js'
import removeMd from 'remove-markdown'
import { capitalize, truncate } from '@/assets/scripts/helpers'

type Props = {
  isFull?: boolean
  uid: string
  discussion: string
  title: string
  creator: string
  status: 'Active' | 'Closed'
  description: string
  votes: {
    for: number
    against: number
    abstain: number
  }
}

type VoteStatus = {
  choice: keyof Props['votes']
  count: Props['votes'][keyof Props['votes']]
  ratio: number
}

VMdPreview.use(githubTheme, {
  Hljs: hljs,
})

const props = withDefaults(defineProps<Props>(), {
  isFull: false,
})

const truncatedDescription = computed<string>(
  () => (
    !props.isFull && props.description.split(' ').length > 25
      ? `${
        removeMd(props.description)
          .replaceAll('\n', ' ')
          .replaceAll(/[ ]+/g, ' ')
          .split(' ')
          .filter((_, i) => i < 25)
          .join(' ')
      }…`
      : props.description
  ),
)

const totalCounts = computed<number>(() => Object.values(props.votes).reduce((accu, curr) => accu + curr, 0))

const votesStatus = computed<VoteStatus>(
  () => Object.entries(props.votes)
    .reduce(
      (accu, [choice, count]) => (count > accu.count ? { choice, count, ratio: totalCounts.value ? count / totalCounts.value : 0 } : accu),
      { choice: 'for', count: props.votes.for, ratio: totalCounts.value ? props.votes.for / totalCounts.value : 0 },
    ) as VoteStatus,
)

const progressVersion = computed(() => {
  switch (votesStatus.value.choice) {
    case 'for':
      return 'success'
    case 'abstain':
      return 'neutral'
    case 'against':
      return 'error'
    default:
      return 'neutral'
  }
})
</script>
