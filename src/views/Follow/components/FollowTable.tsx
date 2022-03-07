import React from 'react'
import styled from 'styled-components'
import FollowRow from './FollowRow'

const TableContainer = styled.div`
  position: relative;
  max-width: 960px;
  min-width: 680px;
  margin: 0 auto;
`

export interface RowProps {
  name: string
  address: string
  image: string
}

export interface ITableProps {
  data: RowProps[]
}

const FollowTable: React.FC<ITableProps> = (props) => {
  const { data } = props
  return (
    <TableContainer>
      {data &&
        data.map((row) => {
          return <FollowRow key={`table-row-${row.address}`} image={row.image} address={row.address} name={row.name} />
        })}
    </TableContainer>
  )
}

export default FollowTable
