import { ReactNode } from "react"
import styled from "styled-components"

interface DashProps{
    content: ReactNode
}

const DashContent: React.FC<DashProps> = ({ content }) => {
  return (
    <Container>
        {content}
    </Container>
  )
}

const Container = styled.div`
    color: black;
    flex: 1 1 auto;
    border: 1px solid black;
    border-radius: 20px;
    margin-left: 30px;
`

export default DashContent