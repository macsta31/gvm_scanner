import axios from 'axios';
import axiosHelp from '../axios'
import React, { ChangeEvent, useEffect, useState } from 'react';
import styled from 'styled-components'
import Cookies from 'js-cookie';
import Target from '../datatypes/TargetDataType';
import Task from '../datatypes/TaskDataType';

interface CreateTaskProps{
    createPage: boolean,
    setCreatePage: (bool: boolean) => void
    setTasks: (targets: Task[]) => void,
    tasks: Task[]
}

interface ModalBackgroundProps {
  show: boolean;
}

interface FormState {
  taskName: string;
  target: string;
  config: string;
  scanner: string;
}

const CreateTask: React.FC<CreateTaskProps> = ({ createPage, setCreatePage, setTasks, tasks }) => {

    const [inputs, setInputs] = useState<string[]>(['']);
    const [targets, setTargets] = useState<Target[]>([]);
    const [configs, setConfigs] = useState<[string, string][]>([])
    const [scanners, setScanners] = useState<[string, string][]>([])
    const [formState, setFormState] = useState<FormState>({
        taskName: '',
        target: '',
        config: '',
        scanner: '',
    });

    useEffect(() => {
        axiosHelp.get('/targets/get')
        .then((response) => {
            setTargets(response.data)
        })
        .catch((error) => {
            console.error(error)
        })

        axiosHelp.get('/configs/get')
        .then((response) => {
            const optionsArray = Object.entries(response.data).map(([key, value]) => [key, String(value)]) as [string, string][];
            setConfigs(optionsArray);
        })
        .catch((error) => {
            console.error(error)
        })
        axiosHelp.get('/scanners/get')
        .then((response) => {
            const optionsArray = Object.entries(response.data).map(([key, value]) => [key, String(value)]) as [string, string][];
            setScanners(optionsArray);
        })
        .catch((error) => {
            console.error(error)
        })
    }, [])
    
      const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormState({
          ...formState,
          [e.target.name]: e.target.value,
        });
        // console.log(formState)
      };
      
      const createTask = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const csrfCookie = Cookies.get('csrftoken');
        try {
          const response = await axios.post('http://localhost:8000/tasks/create', {
            name: formState.taskName,
            target: formState.target,
            config: formState.config,
            scanner: formState.scanner
            // include all data you want to send in this object
          }, {
            headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': csrfCookie,
              // include any additional headers if required
            },
            withCredentials: true,
          });
          const newTaskId = response.data.message
          axiosHelp
          .get(`/tasks/get_id?task_id=${newTaskId}`)
          .then((response) => {
            const newTask = response.data as Task[]
            console.log(newTask[0])
            const updatedTasks = [...tasks, newTask[0]]
            setTasks(updatedTasks)
          })
          window.location.reload()
          setCreatePage(false)
          // console.log(response.data);
        } catch (error) {
          console.error(`Error posting data: ${error}`);
        }
      }

  return (
    <ModalBackground show={createPage} onClick={() => setCreatePage(false)}>
              <CreatePageModal onClick={(e) => e.stopPropagation()}>
                <h2>Create New Task</h2>
                <Line></Line>
                <Form onSubmit={(e) => createTask(e)}>
                    <InputSection>
                        <InputTitle>Task Name</InputTitle>
                        <Input name="taskName" value={formState.taskName} onChange={handleFormChange} />
                    </InputSection>
                    <InputSection>
                        <InputTitle>Target</InputTitle>
                        <Select name="target" value={formState.target} onChange={handleFormChange}>
                            <option value=""></option>
                        {
                            targets.map((target_, index) => (
                                <option value={target_.id} key={index} >{target_.name}</option>
                            ))
                        }
                        </Select>
                    </InputSection>
                    <InputSection>
                        <InputTitle>Scanner</InputTitle>
                        <Select name="scanner" value={formState.scanner} onChange={handleFormChange}>
                            <option value=""></option>
                        {scanners.map(([label, value], index) => (
                                <option key={index} value={value}>
                                {label}
                                </option>
                            ))}
                        </Select>
                    </InputSection>
                    { formState.scanner !== '6acd0832-df90-11e4-b9d5-28d24461215b' && 
                        <InputSection>
                        <InputTitle>Config</InputTitle>
                        <Select name="config" value={formState.config} onChange={handleFormChange}>
                            <option value=""></option>
                            {configs.map(([label, value], index) => (
                                <option key={index} value={value}>
                                {label}
                                </option>
                            ))}
                        </Select>
                        </InputSection>
                    }
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

export default CreateTask