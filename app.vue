<template>
  <UtilsNotificationBanner
    v-if="notificationsBanner"
    v-bind="notificationsBanner"
  />
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
  <UtilsNotificationToast
    v-for="(notificationToast, i) in notificationsToast"
    :key="`notificationToast-${i}`"
    v-bind="notificationToast"
  />
</template>

<script setup lang="ts">
import type { NotificationBannerProps } from '@/composables/useNotificationBanner'
import type { NotificationToastProps } from '@/composables/useNotificationToast'
import { useDeviceStore } from '@/stores/device'
import { useImagesStore } from '@/stores/images'
import { useProposalsStore } from '@/stores/proposals'
import BrowserDetector from '@/assets/scripts/detectors/BrowserDetector.class'
import DeviceDetector from '@/assets/scripts/detectors/DeviceDetector.class'

type IPFSQuery = {
  image: string
}

const { logoHash } = useRuntimeConfig()

const [
  { data: dataLogo },
] = await Promise.all([
  useAsyncData<IPFSQuery>('logo', () => $fetch(`https://craft-network.mypinata.cloud/ipfs/${logoHash}`)),
])

const { setBrowser, setDevice } = useDeviceStore()
const { setImage } = useImagesStore()
const { fetchProposals } = useProposalsStore()
const { bus, events } = useEventsBus()
const { listenIconex } = useIconexListener()
const {
  currentPopup,
  POPUP_CLOSE_CURRENT,
  POPUP_HANDLE_GUARD,
  POPUP_CALL_ACTION,
} = usePopupMethods()

const notificationsBanner = useState<NotificationBannerProps>('notifications-banner', () => null)
const notificationsToast = useState<NotificationToastProps[]>('notifications-toast', () => [])

setImage('logo', dataLogo.value.image)

watch(() => bus.value.get(events.POPUP_CLOSE), POPUP_CLOSE_CURRENT)
watch(() => bus.value.get(events.POPUP_GUARD), POPUP_HANDLE_GUARD)
watch(() => bus.value.get(events.POPUP_ACTION), POPUP_CALL_ACTION)

onBeforeMount(async () => {
  const { browser } = new BrowserDetector()
  const checks = new DeviceDetector()
  setBrowser(browser.toLowerCase())
  setDevice(checks)
  listenIconex()
  await fetchProposals()
})
</script>
