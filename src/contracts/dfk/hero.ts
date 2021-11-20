import { getProvider } from '../../wallet'
import { ethers } from 'ethers'

type StatGens = {
  class: string
  subClass: string
  profession: string
  passive1: string
  passive2: string
  active1: string
  active2: string
  statBoost1: string
  statBoost2: string
  statsUnknown1: string
  element: string
  statsUnknown2: string
}

type Hero = {
  agility: number
  agilityGrowthP: number
  agilityGrowthS: number
  assistantId: {
    id: string
  }
  currentQuest: string
  dexterity: number
  dexterityGrowthP: number
  dexterityGrowthS: number
  endurance: number
  enduranceGrowthP: number
  enduranceGrowthS: number
  firstName: number
  fishing: number
  foraging: number
  gardening: number
  generation: number
  hp: number
  hpFullAt: string
  hpLgGrowth: number
  hpRgGrowth: number
  hpSmGrowth: number
  id: string
  intelligence: number
  intelligenceGrowthP: number
  intelligenceGrowthS: number
  lastName: number
  level: number
  luck: number
  luckGrowthP: number
  luckGrowthS: number
  mainClass: string
  maxSummons: number
  mining: number
  mp: number
  mpFullAt: string
  mpLgGrowth: number
  mpRgGrowth: number
  mpSmGrowth: number
  nextSummonTime: string
  owner: {
    id: string
    name: string
    picId: number
  }
  rarity: number
  shiny: boolean
  shinyStyle: number
  sp: number
  stamina: number
  staminaFullAt: string
  statGenes: string
  status: string
  strength: number
  strengthGrowthP: number
  strengthGrowthS: number
  subClass: string
  summonedTime: string
  summonerId: {
    id: string
  }
  summons: number
  visualGenes: string
  vitality: number
  vitalityGrowthP: number
  vitalityGrowthS: number
  wisdom: number
  wisdomGrowthP: number
  wisdomGrowthS: number
  xp: string
  stats: {
    stamina: number
    statGens: StatGens
  }
}

type HeroClass = { id: number; name: string }

const contractAddress = '0x5f753dcdf9b1ad9aabc1346614d1f4746fd6ce5c'

const abi = [
  {
    inputs: [{ internalType: 'address', name: '_address', type: 'address' }],
    name: 'getUserHeroes',
    outputs: [{ internalType: 'uint256[]', name: '', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_id', type: 'uint256' }],
    name: 'getHero',
    outputs: [
      {
        components: [
          { internalType: 'uint256', name: 'id', type: 'uint256' },
          {
            components: [
              { internalType: 'uint256', name: 'summonedTime', type: 'uint256' },
              { internalType: 'uint256', name: 'nextSummonTime', type: 'uint256' },
              { internalType: 'uint256', name: 'summonerId', type: 'uint256' },
              { internalType: 'uint256', name: 'assistantId', type: 'uint256' },
              { internalType: 'uint32', name: 'summons', type: 'uint32' },
              { internalType: 'uint32', name: 'maxSummons', type: 'uint32' },
            ],
            internalType: 'struct IHeroTypes.SummoningInfo',
            name: 'summoningInfo',
            type: 'tuple',
          },
          {
            components: [
              { internalType: 'uint256', name: 'statGenes', type: 'uint256' },
              { internalType: 'uint256', name: 'visualGenes', type: 'uint256' },
              { internalType: 'enum IHeroTypes.Rarity', name: 'rarity', type: 'uint8' },
              { internalType: 'bool', name: 'shiny', type: 'bool' },
              { internalType: 'uint16', name: 'generation', type: 'uint16' },
              { internalType: 'uint32', name: 'firstName', type: 'uint32' },
              { internalType: 'uint32', name: 'lastName', type: 'uint32' },
              { internalType: 'uint8', name: 'shinyStyle', type: 'uint8' },
              { internalType: 'uint8', name: 'class', type: 'uint8' },
              { internalType: 'uint8', name: 'subClass', type: 'uint8' },
            ],
            internalType: 'struct IHeroTypes.HeroInfo',
            name: 'info',
            type: 'tuple',
          },
          {
            components: [
              { internalType: 'uint256', name: 'staminaFullAt', type: 'uint256' },
              { internalType: 'uint256', name: 'hpFullAt', type: 'uint256' },
              { internalType: 'uint256', name: 'mpFullAt', type: 'uint256' },
              { internalType: 'uint16', name: 'level', type: 'uint16' },
              { internalType: 'uint64', name: 'xp', type: 'uint64' },
              { internalType: 'address', name: 'currentQuest', type: 'address' },
              { internalType: 'uint8', name: 'sp', type: 'uint8' },
              { internalType: 'enum IHeroTypes.HeroStatus', name: 'status', type: 'uint8' },
            ],
            internalType: 'struct IHeroTypes.HeroState',
            name: 'state',
            type: 'tuple',
          },
          {
            components: [
              { internalType: 'uint16', name: 'strength', type: 'uint16' },
              { internalType: 'uint16', name: 'intelligence', type: 'uint16' },
              { internalType: 'uint16', name: 'wisdom', type: 'uint16' },
              { internalType: 'uint16', name: 'luck', type: 'uint16' },
              { internalType: 'uint16', name: 'agility', type: 'uint16' },
              { internalType: 'uint16', name: 'vitality', type: 'uint16' },
              { internalType: 'uint16', name: 'endurance', type: 'uint16' },
              { internalType: 'uint16', name: 'dexterity', type: 'uint16' },
              { internalType: 'uint16', name: 'hp', type: 'uint16' },
              { internalType: 'uint16', name: 'mp', type: 'uint16' },
              { internalType: 'uint16', name: 'stamina', type: 'uint16' },
            ],
            internalType: 'struct IHeroTypes.HeroStats',
            name: 'stats',
            type: 'tuple',
          },
          {
            components: [
              { internalType: 'uint16', name: 'strength', type: 'uint16' },
              { internalType: 'uint16', name: 'intelligence', type: 'uint16' },
              { internalType: 'uint16', name: 'wisdom', type: 'uint16' },
              { internalType: 'uint16', name: 'luck', type: 'uint16' },
              { internalType: 'uint16', name: 'agility', type: 'uint16' },
              { internalType: 'uint16', name: 'vitality', type: 'uint16' },
              { internalType: 'uint16', name: 'endurance', type: 'uint16' },
              { internalType: 'uint16', name: 'dexterity', type: 'uint16' },
              { internalType: 'uint16', name: 'hpSm', type: 'uint16' },
              { internalType: 'uint16', name: 'hpRg', type: 'uint16' },
              { internalType: 'uint16', name: 'hpLg', type: 'uint16' },
              { internalType: 'uint16', name: 'mpSm', type: 'uint16' },
              { internalType: 'uint16', name: 'mpRg', type: 'uint16' },
              { internalType: 'uint16', name: 'mpLg', type: 'uint16' },
            ],
            internalType: 'struct IHeroTypes.HeroStatGrowth',
            name: 'primaryStatGrowth',
            type: 'tuple',
          },
          {
            components: [
              { internalType: 'uint16', name: 'strength', type: 'uint16' },
              { internalType: 'uint16', name: 'intelligence', type: 'uint16' },
              { internalType: 'uint16', name: 'wisdom', type: 'uint16' },
              { internalType: 'uint16', name: 'luck', type: 'uint16' },
              { internalType: 'uint16', name: 'agility', type: 'uint16' },
              { internalType: 'uint16', name: 'vitality', type: 'uint16' },
              { internalType: 'uint16', name: 'endurance', type: 'uint16' },
              { internalType: 'uint16', name: 'dexterity', type: 'uint16' },
              { internalType: 'uint16', name: 'hpSm', type: 'uint16' },
              { internalType: 'uint16', name: 'hpRg', type: 'uint16' },
              { internalType: 'uint16', name: 'hpLg', type: 'uint16' },
              { internalType: 'uint16', name: 'mpSm', type: 'uint16' },
              { internalType: 'uint16', name: 'mpRg', type: 'uint16' },
              { internalType: 'uint16', name: 'mpLg', type: 'uint16' },
            ],
            internalType: 'struct IHeroTypes.HeroStatGrowth',
            name: 'secondaryStatGrowth',
            type: 'tuple',
          },
          {
            components: [
              { internalType: 'uint16', name: 'mining', type: 'uint16' },
              { internalType: 'uint16', name: 'gardening', type: 'uint16' },
              { internalType: 'uint16', name: 'foraging', type: 'uint16' },
              { internalType: 'uint16', name: 'fishing', type: 'uint16' },
            ],
            internalType: 'struct IHeroTypes.HeroProfessions',
            name: 'professions',
            type: 'tuple',
          },
        ],
        internalType: 'struct IHeroTypes.Hero',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]

const heroClasses: HeroClass[] = [
  { id: 0, name: 'Warrior' },
  { id: 1, name: 'Knight' },
  { id: 2, name: 'Thief' },
  { id: 3, name: 'Archer' },
  { id: 4, name: 'Priest' },
  { id: 5, name: 'Wizard' },
  { id: 6, name: 'Monk' },
  { id: 7, name: 'Pirate' },
  { id: 16, name: 'Paladin' },
  { id: 17, name: 'DarkKnight' },
  { id: 18, name: 'Summoner' },
  { id: 19, name: 'Ninja' },
  { id: 24, name: 'Dragoon' },
  { id: 25, name: 'Sage' },
  { id: 28, name: 'DreadKnight' },
]

const formatHero = (rawHero: any[]): Hero => {
  let hero: any = {}

  rawHero.map((item, index) => {
    switch (index) {
      case 0:
        hero.id = item.toString()
        break
      case 1:
        hero.summonedTime = item[0].toString()
        hero.nextSummonTime = item[1].toString()
        hero.summonerId = { id: item[2].toString() }
        hero.assistantId = { id: item[3].toString() }
        hero.maxSummons = item.maxSummons
        hero.summons = item.summons
        break
      case 2:
        hero.mainClass = item.class
        hero.firstName = item.firstName
        hero.lastName = item.lastName
        hero.generation = item.generation
        hero.rarity = item.rarity
        hero.shiny = item.shiny
        hero.shinyStyle = item.shinyStyle
        hero.statGenes = item[0]
        hero.subClass = item.subClass
        hero.visualGenes = item[1]
        break
      case 3:
        hero.staminaFullAt = item[0].toString()
        hero.hpFullAt = item[1].toString()
        hero.mpFullAt = item[2].toString()
        hero.level = item.level
        hero.xp = item[4].toString()
        hero.currentQuest = item.currentQuest
        hero.sp = item.sp
        hero.status = item.status
        break
      case 4:
        hero.agility = item.agility
        hero.dexterity = item.dexterity
        hero.endurance = item.endurance
        hero.hp = item.hp
        hero.intelligence = item.intelligence
        hero.luck = item.luck
        hero.mp = item.mp
        hero.stamina = item.stamina
        hero.strength = item.strength
        hero.vitality = item.vitality
        hero.wisdom = item.wisdom
        break
      case 5:
        hero.agilityGrowthP = item.agility
        hero.dexterityGrowthP = item.dexterity
        hero.enduranceGrowthP = item.endurance
        hero.hpSmGrowth = item.hpSm
        hero.hpRgGrowth = item.hpRg
        hero.hpLgGrowth = item.hpLg
        hero.mpSmGrowth = item.mpSm
        hero.mpRgGrowth = item.mpRg
        hero.mpLgGrowth = item.mpLg
        hero.intelligenceGrowthP = item.intelligence
        hero.luckGrowthP = item.luck
        hero.strengthGrowthP = item.strength
        hero.vitalityGrowthP = item.vitality
        hero.wisdomGrowthP = item.wisdom
        break
      case 6:
        hero.agilityGrowthS = item.agility
        hero.dexterityGrowthS = item.dexterity
        hero.enduranceGrowthS = item.endurance
        hero.intelligenceGrowthS = item.intelligence
        hero.luckGrowthS = item.luck
        hero.strengthGrowthS = item.strength
        hero.vitalityGrowthS = item.vitality
        hero.wisdomGrowthS = item.wisdom
        break
      case 7:
        hero.mining = item.mining
        hero.gardening = item.gardening
        hero.foraging = item.foraging
        hero.fishing = item.fishing
        break
    }
  })

  const mainClass = heroClasses.find((heroClass) => heroClass.id === hero.mainClass)
  hero.mainClass = mainClass && mainClass.name

  const subClass = heroClasses.find((heroClass) => heroClass.id === hero.subClass)
  hero.subClass = subClass && subClass.name

  return hero as Hero
}

const contract = new ethers.Contract(contractAddress, abi, getProvider())

export const getHero = async (tokenId: number | ethers.BigNumber): Promise<Hero | undefined> => {
  try {
    const tx = await contract.callStatic.getHero(tokenId)
    return formatHero(tx)
  } catch (e) {
    return undefined
  }
}
