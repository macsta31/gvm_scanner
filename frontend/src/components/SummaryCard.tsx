import React from 'react'
import styled from 'styled-components'
import { CardType } from '../datatypes/SummaryCardEnum'
import HostsScannedCard from './HostsScannedCard'
import RiskScoreCard from './RiskScoreCard'
import VulnBySevCard from './VulnBySevCard'
import VulnFoundCard from './VulnFoundCard'


interface SummaryCardProps{
    title: string,
    type: CardType
}

const SummaryCard: React.FC<SummaryCardProps> = ({title, type}) => {
  return (
    <Container>
        <Head><HeadTitle>{title}</HeadTitle></Head>
        <CardBody>
          {type === CardType.HOSTSSCANNED && 
            <HostsScannedCard />
          }
          {
            type === CardType.RISKSCORE && 
            <RiskScoreCard />
          }
          {type === CardType.VULNERABILITIESBYSEV && 
            <VulnBySevCard />
          }
          {type === CardType.VULNERABILITIESFOUND && 
            <VulnFoundCard />
          }
        </CardBody>
      
    </Container>
  )
}

const Container = styled.div`
  padding: 10px 0px; 
  text-align: center;
  margin: 5px 0px;

  &:nth-child(-n+2){
    border-right: 1px solid #b3b3b3;
  }
`

const Head = styled.div`
  padding-bottom: 10px;
`

const HeadTitle = styled.h4`

`


const CardBody = styled.div`

`

export default SummaryCard