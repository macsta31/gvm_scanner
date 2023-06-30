import { useState, useEffect } from 'react';
import axios from '../axios';
import styled from 'styled-components';
import Target from '../datatypes/TargetDataType';
import TargetsTable from './DataTable';
import TableData from '../datatypes/TableData';
import CreateTarget from './CreateTarget';
import { GridLoader } from 'react-spinners';
import { BiTrash } from 'react-icons/bi'



const Targets = () => {
  const [targets, setTargets] = useState<Target[]>([]);
  const [loading, setLoading] = useState(true);
  const [keys, setKeys] = useState<string[]>([]);
  const [createPage, setCreatePage] = useState<boolean>(false)
  const keys_i_want = ['id', 'name', 'owner', 'port_list', 'hosts', 'creation_time', 'in_use', 'tools'];

  const deleteTarget = (id:string) => {
    axios.get(`/targets/delete?target_id=${id}`)
    .then((response) => {
      setTargets(targets.filter(target => target.id !== id))
      console.log(response.data);
    })
    .catch((error) => {
      console.error(`Error: ${error}`);
    });
  }

  const tableData: TableData = {
    columns: keys_i_want,
    rows: targets.map((target) => [target.id, target.name, JSON.stringify(target.owner).replace(/"/g, ''), target.port_list.name, target.hosts, target.creation_time.split('T')[0], target.in_use, <Tools><BiTrash size={18} onClick={() => deleteTarget(target.id)} /></Tools>]),
  };

  useEffect(() => {
    axios
      .get('/targets/get')
      .then((response) => {
        // console.log(response.data);
        setTargets(response.data as Target[]);
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
  }, []);

  return (
    <Container>
      {
            createPage ? (
            <CreateTarget createPage={createPage} setCreatePage={setCreatePage} setTargets={setTargets} targets={targets}/>
            ):(
            <>
            </>)
      }
      {!loading ? (
        <>
          <ContainerHeading>
            <div>
              <H1>Last targets</H1>
              <ContainerSubHeading>
                <p>{targets.length} total</p>
              </ContainerSubHeading>
            </div>
            <Button onClick={() => setCreatePage(!createPage)} >New Target</Button>
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

const Tools = styled.div`
  display: flex;
  justify-content: center;

  &:hover{
    cursor: pointer;
    transition: 1s;
    transform: scale(1.1)
  }

  &:active{
    transition: 0;
    transform: scale(0.5);
  }
`


const Spinner = styled.div`
  width:100%;
  height: 100%;
  display:flex;
  align-items:center;
  justify-content: center;
`

const Container = styled.div`
  position: relative;
  height:100%
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



export default Targets;
