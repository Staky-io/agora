<template>
  <component
    :is="to ? NuxtLink : 'button'"
    class="
      relative
      px-24
      rounded-max
      whitespace-nowrap
      select-none
      border-1
      transition
      duration-200
      before:absolute
      before:left-0
      before:top-0
      before:w-full
      before:h-full
      before:rounded-inherit
      before:origin-center
      before:transition
      before:duration-200
    "
    :class="[
      isImportant ? 'h-60 typo-button-l' : 'h-40 typo-button-s',
      isLocked ? {
        'text-grey-100 border-grey-200 cursor-not-allowed': ['success-border', 'warning-border', 'error-border', 'info-border', 'neutral-border'].includes(version),
      } : (!isActive ? {
        'text-white bg-grey-200 border-primary border-opacity-0 hover:border-opacity-100 active:bg-primary': version === 'primary',
        'text-white border-grey-200 hover:border-primary active:border-primary active:bg-primary': version === 'secondary',
        'text-white border-0 before:content-[\'\'] before:bg-grey-200 hover:before:bg-primary active:before:bg-primary active:before:scale-112.5 active:before:ease-reveal-xxl': version === 'tertiary',

        'text-success bg-success bg-opacity-25 border-success border-opacity-0 hover:border-opacity-100 active:border-opacity-100 active:bg-opacity-50': version === 'success-bg',
        'text-warning bg-warning bg-opacity-25 border-warning border-opacity-0 hover:border-opacity-100 active:border-opacity-100 active:bg-opacity-50': version === 'warning-bg',
        'text-error bg-error bg-opacity-25 border-error border-opacity-0 hover:border-opacity-100 active:border-opacity-100 active:bg-opacity-50': version === 'error-bg',
        'text-info bg-info bg-opacity-25 border-info border-opacity-0 hover:border-opacity-100 active:border-opacity-100 active:bg-opacity-50': version === 'info-bg',
        'text-white bg-white bg-opacity-25 border-white border-opacity-0 hover:border-opacity-100 active:border-opacity-100 active:bg-opacity-50': version === 'neutral-bg',

        'text-success bg-success bg-opacity-0 border-grey-200 hover:border-success active:bg-opacity-100 active:bg-success active:border-success active:text-white': version === 'success-border',
        'text-warning bg-warning bg-opacity-0 border-grey-200 hover:border-warning active:bg-opacity-100 active:bg-warning active:border-warning active:text-white': version === 'warning-border',
        'text-error bg-error bg-opacity-0 border-grey-200 hover:border-error active:bg-opacity-100 active:bg-error active:border-error active:text-white': version === 'error-border',
        'text-info bg-info bg-opacity-0 border-grey-200 hover:border-info active:bg-opacity-100 active:bg-info active:border-info active:text-white': version === 'info-border',
        'text-white bg-white bg-opacity-0 border-grey-200 hover:border-white active:bg-opacity-100 active:bg-white active:border-white active:text-grey-400': version === 'neutral-border',
      } : {
        'bg-primary': version === 'primary',
        'border-primary bg-primary': version === 'secondary',
        'before:bg-primary before:scale-112.5 before:ease-reveal-xxl': version === 'tertiary',

        'border-opacity-100 bg-opacity-50': ['success-bg', 'warning-bg', 'error-bg', 'info-bg', 'neutral-bg'].includes(version),

        'bg-opacity-100 bg-success border-success text-white': version === 'success-border',
        'bg-opacity-100 bg-warning border-warning text-white': version === 'warning-border',
        'bg-opacity-100 bg-error border-error text-white': version === 'error-border',
        'bg-opacity-100 bg-info border-info text-white': version === 'info-border',
        'bg-opacity-100 bg-white border-white text-grey-400': version === 'neutral-border',
      })
    ]"
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
    @click="onClick"
  >
    <div class="relative grid gap-10 grid-flow-col place-content-center place-items-center">
      <slot />
      <template v-if="copiedText">
        <transition
          name="fade-quick"
          mode="out-in"
        >
          <UtilsIcon
            v-if="!isCopying"
            class="w-20 h-20"
            :class="{
              'text-grey-100': version === 'primary'
            }"
            name="Copy"
          />
          <UtilsIcon
            v-else
            class="w-20 h-20"
            :class="{
              'text-grey-100': version === 'primary'
            }"
            name="State/Success"
          />
        </transition>
      </template>
    </div>
  </component>
</template>

<script setup lang="ts">
import type { NuxtLinkProps } from '#app'

type Version =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'success-bg'
  | 'warning-bg'
  | 'error-bg'
  | 'info-bg'
  | 'neutral-bg'
  | 'success-border'
  | 'warning-border'
  | 'error-border'
  | 'info-border'
  | 'neutral-border'

type Props = {
  version?: Version
  to?: NuxtLinkProps
  target?: '_self' | '_blank' | '_parent' | '_top'
  type?: 'submit' | 'reset' | 'button'
  isActive?: boolean
  isImportant?: boolean
  isLocked?: boolean
  copiedText?: string
}

const props = withDefaults(defineProps<Props>(), {
  version: 'primary',
  to: null,
  target: null,
  type: null,
  isActive: false,
  isImportant: false,
  isLocked: false,
  copiedText: '',
})

const { copyText } = useCopyText()
const { NuxtLink } = useNuxtLink()

const isCopying = ref<boolean>(false)
const copyTimeout = ref<NodeJS.Timeout>(null)

const onClick = (): void => {
  if (props.copiedText) {
    clearTimeout(copyTimeout.value)
    copyText(props.copiedText)
    isCopying.value = true
    copyTimeout.value = setTimeout(() => {
      isCopying.value = false
    }, 1000)
  }
}
</script>
