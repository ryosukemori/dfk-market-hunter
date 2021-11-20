import { ethers } from 'ethers'
import { getProvider } from '../wallet'

export const abi = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function balanceOf(address) view returns (uint)',
  'function approve(address _spender, uint256 _value) public returns (bool success)',
  'function allowance(address _owner, address _spender) public view returns (uint256 remaining)',
]

type TokenInfo = {
  name: string
  symbol: string
  decimals: number
  balance: ethers.BigNumber
}

export const getTokenInfos = async (address: string, walletAddress: string) => {
  const provider = getProvider()
  const contract = new ethers.Contract(address, abi, provider)
  try {
    const [name, symbol, balance, decimals] = await Promise.all([
      await contract.callStatic.name(),
      await contract.callStatic.symbol(),
      await contract.callStatic.balanceOf(walletAddress),
      await contract.callStatic.decimals(),
    ])
    return {
      name,
      symbol,
      decimals,
      balance,
    } as TokenInfo
  } catch (e) {
    console.error(e)
    return undefined
  }
}
