<template>
  <Container class="grid gap-40 pt-24 pb-48">
    <nuxt-link
      :to="{ name: 'index' }"
      class="grid gap-6 grid-flow-col items-center justify-self-start text-grey-100 typo-button-s transition-color duration-200 hover:text-white"
    >
      <UtilsIcon
        name="Arrow/Left"
        class="w-20 h-20"
      />
      Back
    </nuxt-link>
    <form
      v-if="!createIsPreviewing"
      class="grid gap-32 l:grid-cols-1fr-auto xl:grid-cols-1fr-auto-1fr items-start"
      @submit.prevent="onSubmit"
    >
      <ControlsFormInput
        v-model="v$.title.$model"
        :errors="v$.title.$errors"
        is-required
        label="Title"
        tag="The title of your proposal"
        placeholder="e.g. Change protocol inflation to 7.4%"
        class="col-start-1 xl:col-start-2"
      />
      <ControlsFormSelect
        v-model="v$.expiration.$model"
        :errors="v$.expiration.$errors"
        class="l:row-start-1 l:col-start-2 xl:col-start-3 l:w-256"
        is-required
        label="Proposal length"
        :options="Object.values(EXPIRATION)"
      />
      <ControlsFormInput
        v-model="v$.description.$model"
        :errors="v$.description.$errors"
        is-required
        is-wysiwyg
        type="textarea"
        label="Description"
        :tag="`${v$.description.$model.length}/${maxDiscussionLength}`"
        placeholder="The description of your proposal"
        :rows="12"
        class="col-start-1 xl:col-start-2"
      />
      <ControlsFormInput
        v-model="v$.discussion.$model"
        :errors="v$.discussion.$errors"
        label="Discussion (optional)"
        tag="The forum link of your proposal"
        placeholder="e.g. https://forum.icon.community/proposal..."
        class="col-start-1 xl:col-start-2"
      />
      <ControlsButtonAction
        version="tertiary"
        is-important
        type="submit"
        class="col-start-1 xl:col-start-2 l:w-576 mt-8"
      >
        Submit
      </ControlsButtonAction>
    </form>
    <DisplaysCardProposal
      v-else
      is-full
      :uid="uid"
      :discussion="formStates.discussion"
      :title="formStates.title || '[Empty title]'"
      :creator="truncatedAddress || '[Unregistered creator]'"
      status="Active"
      :description="formStates.description || '[Empty description]'"
      :votes="{
        for: 0,
        against: 0,
        abstain: 0,
      }"
    />
  </Container>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import useVuelidate from '@vuelidate/core'
import { maxLength, required, url } from '@vuelidate/validators'
import { useUserStore } from '@/stores/user'

enum EXPIRATION {
  THREE_DAYS = '3 days',
  SEVEN_DAYS = '7 days',
  FOURTEEN_DAYS = '14 days',
}

type FormStates = {
  title: string
  description: string
  discussion: string
  expiration: EXPIRATION
}

type FormValidators =
  | ReturnType<typeof maxLength>
  | typeof required
  | typeof url

type FormRules = {
  [key in keyof FormStates]: Record<string, FormValidators>
}

const { emit, events } = useEventsBus()
const createIsPreviewing = useState<boolean>('create-is-previewing', () => false)
const { truncatedAddress } = storeToRefs(useUserStore())

const uid = ref<string>(Date.now().toString(36) + Math.random().toString(36).split('.')[1])
const maxDiscussionLength = ref<number>(14000)

const formStates = reactive<FormStates>({
  title: '',
  description: '',
  discussion: '',
  expiration: EXPIRATION.THREE_DAYS,
})

const v$ = useVuelidate<FormStates, FormRules>({
  title: { required },
  description: { required, maxLength: maxLength(maxDiscussionLength) },
  discussion: { url },
  expiration: { required },
}, formStates)

const onSubmit = async (): Promise<void> => {
  const isValid = await v$.value.$validate()

  if (isValid) {
    emit(events.POPUP_ACTION, { name: 'SubmitProposal', handleGuard: true, params: { ...formStates } })
  }
}

onUnmounted(() => {
  createIsPreviewing.value = false
})
</script>
