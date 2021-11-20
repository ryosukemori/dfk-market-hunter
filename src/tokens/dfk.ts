import { ethers } from 'ethers'
import { getTokenInfos } from './erc20'

const jewelAddress = '0x72cb10c6bfa5624dd07ef608027e366bd690048f'
const heroAddress = '0x5f753dcdf9b1ad9aabc1346614d1f4746fd6ce5c'

export const getJewelInfo = async (walletAddress: string) => {
  return await getTokenInfos(jewelAddress, walletAddress)
}

export const getHeroInfo = async (walletAddress: string) => {
  return await getTokenInfos(heroAddress, walletAddress)
}
