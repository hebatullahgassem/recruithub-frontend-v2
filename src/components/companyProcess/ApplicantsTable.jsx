import {
  Chip,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Checkbox,
  Button,
  Box,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import CompanySchedule from "../Popup/Schedule.jsx";
import { userContext } from "../../context/UserContext";
import { useLocation, useParams } from "react-router";
import CustomPopup from "../Popup/CustomPopup";
import { UserCheck, UserX, MessageSquare, Calendar, ChevronRight, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { showConfirmToast } from "../../confirmAlert/toastConfirm.jsx";
// import '../../styles/theme.css';
import '../../ComponentsStyles/CompanyProcess/application_table.css';
// import {FaUserSlash, FaUserCheck} from 'react-icons/fa';
// import { RiQuestionAnswerFill } from 'react-icons/ri';
// import { FaCalendarPlus } from 'react-icons/fa';



function ApplicantsTable({ phase, setFilters, fetch }) {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [total, setTotal] = useState(1);
  const [update, setUpdate] = useState({});
  const [selected, setSelected] = useState([]);
  const [answer, setAnswer] = useState(false);
  const { user } = useContext(userContext);
  const { id } = useParams();

  const queryKey = ["applicants", page, rowsPerPage, phase, fetch];
  const queryFn = async () => {
    const response = await axios.get(`http://127.0.0.1:8000/applications/`, {
      params: { page, page_size: rowsPerPage, status: phase + 1, job: id }, //, company: 3
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    setTotal(response.data.count || 0);
    setFilters(response.data.count ? true : false);
    return response.data.results;
  };

  const {
    data: applicants,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey,
    queryFn,
    onSuccess: () => {
      console.log("Data updated successfully");
      // Clear selection when data changes
      setSelected([]);
    },
  });

  useEffect(() => {
    refetch();
  }, [page, rowsPerPage, phase, refetch]);

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const newSelected = applicants.map((app) => app.id);
      setSelected(newSelected);
    } else {
      setSelected([]);
    }
  };

  const handleSelect = (event, id) => {
    if (event.target.checked) {
      setSelected([...selected, id]);
    } else {
      setSelected(selected.filter((item) => item !== id));
    }
  };

  const handleBulkAction = async (action) => {
    if (selected.length === 0) {
      toast.error("Please select at least one applicant");
      return;
    }

    let confirmMessage = "";
    let endpoint = "";
    let data = {};

    if (action === "next") {
      if (phase >= 5) {
        toast.error("Cannot move beyond Offer phase");
        return;
      }
      confirmMessage = `Move ${selected.length} applicant(s) to next phase?`;
      endpoint = "update_status";
      data = { status: String(phase + 2) };
    } else if (action === "reject") {
      confirmMessage = `Reject ${selected.length} applicant(s)?`;
      endpoint = "update_status";
      data = { fail: true, status: String(phase + 1) };
    }

    // if (window.confirm(confirmMessage)) {
      showConfirmToast({
        message: confirmMessage,
        onConfirm: async () => {
    
      try {
        // Perform bulk update
        const promises = selected.map((applicantId) =>
          axios.patch(
            `http://localhost:8000/applications/${applicantId}/${endpoint}/`,
            data,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
              },
            }
          )
        );

        await Promise.all(promises);
        refetch();
        toast.success(`Applicants ${action === "next" ? "moved" : "rejected"} successfully`);
      } catch (error) {
        console.error("Error updating applications:", error);
        toast.error(`Failed to ${action === "next" ? "move" : "reject"} applicants`);
      }
    },
  });
};

  const handleChangePage = (event, newPage) => {
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
  };

  const handleNext = async (applicant, phase) => {
    // if (
    //   !confirm(
    //     "Are you sure you want to move this applicant to the next phase?"
    //   )
    // ) {
    //   return;
    // }
    showConfirmToast({
      message: "Are you sure you want to move this applicant to the next phase?",
      onConfirm: async () => {
    if (phase < 5) {
      try {
        const response = await axios.patch(
          `http://localhost:8000/applications/${applicant}/update_status/`,
          { status: String(phase + 2) },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        refetch();
        toast.success("Applicant moved to next phase");
      } catch (error) {
        console.error("Error:", error);
        toast.error("Failed to update application status");
      }
    }
  },
});
};
  const handleFail = async (applicant, phase) => {
    // if (!confirm("Are you sure you want to make this applicant fail?")) {
    //   return;
    // }
    showConfirmToast({
      message: "Are you sure you want to make this applicant fail?",
      onConfirm: async () => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/applications/${applicant}/update_status/`,
        { fail: true, status: String(phase + 1) },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      refetch();
      toast.success("Applicant marked as failed");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to mark applicant as failed");
    }
  },
});
};

  function handleAnswer(applicant) {
    if (applicant?.answers && applicant?.answers.length > 0) {
      setAnswer(true);
      setUpdate(applicant);
    } else {
      toast.error("No answers found for this applicant.", { icon: "ℹ️" });
    }
  }

  function handleClose() {
    setAnswer(false);
    setUpdate({});
    refetch();
  }

  if (isLoading) {
    return <CircularProgress style={{ display: "block", margin: "auto" }} />;
  }

  return (
    <div className="applicants-table-container">
    {applicants?.length < 1 && (
      <div className="no-applicants-message">
        <p>There are no applicants in the current phase of this job.</p>
      </div>
    )}

    {update.id ? <CustomPopup answer={answer} phase={phase} update={update} handleClose={handleClose} handleNext={handleNext} handleFail={handleFail} /> : null}

    {selected.length > 0 && (
      <Box className="bulk-actions-container">
        <Button
          variant="contained"
          className="btn-next"
          onClick={() => handleBulkAction("next")}
          disabled={phase >= 5}
          startIcon={<ChevronRight />}
          sx={{
            backgroundColor: "#901b21",
            "&:hover": {
              backgroundColor: "#8c364bl",
            },
            "&:disabled": {
              backgroundColor: "#e9d8d9",
            },
          }}
        >
          Move {selected.length} to Next Phase
        </Button>
        <Button
          variant="contained"
          className="btn-reject"
          onClick={() => handleBulkAction("reject")}
          startIcon={<X />}
          sx={{
            backgroundColor: "#d32f2f",
            "&:hover": {
              backgroundColor: "#ef5350",
            },
          }}
        >
          Reject {selected.length} Applicants
        </Button>
      </Box>
    )}

    <Paper className="applicants-table-paper">
      <TableContainer>
        <Table stickyHeader aria-label="applicants table" className="recruitment-table">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selected.length > 0 && selected.length < applicants?.length}
                  checked={applicants?.length > 0 && selected.length === applicants?.length}
                  onChange={handleSelectAll}
                  sx={{
                    color: "white",
                    "&.Mui-checked": {
                      color: "white",
                    },
                    "&.MuiCheckbox-indeterminate": {
                      color: "white",
                    },
                  }}
                />
              </TableCell>
              <TableCell >ID</TableCell>
              <TableCell >Name</TableCell>
              <TableCell >Phone</TableCell>
              <TableCell >Email</TableCell>
              <TableCell >Status & ATS</TableCell>
              <TableCell >Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applicants?.map((applicant, index) => (
              <TableRow key={applicant.id} className={index % 2 === 0 ? "row-even" : "row-odd"}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selected.includes(applicant.id)}
                    onChange={(event) => handleSelect(event, applicant.id)}
                    sx={{
                      color: "#2f3744",
                      "&.Mui-checked": {
                        color: "#2f3744",
                      },
                    }}
                  />
                </TableCell>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{applicant.user_name}</TableCell>
                <TableCell >{applicant.user_phone}</TableCell>
                <TableCell>{applicant.user_email}</TableCell>

                <TableCell>
                  <div className="status-chips">
                    <Chip
                      label={applicant.fail ? "Failed" : "Pending"}
                      className={`status-chip ${applicant.fail ? "status-chip-error" : "status-chip-success"}`}
                      size="small"
                    />
                    {applicant?.ats_res > 0 && (
                      <Chip label={`${applicant.ats_res}%`} className="status-chip status-chip-info" size="small" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="action-buttons">
                    {!applicant.fail ? (
                      <>
                        <UserX
                          className="action-icon action-icon-error"
                          onClick={() => handleFail(applicant.id, phase)}
                          size={35}
                        />
                        {phase !== 5 && (
                          <UserCheck
                            className="action-icon action-icon-success"
                            onClick={() => handleNext(applicant.id, phase)}
                            size={35}
                          />
                        )}
                        {applicant.answers && applicant.answers.length > 0 && (
                          <MessageSquare
                            className="action-icon action-icon-primary"
                            onClick={() => handleAnswer(applicant)}
                            size={35}
                          />
                        )}
                      </>
                    ) : (
                      <span className="rejected-text">Rejected</span>
                    )}
                    {(Number(phase) === 2 || Number(phase) === 3 || Number(phase) === 4 || Number(phase) === 5) && (
                      <Calendar
                        className={`action-icon ${
                          (Number(phase) === 2 && applicant.assessment_link) ||
                          (Number(phase) === 3 && applicant.interview_link) ||
                          (Number(phase) === 4 && applicant.hr_link) ||
                          (Number(phase) === 5 && applicant.offer_link)
                            ? "action-icon-success"
                            : "action-icon-secondary"
                        }`}
                        // onClick={() => setUpdate(applicant)}
                         onClick={() => {
                          const hasLink =
                            (Number(phase) === 2 && applicant.assessment_link) ||
                            (Number(phase) === 3 && applicant.interview_link) ||
                            (Number(phase) === 4 && applicant.hr_link) ||
                            (Number(phase) === 5 && applicant.offer_link);
                        
                          if (hasLink) {
                            setUpdate(applicant);
                          } else {
                            toast.error("No link available for this phase");
                          }
                        }}
                        size={35}
                      />
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 100]}
        component="div"
        count={total}
        rowsPerPage={rowsPerPage}
        page={page - 1}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          ".MuiTablePagination-selectIcon": {
            color: "#2f3744",
          },
          ".MuiTablePagination-actions button": {
            color: "#2f3744",
          },
        }}
      />
    </Paper>
  </div>


  );
}

export default ApplicantsTable;
