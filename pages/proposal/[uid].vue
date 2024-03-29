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
          @setClosable="isClosable = true"
        />
        <div class="grid gap-20 l:grid-flow-col auto-cols-fr">
          <DisplaysCardVote
            v-if="isLoggedIn && currentProposal.status === 'Active'"
            :title="isClosable ? 'Proposal expired' : 'Cast your vote'"
          >
            <div
              v-if="isClosable"
              class="grid gap-24"
            >
              <p class="typo-paragraph">
                The proposal vote delay is now expired. You can close the proposal.
              </p>
              <ControlsButtonAction @click="onClose">
                Close the proposal
              </ControlsButtonAction>
            </div>
            <div
              v-else
              class="grid gap-24"
            >
              <div class="grid gap-12 grid-cols-2">
                <ControlsButtonAction
                  version="success-border"
                  :is-active="[currentVote, userVote].includes('for')"
                  :is-locked="!!userVote && userVote !== 'for'"
                  @click="currentVote = userVote ? null : 'for'"
                >
                  FOR
                </ControlsButtonAction>
                <ControlsButtonAction
                  version="error-border"
                  :is-active="[currentVote, userVote].includes('against')"
                  :is-locked="!!userVote && userVote !== 'against'"
                  @click="currentVote = userVote ? null : 'against'"
                >
                  AGAINST
                </ControlsButtonAction>
                <ControlsButtonAction
                  version="neutral-border"
                  class="col-span-2"
                  :is-active="[currentVote, userVote].includes('abstain')"
                  :is-locked="!!userVote && userVote !== 'abstain'"
                  @click="currentVote = userVote ? null : 'abstain'"
                >
                  ABSTAIN
                </ControlsButtonAction>
              </div>
              <ControlsButtonAction
                v-if="!userVote"
                @click="onVote"
              >
                Vote
              </ControlsButtonAction>
              <div
                v-else
                class="typo-button-s text-center"
              >
                Thanks for your vote!
                <UtilsIcon
                  name="State/Success"
                  class="w-20 h-20"
                />
              </div>
              <div
                v-if="currentProposal.creator === address"
                class="grid border-t-1 border-grey-200 mt-8 pt-32"
              >
                <ControlsButtonAction
                  version="secondary"
                  @click="onCancel"
                >
                  Cancel the proposal
                </ControlsButtonAction>
              </div>
            </div>
          </DisplaysCardVote>
          <DisplaysCardVote title="Current results">
            <div class="grid gap-16 m:gap-20">
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
const usersStore = useUserStore()
const { fetchProposal } = proposalsStore
const { currentProposal, userVotes } = storeToRefs(proposalsStore)
const { isLoggedIn, address } = storeToRefs(usersStore)
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
const isClosable = ref<boolean>(false)

const userVote = computed<VoteChoice>(() => (typeof uid === 'string' ? userVotes.value[uid] : null))

const resultsVotes = computed<Results>(() => {
  const totalCounts = Object.values(currentProposal.value.votes).reduce((accu, curr) => accu + curr, 0)
  return Object.entries(currentProposal.value.votes).reduce((accu, [choice, count]) => ({ ...accu, [choice]: { choice, count, ratio: totalCounts ? count / totalCounts : 0 } }), {}) as Results
})

const onClose = async (): Promise<void> => {
  if (typeof uid === 'string') {
    emit(events.POPUP_ACTION, { name: 'CloseProposal', handleGuard: true, params: { uid } })
  }
}

const onCancel = async (): Promise<void> => {
  if (typeof uid === 'string') {
    emit(events.POPUP_ACTION, { name: 'CancelProposal', handleGuard: true, params: { uid } })
  }
}

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
