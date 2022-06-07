const types = [
  'info',
  'success',
  'warning',
  'error',
] as const
const positions = [
  'top-left',
  'top-right',
  'bottom-left',
  'bottom-right',
] as const

export type NotificationTypes = typeof types[number]

export type NotificationPositions = typeof positions[number]

type NotificationOptionalProps = {
  type?: NotificationTypes
  position?: NotificationPositions
  width?: number
  timeout?: number
  speed?: number
}

type NotificationRequiredProps =
  | { title: string, message?: string }
  | { message: string, title?: string }

type NotificationMainHandlerProps = NotificationOptionalProps & NotificationRequiredProps
type NotificationSubHandlersProps = Omit<NotificationOptionalProps, 'type'> & NotificationRequiredProps

type NotificationMainHandlerCallback = { (params: string | NotificationMainHandlerProps): string }
type NotificationSubHandlersCallbacks = { [key in typeof types[number]]: (params: string | NotificationSubHandlersProps) => string }

type NotificationSettingsProps = {
  offsetY?: number
  offsetX?: number
  gap?: number
}

type NotificationGlobalProps = {
  uid: string
  height?: number
  isActive: boolean
  isVisible: boolean
}

export type NotificationProps =
  & NotificationMainHandlerProps
  & NotificationSettingsProps
  & NotificationGlobalProps

export const useToastNotification = (settings?: NotificationSettingsProps) => {
  const notifications = useState<NotificationProps[]>('notifications', () => [])

  watch(notifications, (value) => {
    if (value.length && value.map(({ isActive }) => !isActive).every(Boolean)) notifications.value = []
  }, { deep: true })

  const handleNotification: NotificationMainHandlerCallback = (params: string | NotificationMainHandlerProps): string => {
    const uid: string = Date.now().toString(36) + Math.random().toString(36).split('.')[1]
    notifications.value.push({
      uid,
      isActive: true,
      isVisible: false,
      ...settings,
      ...typeof params === 'string' ? { message: params } : params,
    })

    return uid
  }

  types.forEach((type: NotificationTypes) => {
    handleNotification[type] = (params: string | NotificationSubHandlersProps): string => handleNotification({
      ...typeof params === 'string' ? { message: params } : params,
      type,
    })
  })

  const notify = handleNotification as NotificationMainHandlerCallback & NotificationSubHandlersCallbacks

  const close = (...uids: string[]): void => {
    uids.forEach((uid) => {
      const notificationIndex: number = notifications.value.indexOf(notifications.value.find((notification) => notification.uid === uid))
      if (notificationIndex > -1) notifications.value[notificationIndex].isVisible = false
    })
  }

  return {
    notify,
    close,
  }
}
