<template>
  <Container class="grid gap-24 py-32">
    <h1 class="text-white typo-title-m">
      Proposals
    </h1>
    <div class="grid gap-16">
      <CardProposal
        v-for="(proposal, i) in proposals"
        :key="`proposal-${i}`"
        v-bind="proposal"
      />
    </div>
  </Container>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useProposalsStore } from '@/stores/proposals'

const proposalsStore = useProposalsStore()

const { fetchProposals } = proposalsStore
const { proposals } = storeToRefs(proposalsStore)

onMounted(async () => {
  await fetchProposals()
})
</script>
