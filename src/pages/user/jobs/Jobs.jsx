import React, { useState } from "react";
import { Link } from "react-router-dom";
import JobCard from "../../../components/job/JobCard";
import { useQuery } from "@tanstack/react-query";
import { getAllJobs } from "../../../services/Job";
import CustomPagination from "../../../components/pagination/pagination";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  Alert,
  useMediaQuery,
  useTheme
} from "@mui/material";
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  WorkOutline as WorkOutlineIcon
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";

const primaryColor = "#d43132";
const secondaryColor = "#f5f5f5";

function UserJobs() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [filters, setFilters] = useState({
    title: "",
    location: "",
    experince: "",
    type_of_job: "",
    attend: "",
    status: "1",
    ordering: "",
  });

   const [pagination, setPagination] = useState({
     page: 1,
     pageSize: 6,
     totalPages: 1,
     totalResults: 0,
   });
 

  const [searchFilters, setSearchFilters] = useState({
    title: "",
    location: "",
    experince: "",
    type_of_job: "",
    attend: "",
    status: "1",
    ordering: "",
  });

const {
  data: jobs,
  error: jobError,
  isLoading: jobLoading,
  refetch,
} = useQuery({
  queryKey: ["jobs", pagination.page, pagination.pageSize, searchFilters], // Use pagination values
  queryFn: async () => {
    const res = await getAllJobs({ 
      filters: searchFilters, 
      page: pagination.page, 
      pageSize: pagination.pageSize 
    });


    setPagination(prev => ({
      ...prev,
      totalResults: res.data.count,
      totalPages: Math.ceil(res.data.count / prev.pageSize),
    }));
    
    return res.data.results;
  },
});

  const handleChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSearch = () => {
    setSearchFilters(filters); // Update search filters
    setPage(1); // Reset to first page
    refetch(); // Fetch with new filters
  };

  const handleReset = () => {
    setFilters({ title: "", location: "", experince: "", type_of_job: "" });
    setSearchFilters({
      title: "",
      location: "",
      experince: "",
      type_of_job: "",
      attend: "",
      status: "1",
      ordering: "",
    });
    setPage(1); // Reset page
    refetch(); // Fetch without filters
  };

  const handlePageChange = (event, newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (event) => {
    setPagination(prev => ({
      ...prev,
      pageSize: event.target.value,
      page: 1,
    }));
  };

  const hasFilters = Object.values(filters).some(
    value => value !== "" && value !== "1"
  );

  return (
    <Box
      sx={{
        p: isMobile ? 1 : 3,
        maxWidth: "1200px",
        margin: "0 auto",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#fff",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
          background: "#fff",
          p: 3,
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
          borderBottom: `3px solid ${primaryColor}`
        }}>
          <Box>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 800,
                fontSize: isMobile ? "1.8rem" : "2.125rem",
                color: "#2d3748",
                lineHeight: 1.2,
                mb: 1
              }}
            >
              <span style={{ color: primaryColor }}>Available</span> Jobs
            </Typography>
            <Typography variant="subtitle1" sx={{ 
              color: "#718096",
              display: "flex",
              alignItems: "center",
              gap: 1
            }}>
              <WorkOutlineIcon sx={{ fontSize: 18, color: primaryColor }} />
              {pagination.totalResults} jobs found
            </Typography>
          </Box>
          <FormControl size="small" sx={{ 
              minWidth: 140,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                background: "#fff"
              }
            }}>
              <InputLabel id="page-size-label">Per page</InputLabel>
              <Select
                labelId="page-size-label"
                value={pagination.pageSize}
                onChange={handlePageSizeChange}
                label="Per page"
              >
                {[6, 12, 18, 24].map((size) => (
                  <MenuItem key={size} value={size}>
                    {size}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          
          <Button 
            variant="contained"
            onClick={refetch} 
            disabled={jobLoading}
            sx={{
              px: 3,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              backgroundColor: "#2d3748",
              "&:hover": {
                backgroundColor: "#1a202c",
              },
              "&:disabled": {
                backgroundColor: "#e2e8f0",
              }
            }}
            startIcon={<RefreshIcon />}
          >
            Refresh
          </Button>
        </Box>
      </motion.div>

      <Box sx={{
        background: "#fff",
        p: 3,
        borderRadius: 3,
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
        mb: 3
      }}>
        <Typography variant="h6" sx={{ 
          fontWeight: 600,
          mb: 2,
          color: "#2d3748"
        }}>
          Search Filters
        </Typography>
        
        <Box sx={{ 
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 2,
          mb: 2
        }}>
          <TextField
            size="small"
            label="Job Title"
            name="title"
            value={filters.title}
            onChange={handleChange}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                background: "#fff"
              }
            }}
          />
          
          <TextField
            size="small"
            label="Location"
            name="location"
            value={filters.location}
            onChange={handleChange}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                background: "#fff"
              }
            }}
          />
          
          <TextField
            size="small"
            label="Experience"
            name="experince"
            value={filters.experince}
            onChange={handleChange}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                background: "#fff"
              }
            }}
          />
          
          <FormControl size="small" sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              background: "#fff"
            }
          }}>
            <InputLabel>Attendance</InputLabel>
            <Select
              name="attend"
              value={filters.attend || ""}
              onChange={handleChange}
              label="Attendance"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Onsite">Onsite</MenuItem>
              <MenuItem value="Hybrid">Hybrid</MenuItem>
              <MenuItem value="Remote">Remote</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl size="small" sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              background: "#fff"
            }
          }}>
            <InputLabel>Job Type</InputLabel>
            <Select
              name="type_of_job"
              value={filters.type_of_job || ""}
              onChange={handleChange}
              label="Job Type"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Full-time">Full-time</MenuItem>
              <MenuItem value="Part-time">Part-time</MenuItem>
              <MenuItem value="Internship">Internship</MenuItem>
              <MenuItem value="Freelance">Freelance</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl size="small" sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              background: "#fff"
            }
          }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              name="ordering"
              value={filters.ordering || ""}
              onChange={handleChange}
              label="Sort By"
            >
              <MenuItem value="">Default</MenuItem>
              <MenuItem value="-created_at">Newest First</MenuItem>
              <MenuItem value="created_at">Oldest First</MenuItem>
            </Select>
          </FormControl>
        </Box>
        
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            onClick={handleReset}
            disabled={!hasFilters}
            sx={{
              px: 3,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              borderColor: primaryColor,
              color: primaryColor,
              "&:hover": {
                borderColor: "#b32828",
                backgroundColor: `${primaryColor}10`,
              },
              "&:disabled": {
                borderColor: "#e2e8f0",
                color: "#a0aec0",
              }
            }}
          >
            Reset
          </Button>
          
          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={!hasFilters}
            sx={{
              px: 3,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              backgroundColor: primaryColor,
              "&:hover": {
                backgroundColor: "#b32828",
                boxShadow: `0 6px 20px ${primaryColor}33`,
              },
              "&:disabled": {
                backgroundColor: "#e2e8f0",
              },
              boxShadow: `0 4px 14px ${primaryColor}33`,
            }}
            startIcon={<SearchIcon />}
          >
            Search
          </Button>
        </Box>
      </Box>

      {jobLoading ? (
        <Box 
          sx={{ 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center",
            minHeight: "300px",
            background: "#fff",
            borderRadius: 3,
            p: 4,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)"
          }}
        >
          <motion.div
            animate={{ 
              rotate: 360,
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <CircularProgress 
              size={60} 
              thickness={4}
              sx={{
                color: primaryColor
              }}
            />
          </motion.div>
        </Box>
      ) : jobError ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
              borderLeft: `4px solid ${primaryColor}`
            }}
            icon={false}
          >
            <Box sx={{ display: "flex", alignItems: "flex-start" }}>
              <Box sx={{ 
                backgroundColor: `${primaryColor}20`,
                p: 1,
                borderRadius: "50%",
                mr: 2,
                display: "flex"
              }}>
                <WorkOutlineIcon sx={{ color: primaryColor }} />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 600, color: "#2d3748" }}>
                  Couldn't load jobs
                </Typography>
                <Typography variant="body2" sx={{ color: "#718096" }}>
                  {jobError.message || "Please try refreshing the page"}
                </Typography>
              </Box>
            </Box>
          </Alert>
        </motion.div>
      ) : jobs?.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ 
            background: "#fff",
            p: 4,
            borderRadius: 3,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
            textAlign: "center",
            borderLeft: `4px solid ${primaryColor}`
          }}>
            <Box sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: `${primaryColor}10`,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2
            }}>
              <SearchIcon sx={{ 
                fontSize: 40,
                color: primaryColor 
              }} />
            </Box>
            <Typography variant="h6" sx={{ 
              fontWeight: 700,
              mb: 1,
              color: "#2d3748"
            }}>
              No jobs found
            </Typography>
            <Typography sx={{ 
              color: "#718096",
              mb: 3,
              maxWidth: 500,
              mx: "auto"
            }}>
              {hasFilters 
                ? "No jobs match your current filters. Try adjusting your search criteria."
                : "There are currently no available jobs. Please check back later."}
            </Typography>
            {hasFilters && (
              <Button
                variant="contained"
                onClick={handleReset}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  textTransform: "none",
                  fontSize: 16,
                  backgroundColor: primaryColor,
                  "&:hover": {
                    backgroundColor: "#b32828",
                    boxShadow: `0 6px 20px ${primaryColor}33`,
                  },
                  boxShadow: `0 4px 14px ${primaryColor}33`,
                }}
              >
                Reset Filters
              </Button>
            )}
          </Box>
        </motion.div>
      ) : (
        <>
          <Box sx={{ 
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(450px, 1fr))",
            gap: 3,
            mb: 4
          }}>
            <AnimatePresence>
              {jobs?.map((job, index) => (
                <JobCard 
                  key={job.id} 
                  job={job} 
                  user={"user"} 
                  index={index}
                  primaryColor={primaryColor}
                />
            ))}
            </AnimatePresence>
          </Box>

          <Box
             sx={{
              display: "flex",
              justifyContent: "center",
              py: 3,
            }}
          >
           
            <motion.div whileHover={{ scale: 1.02 }}>
              <Pagination
                count={pagination.totalPages}
                page={pagination.page}
                onChange={handlePageChange}
                color="primary"
                shape="rounded"
                size={isMobile ? "small" : "medium"}
                sx={{
                  "& .MuiPaginationItem-root": {
                    fontWeight: 600,
                    color: "#4a5568",
                    "&.Mui-selected": {
                      backgroundColor: primaryColor,
                      color: "#fff",
                      "&:hover": {
                        backgroundColor: "#b32828",
                      }
                    },
                  }
                }}
              />
            </motion.div>
          </Box>
        </>
      )}
    </Box>
  );
}

export default UserJobs;
