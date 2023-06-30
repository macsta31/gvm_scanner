import { useEffect, useState } from "react"
import axios from '../axios'
import styled from "styled-components"
import Progressbar from './Progressbar';
import Task from "../datatypes/TaskDataType";
import { BsBullseye } from 'react-icons/bs'
import {  BiTask } from 'react-icons/bi'
import { FiUsers } from 'react-icons/fi'
import { CiUser } from 'react-icons/ci'
import { AiOutlineDashboard } from 'react-icons/ai'
import { Chart } from "react-google-charts";
import { BarLoader } from 'react-spinners';

const HostsScannedCard = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [onGoingTasks, setOnGoingTasks] = useState(0);
    const [finishedTasks, setFinishedTasks] = useState(0);
    const [newTasks, setNewTasks] = useState(0);
    const [numReports, setNumReports] = useState(0)
    const [numTargets, setNumTargets] = useState(0);
    const [chartData, setChartData] = useState<[string, any][]>([])
    const [loading, setLoading] = useState(true)
    const [options, setOptions] = useState<{}>({
      // title: "Task Status",
      is3D: true,
      backgroundColor: 'none',
      legend: {
        position: 'none'
      },
      chartArea: {
        left: 10,
        top: 10,
        right: 10,
        bottom: 10,
      },
      pieSliceBorderColor: "transparent",
      pieSliceText: "value",
      pieSliceTextStyle: {
        color: "white",
      },
      colors: ["#9561fa", "#1ee500", "#4927d9"],  // Specify your desired colors here
    })
    
  
    useEffect(() => {
        axios
            .get('/tasks/get')
            .then((response) => {
            setTasks(response.data);
            })
            .catch((error) => {
            console.error(error);
            });
        axios
            .get('/targets/get')
            .then((response) => {
                setNumTargets(response.data.length);
            })
            .catch((error) => {
                console.error(error);
            });
        axios
            .get('/reports/get')
            .then((response) => {
                setNumReports(response.data.length);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);
  
    useEffect(() => {
      let done = 0;
      let new_ = 0;
      let ongoing = 0;
  
      tasks.forEach((task) => {
        switch (task.status.text) {
          case 'Done':
            done++;
            break;
          case 'New':
            new_++;
            break;
          default:
            ongoing++;
            break;
        }
      });
      setChartData([
        ["Tasks", "Status"],
        ['Done', done],
        ['New', new_],
        ['Ongoing', ongoing]
      ])
      setOnGoingTasks(ongoing);
      setNewTasks(new_);
      setFinishedTasks(done);
      setLoading(false)


      
    }, [tasks]);
  
    return (
        <>
            {/* <FlexBox>
                <Div><BiTask /><p>Tasks: </p></Div>
                <ScanCounts>
                    <NewCount>{newTasks}</NewCount>
                    <OngoingCount>{onGoingTasks}</OngoingCount>
                    <DoneCount>{finishedTasks}</DoneCount>
                </ScanCounts>
            </FlexBox>
            <FlexBox>
                <Div><BsBullseye /><p>Targets: </p></Div>
                <ScanCounts>{numTargets}</ScanCounts>
                
            </FlexBox> */}
            {
              loading ?
              <><BarLoader /></>:
              <><Chart 
              chartType="PieChart"
              data={chartData}
              options={options}
              width={"100%"}
              height={"200px"}
              /></>
            }
            
        </>
    );
  };
  
  const Div = styled.div`
    display: flex;
    margin-right: 10px;
  `

const FlexBox = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-right: 10px;
    margin-bottom: 15px;
`

const ScanCounts = styled.div`
   display: grid;
   grid-template-columns: 1fr 1fr 1fr;
   grid-gap: 5px;
`

const NewCount = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: blue;
  padding: 5px;
  color: white;
  border-radius: 10px;
`
const OngoingCount = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: yellow;
    padding: 5px 10px;
    border-radius: 10px;
`
const DoneCount = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: green; 
    padding: 5px;
    color: white;
    border-radius: 10px;
`

export default HostsScannedCard
