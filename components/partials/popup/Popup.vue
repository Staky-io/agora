<template>
  <div
    class="fixed top-0 left-0 grid w-screen h-screen z-100 py-10"
    v-on="{ ...!requireButton && { click: closeOnClick } }"
  >
    <Container
      class="grid gap-40"
      :class="{ 'grid-rows-auto-1fr': requireButton }"
    >
      <button
        v-if="requireButton"
        class="justify-self-end"
        @click="closeOnClick"
      >
        Close
      </button>
      <div
        class="grid gap-10 content-start justify-self-center self-center w-full s:w-512 min-h-192 p-20 bg-white rounded-5"
        @click.stop
      >
        <slot name="header" />
        <slot name="body" />
      </div>
    </Container>
  </div>
</template>

<script setup lang="ts">
const { emit, events } = useEventsBus()

defineProps({
  requireButton: {
    type: Boolean,
    default: false,
  },
})

const closeOnClick = (): void => {
  emit(events.POPUP_CLOSE)
}
</script>
