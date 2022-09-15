<template>
  <Container class="grid gap-24 py-32">
    <h1 class="text-white typo-title-m">
      Proposals
    </h1>
    <client-only>
      <UtilsLoader
        v-if="!isAllFetched"
        class="mx-auto my-40"
      />
      <div
        v-else-if="Object.keys(proposals).length"
        class="grid gap-16"
      >
        <nuxt-link
          v-for="([uid, proposal]) in Object.entries(proposals).sort((a, b) => parseInt(b[0], 16) - parseInt(a[0], 16))"
          :key="`proposal-${uid}`"
          :to="{ name: 'proposal-uid', params: { uid } }"
        >
          <DisplaysCardProposal v-bind="proposal" />
        </nuxt-link>
      </div>
      <div
        v-else
        class="px-12 py-8 rounded-5 bg-info bg-opacity-10 text-info typo-paragraph"
      >
        No proposal has been found.
      </div>
    </client-only>
  </Container>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useProposalsStore } from '@/stores/proposals'

const proposalsStore = useProposalsStore()

const { fetchProposals } = proposalsStore
const { isAllFetched, proposals } = storeToRefs(proposalsStore)

onBeforeMount(async () => {
  await fetchProposals()
})
</script>
