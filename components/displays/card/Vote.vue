<template>
  <div class="grid gap-16 content-start p-32 bg-grey-300 rounded-30">
    <div
      v-if="title || subtitle"
      class="grid grid-flow-col justify-between items-baseline gap-10"
    >
      <h3
        v-if="title"
        class="text-white typo-title-s"
      >
        {{ title }}
      </h3>
      <h4
        v-if="subtitle"
        class="text-white typo-text-regular"
      >
        {{ subtitle }}
      </h4>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
type Props = {
  title?: string
  subtitle?: string
}

defineProps<Props>()
</script>
