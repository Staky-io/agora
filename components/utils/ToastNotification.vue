<template>
  <div
    ref="root"
    :class="$style.container"
    class="p-10 bg-white rounded-5 shadow"
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
  >
    <button @click="closeNotification">
      Close
    </button>
    <h3 v-if="title">
      {{ title }}
    </h3>
    <p v-if="message">
      {{ message }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { NotificationTypes, NotificationPositions, NotificationProps } from '@/composables/useToastNotification'

// TODO: use `NotificationProps` type when Vue fixes the import (https://github.com/vuejs/core/issues/4294)
const props = withDefaults(defineProps<{
  uid: string
  isActive: boolean
  isVisible: boolean
  type?: NotificationTypes
  title?: string
  message?: string
  position?: NotificationPositions
  width?: number
  height?: number
  timeout?: number
  speed?: number
  offsetY?: number
  offsetX?: number
  gap?: number
}>(), {
  type: null,
  title: null,
  message: null,
  position: 'top-right',
  width: 300,
  height: null,
  timeout: 0,
  speed: 250,
  offsetY: 60,
  offsetX: 20,
  gap: 10,
})

const notifications = useState<NotificationProps[]>('notifications')

const root = ref<HTMLElement | null>(null)
const isHovering = ref<boolean>(false)
const startDate = ref<number>(0)
const pauseDate = ref<number>(0)
const deltaTimeout = ref<number>(1)
const notificationIndex = ref<number>(notifications.value.indexOf(notifications.value.find(({ uid }) => uid === props.uid)))
const currentNotification = ref<NotificationProps>(notifications.value[notificationIndex.value])

const [posY, posX]: string[] = props.position.split('-')
const offsets = reactive<{
  top: string
  right: string
  bottom: string
  left: string
}>({
  top: posY === 'top' ? `${props.offsetY}px` : 'unset',
  bottom: posY === 'bottom' ? `${props.offsetY}px` : 'unset',
  right: posX === 'right' ? `${props.offsetX}px` : 'unset',
  left: posX === 'left' ? `${props.offsetX}px` : 'unset',
})

const displayTimer = computed<string>(() => (props.timeout ? 'block' : 'none'))

const transitionDuration = computed<number>(() => Math.max(1, props.speed))

const translateOffsetX = computed<string>(() => {
  if (props.isVisible && props.isActive) return '0'

  switch (posX) {
    case 'right':
      return `calc(100% + ${offsets.right})`
    case 'left':
      return `calc(-100% - ${offsets.left})`
    default:
      return '0'
  }
})

const translateOffsetY = computed<string>(() => {
  const notificationsPositionGroup = notifications.value.filter(({ position, isActive }) => isActive && (position === props.position || (!position && props.position === 'top-right')))
  const notificationIndexInGroup = notificationsPositionGroup.indexOf(notificationsPositionGroup.find(({ uid }) => uid === props.uid))
  const notificationsElderGroup = notificationsPositionGroup.filter((_, index) => index < notificationIndexInGroup)
  const notificationOffset = notificationsElderGroup.reduce((accu, { height = 0, gap = props.gap }) => accu + height + gap, 0)

  switch (posY) {
    case 'top':
      return `${notificationOffset}px`
    case 'bottom':
      return `${-notificationOffset}px`
    default:
      return '0'
  }
})

const closeNotification = (): void => {
  currentNotification.value.isVisible = false
}

const closeTimeout = (): void => {
  const currentDate = Date.now()
  deltaTimeout.value = Math.min(1, Math.max(0, 1 - (currentDate - startDate.value) / props.timeout))

  if (currentDate - startDate.value >= props.timeout) {
    closeNotification()
  } else if (currentNotification.value.isVisible && !isHovering.value) {
    requestAnimationFrame(closeTimeout)
  }
}

if (props.timeout) {
  watch(isHovering, (value) => {
    if (value) {
      pauseDate.value = Date.now()
    } else {
      startDate.value = Date.now() - (pauseDate.value - startDate.value)
      closeTimeout()
    }
  })
}

watch(currentNotification, ({ isVisible }) => {
  if (!isVisible) {
    setTimeout(() => {
      currentNotification.value.isActive = false
    }, transitionDuration.value)
  }
}, { deep: true })

onMounted(() => {
  currentNotification.value.height = root.value?.offsetHeight

  if (props.title || props.message) {
    currentNotification.value.isVisible = true

    if (props.timeout) {
      startDate.value = Date.now()
      closeTimeout()
    }
  } else {
    closeNotification()
  }
})
</script>

<style module lang="scss">
.container {
  position: fixed;
  top: v-bind("offsets.top");
  right: v-bind("offsets.right");
  bottom: v-bind("offsets.bottom");
  left: v-bind("offsets.left");
  z-index: 999999;
  width: calc(v-bind(width) * 1px);
  overflow: hidden;
  transform: translateY(v-bind(translateOffsetY)) translateX(v-bind(translateOffsetX));
  transition-timing-function: cubic-bezier(.25, .1, .25, 1);
  transition-duration: calc(v-bind(transitionDuration) * 1ms);
  transition-property: transform;
  will-change: transform;

  &::after {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    display: v-bind(displayTimer);
    width: 100%;
    height: 4px;
    background: black;
    transform: scaleX(v-bind(deltaTimeout));
    transform-origin: left;
    content: "";
    will-change: transform;
  }
}
</style>
