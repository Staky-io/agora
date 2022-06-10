<template>
  <component
    :is="to ? 'NuxtLink' : 'button'"
    class="grid gap-10 grid-flow-col place-content-center place-items-center px-24 rounded-max whitespace-nowrap select-none border-1 transition duration-200"
    :class="[
      isImportant ? 'h-60 typo-button-l' : 'h-40 typo-button-s',
      {
        'text-white bg-grey-200 border-primary border-opacity-0 hover:border-opacity-100 active:bg-primary': version === 'primary',
        'text-white border-grey-200 hover:border-primary active:border-primary active:bg-primary': version === 'secondary',
        'text-success bg-success bg-opacity-25 border-success border-opacity-0 hover:border-opacity-100 active:border-opacity-100 active:bg-opacity-50': version === 'success-bg',
        'text-warning bg-warning bg-opacity-25 border-warning border-opacity-0 hover:border-opacity-100 active:border-opacity-100 active:bg-opacity-50': version === 'warning-bg',
        'text-error bg-error bg-opacity-25 border-error border-opacity-0 hover:border-opacity-100 active:border-opacity-100 active:bg-opacity-50': version === 'error-bg',
        'text-info bg-info bg-opacity-25 border-info border-opacity-0 hover:border-opacity-100 active:border-opacity-100 active:bg-opacity-50': version === 'info-bg',
        'text-success bg-success bg-opacity-0 border-grey-200 hover:border-success active:bg-opacity-100 active:bg-success active:text-white': version === 'success-border',
        'text-warning bg-warning bg-opacity-0 border-grey-200 hover:border-warning active:bg-opacity-100 active:bg-warning active:text-white': version === 'warning-border',
        'text-error bg-error bg-opacity-0 border-grey-200 hover:border-error active:bg-opacity-100 active:bg-error active:text-white': version === 'error-border',
        'text-info bg-info bg-opacity-0 border-grey-200 hover:border-info active:bg-opacity-100 active:bg-info active:text-white': version === 'info-border',
        'text-white bg-white bg-opacity-0 border-grey-200 hover:border-white active:bg-opacity-100 active:bg-white active:text-grey-400': version === 'neutral',
      }
    ]"
    v-bind="{
      ...$attrs,
      ...Object.entries({
        to,
        target,
        type,
      })
        .reduce((accu, [key, value]) => ({ ...accu, ...!!value && { [key]: value } }), {}),
    }"
    @click="onClick"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
type Version =
  | 'primary'
  | 'secondary'
  | 'success-bg'
  | 'warning-bg'
  | 'error-bg'
  | 'info-bg'
  | 'success-border'
  | 'warning-border'
  | 'error-border'
  | 'info-border'
  | 'neutral'

type LinkTo =
  | string
  | (
    & {
      query?: Record<string | number, string | number | null | undefined | undefined[]>
      hash?: string
    }
    & (
      | {
        path: string
        name?: never
        params?: never
      }
      | {
        path?: never
        name: string | symbol
        params?: Record<string, string | number | null | undefined | (string | number)[]>
      }
    )
  )

type Props = {
  version?: Version
  to?: LinkTo
  target?: '_self' | '_blank' | '_parent' | '_top'
  type?: 'submit' | 'reset' | 'button'
  isImportant?: boolean
  copiedText?: string
}

const props = withDefaults(defineProps<Props>(), {
  version: 'primary',
  to: null,
  target: null,
  type: null,
  isImportant: false,
  copiedText: '',
})

const { copyText } = useCopyText()

const onClick = (): void => {
  if (props.copiedText) {
    copyText(props.copiedText)
  }
}
</script>
