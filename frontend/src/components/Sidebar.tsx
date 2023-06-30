import { useState } from 'react';
import styled, { css } from "styled-components";
import { Link, isRouteErrorResponse, useLocation } from 'react-router-dom';
import { BsBullseye, BsChevronDoubleLeft } from 'react-icons/bs';
import { BiTask } from 'react-icons/bi';
import { FiUsers } from 'react-icons/fi';
import { CiUser } from 'react-icons/ci';
import { AiOutlineDashboard } from 'react-icons/ai';
import { useAuth } from "../contexts/AuthContext";

const Sidebar = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isRotated, setIsRotated] = useState(false);

  const handleCollapseClick = () => {
    setIsCollapsed(!isCollapsed);
    setIsRotated(!isRotated)
  };

  return (
    <Container isCollapsed={isCollapsed}>
      <div style={{maxHeight:'100vh'}}>
      <SidebarTop>
        <SidebarTitleBox>
          {!isCollapsed && <SidebarTitle>ISAIX</SidebarTitle>}
          <Collapse isRotated={isRotated} onClick={handleCollapseClick}>
            <BsChevronDoubleLeft size={20} />
          </Collapse>
        </SidebarTitleBox>
        <List>
          <CustomLink to="/">
            <ListItem active={location.pathname === '/'}>
              <AiOutlineDashboard size={20} />
              {!isCollapsed && <ListItemText isCollapsed={isCollapsed}>Dashboard</ListItemText>}
            </ListItem>
          </CustomLink>
          <CustomLink to="/targets">
            <ListItem active={location.pathname === '/targets'}>
              <BsBullseye size={20} />
              {!isCollapsed && <ListItemText isCollapsed={isCollapsed}>Targets</ListItemText>}
            </ListItem>
          </CustomLink>
          <CustomLink to="/tasks">
            <ListItem active={location.pathname === '/tasks'}>
              <BiTask size={20} />
              {!isCollapsed && <ListItemText isCollapsed={isCollapsed}>Tasks</ListItemText>}
            </ListItem>
          </CustomLink>
          <CustomLink to="/users">
            <ListItem active={location.pathname === '/users'}>
              <FiUsers size={20} />
              {!isCollapsed && <ListItemText isCollapsed={isCollapsed}>Users</ListItemText>}
            </ListItem>
          </CustomLink>
        </List>
      </SidebarTop>
      {!isCollapsed && (
        <ProfileBox>
          <CiUser size={80} color={'white'} />
          <Username>{currentUser}</Username>
        </ProfileBox>
      )}
      </div>
    </Container>
  )
};

const Container = styled.div<{ isCollapsed: boolean }>`
  display: flex;
  flex-direction: column;
  color: black;
  flex: 1 1 auto;
  // max-height: 100vh;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  width: ${({ isCollapsed }) => (isCollapsed ? '70px' : '250px')};
  max-width: ${({ isCollapsed }) => (isCollapsed ? '70px' : '250px')};
  color: black;
  justify-content: space-between;
  background-color: #9461fb;
  transition: width 0.5s;
`;





const ProfileBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin-bottom: 50px;
`

const Collapse = styled.div<{ isRotated: boolean }>`
  position: absolute;
  top: 10px;
  right: 20px;
  transition: all 1s;
  &:hover{
      transform: scale(1.2);
      cursor: pointer;
  }
  ${({ isRotated }) => isRotated && css`
    transform: rotate(180deg);
  `}
`;

const ListItemText = styled.h3<{ isCollapsed: boolean }>`
  margin-left: 10px;
  text-decoration: none;
  transition: all 0.5s ease-in-out;
  opacity: ${({ isCollapsed }) => (isCollapsed ? 0 : 1)};
  
`;

const SidebarTop = styled.div`

`

const Username = styled.h2`
    padding: 10px;
    color: white;
`

const SidebarTitleBox = styled.div`
    display: flex;
    padding: 30px;
    align-items: center;
    justify-content: center;
    color: black;
    position: relative;
`

const SidebarTitle = styled.h2`
    color: black;
    // font-size: 20px;
`

// const Container = styled.div<{ isCollapsed: boolean }>`
//   display: flex;
//   flex-direction: column;
//   color: black;
//   flex: 1 1 auto;
//   box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
//   width: ${({ isCollapsed }) => (isCollapsed ? '70px' : '250px')};
//   max-width: ${({ isCollapsed }) => (isCollapsed ? '70px' : '250px')};
//   color: black;
//   justify-content: space-between;
//   background-color: #9461fb;
//   transition: width 0.5s;
// `;

const List = styled.ul`
    list-style: none;
`
interface ListItemProps {
    active: boolean;
}


const ListItem = styled.li<ListItemProps>`
    background-color: ${props => props.active ? 'white' : 'transparent'}; 
    & > * {
        color: ${props => props.active ? 'black' : 'white'};
      } 
    border-radius: 25px;
    padding: 15px;
    margin: 20px 10px;
    color: black;
    display: flex;
    align-items:center;
    justify-content: center
    &:hover{
        cursor:pointer;
        transition: 1s;
        transform: scale(1.05)
    }

    &: active{
        transform: scale(0.95)
    }
`

// const ListItemText = styled.h3`
//     margin-left: 10px;
//     text-decoration: none;
// `

const CustomLink = styled(Link)`
    text-decoration: none;
`

export default Sidebar