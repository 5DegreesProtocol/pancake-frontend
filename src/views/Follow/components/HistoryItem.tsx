import React from 'react'
import dayjs from 'dayjs'
import styled from 'styled-components/macro'

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

interface HistoryDetailProps {
  historyDetail: TxInfo
}

const ItemRow = styled.div`
  display: block;
  width: 100%;
  text-align: left;
  margin: 12px 0;
  padding: 0 12px;
  color: ${({ theme }) => theme.colors.text};
`

const ExplorerIcon = styled.img`
  border-radius: 100%;
  width: 18px;
  height: 18px;
  float: left;
`

const OrderPair = styled.div`
  width: 360px;
  display: flex;
  font-family: monospace;

  i {
    margin: 0 8px;
  }
  > span {
    display: inline-block;
    width: 150px;

    span {
      display: inline-block;
      overflow: hidden;
      font-family: monospace;
    }

    span:first-child {
      width: 80px;
      text-align: right;
      margin-right: 6px;
    }
  }
`

const TimeWrap = styled.div`
  width: 185px;
  display: inline-block;
  font-family: monospace;
`

const VolWrap = styled.div`
  width: 110px;
  display: inline-block;
  text-align: right;
  font-family: monospace;
`

const PrimaryPositionIdData = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  HistoryItem > * {
    font-family: monospace;
    margin-right: 8px;
  }
`

const HistoryItem: React.FC<HistoryDetailProps> = (props) => {
  const { historyDetail } = props
  function formatTime(time: any) {
    return dayjs(Number(time) * 1000).format('YYYY-MM-DD HH:mm:ss')
  }
  function formatAmt(amount: any) {
    return Math.abs(Number(amount)).toPrecision(6)
  }
  function formatUsd(amount: any) {
    return Number(amount).toFixed(2)
  }

  const explorerUrl = 'https://bscscan.com'

  return (
    <ItemRow>
      <PrimaryPositionIdData>
        <TimeWrap>{formatTime(historyDetail.timestamp)}</TimeWrap>
        {Number(historyDetail.amount0) > 0 ? (
          <OrderPair>
            <span>
              <span>{formatAmt(historyDetail.amount0)}</span>
              <span>{historyDetail?.token0?.symbol}</span>
            </span>
            <i>{'->'}</i>
            <span>
              <span>{formatAmt(historyDetail.amount1)}</span>
              <span>{historyDetail?.token1?.symbol}</span>
            </span>
          </OrderPair>
        ) : (
          <OrderPair>
            <span>
              <span>{formatAmt(historyDetail.amount1)}</span>
              <span>{historyDetail?.token1?.symbol}</span>
            </span>
            <i>{'->'}</i>
            <span>
              <span>{formatAmt(historyDetail.amount0)}</span>
              <span>{historyDetail?.token0?.symbol}</span>
            </span>
          </OrderPair>
        )}
        <VolWrap>${formatUsd(historyDetail.amountUSD)}</VolWrap>
        <div>
          <a target="_blank" rel="noreferrer" href={`${explorerUrl}/tx/${historyDetail?.id?.split('-')[0]}`}>
            <ExplorerIcon src="https://tp-statics.tokenpocket.pro/logo/bscscan.png" alt="" />
          </a>
        </div>
      </PrimaryPositionIdData>
    </ItemRow>
  )
}

export default HistoryItem
