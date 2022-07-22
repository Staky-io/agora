import { defineStore } from 'pinia'

export type Proposal = {
  uid: string
  name: string
  title: string
  author: string
  status: 'Active' | 'Closed'
  description: string
  votes: {
    for: number
    against: number
    abstain: number
  }
}

type Range = Partial<Record<'min' | 'max', number>>

const capitalize = (string: string): string => `${string.charAt(0).toUpperCase()}${string.slice(1)}`
const getRandomNumber = ({ min = 0, max = 1_000_000 }: Range): number => min + Math.floor(Math.random() * (max + 1))
const createRandomWord = ({ length = 1, radix = 36, range }: { length?: number, radix?: number, range?: Range }): string => [...new Array(Math.max(1, length))]
  .map(() => getRandomNumber(range).toString(radix))
  .join('')
const createRandomSentence = (length: number): string => [...new Array(Math.max(1, length))]
  .map(() => createRandomWord({ length: 1 + Math.ceil(Math.random() * 9), range: { min: 10, max: 25 } }))
  .join(' ')
const createRandomParagraph = (length: number): string => [...new Array(Math.max(2, length))]
  .map(() => capitalize(`${createRandomSentence(1 + Math.ceil(Math.random() * 9))}.`))
  .join(' ')

export const useProposalsStore = defineStore('proposals-store', () => {
  const route = useRoute()

  // States
  const proposals = ref<Proposal[]>([])

  // Getters
  const currentProposal = computed<Proposal>(() => {
    if (route.name === 'proposal-uid') return proposals.value.find(({ uid }) => uid === route.params.uid)
    return null
  })

  // Actions
  const fetchProposals = async (): Promise<void> => {
    try {
      [...new Array(10)]
        .map((): Proposal => ({
          uid: Date.now().toString(36) + Math.random().toString(36).split('.')[1],
          name: capitalize(createRandomWord({ length: 5 + Math.ceil(Math.random() * 5), range: { min: 10, max: 25 } })),
          title: capitalize(createRandomSentence(Math.ceil(Math.random() * 5))),
          author: `hx${[...new Array(40)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
          status: Math.random() < 0.5 ? 'Active' : 'Closed',
          description: createRandomParagraph(Math.ceil(Math.random() * 10)),
          votes: {
            for: getRandomNumber({ max: 1000 }),
            against: getRandomNumber({ max: 1000 }),
            abstain: getRandomNumber({ max: 1000 }),
          },
        }))
        .forEach((proposal) => {
          proposals.value.push(proposal)
        })
    } catch (error) {
      throw new Error(error)
    }
  }

  return {
    // States
    currentProposal,
    proposals,

    // Getters

    // Actions
    fetchProposals,
  }
})
