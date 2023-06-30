import { useAuth } from "../contexts/AuthContext"
import styled from "styled-components"
import { useNavigate } from "react-router-dom"
import axios from '../axios'
import { ChangeEvent, useState } from "react"





const SignInComponent = () => {

    const { currentUser, login } = useAuth()
    const [form, setForm] = useState({username: '', password: ''})
    const [signUpState, setSignUpState] = useState(false)
    const [incorrectUP, setIncorrectUP] = useState(false)
    const navigate = useNavigate()

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        e.preventDefault()
        setForm({
            ...form,
            [e.target.name]: e.target.value,
          });
          const input1 = document.getElementById('userInput')
          if( input1 !== null){
            input1.style.border = '1px solid black'
          }
          const input2 = document.getElementById('pwInput')
          if( input2 !== null){
            input2.style.border = '1px solid black'
          }
          
    }

    const logInHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post('/users/authenticate', {
                username: form.username,
                password: form.password,
            });
            console.log(response.data)
            login('user')
            navigate('/')
        } catch (error:any) {
            if(error.response.data.message === 'Authentication failed'){
                setIncorrectUP(true)
                const formElement = e.target as HTMLFormElement;
                const inputElement = formElement[0] as HTMLElement;
                const inputElement1 = formElement[1] as HTMLElement
                inputElement.style.border = '1px solid red'
                inputElement1.style.border = '1px solid red'
            }
        }
    };

    const signUpHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post('/users/signup', {
                username: form.username,
                password: form.password,
            });
            console.log(response.data)
            login('user')
            setSignUpState(!signUpState)
            // navigate('/')
        } catch (error) {
            console.error(error);
        }
    }

    // const logInHandlder = async (e: React.MouseEvent<HTMLFormElement, MouseEvent>) => {
    //     e.preventDefault();
    //     login('user');
    //     fetch('http://localhost:8000/users/authenticate', {
    //         credentials: 'include', // This line is important
    //     })
    //     .then(response => response.json())
    //     .then(data => {
    //         // Handle the response data
    //         console.log(data);
    //     })
    //     .catch(error => {
    //         // Handle any errors that occur during the request
    //         console.error(error);
    //     });
    //     navigate('/');
    // }

    const getCurrentUser = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        console.log(currentUser)
    }
    return (
    <Card>
        {
            !signUpState ?
            <>
                <Title>You must Sign in to access</Title>
                <Form onSubmit={(e) => logInHandler(e)} >
                    <Field>
                        <FieldTitle>Email</FieldTitle>
                        <Input id='userInput' name='username' placeholder="Uname@mail.com" onChange={(e) => (handleChange(e))}/>
                    </Field>
                    <Field>
                        <FieldTitle>Password</FieldTitle>
                        <Input id='pwInput' type="password" name='password' placeholder="Password" onChange={(e) => (handleChange(e))}/>
                    </Field>
                    <Button type="submit" >Sign in</Button>
                    {incorrectUP &&
                        <>
                            <Invalid>Incorrect username or password</Invalid>    
                        </>
                    } 
                </Form>
                    <SwitchState>
                        <p>Not a user yet? <SwitchStateButton onClick={() => setSignUpState(!signUpState)}>Sign up!</SwitchStateButton></p>
                    </SwitchState>
            </>
            :
            <>
                <Title>Sign up!</Title>
                <Form onSubmit={(e) => signUpHandler(e)} >
                    <Field>
                        <FieldTitle>Email</FieldTitle>
                        <Input name='username' placeholder="Uname@mail.com" onChange={(e) => (handleChange(e))}/>
                    </Field>
                    <Field>
                        <FieldTitle>Password</FieldTitle>
                        <Input type="password" name='password' placeholder="Password" onChange={(e) => (handleChange(e))}/>
                    </Field>
                    <Button type="submit" >Sign up</Button>  
                </Form>
                    <SwitchState>
                        <p>Already a user? <SwitchStateButton onClick={() => setSignUpState(!signUpState)}>Sign in!</SwitchStateButton></p>
                    </SwitchState>
            </>

        }
    </Card>
    )
}

const Invalid = styled.p`
    font-size: 0.8em;
    color: red;
    text-align: center;
`

const SwitchState = styled.div`
    text-align: center;
`

const SwitchStateButton = styled.button`
    background: none;
    border: none;
    color: #9461fb;
    text-decoration: underline;

    &:hover{
        cursor: pointer;
    }
`

const FieldTitle = styled.h4`
    color: black;
    color: #8c8d91;
    font-size: 12px;
    padding-bottom: 5px;
`

const Title = styled.h3`
    color: black;
    text-align: center;
`

const Card = styled.div`
    display: flex;
    flex-direction: column;
    height: 500px;
    width: 400px;
    border-radius: 8px;
    background-color: white;
    padding: 80px 60px;
`

const Field = styled.div`
    display: flex;
    flex-direction: column;
`

const Form = styled.form`
    display: flex;
    flex-direction: column;
    flex-grow:1;
    justify-content: space-evenly;
    
`

const Input = styled.input`
    padding: 6px;
    border-radius: 5px;
    border: 1px solid #8c8d91;
    color: black;
`
const Button = styled.button`
    border: none;
    border-radius: 5px;
    color: white;
    background-color: #9461fb;
    height: 28px;

    &:hover{
        cursor: pointer;
    }
`
export default SignInComponent