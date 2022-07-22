<template>
  <!-- TODO: handle errors UI -->
  <label
    class="grid gap-20"
    :class="{ [$style.hasErrors]: errors && errors.length }"
  >
    <div class="grid gap-10 grid-cols-1fr-auto">
      <h2
        v-if="label"
        class="text-white typo-title-m"
      >
        {{ label }}
      </h2>
      <span
        v-if="tag"
        class="typo-text-regular"
      >
        {{ tag }}
      </span>
    </div>
    <textarea
      v-if="type === 'textarea'"
      v-model="model"
      :class="$style.input"
      class="typo-paragraph"
      :placeholder="placeholder"
      :rows="rows"
      :cols="cols"
    />
    <input
      v-else
      v-model="model"
      :class="$style.input"
      class="typo-paragraph"
      :type="type"
      :placeholder="placeholder"
      :min="min"
      :max="max"
    >
  </label>
</template>

<script setup lang="ts">
import type { ErrorObject } from '@vuelidate/core'

type FormType =
  | 'button'
  | 'checkbox'
  | 'color'
  | 'date'
  | 'datetime-local'
  | 'email'
  | 'file'
  | 'hidden'
  | 'image'
  | 'month'
  | 'number'
  | 'password'
  | 'radio'
  | 'range'
  | 'reset'
  | 'search'
  | 'submit'
  | 'tel'
  | 'text'
  | 'textarea'
  | 'time'
  | 'url'
  | 'week'

type ModelValue = string | number

type Emits = {
  (event: 'update:modelValue', value: ModelValue): void
}

type Props = {
  modelValue?: ModelValue
  label?: string
  tag?: string
  type?: FormType
  placeholder?: string
  errors: ErrorObject[]
  rows?: number
  cols?: number
  min?: number
  max?: number
}

const emit = defineEmits<Emits>()

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  label: null,
  tag: null,
  type: 'text',
  placeholder: null,
  rows: 8,
  cols: null,
  min: null,
  max: null,
})

const model = computed<ModelValue>({
  get() {
    return props.modelValue
  },
  set(value) {
    switch (props.type) {
      case 'number':
        emit('update:modelValue', Number(value))
        break
      default:
        emit('update:modelValue', value)
        break
    }
  },
})
</script>

<style lang="scss" module>
.hasErrors .input {
  @apply border-error hover:border-error active:border-error focus:border-error;
}

.input {
  @apply px-24 py-20 text-white placeholder:text-grey-100 bg-transparent border-1 border-grey-200 rounded-20 transition-border duration-200 hover:border-primary active:border-primary focus:border-primary;
}
</style>
