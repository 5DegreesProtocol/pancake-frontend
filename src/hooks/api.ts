import { useEffect, useState } from 'react'
import { Base64 } from 'js-base64'

/* eslint-disable camelcase */
export interface DeBankTvlResponse {
  id: string
  chain: string
  name: string
  site_url: string
  logo_url: string
  has_supported_portfolio: boolean
  tvl: number
}

export const useGetStats = () => {
  const [data, setData] = useState<DeBankTvlResponse | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://openapi.debank.com/v1/protocol?id=bsc_pancakeswap')
        const responseData: DeBankTvlResponse = await response.json()

        setData(responseData)
      } catch (error) {
        console.error('Unable to fetch data:', error)
      }
    }

    fetchData()
  }, [setData])

  return data
}

/* eslint-disable camelcase */
export interface Follow {
  address: string
  name: string
  image: string
}

export const formatURL = function (url) {
  if (!url) {
    return ''
  }
  let result = url
  if (url.indexOf('ipfs://') === 0) {
    result = url.replace(/ipfs:\/\//, 'https://infura-ipfs.io/ipfs/')
  }
  return result
}

export const useGetFollows = (address) => {
  const [data, setData] = useState<Follow[] | []>([])

  useEffect(() => {
    const fetchData = async () => {
      if (!address) {
        setData([])
        return
      }

      try {
        const response = await fetch(`https://openapi.5degrees.io/follow?address=${address}`)
        const responseData = await response.json()

        const followings = responseData?.data?.followings
        /* eslint-disable */
        if (followings) {
          followings.forEach((f) => {
            if (f.info) {
              const baseStr = f.info.split(',')[1]
              const baseJson = JSON.parse(Base64.decode(baseStr))
              f.name = baseJson.name
              f.image = formatURL(baseJson.image)
            }
          })
        }

        setData(responseData?.data?.followings)
      } catch (error) {
        console.error('Unable to fetch data:', error)
      }
    }

    fetchData()
  }, [setData, address])

  return data
}

interface Token {
  symbol: string
}

interface TxInfo {
  amountUSD?: number
  id?: string
  timestamp?: string
  token0?: Token
  token1?: Token
  amount0?: string
  amount1?: string
}

export async function getPancakeTxList(address, timestamp): Promise<TxInfo[]> {
  const document = `
      query { 
          swaps(first:10, orderBy: timestamp, orderDirection: desc, where:{from: "${address}", timestamp_gt: ${timestamp}}) {
           id
           from
           sender
           to
           timestamp
           amountUSD
           amount0In
           amount1In
           amount0Out
           amount1Out
           transaction {
             id
           }
           token0 {
             symbol
           }
           token1 {
             symbol
           }
         }
      }
    `

  const payload = JSON.stringify({
    query: document,
  })

  const FetchApi = 'https://openapi.5degrees.io/pancake/swaps'

  const response = await fetch(FetchApi, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: payload,
  })

  const { data } = await response.json()

  if (!data) {
    return []
  }

  data.sort((a: TxInfo, b: TxInfo) => Number(b.timestamp) - Number(a.timestamp))
  /* eslint-disable */
  data.forEach((item) => {
    item.amount0 = item.amount0In - item.amount0Out
    item.amount1 = item.amount1In - item.amount1Out
  })

  const txList: TxInfo[] = data

  return txList
}

export const useGetPopular = () => {
  const [data, setData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://preserver.mytokenpocket.vip/v1/wallet/hot_address?ns=ethereum&chain_id=56',
        )
        const responseData = await response.json()

        setData(responseData.data)
      } catch (error) {
        console.error('Unable to fetch data:', error)
      }
    }

    fetchData()
  }, [setData])

  return data
}
