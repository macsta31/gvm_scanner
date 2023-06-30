import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useState, useEffect } from 'react';
import axios from '../axios';
import Task from '../datatypes/TaskDataType';
import { BarLoader } from 'react-spinners';
import styled from 'styled-components';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);



const VulnBySevCard = () => {
  const [barData, setBarData] = useState<any>(null);
  const [dataArray, setDataArray] = useState<number[]>([])
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState<any>(null)


  let labels: string[] = []

  useEffect(() => {
    const fetchData = async () => {
      // const sevs: { name: string; value: number }[] = [];
      const response = await axios.get<Task[]>('/tasks/get');

      const options = {
        animation: {
          tension: {
            duration: 1000,
            easing: 'linear',
            from: 100,
            to: 0,
            loop: true
          }
        },
        responsive: true,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: false,

          },
        },
        scales:{
          x: {
            grid: {
              display: false, // this will remove only the vertical lines
            },
          },
          y: {
            grid: {
              display: false, // this will remove only the horizontal lines
            },
          }
        }
      }

      setOptions(options)

      
      let dataArr: number[] = []
      response.data.forEach((task: Task, index: number) => {
        if (task.last_report && task.last_report.report && task.name.text) {
          labels[index] = task.name.text
          dataArr[index] = parseInt(task.last_report.report.severity.text)
        }
      });
      const data = {
        labels,
        datasets: [
          // labels.map((label, index) => {
          //   return{
          //     label: `${label}`,
          //     data: dataArr[index],
          //     backgroundColor: `rgba(149, 97, 250, ${dataArr[index]/10})`
          //   }
          // })
          {
            label: 'Dataset 1',
            data: labels.map((label, index) => dataArr[index]),
            backgroundColor: `rgba(149, 97, 250)`,
          }
        ],
      };

      setBarData(data);
      setLoading(false); // Set loading to false after data is fetched
    };

    fetchData();
  }, []);

  // Only attempt to render Bar chart when the data is available
  return loading ? <Div><BarLoader color='#9461fb'/></Div> : <Bar data={barData} options={options} />;
};


const Div = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  transform: translateY(30px)
`
export default VulnBySevCard;
