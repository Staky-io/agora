<template>
  <Container class="grid gap-40 py-24">
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
      class="grid gap-40 w-full max-w-576 mx-auto"
      @submit.prevent
    >
      <div class="grid gap-32">
        <ControlsFormInput
          v-model="v$.title.$model"
          :errors="v$.title.$errors"
          label="Title"
          tag="The title of your proposal"
          placeholder="e.g. Change protocol inflation to 7.4%"
        />
        <ControlsFormInput
          v-model="v$.description.$model"
          :errors="v$.description.$errors"
          type="textarea"
          label="Description (optional)"
          tag="0/14,000"
          placeholder="The description of your proposal"
          :rows="12"
        />
        <ControlsFormInput
          v-model="v$.discussion.$model"
          :errors="v$.discussion.$errors"
          label="Discussion (optional)"
          tag="The forum link of your proposal"
          placeholder="e.g. https://forum.icon.community/proposal..."
        />
      </div>
      <ControlsButtonAction
        version="tertiary"
        is-important
        type="submit"
      >
        Submit
      </ControlsButtonAction>
    </form>
    <DisplaysCardProposal
      v-else
      :uid="uid"
      name="???"
      :title="formStates.title || '[Empty title]'"
      :author="truncatedAddress || '[Unregistered author]'"
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
import { required, url } from '@vuelidate/validators'
import { useUserStore } from '@/stores/user'

type FormStates = {
  title: string
  description: string
  discussion: string
}

type FormValidators =
  | typeof required
  | typeof url

type FormRules = {
  [key in keyof FormStates]: Record<string, FormValidators>
}

const createIsPreviewing = useState<boolean>('create-is-previewing', () => false)

const { address, truncatedAddress } = storeToRefs(useUserStore())

const uid = ref<string>(Date.now().toString(36) + Math.random().toString(36).split('.')[1])

const formStates = reactive<FormStates>({
  title: null,
  description: null,
  discussion: null,
})

const v$ = useVuelidate<FormStates, FormRules>({
  title: { required },
  description: {},
  discussion: { url },
}, formStates)
</script>
