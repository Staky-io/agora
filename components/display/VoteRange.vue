<template>
  <div class="grid gap-16">
    <div class="grid gap-16 grid-flow-col justify-between">
      <span class="uppercase text-grey-100 typo-text-medium">{{ choice }}</span>
      <div>
        <span class="text-grey-100 typo-text-regular">{{ count }}</span>
        {{ ' ' }}
        <span class="uppercase text-white typo-text-semibold">{{ name }}</span>
        {{ ' ' }}
        <span
          class="typo-text-regular"
          :class="{
            'text-success': version === 'success',
            'text-warning': version === 'warning',
            'text-error': version === 'error',
            'text-info': version === 'info',
            'text-white': version === 'neutral',
          }"
        >
          {{ percent.toFixed(2) }}%
        </span>
      </div>
    </div>
    <div
      class="relative w-full h-4 rounded-max bg-opacity-35 after:blur-sm"
      :class="[
        $style.range,
        {
          'text-success bg-success': version === 'success',
          'text-warning bg-warning': version === 'warning',
          'text-error bg-error': version === 'error',
          'text-info bg-info': version === 'info',
          'text-white bg-white': version === 'neutral',
        }
      ]"
    />
  </div>
</template>

<script setup lang="ts">
type Version =
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'neutral'

type Props = {
  version: Version
  name: string
  choice: string
  count: number
  ratio: number
}

const props = defineProps<Props>()

const percent = computed<number>(() => props.ratio * 100)
</script>

<style lang="scss" module>
.range::before,
.range::after {
  width: calc(v-bind(percent) * 1%);
  @apply absolute content-[""] left-0 top-0 h-full bg-current rounded-inherit;
}
</style>
