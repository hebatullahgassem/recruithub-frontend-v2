import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Chip,
  TablePagination,
  Box,
} from "@mui/material";
import { FaUserSlash, FaUserCheck, FaCalendarPlus } from "react-icons/fa";
import { RiQuestionAnswerFill } from "react-icons/ri";
import { getMeetingsByJob } from "../../services/Application";
import CustomPopup from "../Popup/CustomPopup";

function MeetingsTable({ column, phases }) {
  const { id } = useParams();
  console.log(phases);
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [update, setUpdate] = useState({});

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const newSelected = meetingsData.map((m) => m.id);
      setSelected(newSelected);
    } else {
      setSelected([]);
    }
  };

  const handleSelect = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, id];
    } else {
      newSelected = selected.filter((item) => item !== id);
    }

    setSelected(newSelected);
  };

  function handleClose() {
    setUpdate({});
    refetch();
  }

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const {
    data: meetingsData = [],
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["meetings", id, page, rowsPerPage, column],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page + 1,
        page_size: rowsPerPage,
        job: id,
        status: column + 3,
      });
      const res = await getMeetingsByJob(params);
      return res.results;
    },
  });

  return (
    <Box>
      {update.id && (
        <CustomPopup
          phase={column + 2}
          update={update}
          handleClose={handleClose}
        />
      )}
      <h2 style={{ textAlign: "center", marginTop: 20, fontSize: 30 }}>
        {phases[column - 1]} Meetings
      </h2>
      {meetingsData.length === 0 ? (
        <h2
          style={{
            textAlign: "center",
            marginTop: 20,
            fontSize: 15,
            color: "red",
          }}
        >
          No meetings scheduled for this phase in this job.
        </h2>
      ):(<>
        {/* Add Filter by date */}
      </>)}
      <Paper
        sx={{
          width: "90%",
          overflow: "hidden",
          marginX: 10,
          maxWidth: "100vw",
          marginTop: 5,
        }}
      >
        <TableContainer>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {/* <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={
                      selected.length > 0 &&
                      selected.length < meetingsData.length
                    }
                    checked={
                      meetingsData.length > 0 &&
                      selected.length === meetingsData.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell> */}
                <TableCell style={headerStyle}>Applicant</TableCell>
                <TableCell style={headerStyle}>Date</TableCell>
                <TableCell style={headerStyle}>Time</TableCell>
                <TableCell style={headerStyle}>Link</TableCell>
                <TableCell style={headerStyle}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {meetingsData?.map((meeting, index) => (
                <TableRow
                  key={meeting.id}
                  style={{
                    backgroundColor: index % 2 === 0 ? "#ffffff" : "#ececec",
                  }}
                >
                  {/* <TableCell padding="checkbox">
                    <Checkbox
                      checked={selected.includes(meeting.id)}
                      onChange={(event) => handleSelect(event, meeting.id)}
                    />
                  </TableCell> */}
                  <TableCell>{meeting.user_name}</TableCell>
                  <TableCell>
                    {meeting.status === "4"
                      ? meeting.interview_time?.split("T")[0]
                      : meeting.status === "5"
                      ? meeting.hr_time?.split("T")[0]
                      : meeting.offer_time?.split("T")[0]}
                  </TableCell>
                  <TableCell>
                    {(() => {
                      const time =
                        meeting.status === "4"
                          ? meeting.interview_time
                          : meeting.status === "5"
                          ? meeting.hr_time
                          : meeting.offer_time;

                      const timeParts = time?.split("T")[1]?.split(":");
                      return timeParts ? `${timeParts[0]}:${timeParts[1]}` : "";
                    })()}
                  </TableCell>
                  <TableCell>
                    <a
                      href={
                        meeting.status === "4"
                          ? meeting.interview_link
                          : meeting.status === "5"
                          ? meeting.hr_link
                          : meeting.offer_link
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {meeting.status === "4"
                        ? meeting.interview_link
                        : meeting.status === "5"
                        ? meeting.hr_link
                        : meeting.offer_link}
                    </a>
                  </TableCell>
                  <TableCell>
                    <FaCalendarPlus
                      style={{
                        cursor: "pointer",
                        scale: 1.5,
                        color:
                          (Number(meeting.status) === 4 && meeting.interview_link) ||
                          (Number(column.status) === 5 && meeting.hr_link) ||
                          (Number(column.status) === 6 && meeting.offer_link)
                            ? "green"
                            : "black",
                      }}
                      onClick={() => setUpdate(meeting)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 100]}
          component="div"
          count={meetingsData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}

const headerStyle = {
  backgroundColor: "black",
  color: "#ffffff",
  fontWeight: "bold",
};

export default MeetingsTable;
