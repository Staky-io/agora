<template>
  <label
    class="grid gap-20"
    :class="{
      [$style.hasErrors]: errors && errors.length,
    }"
  >
    <div class="grid gap-10 grid-cols-1fr-auto items-baseline">
      <h2
        v-if="label"
        class="text-white typo-title-m"
      >
        {{ label }}
        <span
          v-if="isRequired"
          class="text-error"
        >
          *
        </span>
      </h2>
      <span
        v-if="tag"
        class="typo-text-regular"
      >
        {{ tag }}
      </span>
    </div>
    <div class="grid gap-6">
      <div class="relative">
        <button
          :class="$style.input"
          class="
            grid
            gap-10
            grid-flow-col
            justify-between
            items-center
            w-full
            px-20
            m:px-24
            py-16
            m:py-20
            text-white
            font-medium
            text-14
            text-left
            border-1
            border-grey-200
            rounded-20
            transition-border
            duration-200
            hover:border-primary
            active:border-primary
            focus:border-primary
          "
          type="button"
          @click="isOpen = !isOpen"
          @blur="onBlur"
        >
          {{ model }}
          <UtilsIcon
            name="Chevron/Left"
            class="w-16 m:w-20 h-16 m:h-20 origin-center transition-transform duration-100"
            :class="{ '-rotate-90': isOpen }"
          />
        </button>
        <div
          class="absolute top-full z-1 grid w-full mt-10 bg-grey-400 rounded-5 shadow-lg overflow-hidden origin-top transition-transform duration-200"
          :class="isOpen ? 'scale-y-100' : 'scale-y-0'"
        >
          <button
            v-for="(option, i) in options"
            :key="`option-${i}`"
            ref="optionButtons"
            type="button"
            class="relative py-6 text-grey-100 font-inter text-14 bg-primary bg-opacity-5 transition-default duration-100 hover:text-primary hover:bg-opacity-20"
            @click="selectOption(option)"
            @blur="isOpen = false"
          >
            {{ option }}
          </button>
        </div>
      </div>
      <span
        v-if="errors && errors.length"
        class="typo-caption text-error"
      >
        {{ errorMessage }}
      </span>
    </div>
  </label>
</template>

<script setup lang="ts">
import { ErrorObject } from '@vuelidate/core'

type ModelValue = string | number

type Emits = {
  (event: 'update:modelValue', value: ModelValue): void
}

type Props = {
  modelValue?: ModelValue
  errors: ErrorObject[]
  isRequired?: boolean
  label?: string
  tag?: string
  options: ModelValue[]
}

const emit = defineEmits<Emits>()

const props = withDefaults(defineProps<Props>(), {
  isRequired: false,
  modelValue: '',
  label: '',
  tag: '',
})

const isOpen = ref<boolean>(false)
const optionButtons = ref<EventTarget[] | null>(null)

const model = computed<ModelValue>({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

const errorMessage = computed<string>(() => {
  if (props.errors && props.errors.length) {
    if (props.errors[0].$validator === 'required') return 'This field is required.'
    if (props.errors[0].$validator === 'url') return 'This field must be a valid URL.'
  }
  return ''
})

const onBlur = ({ relatedTarget }: FocusEvent): void => {
  if (!optionButtons.value.includes(relatedTarget)) isOpen.value = false
}

const selectOption = (option: ModelValue): void => {
  model.value = option
  isOpen.value = false
}
</script>

<style lang="scss" module>
.hasErrors .select {
  @apply border-error hover:border-error active:border-error focus:border-error;
}
</style>
