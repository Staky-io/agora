<template>
  <article class="grid gap-16 m:gap-32 m:grid-cols-1fr-auto justify-between items-start p-24 m:p-32 text-left rounded-30 border-1 border-grey-200 border-opacity-0 hover:border-opacity-100 transition-border duration-200">
    <UtilsChip
      :version="status === 'Active' ? 'success' : 'error'"
      class="justify-self-start m:order-last"
    >
      {{ status }}
    </UtilsChip>
    <div class="grid gap-10 max-w-640">
      <div class="grid gap-10 grid-flow-col items-start justify-start">
        <UtilsJazzicon
          class="flex justify-center items-center"
          :address="creator"
          :diameter="24"
        />
        <div class="mt-1 text-white break-all">
          <component
            :is="isFull ? 'h1' : 'h2'"
            class="inline typo-title-l"
          >
            {{ title }}
          </component>
          {{ ' ' }}
          <span class="text-grey-100 typo-text-semibold">by</span>
          {{ ' ' }}
          <button
            :class="$style.button"
            class="typo-text-medium"
            @click.stop.prevent="copyText(creator)"
          >
            {{ /hx[a-f0-9]{40,40}/.test(creator) ? truncate(creator) : creator }}
            <transition
              name="fade-quick"
              mode="out-in"
            >
              <UtilsIcon
                v-if="!isCopying"
                class="w-16 h-16 text-grey-100"
                name="Copy"
              />
              <UtilsIcon
                v-else
                class="w-16 h-16 text-grey-100"
                name="State/Success"
              />
            </transition>
          </button>
        </div>
      </div>
      <p
        v-if="discussion"
        class="text-grey-100 typo-text-semibold"
      >
        Discussion: <NuxtLink
          :class="$style.button"
          :to="discussion"
          :title="discussion"
          target="_blank"
        >
          {{ truncate({ string: discussion, start: 30, end: 0 }) }}
        </NuxtLink>
      </p>
      <VMdPreview
        v-if="isFull"
        :text="truncatedDescription"
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

const { copyText, isCopying } = useCopyText()

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

<style lang="scss" module>
.button {
  @apply px-6 py-4 text-primary bg-primary bg-opacity-0 rounded-5 transition-background duration-100 hover:bg-opacity-20;
}
</style>
