import styled from "styled-components"
import SummaryCard from "./SummaryCard"
import { CardType } from '../datatypes/SummaryCardEnum'


const DashboardContent = () => {



  return (
    <Container>
        <Head>
          <HeadTitle>Hello, User</HeadTitle>
          <HeadBlurb>Below you will find all pertinent information about your system.</HeadBlurb>
        </Head>
        <Summary>
          <SummaryCard title={ 'Hosts Scanned' } type={CardType.HOSTSSCANNED}/>
          {/* <SummaryCard title={ 'Vulnerabilities Found' }   type={CardType.VULNERABILITIESFOUND}/> */}
          <SummaryCard title={ 'Most Vulnerable Hosts' }  type={CardType.VULNERABILITIESBYSEV}/>
          <SummaryCard title={ 'Risk Score' }  type={CardType.RISKSCORE}/>
        </Summary>
    </Container>
  )
}

const Container = styled.div`

`

const Head = styled.div`
  border-bottom: 1px solid #b3b3b3;
  padding-bottom: 15px;
`

const HeadBlurb = styled.div`
  color: #b3b3b3;
`

const HeadTitle = styled.h1`
  padding-bottom: 8px;
  
`

const Summary = styled.div`
  border-bottom: 1px solid #b3b3b3;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 10px;
`

export default DashboardContent