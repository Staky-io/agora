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
        <DisplaysCardProposal v-bind="currentProposal" />
        <div class="grid gap-20 grid-flow-col auto-cols-fr">
          <DisplaysCardVote
            v-if="isLoggedIn && currentProposal.status === 'Active'"
            title="Cast your vote"
          >
            <div class="grid gap-24">
              <div class="grid gap-12 grid-cols-2">
                <ControlsButtonAction version="success-border">
                  FOR
                </ControlsButtonAction>
                <ControlsButtonAction version="error-border">
                  AGAINST
                </ControlsButtonAction>
                <ControlsButtonAction
                  version="neutral-border"
                  class="col-span-2"
                >
                  ABSTAIN
                </ControlsButtonAction>
              </div>
              <ControlsButtonAction>
                Vote
              </ControlsButtonAction>
            </div>
          </DisplaysCardVote>
          <DisplaysCardVote title="Current result">
            <div class="grid gap-20">
              <DisplaysStatProgress
                version="success"
                :name="currentProposal.name"
                :choice="resultsVotes.for.choice"
                :count="resultsVotes.for.count"
                :ratio="resultsVotes.for.ratio"
              />
              <DisplaysStatProgress
                version="error"
                :name="currentProposal.name"
                :choice="resultsVotes.against.choice"
                :count="resultsVotes.against.count"
                :ratio="resultsVotes.against.ratio"
              />
              <DisplaysStatProgress
                version="neutral"
                :name="currentProposal.name"
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

const { currentProposal } = storeToRefs(useProposalsStore())
const { isLoggedIn } = useUserStore()

type Results = {
  [choice in keyof typeof currentProposal.value.votes]: {
    choice: string
    count: number
    ratio: number
  }
}

const resultsVotes = computed<Results>(() => {
  const totalCounts = Object.values(currentProposal.value.votes).reduce((accu, curr) => accu + curr, 0)
  return Object.entries(currentProposal.value.votes).reduce((accu, [choice, count]) => ({ ...accu, [choice]: { choice, count, ratio: count / totalCounts } }), {}) as Results
})
</script>
