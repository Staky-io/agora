<template>
  <div class="grid gap-16 content-start p-32 bg-grey-300 rounded-30">
    <h3
      v-if="title"
      class="text-white typo-title-s"
    >
      {{ title }}
    </h3>
    <slot />
  </div>
</template>

<script setup lang="ts">
type Props = {
  title?: string
}

defineProps<Props>()
</script>
