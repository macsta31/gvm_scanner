import styled from 'styled-components';
import TableData from '../datatypes/TableData';
import { useState } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';

const rowsPerPage = 10;

const TargetsTable = ({ data }: { data: TableData }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const totalPages = Math.ceil(data.rows.length / rowsPerPage);

  const handleNextPage = () => {
    setCurrentPage((old) => Math.min(old + 1, totalPages));
  };

  const handlePreviousPage = () => {
    setCurrentPage((old) => Math.max(old - 1, 1));
  };

  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;

  // Filter rows based on the search term.
  const filteredRows = data.rows.filter((row) => {
    const taskName = row[1]; // Assuming the task name is the second element of the row
    return taskName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <>
      <SearchInput
        type="text"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <TableWrapper className="table table-striped table-bordered">
        <TableHeader>
          <TableRowHeader>
            {data.columns.map((column, index) => {
              if (column === "id") return null; // Exclude the "id" column
              if (column === "results_ids") return null;
              return <TableHeadRow key={index}>{column}</TableHeadRow>;
            })}
          </TableRowHeader>
        </TableHeader>
        <TableBody>
          {filteredRows.slice(start, end).map((target, rowIndex) => (
            <TableRow key={rowIndex}>
             {data.columns.map((column, columnIndex) => {
                if (column === "id") return null; // Exclude the "id" column
                return (
                  <TableDataCell key={columnIndex}>{target[columnIndex]}</TableDataCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
        <TableRow>
          <TableDataCell colSpan={data.columns.length - 1}>
            <PaginationContainer>
              <PaginationButton onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</PaginationButton>
              <PaginationButton onClick={handleNextPage} disabled={currentPage === totalPages}>Next</PaginationButton>
            </PaginationContainer>
          </TableDataCell>
        </TableRow>
      </TableFooter>
      </TableWrapper>
      {/* <PaginationContainer>
        <PaginationButton onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</PaginationButton>
        <PaginationButton onClick={handleNextPage} disabled={currentPage === totalPages}>Next</PaginationButton>
      </PaginationContainer> */}
    </>
  );
};

const SearchInput = styled.input`
  margin-top: 20px;
  padding: 10px;
  margin-bottom: 20px;
  font-size: 1em;
  width: 100%;
  box-sizing: border-box;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const TableFooter = styled.tfoot`
  background-color: #9461fb;
  color: #fff;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const PaginationButton = styled.button`
  margin: 0 10px;
  padding: 5px 10px;
  background-color: #9461fb;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:disabled {
    background-color: #c7c7c7;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: #7643d9;
    // border: 1px solid black;
  }
  `
  
  
  

const TableWrapper = styled.table`
    border-collapse: collapse;
    width: 100%;
    max-width: 1200px;
    color: #333;
    font-family: Arial, sans-serif;
    font-size: 14px;
    text-align: left;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    margin: auto;
    margin-top: 10px;
    margin-bottom: 50px;
`;

const TableHeader = styled.thead`
    background-color: #9461fb;
    color: #fff;
    font-weight: bold;
    padding: 10px;
    text-transform: uppercase;
    letter-spacing: 1px;
    border-bottom: 1px solid #ccc;
`;

const TableRowHeader = styled.tr`
`;

const TableHeadRow = styled.th`
  padding: 10px;
  font-weight: bold;
  text-align: left;
  // text-align: center;
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  &:nth-of-type(even) {
    background-color: #c7c7c7;
  }
`;

const TableDataCell = styled.td`
  padding: 10px;
  margin: auto;
  // display: flex;
  // flex-direction: row;
  // align-items: center;

`;
export default TargetsTable;

  