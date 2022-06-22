<template>
  <Container class="grid gap-24 py-32">
    <h1 class="text-white typo-title-m">
      Proposals
    </h1>
    <client-only>
      <div
        v-if="proposals.length"
        class="grid gap-16"
      >
        <nuxt-link
          v-for="(proposal, i) in proposals"
          :key="`proposal-${i}`"
          :to="{ name: 'proposal-uid', params: { uid: proposal.uid } }"
        >
          <DisplaysCardProposal v-bind="proposal" />
        </nuxt-link>
      </div>
    </client-only>
  </Container>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useProposalsStore } from '@/stores/proposals'

const { proposals } = storeToRefs(useProposalsStore())
</script>
