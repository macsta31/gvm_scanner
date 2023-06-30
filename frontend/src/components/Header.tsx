import styled from "styled-components"
import Nav from "./Nav"
import { useAuth } from "../contexts/AuthContext"
import axios from '../axios'

const Header = () => {
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    axios
    .get('/users/logout')
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
  }

  return (
    <FlexBox>
        <h3>Cyber Tool</h3>
        {/* <Nav /> */}
        <Button onClick={() => handleLogout()}>Log out</Button>
    </FlexBox>
  )
}

export default Header

const FlexBox = styled.div`
    display: flex;
    align-items: center;
    padding: 30px;
    background-color: #9461fb;
    height: 50px;
    font-size: 18px;
    justify-content: space-between;
`

const Button = styled.button`
  background-color: white;
  border-radius: 20px;
  padding: 5px 20px;
  color: black;
  font-size: 21px;
  border: none;

  &:hover{
    cursor: pointer
  }
`