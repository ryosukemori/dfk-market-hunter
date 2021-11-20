import { ethers } from 'ethers'

const providerMode = process.env.PROVIDER || 'http'
const rpc = process.env.RPC || ''
const rpc_wss = process.env.RPC_WSS || ''
const pk = process.env.PK || ''

let provider: undefined | ethers.providers.JsonRpcProvider | ethers.providers.WebSocketProvider =
  undefined

export const getWallet = () => {
  return new ethers.Wallet(pk, getProvider())
}

export const getProvider = (init = false) => {
  if (provider !== undefined && !init) return provider

  if (providerMode === 'wss') {
    let keepAliveInterval: NodeJS.Timer | undefined = undefined
    const wssProvider = new ethers.providers.WebSocketProvider(rpc_wss)

    wssProvider._websocket.on('open', () => {
      console.log('wss open')
      keepAliveInterval = setInterval(() => {
        console.log('wss ping')
        wssProvider._websocket.ping()
      }, 30000)
    })
    wssProvider._websocket.on('close', () => {
      console.log('wss close')
      keepAliveInterval && clearInterval(keepAliveInterval)
      getProvider(true)
    })
    provider = wssProvider
    return provider
  }
  provider = new ethers.providers.JsonRpcProvider(rpc)
  return provider
}
