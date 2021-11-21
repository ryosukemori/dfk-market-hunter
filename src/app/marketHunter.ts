import fs from 'fs'
import path from 'path'
import { ethers } from 'ethers'
import { getWallet } from '../wallet'
import { getJewelInfo, getHeroInfo } from '../tokens/dfk'
import { eventAuctionCreated, bid } from '../contracts/dfk/auction'
import { getHero } from '../contracts/dfk/hero'

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

  eventAuctionCreated(async (_auctionId, _owner, tokenId, startingPrice) => {
    try {
      // low Price
      const price = Number(ethers.utils.formatUnits(startingPrice, jewel.decimals))
      const heroId = Number(ethers.utils.formatUnits(tokenId, 0))
      if (price < bidPrice) {
        const tx = await bid(wallet, tokenId, startingPrice, gasPrice)
        bidResult(heroId, tx)
      }
      // Gen0
      if (heroId <= gen0 && price <= bidPriceGen0) {
        const tx = await bid(wallet, tokenId, startingPrice, gasPrice)
        bidResult(heroId, tx)
      }
      console.log(`ヒーローID:${heroId} 販売価格:${price}`)
    } catch (e) {
      console.log(e)
      return
    }
  })

  while (true) {
    await new Promise((resolve) => setTimeout(resolve, 1000))
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

const log = (text: string, consoleOnly = false) => {
  if (!consoleOnly) {
    fs.appendFile(`${path.join(path.resolve(), '/bid.log')}`, `${text}\n`, () => {})
  }
  console.log(text)
}

export default main
