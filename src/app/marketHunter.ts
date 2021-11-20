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
const bidPrices = [
  Number(process.env.bidPriceGen1) || 10,
  Number(process.env.bidPriceGen2) || 10,
  Number(process.env.bidPriceGen3) || 10,
  Number(process.env.bidPriceGen4) || 10,
  Number(process.env.bidPriceGen5) || 10,
  Number(process.env.bidPriceGen6) || 10,
]

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

  // balance
  console.log('one ', ethers.utils.formatEther(balance))
  console.log('jewel ', ethers.utils.formatUnits(jewel.balance, jewel.decimals))

  eventAuctionCreated(async (_auctionId, _owner, tokenId, startingPrice) => {
    const heroId = Number(ethers.utils.formatUnits(tokenId, 0))
    const price = Number(ethers.utils.formatUnits(startingPrice, jewel.decimals))
    console.log(`ヒーローID:${heroId} 販売価格:${price}`)
    log(`ヒーローID:${heroId} 販売価格:${price}`)
    // low cost gen0
    if (heroId <= gen0 && price <= bidPriceGen0) {
      const tx = await bid(wallet, tokenId, startingPrice)
      if (tx === false) console.log('購入失敗 :', tokenId, startingPrice)
      console.log('購入成功 : ', heroId, startingPrice)
      log(`'購入成功 ID:${heroId}, ${startingPrice} Jewel`)
      return
    }
    // ヒーローデータ取得
    const hero = await getHero(tokenId)
    if (!hero) return
    // 最高購入価格の取得
    const bidPrice = bidPrices[hero?.generation - 1] || undefined
    if (!bidPrice) return
    // low cost gen1~
    if (price <= bidPrice) {
      console.log(`gen: ${hero.generation} 購入価格閾値: ${bidPrice || 'なし'}`)
      console.log('購入開始')
      const tx = await bid(wallet, tokenId, startingPrice)
      if (tx === false) console.log('購入失敗 :', tokenId, startingPrice)
      log(`'購入成功 ID:${heroId}, ${startingPrice} Jewel`)
      return
    }
  })

  while (true) {
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }
}

const log = (text: string) => {
  fs.writeFile(`${path.join(path.resolve(), '/bid.log')}`, text, () => {})
}

export default main
