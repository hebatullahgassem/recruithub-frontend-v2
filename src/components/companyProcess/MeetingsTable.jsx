"use client"

import { useContext, useState } from "react"
import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination } from "@mui/material"
import { FaCalendarPlus } from "react-icons/fa"
import { getMeetingsByJob } from "../../services/Application"
import "../../ComponentsStyles/CompanyProcess/meetings_table.css"
import { userContext } from "../../context/UserContext"

function MeetingsTable({ column, phases }) {
  const { isLight, setUpdate } = useContext(userContext)
  const { id } = useParams()
  const [selected, setSelected] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  function handleClose() {
    setUpdate({ user: {}, settings: {} })
    refetch()
  }

  const handleChangePage = (event, newPage) => setPage(newPage)
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

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
      })

      const res = await getMeetingsByJob(params)
      return res.results
    },
  })

  // Define header cell style
  const headerCellStyle = {
    backgroundColor: isLight ? "#f5f5f5" : "#121212",
    color: isLight ? "black" : "white",
    fontWeight: "bold",
  }

  return (
    <div className="meetings-table-container" style={{ backgroundColor: isLight ? "white" : "#242424", borderRadius: "10px" }}>
      <h2 className="meetings-title pt-2" style={{ color: isLight ? "black" : "white" }}>
        {phases[column - 1]} Meetings
      </h2>

      {meetingsData.length === 0 ? (
        <div className="no-meetings-message" style={{ background: isLight ? null : "black" }}>
          No meetings scheduled for this phase in this job.
        </div>
      ) : (
        <Paper
          className="meetings-paper"
          style={{
            backgroundColor: isLight ? null : "#121212",
          }}
        >
          <TableContainer className="table-container">
            <Table stickyHeader aria-label="meetings table" style={{ borderTop:'2px solid #ccc', borderBottom:'2px solid #ccc' }}>
              <TableHead>
                {/* Apply styles directly to TableCells instead of TableRow */}
                <TableRow>
                  <TableCell style={headerCellStyle}>Applicant</TableCell>
                  <TableCell style={headerCellStyle}>Date</TableCell>
                  <TableCell style={headerCellStyle}>Time</TableCell>
                  <TableCell style={headerCellStyle}>Link</TableCell>
                  <TableCell style={headerCellStyle}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {meetingsData.map((meeting, index) => (
                  <TableRow
                    key={meeting.id}
                    className={index % 2 === 0 ? "row-even" : "row-odd"}
                    style={{
                      backgroundColor: isLight ? (index % 2 === 0 ? "#ffffff" : "#f9f9f9") : "#121212",
                    }}
                  >
                    <TableCell style={{ color: isLight ? "black" : "white" }}>{meeting.user_name}</TableCell>
                    <TableCell style={{ color: isLight ? "black" : "white" }}>
                      {meeting.status === "4"
                        ? meeting.interview_time?.split("T")[0]
                        : meeting.status === "5"
                          ? meeting.hr_time?.split("T")[0]
                          : meeting.offer_time?.split("T")[0]}
                    </TableCell>
                    <TableCell style={{ color: isLight ? "black" : "white" }}>
                      {(() => {
                        const time =
                          meeting.status === "4"
                            ? meeting.interview_time
                            : meeting.status === "5"
                              ? meeting.hr_time
                              : meeting.offer_time

                        const timeParts = time?.split("T")[1]?.split(":")
                        return timeParts ? `${timeParts[0]}:${timeParts[1]}` : ""
                      })()}
                    </TableCell>
                    <TableCell style={{ color: isLight ? "black" : "white" }}>
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
                        className="meeting-link"
                      >
                        Join Meeting
                      </a>
                    </TableCell>
                    <TableCell style={{ color: isLight ? "black" : "white" }}>
                      <button
                        className="calendar-button"
                        onClick={() =>
                          setUpdate({
                            user: meeting,
                            settings: { phase: column + 2, handleClose },
                          })
                        }
                        aria-label="Schedule meeting"
                      >
                        <FaCalendarPlus
                          className={
                            (Number(meeting.status) === 4 && meeting.interview_link) ||
                            (Number(meeting.status) === 5 && meeting.hr_link) ||
                            (Number(meeting.status) === 6 && meeting.offer_link)
                              ? "icon-scheduled"
                              : "icon-unscheduled"
                          }
                        />
                      </button>
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
            className="pagination"
            sx={{
              ".MuiTablePagination-selectIcon": {
                color: isLight ? "black" : "white",
              },
              ".MuiTablePagination-actions button": {
                color: isLight ? "black" : "white",
              },
              color: isLight ? "black" : "white",
            }}
          />
        </Paper>
      )}
    </div>
  )
}

export default MeetingsTable
