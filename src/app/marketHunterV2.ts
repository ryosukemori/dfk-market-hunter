import fs from 'fs'
import path from 'path'
import { ethers } from 'ethers'
import { getWallet } from '../wallet'
import { getJewelInfo, getHeroInfo } from '../tokens/dfk'
import {
  eventAuctionCreated,
  bid,
  contractAddressOne as auctionAddress,
  contractAddressOne,
} from '../contracts/dfk/auction'
import { getHero } from '../contracts/dfk/hero'
import { Harmony } from '@harmony-js/core'
import { ChainID, ChainType } from '@harmony-js/utils'

const hmy_ws = new Harmony(process.env.RPC_WSS || 'wss://ws.s0.t.hmny.io', {
  chainType: ChainType.Harmony,
  chainId: ChainID.HmyMainnet,
})

const auction = '0x13a65b9f8039e2c032bc022171dc05b30c3f2892'
const gen0 = 2071
const bidPriceGen0 = Number(process.env.bidPriceGen0) || 200
const bidPrice = Number(process.env.bidPrice) || 15
const gasBoost = process.env.GAS_BOOST || 10

let gasPrice = ethers.BigNumber.from(0)

const main = async () => {
  const wallet = getWallet()
  const walletAddress = await wallet.getAddress()

  const [balance, jewel] = await Promise.all([
    await wallet.getBalance(),
    await getJewelInfo(walletAddress),
  ])
  if (!balance || !jewel) {
    console.log('continue get balance')
    return
  }
  // setting
  console.log('provider', process.env.PROVIDER)
  console.log('GAS_BOOST', process.env.GAS_BOOST)
  console.log('GAS_LIMIT', process.env.GAS_LIMIT)
  // balance
  console.log('one ', ethers.utils.formatEther(balance))
  console.log('jewel ', ethers.utils.formatUnits(jewel.balance, jewel.decimals))

  gasPrice = await (await wallet.getGasPrice()).mul(gasBoost)
  console.log('set gas:', ethers.utils.formatUnits(gasPrice, 'gwei'))

  setInterval(async () => {
    gasPrice = await (await wallet.getGasPrice()).mul(gasBoost)
    console.log('set gas:', ethers.utils.formatUnits(gasPrice, 'gwei'))
  }, 60000)

  const pendingTx = hmy_ws.blockchain.newPendingTransactions()

  pendingTx.onData(async (tx: any) => {
    const txData = await await hmy_ws.blockchain.getTransactionByHash({
      txnHash: tx.params.result,
      shardID: 0,
    })
    console.log(txData)
    if (txData && txData.to === contractAddressOne) {
      console.log(formatAuctionCreatedHexData(txData.input, jewel.decimals))
    }
  })
}

const getTransaction = async (txHash: string) => {
  let res = null
  for (let i = 0; i < 100; i++) {
    res = await hmy_ws.blockchain.getTransactionReceipt({
      txnHash: txHash,
      shardID: 0,
    })
    console.log(res)
    if (res.result !== null) {
      return res.result
    }
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
  return null
}

const bidResult = async (heroId: number, tx = false) => {
  const hero = await getHero(heroId)
  if (tx === false) {
    log(
      `購入失敗 ID:${heroId} gen:${hero?.generation} rarity:${hero?.rarity} mainClass:${hero?.mainClass}`,
    )
    return
  }
  log(
    `購入成功 ID:${heroId} gen:${hero?.generation} rarity:${hero?.rarity} mainClass:${hero?.mainClass}`,
  )
  return
}

const formatAuctionCreatedHexData = (data: string, decimals: number) => {
  const slice = [
    // 140 $9425
    data.slice(0, 10),
    data.slice(10, 74).replace(/^0+/, ''),
    '0x' + data.slice(74, 138).replace(/^0+/, ''),
  ]
  if (slice[0] === '0x4ee42914') {
    return {
      function: slice[0],
      heroId: parseInt(slice[1], 16),
      price: ethers.utils.formatUnits(slice[2], decimals),
    }
  }
  return undefined
}

const log = (text: string, consoleOnly = false) => {
  if (!consoleOnly) {
    fs.appendFile(`${path.join(path.resolve(), '/bid.log')}`, `${text}\n`, () => {})
  }
  console.log(text)
}

export default main
