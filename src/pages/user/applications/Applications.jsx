import React, { useContext, useState ,useEffect } from "react";
import { Box,
Typography,
Button,
CircularProgress,
useTheme,
useMediaQuery,
Alert,
Divider,
Chip } from "@mui/material";
import { 
BriefcaseIcon,
RefreshCwIcon as RefreshIcon,
AlertCircle 
} from "lucide-react"
import { getApplicationsByUser } from "../../../services/Application";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion"
import JobCardApp from "../../../components/job/JobCardApp";
import { userContext } from "../../../context/UserContext";
import { useNavigate } from "react-router";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import CustomPagination from "../../../components/pagination/pagination";
import { showInfoToast, showErrorToast, showSuccessToast } from "../../../confirmAlert/toastConfirm";
import '../../../styles/user/Applications.css'

const statusOptions = [
  { label: "All", value: "2,3,4,5,6" },
  { label: "Under Review", value: "2" },
  { label: "Shortlisted", value: "3" },
  { label: "Interview", value: "4" },
  { label: "Offered", value: "5" },
  { label: "Rejected", value: "6" },
];
const JobApplication = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { user } = useContext(userContext);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 6,
    totalPages: 1,
    totalResults: 0,
  });

  const [filters, setFilters] = useState({
    user: "",
    job: "",
    status: "",
  });
 const [statusFilter, setStatusFilter] = useState("2,3,4,5,6"); // default to all active statuses

  const [searchFilters, setSearchFilters] = useState({
    user: `${user.id}`,
    job: "",
    status: "2,3,4,5,6",
  });

  const {
    data: application,
    error: applicationError,
    isLoading: applicationLoading,
    refetch,
  } = useQuery({
    queryKey: ["application",
      pagination.page,
       pagination.pageSize,
       JSON.stringify(searchFilters)
      ],
    queryFn: async () => {
      try {
        const res = await getApplicationsByUser({
          filters: searchFilters,
          page: pagination.page,
          pageSize: pagination.pageSize,
        })

        setPagination((prev) => ({
          ...prev,
          totalResults: res.count,
          totalPages: Math.ceil(res.count / prev.pageSize),
        }))

        return res.results
      } catch (error) {
        showErrorToast("Failed to load your applications. Please try again.")
        throw error
      }
    },
  });
  useEffect(() => {
    // Show welcome toast when component mounts
    showInfoToast("Viewing your job applications")
  }, [])

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }))
  }

  const handlePageSizeChange = (newPageSize) => {
    setPagination((prev) => ({
      ...prev,
      pageSize: newPageSize,
      page: 1,
    }))
  }

  const handleRefresh = () => {
    const loadingToast = showInfoToast("Refreshing applications...")
    refetch()
      .then(() => {
        showSuccessToast("Applications refreshed successfully")
      })
      .catch(() => {
        showErrorToast("Failed to refresh applications")
      })
  }

  const handleBrowseJobs = () => {
    navigate("/applicant/jobs")
  }
  
  const handleStatusChange = (event) => {
    const newStatus = event.target.value;
    setStatusFilter(newStatus);
    // setStatusFilter(event.target.value);
    setPagination((prev) => ({ ...prev, page: 1 })); // reset to first page on filter change
    setSearchFilters((prev) => ({
      ...prev,
      status: newStatus,
    }));
  };

  return (
    <Box className="job-application-container">
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Box className="job-application-header">
        <Box>
          <Typography variant="h4" className="job-application-title">
            <span className="job-application-title-highlight">Your</span> Job Applications
          </Typography>
          <Typography variant="subtitle1" className="job-application-subtitle">
            <BriefcaseIcon className="job-application-icon" />
            {pagination.totalResults} applications found
          </Typography>
        </Box>

        
        <Box display="flex" gap={2}>
            <FormControl size="small" variant="outlined">
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                value={statusFilter}
                onChange={handleStatusChange}
              >
                <MenuItem value="2,3,4,5,6">All</MenuItem>
                <MenuItem value="2">Under Review</MenuItem>
                <MenuItem value="3">Shortlisted</MenuItem>
                <MenuItem value="4">Interview</MenuItem>
                <MenuItem value="5">Offered</MenuItem>
                <MenuItem value="6">Rejected</MenuItem>
              </Select>
            </FormControl>


        <Button
          variant="contained"
          onClick={handleRefresh}
          disabled={applicationLoading}
          className="job-application-refresh-button"
          startIcon={<RefreshIcon />}
        >
          Refresh
        </Button>
      </Box>
      </Box>
    </motion.div>

    {applicationLoading ? (
      <Box className="job-application-loading">
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        >
          <CircularProgress size={60} thickness={4} className="job-application-spinner" />
        </motion.div>
        <Typography variant="h6" className="job-application-loading-text">
          Loading your applications...
        </Typography>
      </Box>
    ) : applicationError ? (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <Alert
          severity="error"
          className="job-application-error"
          icon={<AlertCircle className="job-application-error-icon" />}
        >
          <Box className="job-application-error-content">
            <Typography className="job-application-error-title">Couldn't load applications</Typography>
            <Typography variant="body2" className="job-application-error-message">
              {applicationError.message || "Please try refreshing the page"}
            </Typography>
            <Button variant="contained" onClick={handleRefresh} className="job-application-error-button">
              Try Again
            </Button>
          </Box>
        </Alert>
      </motion.div>
    ) : application?.length === 0 ? (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <Box className="job-application-empty">
          <Box className="job-application-empty-icon-container">
            <BriefcaseIcon className="job-application-empty-icon" />
          </Box>
          <Typography variant="h6" className="job-application-empty-title">
            No applications found
          </Typography>
          <Typography className="job-application-empty-message">
            You haven't applied to any jobs yet. Start exploring opportunities!
          </Typography>
          <Button variant="contained" onClick={handleBrowseJobs} className="job-application-browse-button">
            Browse Jobs
          </Button>
        </Box>
      </motion.div>
    ) : (
      <>
        {/* <Box className="job-application-status-summary">
          <Chip label="All Applications" className="job-application-status-chip active" />
          <Chip label="Under Review" className="job-application-status-chip" />
          <Chip label="Shortlisted" className="job-application-status-chip" />
          <Chip label="Interview" className="job-application-status-chip" />
          <Chip label="Offered" className="job-application-status-chip" />
          <Chip label="Rejected" className="job-application-status-chip" />
        </Box> */}

        <Divider className="job-application-divider" />

        <Box className="job-application-grid">
          <AnimatePresence>
            {application.map((application, index) => (
              <JobCardApp
                key={application.id}
                application={application}
                index={index}
                primaryColor="#d43132"
              />
            ))}
          </AnimatePresence>
        </Box>

        {application && application.length > 0 && (
          <Box className="job-application-pagination-container">
            <pagination
              page={pagination.page}
              setPage={handlePageChange}
              pageSize={pagination.pageSize}
              setPageSize={handlePageSizeChange}
              total={pagination.totalResults}
            />
          </Box>
        )}
      </>
    )}
  </Box>
    // <div className="d-flex flex-column align-items-center w-100" style={{ minHeight: "70vh" }}>
    //   <h2 className="m-3">Your Jobs Applications</h2>
    //   {application?.length > 0 ? (
    //     application.map((application) => (
    //       <JobCard
    //         key={application.id}
    //         job={application.job_details}
    //         user={"user"}
    //       />
    //     ))
    //   ) : (
    //     <div
    //       style={{
    //         minHeight: "30vh",
    //         display: "flex",
    //         flexDirection: "column",
    //         justifyContent: "center",
    //         alignItems: "center",
    //       }}
    //     >
    //       <Typography variant="h4">No applications found</Typography>
    //       <button
    //         className="btn btn-primary"
    //         onClick={() => navigate("/applicant/jobs")}
    //       >
    //         Browse Jobs
    //       </button>
    //     </div>
    //   )}
    //   {application && application.length > 0 && (
    //     <CustomPagination
    //       page={page}
    //       setPage={setPage}
    //       pageSize={pageSize}
    //       setPageSize={setPageSize}
    //       total={total}
    //     />
    //   )}
    // </div>
  );
};

export default JobApplication;          