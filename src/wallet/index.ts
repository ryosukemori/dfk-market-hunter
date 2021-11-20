import { ethers } from 'ethers'

const providerMode = process.env.PROVIDER || 'http'
const rpc = process.env.RPC || ''
const rpc_wss = process.env.RPC_WSS || ''
const pk = process.env.PK || ''

export const getWallet = () => {
  const provider = getProvider()
  return new ethers.Wallet(pk, provider)
}

export const getProvider = () => {
  if (providerMode === 'wss') {
    return new ethers.providers.WebSocketProvider(rpc_wss)
  }
  return new ethers.providers.JsonRpcProvider(rpc)
}
