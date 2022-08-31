/* eslint-disable no-underscore-dangle */
import axios from 'axios'
import IconService from 'icon-sdk-js'
import { defineStore, storeToRefs } from 'pinia'
import { useUserStore } from './user'

const { IconConverter, IconBuilder } = IconService
const { CallTransactionBuilder } = IconBuilder

export type Proposal = {
  uid: string
  name: string
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

const getIpfs = (hash: string): string => `https://craft-network.mypinata.cloud/ipfs/${hash}`

export const useProposalsStore = defineStore('proposals-store', () => {
  const { SCORECallReadOnly } = useScoreService()
  const route = useRoute()

  // States
  const proposals = ref<Proposal[]>([])

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
          name: proposalDataFromIpfs.discussion || '',
          title: proposalDataFromIpfs.title || '',
          description: proposalDataFromIpfs.description || '',
          creator: proposalDataFromScore._creator,
          status: proposalDataFromScore._status,
          votes: {
            for: parseInt(proposalDataFromScore._forVoices, 16),
            against: parseInt(proposalDataFromScore._againstVoices, 16),
            abstain: parseInt(proposalDataFromScore._abstainVoices, 16),
          },
        })
      }
    } catch (error) {
      throw new Error(error)
    }
  }
  const fetchProposals = async (): Promise<void> => {
    try {
      const lastId = parseInt(await SCORECallReadOnly('lastProposalId'), 16)
      const proposalsDataFromScore = await Promise.all([...new Array(lastId)].map(() => SCORECallReadOnly<ProposalScore>('getProposal', { _proposalId: `0x${parseFloat(`${lastId}`).toString(16)}` })))
      const proposalsDataFromIpfs = await Promise.all(proposalsDataFromScore.map(({ _ipfsHash }) => axios.get<ProposalIpfs>(getIpfs(_ipfsHash)).then(({ data }) => data)))

      proposals.value = [...new Array(proposalsDataFromScore.length)]
        .map((_, index): Proposal => ({
          uid: proposalsDataFromScore[index]._proposalId,
          name: proposalsDataFromIpfs[index].discussion || '',
          title: proposalsDataFromIpfs[index].title || '',
          description: proposalsDataFromIpfs[index].description || '',
          creator: proposalsDataFromScore[index]._creator,
          status: proposalsDataFromScore[index]._status,
          votes: {
            for: parseInt(proposalsDataFromScore[index]._forVoices, 16),
            against: parseInt(proposalsDataFromScore[index]._againstVoices, 16),
            abstain: parseInt(proposalsDataFromScore[index]._abstainVoices, 16),
          },
        }))
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
    fetchProposal,
    fetchProposals,
  }
})
