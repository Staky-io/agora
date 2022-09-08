<template>
  <div
    class="grid gap-12 m:gap-16"
    :class="{ 'grid-cols-1fr-auto items-center': isMinified }"
  >
    <div
      class="grid gap-12 m:gap-16"
      :class="isMinified ? 'order-last' : 'grid-flow-col justify-between items-center'"
    >
      <span
        v-if="!isMinified"
        class="uppercase text-grey-100 typo-text-medium"
      >
        {{ choice }}
      </span>
      <div
        class="typo-text-regular"
        :class="{ 'grid place-items-center': isMinified }"
      >
        <template v-if="!isMinified">
          <span class="text-grey-100">{{ count }}</span>
          {{ ' ' }}
        </template>
        <span
          :class="{
            'text-success': version === 'success',
            'text-warning': version === 'warning',
            'text-error': version === 'error',
            'text-info': version === 'info',
            'text-white': version === 'neutral',
          }"
        >
          {{ percent.toFixed(isRounded ? 0 : 2) }}%
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
  isMinified?: boolean
  isRounded?: boolean
  version: Version
  choice: string
  count: number
  ratio: number
}

const props = withDefaults(defineProps<Props>(), {
  isMinified: false,
  isRounded: false,
})

const percent = computed<number>(() => props.ratio * 100)
</script>

<style lang="scss" module>
.range::before,
.range::after {
  width: calc(v-bind(percent) * 1%);
  @apply absolute content-[""] left-0 top-0 h-full bg-current rounded-inherit;
}
</style>
