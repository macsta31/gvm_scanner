import axios from 'axios';
import axiosHelp from '../axios'
import React, { ChangeEvent, useState } from 'react';
import styled from 'styled-components'
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import Target from '../datatypes/TargetDataType';




interface CreateTargetProps{
    createPage: boolean,
    setCreatePage: (bool: boolean) => void,
    setTargets: (targets: Target[]) => void,
    targets: Target[]
}

interface ModalBackgroundProps {
  show: boolean;
}

interface FormState {
  targetName: string;
  portList: string;
}

const CreateTarget: React.FC<CreateTargetProps> = ({createPage, setCreatePage, setTargets, targets}) => {
  const navigate = useNavigate()
  const [inputs, setInputs] = useState<string[]>(['']);
  const [formState, setFormState] = useState<FormState>({
    targetName: '',
    portList: '',
  });

  const handleChange = (i: number, event: ChangeEvent<HTMLInputElement>) => {
    const values = [...inputs];
    values[i] = event.target.value;
    setInputs(values);

  };

  const handleAdd = () => {
    const values = [...inputs];
    values.push('');
    setInputs(values);
  };

  const handleRemove = (i: number) => {
    const values = [...inputs];
    values.splice(i, 1);
    setInputs(values);
  };

  const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let element = document.getElementById('targetName');
        if (element !== null) {
          element.style.border = '1px solid grey';
        }
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });

  }; 

  const createTarget = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const csrfCookie = Cookies.get('csrftoken');
    // console.log(formState.targetName, formState.portList, inputs)
    let response;
    try {
      response = await axios.post('http://localhost:8000/targets/create', {
        name: formState.targetName,
        portList: formState.portList,
        hosts: inputs
        // include all data you want to send in this object
      }, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfCookie,
          // include any additional headers if required
        },
        withCredentials: true,
      });
      const newTargetId = response.data.message
      axiosHelp
      .get(`/targets/get_id?target_id=${newTargetId}`)
      .then((response) => {
        const newTarget = response.data[0] as Target
        console.log(newTarget)
        const updatedTargets = [...targets, newTarget]
        setTargets(updatedTargets);
        const firstTarget = response.data[0];
      })
      .catch((error) => {
        console.error(error);
      });
      // setTargets(oldTargets => [...oldTargets, ])
      setCreatePage(false)

      // window.location.reload()
    } catch (error) {
        console.error(`Error posting data: 'Target Already Exists`);
        let element = document.getElementById('targetName');
        if (element !== null) {
          element.style.border = '1px solid red';
        }

      
    }
  }

  return (
    <ModalBackground show={createPage} onClick={() => setCreatePage(false)}>
              <CreatePageModal onClick={(e) => e.stopPropagation()}>
                <h2>Create New Target</h2>
                <Line></Line>
                <Form onSubmit={(e) => createTarget(e)}>
                  <InputSection>
                    <InputTitle>Target Name</InputTitle>
                    <Input name="targetName" value={formState.targetName} onChange={handleFormChange} id='targetName'/>
                  </InputSection>
                  <InputSection>
                    <InputTitle>Port List</InputTitle>
                    <Select name="portList" value={formState.portList} onChange={handleFormChange}>
                      <option value=""></option>
                      <option value="33d0cd82-57c6-11e1-8ed1-406186ea4fc5">All IANA assigned TCP</option>
                      <option value="4a4717fe-57d2-11e1-9a26-406186ea4fc5">All IANA assigned TCP and UDP</option>
                      <option value="730ef368-57e2-11e1-a90f-406186ea4fc5">All TCP and Nmap top 100 UDP</option>
                    </Select>
                  </InputSection>
                  <>
                  {inputs.map((input, idx) => (
                    <SpecialInputSection key={idx}>
                      <InputTitle>Host {idx + 1}</InputTitle>
                      <Input onChange={e => handleChange(idx, e)} />
                      {inputs.length > 1 && <Button type="button" onClick={() => handleRemove(idx)}>Remove</Button>}
                      <Button type="button" onClick={() => handleAdd()}>Add</Button>
                    </SpecialInputSection>
                  ))}
                  </>
                  <Submit type='submit'>Create new Target</Submit>
                </Form>
              </CreatePageModal>
    </ModalBackground>
  )
}

const Submit = styled.button`
  margin-top: 20px;
  background: none;
  border: none;
  padding: 10px;
  background-color: #9461fb;
  color: white;
  border-radius: 10px;
  font-size: 1.05em;
`

const Button = styled.button`
  background: none;
  border: 1px solid grey;
  margin-left: 5px;
  border-radius: 10px;
  padding: 5px
`

const SpecialInputSection = styled.div`
  display: flex;
  margin-top: 10px;
  width: 100%;
  flex-grow: 1;
`


const CreatePageModal = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: min-content;
  border-radius: 20px;
  z-index: 2;

`

const ModalBackground = styled.div<ModalBackgroundProps>`
  display: ${(props) => (props.show ? "block" : "none")};
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0,0,0,0.4);
`

const Line = styled.div`
  width:100%;
  border-bottom: 1px solid grey;
  margin: 5px 0px;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
`

const Input = styled.input`
  min-width:200px;
  border-radius: 10px;
  border: 1px solid grey;
  padding: 0px 10px;
`

const InputSection = styled.div`
  display: flex;
  margin-top: 10px;
`

const InputTitle = styled.h3`
  color: grey;
  font-size: 0.9em;
  padding: 8px 0px;
  min-width: 100px;
`

const Select = styled.select`
  min-width:200px;
  border-radius: 10px;
  border: 1px solid grey
`

export default CreateTarget