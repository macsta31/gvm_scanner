import styled from 'styled-components'


interface ReportBodyProps{
    reportBody: JSON;
}

const ReportBody: React.FC<ReportBodyProps> = ({reportBody}) => {
  return (
    <Div>{JSON.stringify(reportBody)}</Div>
  )
}

const Div = styled.div`
    overflow: hidden;
`

export default ReportBody