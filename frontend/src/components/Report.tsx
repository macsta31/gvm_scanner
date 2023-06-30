import React, { ChangeEvent, useEffect, useState } from 'react';
import styled from 'styled-components'
import ReportDataType from '../datatypes/ReportDataType';
import ReportBody from './ReportBody';

interface ReportProps{
    report: ReportDataType,
    setReportPage: (bool: boolean) => void
    reportPage: boolean,
}
interface ModalBackgroundProps {
    show: boolean;
}

interface LIProps{
    isSelected: boolean;
}

const Report: React.FC<ReportProps> = ({report, reportPage, setReportPage}) => {
    const [section, setSection] = useState<number>(0)
    const [reportBody, setReportBody] = useState<any>(report.report.results.result)

    useEffect(() => {
        // console.log(report)
    })
    return (
        <ModalBackground show={reportPage} onClick={() => setReportPage(false)}>
            <ReportModal onClick={(e) => e.stopPropagation()}>
                <ReportHeader>
                    <ReportTitle>Report for {report.task.name.text}</ReportTitle>
                    <ReportSections>
                        <ReportSectionsList>
                            <ReportSectionsListItem key={0} isSelected={section === 0} onClick={() => {setSection(0); setReportBody(report.report.results.result)}}>Results</ReportSectionsListItem>
                            <ReportSectionsListItem key={1} isSelected={section === 1} onClick={() => {setSection(1); setReportBody(report.report.apps)}}>Apps</ReportSectionsListItem>
                            <ReportSectionsListItem key={2} isSelected={section === 2} onClick={() => {setSection(2); setReportBody(report.report.closed_cves)}}>Closed CVEs</ReportSectionsListItem>
                            <ReportSectionsListItem key={3} isSelected={section === 3} onClick={() => {setSection(3); setReportBody(report.report.errors)}}>Errors</ReportSectionsListItem>
                            <ReportSectionsListItem key={4} isSelected={section === 4} onClick={() => {setSection(4); setReportBody(report.report.filters)}}>Filters</ReportSectionsListItem>
                            <ReportSectionsListItem key={5} isSelected={section === 5} onClick={() => {setSection(5); setReportBody(report.report.gmp)}}>GMP</ReportSectionsListItem>
                            <ReportSectionsListItem key={6} isSelected={section === 6} onClick={() => {setSection(6); setReportBody(report.report.host)}}>Host</ReportSectionsListItem>
                            <ReportSectionsListItem key={7} isSelected={section === 7} onClick={() => {setSection(7); setReportBody(report.report.hosts)}}>Hosts</ReportSectionsListItem>
                            <ReportSectionsListItem key={8} isSelected={section === 8} onClick={() => {setSection(8); setReportBody(report.report.os)}}>OS</ReportSectionsListItem>
                            <ReportSectionsListItem key={9} isSelected={section === 9} onClick={() => {setSection(9); setReportBody(report.report.ports)}}>Ports</ReportSectionsListItem> 
                        </ReportSectionsList>
                    </ReportSections>
                </ReportHeader>
                <ReportBodyDiv>
                    <ReportBody reportBody={reportBody}/>
                </ReportBodyDiv>
            </ReportModal>

        </ModalBackground>
    )
    
}

const ReportBodyDiv = styled.div`
    margin-top: 15px;
`

const ReportModal = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
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

const ReportHeader = styled.div`
    min-width: 200px;
    
`

const ReportTitle = styled.h1`
    margin-bottom: 10px;
`

const ReportSections = styled.div`

`
const ReportSectionsList = styled.ul`
    list-style: none;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    border-bottom: 1px solid grey

    
`
const ReportSectionsListItem = styled.li<LIProps>`
    padding: 10px;
    margin: 5px;
    border-radius: 10px;
    background-color: ${({ isSelected }) => (isSelected ? '#9461fb' : 'transparent')};
    color: ${({ isSelected }) => (isSelected ? 'white' : 'black')};
    transition: all 1s ease;
    &:hover{
        cursor: pointer;
        transform: scale(1.1);
        background-color: #cfb8ff;
    }
`

export default Report