import {
    Chip,
    CircularProgress,
    Paper,
    // Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
  } from "@mui/material";
//   import { useQuery } from "@tanstack/react-query";
  import { useEffect, useState } from "react";
  import { FaPencilAlt, FaUserCheck, FaUserSlash } from "react-icons/fa";
  import { GiCancel } from "react-icons/gi";
  import { IoMdAddCircle } from "react-icons/io";
  import { RiDeleteBinFill } from "react-icons/ri";
  import TextField from "@mui/material/TextField";
  import Autocomplete from "@mui/material/Autocomplete";
//   import axiosInstance from "../../../apis/config";
//   import axios from "axios";
  // import { Worker, Viewer } from "@react-pdf-viewer/core";
  // import "@react-pdf-viewer/core/lib/styles/index.css";
  
  function ApplicantsTable({phase}) {
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [total, setTotal] = useState(1);
    const [update, setUpdate] = useState({});
    const [uploading, setUploading] = useState(false);
    const handleChangePage = (event, newPage) => {
      setPage(newPage + 1);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(event.target.value);
    };
   const handleNext = (applicant, phase) => {
    if(phase < 5){
      console.log(applicant, 'Added to phase', phase + 1)}
   }

   const handleFail = (applicant, phase) => {
     console.log(applicant, 'Failed at phase', phase);
   }

  
    
    // const {
    //   data: books,
    //   isLoading: bookLoading,
    //   isError: bookError,
    //   refetch,
    // } = useQuery({
    //   queryKey: ["books", page, rowsPerPage],
    //   queryFn: async () => {
    //     const res = await axiosInstance.get(`/books/paginated?page=${page}&limit=${rowsPerPage}`);
    //     setTotal(res.data.data.pagination.total);
    //     return res.data.data.items;
    //   },
    // });
    const columns = [
      { id: "Id", label: "Id", minWidth: 30, align: "left" },
      {
        id: "Name",
        label: "Name",
        minWidth: 100,
        align: "left",
      },
      {
        id: "Phone",
        label: "Phone",
        minWidth: 100,
        align: "left",
      },
      {
        id: "Email",
        label: "Email",
        minWidth: 100,
        align: "left",
      },
      {
        id: "Status",
        label: "Status",
        minWidth: 100,
        align: "left",
      },
      {
        id: "Action",
        label: "Action",
        minWidth: 100,
        align: "left",
      },
    ];
    const dummyData = [
        {
          Id: 1,
          Name: "John Doe",
          Phone: "0123456789",
          Email: "john.doe@example.com",
          Status: "Fail",
        },
        {
          Id: 2,
          Name: "Jane Doe",
          Phone: "0123456789",
          Email: "jane.doe@example.com",
          Status: "Pending",
        },
        {
          Id: 3,
          Name: "Bob Smith",
          Phone: "0123456789",
          Email: "bob.smith@example.com",
          Status: "Pending",
        },
      ];
    
  
    // if (authorLoading || categoryLoading || bookLoading) {
    //   return (
    //     <div style={{ backgroundColor: "white", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
    //       <CircularProgress />
    //     </div>
    //   );
    // }
    return (
      <div  className="d-flex flex-column align-items-center justify-content-center">
        
        <Paper sx={{ width: "90%", overflow: "hidden", marginX: 10 }}>
          <TableContainer>
            <Table stickyHeader aria-label="sticky table" >
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{
                        minWidth: column.minWidth,
                        backgroundColor: "black",
                        color: "#ffffff",
                        fontWeight: "bold",
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
              {dummyData ?
                  dummyData
                    .map((applicant, index) => (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={applicant.Id}
                        style={{
                          backgroundColor:
                            index % 2 === 0 ? "#ffffff" : "#ececec",
                        }}
                      >
                        <TableCell align="left">
                          {(page-1) * rowsPerPage + index + 1}
                        </TableCell>
                        <TableCell align="left">{applicant.Name}</TableCell>
                        <TableCell align="left">{applicant.Phone}</TableCell>
                        <TableCell align="left">{applicant.Email}</TableCell>
                        <TableCell align="left"><Chip color={applicant.Status === "Pending" ? "primary" : "error"} label={applicant.Status} size="small" variant="light" /></TableCell>
                        <TableCell align="left">
                          <FaUserSlash
                            
                            style={{ cursor: "pointer", scale: 1.5, display: applicant.Status === "Fail" ? "none" : "initial"  }}
                            onClick={() => handleFail(applicant.Id, phase)}
                          />
                          <FaUserCheck style={{ cursor: "pointer", scale: 1.5, marginLeft: "20px", display: phase === 5 ? "none" : "initial" }}
                            onClick={() => handleNext(applicant.Id, phase)}/>
                        </TableCell>
                      </TableRow>
                    )) : null}
                
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={
              total > 25 ? [10, 25, 100] : total > 10 ? [10, 25] : [10]
            }
            component="div"
            count={total}
            rowsPerPage={rowsPerPage}
            page={page - 1}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </div> 
    );
  }
  
  export default ApplicantsTable;