import { getProvider } from '../../wallet'
import { ethers } from 'ethers'

export const contractAddress = '0x13a65B9F8039E2c032Bc022171Dc05B30c3f2892'
export const contractAddressOne = 'one1zwn9h8uq883vqv4uqgshrhq9kvxr72yjjjz9la'
const gasBoost = Number(process.env.GAS_BOOST) || 5
const gasLimit = Number(process.env.GAS_LIMIT) || 500000

const abi = [
  {
    inputs: [
      { internalType: 'uint256', name: '_tokenId', type: 'uint256' },
      { internalType: 'uint128', name: '_startingPrice', type: 'uint128' },
      { internalType: 'uint128', name: '_endingPrice', type: 'uint128' },
      { internalType: 'uint64', name: '_duration', type: 'uint64' },
      { internalType: 'address', name: '_winner', type: 'address' },
    ],
    name: 'createAuction',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'uint256', name: 'auctionId', type: 'uint256' },
      { indexed: true, internalType: 'uint256', name: 'tokenId', type: 'uint256' },
    ],
    name: 'AuctionCancelled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'uint256', name: 'auctionId', type: 'uint256' },
      { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
      { indexed: true, internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'startingPrice', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'endingPrice', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'duration', type: 'uint256' },
      { indexed: false, internalType: 'address', name: 'winner', type: 'address' },
    ],
    name: 'AuctionCreated',
    type: 'event',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_tokenId', type: 'uint256' },
      { internalType: 'uint256', name: '_bidAmount', type: 'uint256' },
    ],
    name: 'bid',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]

const contract = new ethers.Contract(contractAddress, abi, getProvider())

let endBids: number[] = []

export const setEndBid = async (heroId: number) => {
  endBids = [...endBids, heroId]
  console.log(endBids)
  await new Promise((resolve) => setTimeout(resolve, 30000))
  endBids = endBids.filter((item) => item !== heroId)
}

export const bid = async (
  signer: ethers.Signer,
  tokenId: number,
  bidAmount: number | ethers.BigNumber,
  gasPrice: ethers.BigNumber,
) => {
  const callContract = new ethers.Contract(contractAddress, abi, signer)
  let tryCount = 0
  while (true) {
    try {
      // bid pause
      if (endBids.find((item) => item === tokenId)) {
        console.log('auction opend')
        tryCount = 11
      }

      const tx = await callContract.bid(tokenId, bidAmount, {
        gasPrice,
        gasLimit,
      })
      await tx.wait()
      return true
    } catch (e: any) {
      if (tryCount > 10) {
        console.error(e)
        return false
      }
      if (e.errorArgs && e.errorArgs[0] === 'private') {
        console.log('private sale')
        return false
      }
      if (e.errorArgs && e.errorArgs[0] === 'ERC20: transfer amount exceeds balance') {
        console.log('low jewel balance')
        return false
      }

      tryCount++
      await new Promise((resolve) => setTimeout(resolve, 500))
      console.log('retry', tryCount)
      continue
    } finally {
      endBids = endBids.filter((item) => item !== tokenId)
    }
  }
}

export const eventAuctionCreated = (
  handler: (
    auctionId: ethers.BigNumber,
    owner: string,
    tokenId: ethers.BigNumber,
    startingPrice: ethers.BigNumber,
  ) => void,
) => {
  const filter = contract.filters.AuctionCreated()
  contract.on(filter, handler)
}
