<template>
  <header class="sticky top-0 bg-grey-400 border-b-1 border-grey-200">
    <Container class="grid gap-20 grid-flow-col items-center justify-between h-60">
      <NuxtLink
        to="/"
        class="text-0"
      >
        <img
          src="@/assets/images/logo.svg"
          alt="Agora"
          class="w-84 h-auto"
        >
      </NuxtLink>
      <client-only>
        <div class="grid gap-10 grid-flow-col items-center">
          <ControlsButtonIcon
            name="Math/Plus"
            :to="{ name: 'create' }"
          />
          <ControlsButtonAction
            v-if="!isLoggedIn"
            @click="emit(events.POPUP_GUARD)"
          >
            Connect
          </ControlsButtonAction>
          <template v-else-if="truncatedAddress">
            <ControlsButtonAction :copied-text="address">
              {{ truncatedAddress }}
              <UtilsIcon
                class="w-20 h-20 text-grey-100"
                name="Copy"
              />
            </ControlsButtonAction>
            <ControlsButtonIcon
              version="error"
              name="Logout"
              @click="emit(events.POPUP_GUARD)"
            />
          </template>
        </div>
      </client-only>
    </Container>
    <Container>
      <div
        class="grid gap-20 items-center py-10 transition-height duration-400"
        :class="[
          $style.heading,
          {
            'grid-cols-1fr-auto-1fr': headingType === 'protocol-proposals',
            '': headingType === 'vote-information',
            'grid-flow-col justify-between': headingType === 'new-proposal',
          }
        ]"
      >
        <template v-if="headingType === 'protocol-proposals'">
          <div class="grid gap-10 grid-flow-col items-center justify-start">
            <div
              class="w-auto h-full bg-grey-200 rounded-10 aspect-square transition-size duration-400"
              :class="$style.protocolPicture"
            />
            <h2
              class="typo-title-l origin-left transition-transform duration-400"
              :class="$style.protocolTitle"
            >
              Protocol name
            </h2>
          </div>
          <PartialsNavigationTabs
            :active-index="activeTabIndex"
            :tabs="tabsNames"
            @update="updateTab"
          />
          <div class="grid gap-4 grid-flow-col items-center justify-end">
            <button
              v-for="(socialData, i) in socialsData"
              :key="`socialData-${i}`"
              class="grid place-items-center w-20 h-20 text-primary"
            >
              <UtilsIcon
                class="w-full h-full"
                :name="socialData.icon"
              />
            </button>
          </div>
        </template>
        <template v-else-if="headingType === 'vote-information'">
          <div class="grid gap-10 grid-flow-col items-center justify-start">
            <h2 class="typo-title-l">
              Vote
            </h2>
            <p class="text-grey-100 typo-text-medium">
              You need to have a minimum of 100 “Staked CFT” in order to submit a proposal.
              <button class="text-white typo-text-semibold transition-color duration-100 hover:text-primary">
                Learn more
              </button>
            </p>
          </div>
        </template>
        <template v-else-if="headingType === 'new-proposal'">
          <div class="grid gap-10 grid-flow-col items-center justify-start">
            <h2 class="typo-title-l">
              New proposal
            </h2>
            <p class="text-grey-100 typo-text-medium">
              You need to have a minimum of 100 “Staked CFT” in order to submit a proposal.
              <button class="text-white typo-text-semibold transition-color duration-100 hover:text-primary">
                Learn more
              </button>
            </p>
          </div>
          <ControlsButtonAction
            version="secondary"
            @click="createIsPreviewing = !createIsPreviewing"
          >
            {{ createIsPreviewing ? 'Edit' : 'Preview' }}
          </ControlsButtonAction>
        </template>
      </div>
    </Container>
  </header>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'
import type { IconsNames } from '@/composables/useIconsComponents'

enum HEADING {
  PROTOCOL_PROPOSALS = 'protocol-proposals',
  VOTE_INFORMATION = 'vote-information',
  NEW_PROPOSAL = 'new-proposal',
}

type SocialData = {
  name: string
  url: string
  icon: IconsNames
}

const route = useRoute()
const createIsPreviewing = useState<boolean>('create-is-previewing', () => false)

const { isLoggedIn, address, truncatedAddress } = storeToRefs(useUserStore())
const { emit, events } = useEventsBus()

const headingType = ref<HEADING>(null)
const scrollRatio = ref<number>(0)
const activeTabIndex = ref<number>(0)
const tabsNames = ref<string[]>(['Proposals', 'New proposals'])

const socialsData = ref<SocialData[]>([
  { name: 'Discord', url: '', icon: 'Logo/Discord' },
  { name: 'Github', url: '', icon: 'Logo/Github' },
  { name: 'Twitter', url: '', icon: 'Logo/Twitter' },
])

const updateTab = (index: number): void => {
  activeTabIndex.value = index
}

const onPageScroll = (): void => {
  scrollRatio.value = Number(!window.scrollY)
}

watch(route, ({ name }) => {
  switch (name) {
    case 'proposal-uid':
      headingType.value = HEADING.VOTE_INFORMATION
      break
    case 'create':
      headingType.value = HEADING.NEW_PROPOSAL
      break
    default:
      headingType.value = HEADING.PROTOCOL_PROPOSALS
      break
  }
}, { immediate: true })

onMounted(() => {
  window.addEventListener('scroll', onPageScroll)
  onPageScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onPageScroll)
})
</script>

<style lang="scss" module>
@function calcScrollValue($min, $max) {
  @return calc($min + v-bind(scrollRatio) * ($max - $min));
}

.heading {
  height: calcScrollValue(60px, 110px);
}

.protocolPicture {
  width: calcScrollValue(30px, 60px);
  height: calcScrollValue(30px, 60px);
}

.protocolTitle {
  transform: translateX(calcScrollValue(0px, 10px)) scale(calcScrollValue(.75, 1));
}
</style>
