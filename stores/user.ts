import { defineStore } from 'pinia'

export const useUserStore = defineStore('user-store', () => {
  // States
  const isLoggedIn = ref<boolean>(false)
  const address = ref<string>('')
  const wallet = ref<string>('')

  // Actions
  const loginUser = (params: { address?: string, wallet?: string }): void => {
    isLoggedIn.value = true
    address.value = params.address
    wallet.value = params.wallet
  }
  const logoutUser = (): void => {
    if (wallet.value) {
      window.dispatchEvent(new CustomEvent('bri.widget', {
        detail: {
          action: 'logout',
        },
      }))
    }
    isLoggedIn.value = false
    address.value = ''
    wallet.value = ''
  }

  return {
    // States
    isLoggedIn,
    address,
    wallet,

    // Actions
    loginUser,
    logoutUser,
  }
}, { persist: true })
