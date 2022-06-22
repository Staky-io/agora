<template>
  <PartialsPopup
    size="s"
    require-button
  >
    <template #header>
      Log out
    </template>
    <template #body>
      <div class="grid gap-10">
        <ControlsButtonAction
          version="secondary"
          :copied-text="address"
        >
          {{ truncatedAddress }}
          <UtilsIcon
            class="w-20 h-20 text-grey-100"
            name="Copy"
          />
        </ControlsButtonAction>
        <ControlsButtonAction
          version="error-bg"
          @click="logoutOnClick"
        >
          Log out
        </ControlsButtonAction>
      </div>
    </template>
  </PartialsPopup>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const { address, truncatedAddress } = storeToRefs(userStore)
const { logoutUser } = userStore
const { emit, events } = useEventsBus()

const logoutOnClick = (): void => {
  logoutUser()
  emit(events.POPUP_CLOSE)
}
</script>
