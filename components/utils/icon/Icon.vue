<template>
  <component
    :is="icon"
    class="text-current inline-block transition-all duration-200"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
const icons = {
  MathMinus: markRaw(defineAsyncComponent(() => import('./set/Math/Minus.vue'))),
  MathPlus: markRaw(defineAsyncComponent(() => import('./set/Math/Plus.vue'))),
}

type IconsNames = keyof typeof icons
type IconsComponents = typeof icons[IconsNames]

const props = defineProps<{
  name: IconsNames
}>()

const icon = computed<IconsComponents>(() => icons[props.name])
</script>
