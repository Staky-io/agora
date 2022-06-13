<template>
  <span
    class="grid place-items-center px-24 py-16 rounded-max typo-text-medium"
    :class="{
      'text-white bg-primary bg-opacity-15': version === 'primary',
      'text-primary bg-white bg-opacity-15': version === 'secondary',
      'text-success bg-success bg-opacity-15': version === 'success',
      'text-warning bg-warning bg-opacity-15': version === 'warning',
      'text-error bg-error bg-opacity-15': version === 'error',
      'text-info bg-info bg-opacity-15': version === 'info',
      'text-white bg-white bg-opacity-15': version === 'neutral',
    }"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
type Version =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'neutral'

type Props = {
  version?: Version
}

withDefaults(defineProps<Props>(), {
  version: 'primary',
})
</script>
