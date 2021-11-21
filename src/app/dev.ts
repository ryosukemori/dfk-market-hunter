import { getWallet } from '../wallet'
import { bid, eventAuctionCreated } from '../contracts/dfk/auction'

const main = async () => {
  const wallet = getWallet()

  eventAuctionCreated(async (_, __, tokenId) => {
    //const tx = await bid(wallet, 1000000, 1)
  })
}

export default main
