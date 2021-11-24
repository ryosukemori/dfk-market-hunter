require('dotenv').config()
import marketHunter from './app/marketHunterV2'

const main = async () => {
  marketHunter()
  // await dev()
}

main()
