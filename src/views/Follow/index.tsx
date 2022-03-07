import React from 'react'
import { useWeb3React } from '@web3-react/core'
import { Heading, Text, Button, ArrowForwardIcon } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useGetFollows, useGetPopular } from 'hooks/api'
import Page from 'components/Layout/Page'
import { useTranslation } from 'contexts/Localization'
import PageHeader from 'components/PageHeader'
import Table from './components/FollowTable'

const H3Div = styled.div`
  position: relative;
  max-width: 960px;
  margin: 36px auto 12px;
  font-weight: bold;
  font-size: 16px;
`

export interface RowProps {
  name: string
  address: string
  image: string
}

const Follow: React.FC = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()

  const myData = [
    {
      address: account,
      name: '',
      image: '',
    },
  ]

  const rowData = useGetFollows(account)

  const popularData = useGetPopular()

  const popularRowData = popularData.map((item) => {
    return {
      address: item,
      name: '',
      image: '',
    }
  })

  const renderContent = (): JSX.Element => {
    return (
      <>
        {account && (
          <>
            {' '}
            <H3Div v-if="account">You</H3Div>
            <Table data={myData} />{' '}
          </>
        )}

        <H3Div>Your Followings</H3Div>
        <Table data={rowData} />

        <H3Div>Trending</H3Div>
        <Table data={popularRowData} />
      </>
    )
  }

  return (
    <>
      <PageHeader>
        <Heading as="h1" scale="xxl" color="secondary" mb="24px">
          {t('Social')}
        </Heading>
        <Heading scale="lg" color="text">
          {t('Meet your Web3 friends on pancake')}
        </Heading>
        {account && (
          <a
            target="_blank"
            rel="noreferrer"
            href={`https://fans3.5degrees.io/#/address/${account}/bsc`}
            id="lottery-pot-banner"
          >
            <Button p="0" variant="text">
              <Text color="primary" bold fontSize="16px" mr="4px">
                {t('Check your own profile')}
              </Text>
              <ArrowForwardIcon color="primary" />
            </Button>
          </a>
        )}
      </PageHeader>
      <Page>{renderContent()}</Page>
    </>
  )
}

export default Follow
