<template>
  <component
    :is="to ? NuxtLink : 'button'"
    class="
      relative
      flex
      justify-center
      items-center
      w-40
      h-40
      before:absolute
      before:w-full
      before:h-full
      before:rounded-full
      before:transition-transform
      before:origin-center
      before:duration-400
      before:ease-reveal-xxl
      before:content-['']
      hover:before:scale-112.5
    "
    :class="{
      'text-white before:bg-primary': version === 'primary',
      'text-white border-1 border-primary': version === 'secondary',
      'text-success before:bg-success before:bg-opacity-25': version === 'success',
      'text-warning before:bg-warning before:bg-opacity-25': version === 'warning',
      'text-error before:bg-error before:bg-opacity-25': version === 'error',
      'text-info before:bg-info before:bg-opacity-25': version === 'info',
      'text-white border-1 border-white': version === 'neutral',
    }"
    v-bind="{
      ...$attrs,
      ...Object.entries({
        to,
        target,
        type,
      })
        .filter(([_, value]) => !!value)
        .reduce((accu, [key, value]) => ({ ...accu, ...!!value && { [key]: value } }), {}),
    }"
  >
    <UtilsIcon
      class="relative w-20 h-20"
      :name="name"
    />
  </component>
</template>

<script setup lang="ts">
import type { NuxtLinkProps } from '#app'
import type { IconsNames } from '@/composables/useIconsComponents'

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
  to?: NuxtLinkProps
  target?: '_self' | '_blank' | '_parent' | '_top'
  type?: 'submit' | 'reset' | 'button'
  name: IconsNames
}

withDefaults(defineProps<Props>(), {
  version: 'primary',
})

const { NuxtLink } = useNuxtLink()
</script>
