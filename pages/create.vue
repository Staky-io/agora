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
      class="grid gap-32 grid-cols-1fr-auto-1fr items-start before:content-['']"
      @submit.prevent="onSubmit"
    >
      <div class="grid gap-40 w-576">
        <div class="grid gap-32">
          <ControlsFormInput
            v-model="v$.title.$model"
            :errors="v$.title.$errors"
            is-required
            label="Title"
            tag="The title of your proposal"
            placeholder="e.g. Change protocol inflation to 7.4%"
          />
          <ControlsFormInput
            v-model="v$.description.$model"
            :errors="v$.description.$errors"
            is-wysiwyg
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
      </div>
      <ControlsFormSelect
        v-model="v$.expiration.$model"
        :errors="v$.expiration.$errors"
        class="w-256"
        is-required
        label="Expiration duration"
        :options="Object.values(EXPIRATION)"
      />
    </form>
    <DisplaysCardProposal
      v-else
      is-full
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
// eslint-disable-next-line import/no-unresolved
import { create } from 'ipfs-http-client'
import { storeToRefs } from 'pinia'
import useVuelidate from '@vuelidate/core'
import { required, url } from '@vuelidate/validators'
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
  | typeof required
  | typeof url

type FormRules = {
  [key in keyof FormStates]: Record<string, FormValidators>
}

const createIsPreviewing = useState<boolean>('create-is-previewing', () => false)

const { truncatedAddress } = storeToRefs(useUserStore())

const uid = ref<string>(Date.now().toString(36) + Math.random().toString(36).split('.')[1])

const formStates = reactive<FormStates>({
  title: '',
  description: '',
  discussion: '',
  expiration: EXPIRATION.THREE_DAYS,
})

const v$ = useVuelidate<FormStates, FormRules>({
  title: { required },
  description: {},
  discussion: { url },
  expiration: { required },
}, formStates)

const onSubmit = async (): Promise<void> => {
  const isValid = await v$.value.$validate()

  if (isValid) {
    const states = { ...formStates, expiration: 0 }

    switch (formStates.expiration) {
      case EXPIRATION.THREE_DAYS:
        states.expiration = (new Date(Date.now()).getTime() + 1000 * 60 * 60 * 24 * 3) * 1000
        break
      case EXPIRATION.SEVEN_DAYS:
        states.expiration = (new Date(Date.now()).getTime() + 1000 * 60 * 60 * 24 * 7) * 1000
        break
      case EXPIRATION.FOURTEEN_DAYS:
        states.expiration = (new Date(Date.now()).getTime() + 1000 * 60 * 60 * 24 * 14) * 1000
        break
      default:
        states.expiration = (new Date(Date.now()).getTime() + 1000 * 60 * 60 * 24 * 14) * 1000
        break
    }

    try {
      const data = JSON.stringify(states)
      const client = create({ url: 'https://ipfs.infura.io:5001/api/v0' })
      const added = await client.add(data)

      console.log({ data, added })
    } catch (error) {
      console.error(error)
    } finally {
      console.log('Upload ended!')
    }
  }
}

onUnmounted(() => {
  createIsPreviewing.value = false
})
</script>
