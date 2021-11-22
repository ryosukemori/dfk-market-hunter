require('dotenv').config()
import marketHunter from './app/marketHunterV2'
import dev from './app/dev'

const main = async () => {
  marketHunter()
  // await dev()
}

main()
