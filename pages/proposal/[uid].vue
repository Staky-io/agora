<template>
  <Container class="grid gap-40 py-24">
    <nuxt-link
      :to="{ name: 'index' }"
      class="grid gap-6 grid-flow-col items-center justify-self-start text-grey-100 typo-button-s transition-color duration-200 hover:text-white"
    >
      <UtilsIcon
        name="Arrow/Left"
        class="w-20 h-20"
      />
      Back
    </nuxt-link>
    <client-only>
      <div
        v-if="currentProposal"
        class="grid gap-12"
      >
        <DisplaysCardProposal
          is-full
          v-bind="currentProposal"
        />
        <div class="grid gap-20 grid-flow-col auto-cols-fr">
          <DisplaysCardVote
            v-if="isLoggedIn && currentProposal.status === 'Active'"
            title="Cast your vote"
          >
            <div class="grid gap-24">
              <div class="grid gap-12 grid-cols-2">
                <ControlsButtonAction
                  version="success-border"
                  :is-active="currentVote === 'for'"
                  @click="currentVote = 'for'"
                >
                  FOR
                </ControlsButtonAction>
                <ControlsButtonAction
                  version="error-border"
                  :is-active="currentVote === 'against'"
                  @click="currentVote = 'against'"
                >
                  AGAINST
                </ControlsButtonAction>
                <ControlsButtonAction
                  version="neutral-border"
                  class="col-span-2"
                  :is-active="currentVote === 'abstain'"
                  @click="currentVote = 'abstain'"
                >
                  ABSTAIN
                </ControlsButtonAction>
              </div>
              <ControlsButtonAction @click="onVote">
                Vote
              </ControlsButtonAction>
            </div>
          </DisplaysCardVote>
          <DisplaysCardVote
            title="Current result"
            :subtitle="currentProposal.name"
          >
            <div class="grid gap-20">
              <DisplaysStatProgress
                version="success"
                :choice="resultsVotes.for.choice"
                :count="resultsVotes.for.count"
                :ratio="resultsVotes.for.ratio"
              />
              <DisplaysStatProgress
                version="error"
                :choice="resultsVotes.against.choice"
                :count="resultsVotes.against.count"
                :ratio="resultsVotes.against.ratio"
              />
              <DisplaysStatProgress
                version="neutral"
                :choice="resultsVotes.abstain.choice"
                :count="resultsVotes.abstain.count"
                :ratio="resultsVotes.abstain.ratio"
              />
            </div>
          </DisplaysCardVote>
        </div>
      </div>
    </client-only>
  </Container>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useProposalsStore } from '@/stores/proposals'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const uid = route?.params?.uid

const proposalsStore = useProposalsStore()
const { fetchProposal } = proposalsStore
const { currentProposal } = storeToRefs(proposalsStore)
const { isLoggedIn } = useUserStore()
const { emit, events } = useEventsBus()

type VoteChoice = keyof typeof currentProposal.value.votes

type Results = {
  [choice in VoteChoice]: {
    choice: string
    count: number
    ratio: number
  }
}

const currentVote = ref<VoteChoice>(null)

const resultsVotes = computed<Results>(() => {
  const totalCounts = Object.values(currentProposal.value.votes).reduce((accu, curr) => accu + curr, 0)
  return Object.entries(currentProposal.value.votes).reduce((accu, [choice, count]) => ({ ...accu, [choice]: { choice, count, ratio: totalCounts ? count / totalCounts : 0 } }), {}) as Results
})

const onVote = async (): Promise<void> => {
  if (typeof uid === 'string' && currentVote.value) {
    emit(events.POPUP_ACTION, { name: 'SubmitVote', handleGuard: true, params: { uid, vote: currentVote.value } })
  }
}

onBeforeMount(async () => {
  if (typeof uid === 'string') {
    try {
      await fetchProposal(uid)
    } catch (error) {
      navigateTo('/')
    }
  }
})
</script>
