import styled from "styled-components"
import Sidebar from "./Sidebar"
import DashContent from "./DashContent"
import { ReactNode } from "react"
import { Routes, Route } from 'react-router-dom'
import Tasks from "./Tasks"
import Targets from "./Targets"
import DashboardContent from "./DashboardContent"

interface DashboardProps{
  children: ReactNode
}

const Dashboard: React.FC<DashboardProps> = () => {
  return (
    <Container>
      
      <ContentContainer>
        <Routes>
          <Route path="/" element={<DashboardContent />}/>
          <Route path='/tasks' element={<Tasks />} />
          <Route path='/targets' element={<Targets />} />
        </Routes>
      </ContentContainer>
    </Container>
  )
}

const ContentContainer = styled.div`
  color: black;
  flex: 1 1 auto;
  // border: 1px solid black;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  // border-radius: 20px;
  // margin-left: 30px;
  padding: 30px 50px;
  background-color: #eee;
`

const Container = styled.div`
  display: flex;
  color: black;
  flex-grow: 1;
  // justify-self: center;
  width: 100%;
`

export default Dashboard