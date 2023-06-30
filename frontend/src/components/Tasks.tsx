import { useState, useEffect } from 'react';
import axios from '../axios';
import styled from 'styled-components';
import Target from '../datatypes/TargetDataType';
import TargetsTable from './DataTable';
import Task from '../datatypes/TaskDataType'
import TableData from '../datatypes/TableData';
import { GridLoader } from 'react-spinners';
import {VscDebugStart, VscDebugStop} from 'react-icons/vsc'
import Progressbar from './Progressbar';
import CreateTask from './CreateTask';
import { BiTrash } from 'react-icons/bi'
import { HiOutlineDocumentReport } from 'react-icons/hi'
import Report from '../datatypes/ReportDataType';
import ReportPage from '../components/Report';
import ClipLoader from "react-spinners/ClipLoader";


        



const Tasks = () => {

  interface TaskProgress {
    id: string;
    progress: string;
    status: string;
  }
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(0)
  const [keys, setKeys] = useState<string[]>([]);
  const [taskProgresses, setTaskProgresses] = useState<TaskProgress[]>([]);
  const [taskProgress, setTaskProgress] = useState<string>('0');
  const [socket, setSocket] = useState<WebSocket | null>();
  const [createPage, setCreatePage] = useState<boolean>(false);
  const [reportPage, setReportPage] = useState<boolean | null>(false);
  const [report, setReport] = useState<Report>()
  const keys_i_want = ['id', 'name', 'owner', 'scanner', 'target', 'config', 'creation date','last report', 'progress', 'Tools'];

  
  useEffect(() => {
    axios
      .get('/tasks/get')
      .then((response) => {
        setTasks(response.data as Task[]);
        const firstTarget = response.data[0];
        if (firstTarget) {
          const targetKeys = Object.keys(firstTarget);
          setKeys(targetKeys);
        }
        setLoading(false);

      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });

    const newSocket = new WebSocket("ws://localhost:8000/tasks/socket/");
  
    newSocket.onopen = (e) => {
      console.log("Connection established!");
    };
  
    newSocket.onmessage = (event) => {
      const newData = JSON.parse(event.data).data;
      // console.log(newData)
      // console.log(newData)
      setTasks(prevTasks => {
        return prevTasks.map((task, index) => {
          const updatedTask = newData[index];
          // console.log(task)
            
          if (task?.id !== updatedTask?.id) {
            console.error(`Mismatching task IDs at index ${index}`);
            return task;
          }
          // console.log(newData[3])

          
      
          return {
            ...task, 
            progress: { ...task.progress, text: updatedTask.progress },
            status: { ...task.status, text: updatedTask.status },
          };
        });
      });
    };
    
  
    newSocket.onerror = (error) => {
      console.log(`WebSocket error: ${error}`);
    };
  
    newSocket.onclose = (event) => {
      if (event.wasClean) {
        console.log(`Connection closed cleanly, code=${event.code} reason=${event.reason}`);
      } else {
        console.log("Connection died!");
      }
    };
  
    setSocket(newSocket);
    
    // Clean up function
    return () => {
      newSocket.close();
    };

  }, []); // Empty array makes this run on mount and unmount



  const startScan = (taskId: string) => {
    setScanning(scanning + 1);
    axios
      .get(`tasks/start?task_id=${taskId}`)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  

  const stopScan = (taskId: string) => {

    setScanning(scanning-1)
    axios.get(`/tasks/stop/?task_id=${taskId}`)
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.error(`Error: ${error}`);
      return;
    })
  }


  const deleteTask = (id:string) => {
    axios.get(`/tasks/delete?task_id=${id}`)
    .then((response) => {
      setTasks(tasks.filter(task => task.id !== id))
      console.log(response.data);
    })
    .catch((error) => {
      console.error(`Error: ${error}`);
    });
  }

  const getReport = (id:string|undefined) => {
    // console.log(id)
    setReportPage(true)
    axios.get(`reports/get_id?report_id=${id}`)
        .then((response) => {
            setReport(response.data)
        })
        .catch((error) => {
            console.error(error)
    })
    // setReportPage(true)
  }

  const savePdfReport = async (reportId: string|undefined, taskName: string|undefined) => {
    const response_ = await axios.get(`reports/get_id?report_id=${reportId}`);
    const response = response_.data;
  
    // Convert base64 to blob and create a downloadable link
    const linkSource = `data:application/pdf;base64,${response}`;
    const downloadLink = document.createElement("a");
    const fileName = `${taskName}.pdf`;
  
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  };

  // console.log(tasks)

  const tableData: TableData = {
    columns: keys_i_want,
    rows: tasks.map((task, i) => [
      task.id, 
      task.name.text, 
      task.owner.name.text, 
      task.scanner.name.text, 
      task.target.name.text, 
      task.config.name.text, 
      task.creation_time.text.split('T')[0], 
      <div>
      {Object.prototype.hasOwnProperty.call(task, 'last_report') ?
        <ReportTab>
          {task.last_report?.report.severity.text}
          {/* <ReportButton onClick={() => getReport(task.last_report?.report.id)}><HiOutlineDocumentReport /></ReportButton> */}
          <ReportButton onClick={() => savePdfReport(task.last_report?.report.id, task.name.text)}><HiOutlineDocumentReport /></ReportButton>

        </ReportTab> 
      : null}
      </div>, 
      <>
      {task.status.text !== 'Running' ?
        <Progressbar value={task.status.text} />
        :
        <Progressbar value={parseInt(task.progress.text)} />
      }</>, 
      <Tools>
        
        {task.status.text === 'Queued' || task.status.text === 'Requested' && 
          <StartButton onClick={() => startScan(task.id)} key={task.id} >
          <ClipLoader size={18} color={'blue'}/></StartButton>} 
        {task.status.text === 'Running' && 
          <StartButton onClick={() => stopScan(task.id)}>
            <VscDebugStop size={18} color={'red'} /> 
          </StartButton>}
          {task.status.text !== 'Running' && task.status.text !== 'Queued' && task.status.text !== 'Requested' && 
            <StartButton onClick={() => startScan(task.id)} key={task.id} >
              <VscDebugStart color={'green'}/>
            </StartButton>}
          
        
        <Trash>
          <BiTrash size={18} onClick={() => deleteTask(task.id)} />
        </Trash>
      </Tools>
    ]),
  };

  return (
    <Container>
      {
            createPage ? (
            <CreateTask createPage={createPage} setCreatePage={setCreatePage} setTasks={setTasks} tasks={tasks} />
            ):(
            <>
            </>)
      }
      {
        reportPage && report ? (
          <ReportPage reportPage={reportPage} setReportPage={setReportPage} report={report} />
        ):(
          <></>
        )
      }
      {!loading ? (
        <>
          <ContainerHeading>
            <div>
              <H1>Last tasks</H1>
              <ContainerSubHeading>
                <p>{tasks.length} total</p>
              </ContainerSubHeading>
            </div>
            <Button onClick={() => setCreatePage(!createPage)} >New Task</Button>
          </ContainerHeading>
          <TargetsContainer>
            <TargetsTable data={tableData} />
          </TargetsContainer>
        </>
      ) : (
          <Spinner><GridLoader color='#9461fb' size={40} /></Spinner>
      )}
    </Container>
  );
};

const ReportTab = styled.div`
  display: flex;
  justify-content: space-evenly;
`

const ReportButton = styled.div`
  transition: all 1s;
  &:hover{
    cursor: pointer;
    transform: scale(1.05);
  }
`

const Button = styled.button`
  padding: 5px;
  border-radius: 10px;
  border: 1px solid grey;
  background-color: #9461fb;
  color: white;
  font-size: 1.1em;

  &:hover{
    transition:1s;
    transform: scale(1.1);
    cursor: pointer;
  }
`

const Spinner = styled.div`
  width:100%;
  height: 100%;
  display:flex;
  align-items:center;
  justify-content: center;
`


const Trash = styled.div`
  &:hover{
    cursor: pointer;
  }
`

const Tools = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const TaskCategories = styled.div`
  display: flex;
  justify-content: s;
`;

const Container = styled.div`
  height:100%;
`;
const ContainerHeading = styled.div`
  display: flex;
  justify-content: space-between;
`;

const H1 = styled.h1``;

const ContainerSubHeading = styled.div``;

const TargetsContainer = styled.div`
  border-radius: 20px

`;

const StartButton = styled.div`
  display: flex;
  align-items:center;
  justify-content: center;
  &:hover{
    cursor: pointer;
    transition: 1s;
    transform: scale(1.2);
  }
  &:active{
    transform: scale(0.9);
  }
`

export default Tasks;