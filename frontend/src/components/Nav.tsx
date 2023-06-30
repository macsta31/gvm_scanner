import styled from "styled-components"

const Nav = () => {
  return (
    <FlexBox>
        <ListItem>Dashboard</ListItem>
        <ListItem>Profile</ListItem>
        <ListItem>About</ListItem>
    </FlexBox>
  )
}

const FlexBox = styled.ul`
    display: flex;
    list-style: none;
    background-color: white;
    border-radius: 20px;
    padding: 0px 20px;
`

const ListItem = styled.li`
    margin: 5px; 
    padding: 5px 15px;
    color: black;
    border-radius: 20px;

    &:active{
        background: #9461fb;
        color: white;
    }

    &:hover{
        cursor: pointer;
    }
`

export default Nav