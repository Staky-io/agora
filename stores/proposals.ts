/* eslint-disable no-underscore-dangle */
import axios from 'axios'
import { defineStore, storeToRefs } from 'pinia'
import { useUserStore } from './user'

export type Proposal = {
  uid: string
  endTime: number
  discussion: string
  title: string
  description: string
  creator: string
  status: 'Active' | 'Closed'
  votes: {
    for: number
    against: number
    abstain: number
  }
}

type VoteValue = keyof Proposal['votes']

type ProposalScore = {
  _proposalId: string
  _creator: string
  _status: Proposal['status']
  _abstainVoices: string
  _forVoices: string
  _againstVoices: string
  _endTime: string
  _ipfsHash: string
}

type ProposalIpfs = {
  title: string
  description: string
  discussion: string
}

type UserVotes = {
  [id in string]: VoteValue
}

const getIpfs = (hash: string): string => `https://craft-network.mypinata.cloud/ipfs/${hash}`

export const useProposalsStore = defineStore('proposals-store', () => {
  const { address } = storeToRefs(useUserStore())
  const { SCORECallReadOnly } = useScoreService()
  const route = useRoute()

  // States
  const isAllFetched = ref<boolean>(false)
  const proposals = ref<Proposal[]>([])
  const userVotes = ref<UserVotes>({})

  // Getters
  const currentProposal = computed<Proposal>(() => {
    if (route.name === 'proposal-uid') return proposals.value.find(({ uid }) => uid === route.params.uid)
    return null
  })

  // Actions
  const fetchProposal = async (uid: string): Promise<void> => {
    try {
      if (!proposals.value.find(({ uid: proposalId }) => proposalId === uid)) {
        const proposalDataFromScore = await SCORECallReadOnly<ProposalScore>('getProposal', { _proposalId: uid })
        const proposalDataFromIpfs = await axios.get<ProposalIpfs>(getIpfs(proposalDataFromScore._ipfsHash)).then(({ data }) => data)

        proposals.value.push({
          uid: proposalDataFromScore._proposalId,
          endTime: parseInt(proposalDataFromScore._endTime, 16) / 1000,
          discussion: proposalDataFromIpfs.discussion || '',
          title: proposalDataFromIpfs.title || '',
          description: proposalDataFromIpfs.description || '',
          creator: proposalDataFromScore._creator,
          status: proposalDataFromScore._status,
          votes: {
            for: parseInt(proposalDataFromScore._forVoices, 16) / (10 ** 18),
            against: parseInt(proposalDataFromScore._againstVoices, 16) / (10 ** 18),
            abstain: parseInt(proposalDataFromScore._abstainVoices, 16) / (10 ** 18),
          },
        })
      }

      if (address.value && !userVotes.value[currentProposal.value.uid]) {
        const currentUserVote = await SCORECallReadOnly<{ _power: string, _vote: VoteValue }>('getVote', { _voter: address.value, _proposalId: currentProposal.value.uid })

        if (currentUserVote) {
          userVotes.value[currentProposal.value.uid] = currentUserVote._vote
        }
      }
    } catch (error) {
      throw new Error(error)
    }
  }
  const fetchProposals = async (): Promise<void> => {
    try {
      const lastId = parseInt(await SCORECallReadOnly<string>('lastProposalId'), 16)
      const proposalsDataFromScore = await Promise.all([...new Array(lastId)].map((_, index) => SCORECallReadOnly<ProposalScore>('getProposal', { _proposalId: `0x${parseFloat(`${index + 1}`).toString(16)}` })))
      const proposalsDataFromIpfs = await Promise.all(proposalsDataFromScore.map(({ _ipfsHash }) => axios.get<ProposalIpfs>(getIpfs(_ipfsHash)).then(({ data }) => data)))

      proposals.value = [...new Array(proposalsDataFromScore.length)]
        .map((_, index): Proposal => ({
          uid: proposalsDataFromScore[index]._proposalId,
          endTime: parseInt(proposalsDataFromScore[index]._endTime, 16) / 1000,
          discussion: proposalsDataFromIpfs[index].discussion || '',
          title: proposalsDataFromIpfs[index].title || '',
          description: proposalsDataFromIpfs[index].description || '',
          creator: proposalsDataFromScore[index]._creator,
          status: proposalsDataFromScore[index]._status,
          votes: {
            for: parseInt(proposalsDataFromScore[index]._forVoices, 16) / (10 ** 18),
            against: parseInt(proposalsDataFromScore[index]._againstVoices, 16) / (10 ** 18),
            abstain: parseInt(proposalsDataFromScore[index]._abstainVoices, 16) / (10 ** 18),
          },
        }))
    } catch (error) {
      throw new Error(error)
    } finally {
      isAllFetched.value = true
    }
  }

  return {
    // States
    isAllFetched,
    proposals,
    userVotes,

    // Getters
    currentProposal,

    // Actions
    fetchProposal,
    fetchProposals,
  }
})
