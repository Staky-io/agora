<template>
  <PartialsNavigationHeader />
  <NuxtPage />
  <transition name="fade">
    <UtilsOverlay v-if="!!currentPopup.component" />
  </transition>
  <transition name="popup-bounce">
    <component
      :is="currentPopup.component"
      v-if="!!currentPopup.component"
      v-bind="currentPopup.params"
      v-on="currentPopup.events"
    />
  </transition>
  <UtilsToastNotification
    v-for="(notification, i) in notifications"
    :key="`notification-${i}`"
    v-bind="notification"
  />
</template>

<script setup lang="ts">
import type { NotificationProps } from '@/composables/useToastNotification'
import { useDeviceStore } from '@/stores/device'
import BrowserDetector from '@/assets/scripts/detectors/BrowserDetector.class'
import DeviceDetector from '@/assets/scripts/detectors/DeviceDetector.class'

const notifications = useState<NotificationProps[]>('notifications')

const { setBrowser, setDevice } = useDeviceStore()
const { bus, events } = useEventsBus()
const { listenIconex } = useIconexListener()
const {
  currentPopup,
  POPUP_CLOSE_CURRENT,
  POPUP_HANDLE_GUARD,
  POPUP_CALL_ACTION,
} = usePopupMethods()

watch(() => bus.value.get(events.POPUP_CLOSE), POPUP_CLOSE_CURRENT)
watch(() => bus.value.get(events.POPUP_GUARD), POPUP_HANDLE_GUARD)
watch(() => bus.value.get(events.POPUP_ACTION), POPUP_CALL_ACTION)

onBeforeMount(() => {
  const { browser } = new BrowserDetector()
  const checks = new DeviceDetector()
  setBrowser(browser.toLowerCase())
  setDevice(checks)
  listenIconex()
})
</script>
