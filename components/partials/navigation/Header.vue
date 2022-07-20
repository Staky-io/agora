<template>
  <header class="sticky top-0 py-10 bg-white shadow">
    <Container class="grid gap-20 grid-flow-col items-center justify-between">
      Header
      <div class="grid gap-10 grid-flow-col items-center">
        <span v-if="isLoggedIn && address">{{ address }}</span>
        <button @click="emit(events.POPUP_GUARD)">
          {{ !isLoggedIn ? 'Log in' : 'Log out' }}
        </button>
      </div>
    </Container>
  </header>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'

const { isLoggedIn, address } = storeToRefs(useUserStore())
const { emit, events } = useEventsBus()
</script>
