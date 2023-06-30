import SignInComponent from '../components/SignInComponent'
import styled from 'styled-components'

const SignInPage = () => {
  return (
    <FlexBox className='signinpage'>
        <SignInComponent />
    </FlexBox>
  )
}

const FlexBox = styled.div`
    flex-grow: 1;
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;
    
`

export default SignInPage
