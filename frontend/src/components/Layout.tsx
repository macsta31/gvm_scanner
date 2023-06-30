import React from "react"
import Header from "./Header"
import styled from "styled-components"
import Sidebar from "./Sidebar"


interface LayoutProps{
  children: React.ReactNode
}

const Layout:React.FC<LayoutProps> = ({ children }) => {
  return (
    <Page className="layout">
      {/* <Header /> */}
      <Sidebar />
      <Body className="body">
        {children}
      </Body>
    </Page>
  )
}

const Page = styled.div`
  display: flex;
  min-height: 100vh;
`

const Body = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  // justify-content: center;
  align-items:center;
`

export default Layout