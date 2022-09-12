<template>
  <header class="sticky top-0 z-10 pointer-events-none">
    <Container class="grid gap-20 grid-flow-col items-center justify-between h-60 bg-grey-400 pointer-events-auto">
      <NuxtLink
        to="/"
        class="text-0 text-primary"
      >
        <UtilsIcon
          name="Logo/Agora"
          class="w-84 h-auto"
        />
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
            <!-- <div class="grid place-content-center place-items-center h-32 m:h-40 px-16 m:px-24 rounded-max typo-button-s text-white bg-primary bg-opacity-40 border-1 border-primary">
              <span>
                1000
                <span class="text-white text-opacity-60">token</span>
              </span>
            </div> -->
            <ControlsButtonAction :copied-text="address">
              {{ truncatedAddress }}
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
    <client-only>
      <div :class="$style.headingContainer">
        <Container
          class="grid gap-20 items-center py-10 bg-grey-400 transition-height duration-400 pointer-events-auto"
          :class="[
            $style.headingWrapper,
            {
              [hasNavigationTab ? 'grid-cols-1fr-auto-1fr' : 'grid-cols-2']: headingType === 'protocol-proposals',
              '': headingType === 'vote-information',
              'grid-flow-col justify-between': headingType === 'new-proposal',
            }
          ]"
        >
          <template v-if="headingType === 'protocol-proposals'">
            <div class="grid gap-10 grid-flow-col items-center justify-start">
              <div
                class="w-auto h-full aspect-square transition-size duration-400"
                :class="$style.protocolPicture"
              >
                <img
                  :src="protocolLogo"
                  :alt="appName"
                >
              </div>
              <h2
                class="typo-title-l origin-left transition-transform duration-400"
                :class="$style.protocolTitle"
              >
                {{ appName }}
              </h2>
            </div>
            <PartialsNavigationTabs
              v-if="hasNavigationTab"
              :active-index="activeTabIndex"
              :tabs="tabsNames"
              @update="updateTab"
            />
            <div class="grid gap-2 grid-flow-col items-center justify-end">
              <a
                v-for="(socialData, i) in socialsData.filter(({ url }) => url && url.includes('https'))"
                :key="`socialData-${i}`"
                class="grid place-items-center w-24 h-24 p-2 text-primary bg-primary bg-opacity-0 rounded-full transition-background duration-100 hover:bg-opacity-20"
                :href="socialData.url"
                :title="socialData.name"
                target="_blank"
                rel="noopener noreferrer"
              >
                <UtilsIcon
                  class="w-full h-full"
                  :name="socialData.icon"
                />
              </a>
            </div>
          </template>
          <template v-else-if="headingType === 'vote-information'">
            <div class="grid gap-10 grid-flow-col items-center justify-start">
              <h2 class="typo-title-l">
                Vote
              </h2>
            </div>
          </template>
          <template v-else-if="headingType === 'new-proposal'">
            <div class="grid gap-10 grid-flow-col items-center justify-start">
              <h2 class="typo-title-l">
                New proposal
              </h2>
              <p class="text-grey-100 typo-text-medium">
                You need to have a minimum of {{ minTokens }} tokens ({{ scoreAddress }}) in order to submit a proposal.
              </p>
            </div>
            <ControlsButtonAction
              version="secondary"
              @click="createIsPreviewing = !createIsPreviewing"
            >
              {{ createIsPreviewing ? 'Edit' : 'Preview' }}
            </ControlsButtonAction>
          </template>
        </Container>
        <div class="w-screen h-1 bg-grey-200" />
      </div>
    </client-only>
  </header>
</template>

<script setup lang="ts">

import { storeToRefs } from 'pinia'
import { useImagesStore } from '@/stores/images'
import { useUserStore } from '@/stores/user'
import type { IconsNames } from '@/composables/useIconsComponents'

const { scoreAddress } = useRuntimeConfig()

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

const {
  name: appName,
  discord,
  github,
  twitter,
} = useRuntimeConfig()
const route = useRoute()
const createIsPreviewing = useState<boolean>('create-is-previewing', () => false)

const { images } = storeToRefs(useImagesStore())
const { isLoggedIn, address, truncatedAddress } = storeToRefs(useUserStore())
const { emit, events } = useEventsBus()
const { SCORECallReadOnly } = useScoreService()

const headingType = ref<HEADING>(null)
const scrollRatio = ref<number>(0)
const minTokens = ref<number>(0)
const hasNavigationTab = ref<boolean>(false)
const activeTabIndex = ref<number>(0)
const tabsNames = ref<string[]>(['Proposals', 'New proposals'])

const socialsData = ref<SocialData[]>([
  { name: 'Discord', url: !discord || discord.includes('https') ? discord : `https://discord.gg/${discord}`, icon: 'Logo/Discord' },
  { name: 'Github', url: !github || github.includes('https') ? github : `https://github.com/${github}`, icon: 'Logo/Github' },
  { name: 'Twitter', url: !twitter || twitter.includes('https') ? twitter : `https://twitter.com/${twitter}`, icon: 'Logo/Twitter' },
])

const protocolLogo = computed<string>(() => images.value.logo)

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

onMounted(async () => {
  minTokens.value = parseInt(await SCORECallReadOnly<string>('minimumThreshold'), 16) / (10 ** 18)
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

.headingContainer {
  height: 110px;
}

.headingWrapper {
  height: calcScrollValue(60px, 110px);
}

.protocolPicture {
  width: calcScrollValue(20px, 40px);
  height: calcScrollValue(20px, 40px);

  @screen s {
    width: calcScrollValue(30px, 60px);
    height: calcScrollValue(30px, 60px);
  }
}

.protocolTitle {
  transform: translateX(calcScrollValue(0px, 10px)) scale(calcScrollValue(.75, 1));
}
</style>
