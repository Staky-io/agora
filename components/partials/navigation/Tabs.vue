<template>
  <div
    ref="root"
    :class="$style.container"
    class="
      relative
      grid
      gap-20
      grid-flow-col
      items-center
      justify-center
      pb-6
      after:content-['']
      after:absolute
      after:bottom-0
      after:w-full
      after:h-1
      after:bg-primary
      after:transition-transform
      after:duration-200
      after:origin-left
    "
  >
    <button
      v-for="(tab, i) in tabs"
      :key="`tab-${i}`"
      ref="tabsButtons"
      class="text-white typo-button-s transition-color duration-100"
      :class="{ 'text-opacity-30': i !== activeIndex }"
      @click="emit('update', i)"
      @mouseenter="underlineButton(i)"
      @mouseleave="underlineButton(activeIndex)"
    >
      {{ tab }}
    </button>
  </div>
</template>

<script setup lang="ts">
type Emits = {
  (event: 'update', index: number): void
}

type Props = {
  activeIndex: number
  tabs: string[]
}

const emit = defineEmits<Emits>()

const props = withDefaults(defineProps<Props>(), {
  activeIndex: 0,
})

const root = ref<HTMLElement | null>(null)
const tabsButtons = ref<(HTMLElement | null)[]>(null)
const rootData = reactive<{ width: number, left: number }>({ width: 0, left: 0 })
const underlineTransform = reactive<{ translate: number, scale: number }>({ translate: 0, scale: 0 })

const onResize = (): void => {
  const { width, left } = root.value.getBoundingClientRect()
  rootData.width = width
  rootData.left = left
}

const underlineButton = (index: number): void => {
  const { width, left } = tabsButtons.value[index].getBoundingClientRect()
  underlineTransform.translate = left - rootData.left
  underlineTransform.scale = width / rootData.width
}

onMounted(() => {
  window.addEventListener('resize', onResize)
  onResize()

  watch(() => props.activeIndex, underlineButton, { immediate: true })
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
})
</script>

<style lang="scss" module>
.container::after {
  transform: translateX(calc(v-bind("underlineTransform.translate") * 1px)) scaleX(v-bind("underlineTransform.scale"));
}
</style>
