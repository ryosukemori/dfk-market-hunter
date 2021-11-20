import { ethers } from 'ethers'

const rpc = process.env.RPC || ''
const pk = process.env.PK || ''

export const getWallet = () => {
  const provider = getProvider()
  const wallet = new ethers.Wallet(pk, provider)
  return wallet
}

export const getProvider = () => {
  return new ethers.providers.JsonRpcProvider(rpc)
}
