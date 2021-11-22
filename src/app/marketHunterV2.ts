import fs from 'fs'
import path from 'path'
import { ethers } from 'ethers'
import { getWallet } from '../wallet'
import { getJewelInfo } from '../tokens/dfk'
import axios from 'axios'
import { bid, contractAddressOne as auctionAddress } from '../contracts/dfk/auction'
import { getHero } from '../contracts/dfk/hero'

const rpc = process.env.RPC || 'https://api.harmony.one'
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

  while (true) {
    try {
      const res: any = await axios.post(rpc, {
        jsonrpc: '2.0',
        id: 1,
        method: 'hmyv2_pendingTransactions',
        params: [],
      })
      res.data.result.map(async (tx: any) => {
        if (tx.to === auctionAddress && tx.input.indexOf('4ee42914') != -1) {
          const auctionData = formatAuctionCreatedHexData(tx.input, jewel.decimals)
          if (!auctionData) return
          // low price
          if (auctionData.price < bidPrice) {
            const result = await bid(
              wallet,
              auctionData.heroId,
              ethers.utils.parseUnits(auctionData.price.toString(), jewel.decimals),
              gasPrice,
            )
            bidResult(auctionData.heroId, result)
          }
          // gen0
          if (auctionData.heroId <= gen0 && auctionData.price <= bidPriceGen0) {
            const result = await bid(wallet, auctionData.heroId, auctionData.price, gasPrice)
            bidResult(auctionData.heroId, result)
          }
          console.log(`heroId: ${auctionData.heroId} price: ${auctionData.price}`)
        }
      })
    } catch (e) {
      console.error(e)
    }
    await new Promise((resolve) => setTimeout(resolve, 2000))
  }
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
      price: Number(ethers.utils.formatUnits(slice[2], decimals)),
      rawPrice: slice[2],
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
