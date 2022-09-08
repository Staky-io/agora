<template>
  <label
    class="grid gap-16 m:gap-20"
    :class="{
      [$style.hasErrors]: errors && errors.length,
      'hasErrors': errors && errors.length,
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
      <VMdEditor
        v-if="isWysiwyg"
        ref="editor"
        v-model="model"
        left-toolbar="h bold italic strikethrough quote | ul ol table hr | link customImage code"
        right-toolbar="preview sync-scroll"
        :toolbar="toolbar"
        mode="edit"
        height="300px"
      />
      <textarea
        v-else-if="type === 'textarea'"
        v-model="model"
        :class="$style.input"
        :placeholder="placeholder"
        :rows="rows"
        :cols="cols"
      />
      <input
        v-else
        v-model="model"
        :class="$style.input"
        :type="type"
        :placeholder="placeholder"
        :min="min"
        :max="max"
      >
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
import type { ErrorObject } from '@vuelidate/core'
import VMdEditor from '@kangc/v-md-editor'
import githubTheme from '@kangc/v-md-editor/lib/theme/github'
import enUS from '@kangc/v-md-editor/lib/lang/en-US'
import hljs from 'highlight.js'

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
  errors: ErrorObject[]
  isRequired?: boolean
  label?: string
  tag?: string
  type?: FormType
  placeholder?: string
  isWysiwyg?: boolean
  rows?: number
  cols?: number
  min?: number
  max?: number
}

type ToolbarCustom = {
  [key in string]: {
    title: string
    icon: string
    action: (editor: {
      insert: (selected: unknown) => void
    }) => void
  }
}

VMdEditor.lang.use('en-US', enUS)

VMdEditor.use(githubTheme, {
  Hljs: hljs,
})

const emit = defineEmits<Emits>()

const props = withDefaults(defineProps<Props>(), {
  isRequired: false,
  modelValue: '',
  label: '',
  tag: '',
  type: 'text',
  placeholder: '',
  isWysiwyg: false,
  rows: 8,
  cols: null,
  min: null,
  max: null,
})

const toolbar = reactive<ToolbarCustom>({
  customImage: {
    title: 'Insert image',
    icon: 'v-md-icon-img',
    action(editor) {
      editor.insert((selected: unknown) => {
        const prefix = '![Description]('
        const suffix = ')'
        const placeholder = 'http://'
        const content = selected || placeholder

        return {
          text: `${prefix}${content}${suffix}`,
          selected: content,
        }
      })
    },
  },
})
const editor = ref<InstanceType<typeof VMdEditor> | null>(null)

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

const errorMessage = computed<string>(() => {
  if (props.errors && props.errors.length) {
    if (props.errors[0].$validator === 'maxLength') return 'This field is too long.'
    if (props.errors[0].$validator === 'required') return 'This field is required.'
    if (props.errors[0].$validator === 'url') return 'This field must be a valid URL.'
  }
  return ''
})

const focusEditor = (): void => {
  editor.value.$el.classList.add('focus')
}

const blurEditor = (): void => {
  editor.value.$el.classList.remove('focus')
}

onMounted(() => {
  nextTick(() => {
    if (editor.value) {
      const textarea: HTMLTextAreaElement = editor.value?.$el.querySelector('textarea')
      if (textarea) {
        textarea.placeholder = props.placeholder
        textarea.addEventListener('focus', focusEditor)
        textarea.addEventListener('blur', blurEditor)
      }
    }
  })
})

onUnmounted(() => {
  if (editor.value) {
    const textarea: HTMLTextAreaElement = editor.value?.$el.querySelector('textarea')
    if (textarea) {
      textarea.removeEventListener('focus', focusEditor)
      textarea.removeEventListener('blur', blurEditor)
    }
  }
})
</script>

<style lang="scss" module>
.hasErrors .input {
  @apply border-error hover:border-error active:border-error focus:border-error;
}

.input {
  @apply px-20 m:px-24 py-16 m:py-20 text-white font-medium text-14 placeholder:text-grey-100 bg-transparent border-1 border-grey-200 rounded-20 transition-border duration-200 hover:border-primary active:border-primary focus:border-primary;
}
</style>

<style lang="scss">
#__nuxt .hasErrors .v-md-editor.v-md-editor--edit {
  @apply border-error hover:border-error active:border-error focus:border-error;
}
</style>
