<template>
  <span
    class="grid place-items-center rounded-max typo-text-medium"
    :class="{
      // Size
      'px-8 m:px-16 py-4 m:py-8': size === 's',
      'px-16 m:px-24 py-12 m:py-16': size === 'l',

      // Version
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
type Size = 's' | 'l'

type Version =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'neutral'

type Props = {
  size?: Size
  version?: Version
}

withDefaults(defineProps<Props>(), {
  size: 'l',
  version: 'primary',
})
</script>
