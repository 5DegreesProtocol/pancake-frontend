import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useProfileForAddress } from 'state/profile/hooks'
import { useTranslation } from 'contexts/Localization'

import { getPancakeTxList } from 'hooks/api'

import HistoryItem from './HistoryItem'

export interface IFollowRowProps {
  name: string
  address: string
  image: string
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

const EmptyDiv = styled.div`
  text-align: center;
  padding: 12px;
`

const ItemRow = styled.div`
  overflow: hidden;
  margin-bottom: 12px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  border-color: ${({ theme }) => theme.colors.cardBorder};
`

const AvatarImage = styled.img`
  position: absolute;
  width: 64px;
  height: 64px;
  border-radius: 100%;
`

const ContentDiv = styled.div`
  margin-left: 80px;
  min-height: 64px;
`

const NameDiv = styled.div`
  font-size: 20px;
  font-weight: bold;
  line-height: 36px;
  color: ${({ theme }) => theme.colors.text};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  a,
  span {
    display: inline-block;
    vertical-align: middle;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  img {
    display: inline-block;
    vertical-align: middle;
    width: 18px;
    height: 18px;
    margin-left: 8px;
    float: left;
  }
`

const VolDiv = styled.div`
  //   float: none;
  float: right;
  //   line-height: 32px;
  line-height: 64px;
  font-size: 18px;
  color: ${({ theme }) => theme.colors.text};

  ${({ theme }) => theme.mediaQueries.sm} {
    float: right;
    line-height: 64px;
  }
`

const AddrDiv = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.8;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
`

const FollowRow: React.FC<IFollowRowProps> = (props) => {
  const { address, name, image } = props

  const { t } = useTranslation()

  const [historyList, setList] = useState<TxInfo[]>([])

  const [isOpen, setIsOpen] = useState(false)

  const toggleOpen = () => setIsOpen(!isOpen)

  const { profile } = useProfileForAddress(address)

  const [vol, setVol] = useState(0)

  function formatVol(volome: number) {
    if (volome === 0) {
      return 0
    }
    return `$${volome.toFixed(4)}`
  }
  function getList() {
    if (address) {
      const timestampNum = parseInt(((Number(new Date().getTime()) - 3600 * 24 * 90 * 1000) / 1000).toFixed(0))
      getPancakeTxList(address, timestampNum)
        .then((res) => {
          let volInUsd = 0
          if (res && res.length !== undefined) {
            res.forEach((tx: TxInfo) => {
              volInUsd += Number(tx.amountUSD)
            })

            setList(res)
            setVol(volInUsd)
          }
        })
        .catch((err) => {
          console.error(err)
        })
    }
  }

  useEffect(() => {
    getList()
  }, [address]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <ItemRow>
        <div>
          <AvatarImage
            src={image || profile?.profile?.nft?.image?.original || '/images/nfts/no-profile-md.png'}
            alt=""
          />
          <ContentDiv onClick={toggleOpen}>
            <VolDiv>{formatVol(vol)}</VolDiv>
            <NameDiv>
              {' '}
              <span>{name || `${address.substring(0, 6)}...${address.substring(address.length - 6)}`}</span>
              <a target="_blank" rel="noreferrer" href={`https://fans3.5degrees.io/#/address/${address}/bsc`}>
                <img src="https://tp-statics.tokenpocket.pro/logo/5degrees-logo.png" alt="5degrees" />
              </a>{' '}
            </NameDiv>
            <AddrDiv>{address}</AddrDiv>
          </ContentDiv>
        </div>
        {isOpen && historyList.length ? (
          historyList.map((history) => {
            return <HistoryItem key={history.id} historyDetail={history} />
          })
        ) : isOpen ? (
          <EmptyDiv>{t('No trade info')}</EmptyDiv>
        ) : (
          <></>
        )}
      </ItemRow>
    </>
  )
}

export default FollowRow
