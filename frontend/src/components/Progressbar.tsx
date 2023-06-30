import { ProgressBar } from 'primereact/progressbar';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

interface ProgressbarProps{
    value: number | string
}

const Progressbar:React.FC<ProgressbarProps> = ({ value }) => {
  const valueTemplate = (value:ProgressbarProps["value"]) => `${value}`;
  return (

    <ProgressBarContainer>
      <StyledProgressBar value={value} color='#9461fb' 
        displayValueTemplate={valueTemplate}
      />
    </ProgressBarContainer>

  )
}

const StyledProgressBar = styled(ProgressBar)`
  .p-progressbar-value {
    position: absolute;
    height: 100%;
    box-sizing: border-box;
    border-radius: 5px;
    background-color: #9461fb;
    color: white;
    padding: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    
  }

  .p-progressbar-label{
    align-self: center;
    justify-self: center;
  }
  p-progressbar p-component p-progressbar-determinate sc-eywOmQ fhAngW{
    position: absolute;
    display: flex;
  }
`;

const ProgressBarContainer = styled.div`
  position: relative;
  border-radius:6px;
  border:1px solid black;
  background-color: grey;
  height: 20px;
  width:100px;
`

export default Progressbar