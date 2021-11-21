require('dotenv').config()
import marketHunter from './app/marketHunter'
import dev from './app/dev'

const main = async () => {
  marketHunter()
  // await dev()
}

main()
