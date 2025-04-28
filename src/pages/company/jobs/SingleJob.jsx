import { Navigate, useNavigate, useParams } from "react-router";
import ProcessColumn from "../../../components/companyProcess/ProcessColumn";
import ProcessCard from "../../../components/companyProcess/ProcessCard";
import { useContext, useEffect, useState } from "react";
import JobDetails from "../../../components/job/JobDetails";
import { useQuery } from "@tanstack/react-query";
import { getJobById, patchJob } from "../../../services/Job";
import { Business, CalendarMonth, People, WorkOutline } from "@mui/icons-material"
import { Button, Box, Typography, Paper, useMediaQuery, Tabs, Tab, CircularProgress } from "@mui/material"
import { userContext } from "../../../context/UserContext";
import MeetingsTable from "../../../components/companyProcess/MeetingsTable";
import '../../../styles/company/job/single_job.css';
import DynamicSwitcher from "../../../components/companyProcess/DynamicSwitcher";
function SingleJob() {
  const phases = [
    "Applied",
    "Technical Assessment",
    "Technical Interview",
    "Hr Interview",
    "Offer",
  ];
  const { id } = useParams();
  const [clickedColumn, setClickedColumn] = useState(1);
  const [calender, setCalender] = useState(false);
  const { user,isLight } = useContext(userContext);
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:768px)")

  const primaryColor = "#e53946"
  const backgroundColor = isLight ? "#ffffff" : "#121212"
  const textColor = isLight ? "#2d3748" : "#e2e8f0"
  const borderColor = isLight ? "#e3cdcd" : "#2d3748"
  const cardBackground = isLight ? "#ffffff" : "#1e1e1e"

  const {
    data: jobData,
    error: jobError,
    isLoading: jobLoading,
    refetch,
  } = useQuery({
    queryKey: ["job", id],
    queryFn: async () => {
      const res = await getJobById(id);
      console.log(res);
      return res;
    },
  });
  useEffect(() => {
    if (!user) return;
    if (!jobData) return;
    console.log(user, jobData);

    if (
      user.user_type !== "COMPANY" ||
      (jobData && parseInt(user.id) != jobData.company)
    ) {
      navigate("/company/jobs");
    }
  }, [user, jobData]);

  if (jobLoading)
    return (
      <Box
        className={`single-job-container ${isLight ? "light-mode" : "dark-mode"}`}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "70vh" }}
      >
        <CircularProgress size={60} sx={{ color: primaryColor }} />
      </Box>
    )
    if (jobError)
      return (
        <Box
          className={`single-job-container ${isLight ? "light-mode" : "dark-mode"}`}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "70vh",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h5" sx={{ color: primaryColor, fontWeight: 600 }}>
            Error loading job data
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/company/jobs")}
            sx={{
              backgroundColor: primaryColor,
              "&:hover": {
                backgroundColor: "#c62a37",
              },
            }}
          >
            Back to Jobs
          </Button>
        </Box>
      )

  return (
    <div className={`single-job-container ${isLight ? "light-mode" : "dark-mode"}`}>
    <Paper
      elevation={2}
      className="job-details-card"
      sx={{
        backgroundColor: cardBackground,
        borderRadius: "12px",
        overflow: "hidden",
        border: `1px solid ${borderColor}`,
      }}
    >
      <JobDetails job={jobData} refetch={refetch} />
    </Paper>

    <Paper
      elevation={3}
      className="recruitment-panel"
      sx={{
        backgroundColor: cardBackground,
        borderRadius: "12px",
        border: `1px solid ${borderColor}`,
        mt: 3,
      }}
    >
      <Box className="view-toggle">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            px: 3,
            py: 2,
            borderBottom: `1px solid ${borderColor}`,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 600, color: textColor }}>
            Recruitment Process
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              onClick={() => setCalender(false)}
              className={`toggle-option ${!calender ? "active" : ""}`}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
                padding: "8px 16px",
                borderRadius: "8px",
                backgroundColor: !calender ? `${primaryColor}10` : "transparent",
                color: !calender ? primaryColor : textColor,
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: `${primaryColor}10`,
                },
              }}
            >
              <People fontSize="small" />
              <Typography sx={{ fontWeight: 500, display: { xs: "none", sm: "block" } }}>Applicants</Typography>
            </Box>

            <DynamicSwitcher setter={setCalender} getter={calender} />

            <Box
              onClick={() => setCalender(true)}
              className={`toggle-option ${calender ? "active" : ""}`}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
                padding: "8px 16px",
                borderRadius: "8px",
                backgroundColor: calender ? `${primaryColor}10` : "transparent",
                color: calender ? primaryColor : textColor,
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: `${primaryColor}10`,
                },
              }}
            >
              <CalendarMonth fontSize="small" />
              <Typography sx={{ fontWeight: 500, display: { xs: "none", sm: "block" } }}>Meetings</Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box className="process-content">
        {!calender ? (
          <>
            <ProcessColumn setter={setClickedColumn} column={clickedColumn} phases={phases} />
            <ProcessCard column={clickedColumn} phases={phases} job={jobData} />
          </>
        ) : (
          <>
            <ProcessColumn setter={setClickedColumn} column={clickedColumn} phases={phases.slice(2, 5)} />
            <MeetingsTable column={clickedColumn} phases={phases.slice(2, 5)} />
          </>
        )}
      </Box>
    </Paper>
  </div>
  );
}

export default SingleJob;
