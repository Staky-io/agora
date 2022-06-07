import { useUserStore } from '@/stores/user'

const popupsComponents = {
  action: {
    Buy: markRaw(defineAsyncComponent(() => import('@/components/partials/popup/action/Buy.vue'))),
  },
  guard: {
    LogIn: markRaw(defineAsyncComponent(() => import('@/components/partials/popup/guard/LogIn.vue'))),
    LogOut: markRaw(defineAsyncComponent(() => import('@/components/partials/popup/guard/LogOut.vue'))),
  },
}

export enum EVENTS_NAMES {
  POPUP_CLOSE = 'POPUP_CLOSE_CURRENT',
  POPUP_GUARD = 'POPUP_HANDLE_GUARD',
  POPUP_ACTION = 'POPUP_CALL_ACTION',
}

type CloseParams = {
  handlePending?: boolean
}

type GuardParams = {
  callback?: ((...args: unknown[]) => void) | null
}

type ActionParams = {
  name: keyof typeof popupsComponents.action
  params?: object
  events?: object
  callback?: ((...args: unknown[]) => void) | null
  handleGuard?: boolean
}

export type EventsParams = {
  [EVENTS_NAMES.POPUP_CLOSE]: CloseParams
  [EVENTS_NAMES.POPUP_GUARD]: GuardParams
  [EVENTS_NAMES.POPUP_ACTION]: ActionParams
}

export const usePopupMethods = () => {
  const [currentPopup, setCurrentPopup] = usePopupData()
  const [pendingPopup, setPendingPopup] = usePopupData()

  const POPUP_CLOSE_CURRENT = ({ handlePending = false }: CloseParams = {}): void => {
    if (!pendingPopup.component || !handlePending) {
      setCurrentPopup()
    } else {
      const { callback, ...rest } = pendingPopup
      setCurrentPopup({ ...rest })
      setPendingPopup()
      if (callback) {
        callback(rest.params)
      }
    }
  }

  const POPUP_HANDLE_GUARD = ({ callback = null }: GuardParams = {}): void => {
    const { isLoggedIn } = useUserStore()
    setCurrentPopup({ component: isLoggedIn ? popupsComponents.guard.LogOut : popupsComponents.guard.LogIn })

    if (callback) {
      callback()
    }
  }

  const POPUP_CALL_ACTION = ({
    name,
    params = {},
    events = {},
    callback = null,
    handleGuard = false,
  }: ActionParams): void => {
    const { isLoggedIn } = useUserStore()
    const popup = { component: popupsComponents.action[name], params, events }

    if (handleGuard && !isLoggedIn) {
      setPendingPopup({ ...popup, callback })
      POPUP_HANDLE_GUARD()
    } else {
      setCurrentPopup({ ...popup })
      setPendingPopup()
      if (callback) {
        callback(params)
      }
    }
  }

  return {
    currentPopup,
    POPUP_CLOSE_CURRENT,
    POPUP_HANDLE_GUARD,
    POPUP_CALL_ACTION,
  }
}
