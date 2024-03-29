import { useUserStore } from '@/stores/user'

const popupsComponents = {
  action: {
    CancelProposal: markRaw(defineAsyncComponent(() => import('@/components/partials/popup/action/CancelProposal.vue'))),
    CloseProposal: markRaw(defineAsyncComponent(() => import('@/components/partials/popup/action/CloseProposal.vue'))),
    SubmitProposal: markRaw(defineAsyncComponent(() => import('@/components/partials/popup/action/SubmitProposal.vue'))),
    SubmitVote: markRaw(defineAsyncComponent(() => import('@/components/partials/popup/action/SubmitVote.vue'))),
  },
  guard: {
    Connect: markRaw(defineAsyncComponent(() => import('@/components/partials/popup/guard/Connect.vue'))),
    Disconnect: markRaw(defineAsyncComponent(() => import('@/components/partials/popup/guard/Disconnect.vue'))),
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
    setCurrentPopup({ component: isLoggedIn ? popupsComponents.guard.Disconnect : popupsComponents.guard.Connect })

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
