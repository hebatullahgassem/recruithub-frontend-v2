import React, { useContext , useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Pagination,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useMediaQuery,
  useTheme,
  Chip,
  IconButton
} from "@mui/material";
import { userContext } from "../../../context/UserContext";
import { AxiosApi } from "../../../services/Api";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  BookmarkBorder,
  Bookmark,
  LocationOn,
  Business,
  WorkOutline,
  Schedule,
  Refresh,
  ArrowForward,
  Upload
} from "@mui/icons-material";
const RecommendedJobs = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { user } = useContext(userContext);
  
  console.log("User:", user);
  const navigate = useNavigate();
  // const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const primaryColor = "#d43132";
  const secondaryColor = "#f5f5f5";

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 5,
    totalPages: 1,
    totalResults: 0,
  });
  const {
    data: jobs,
    error: jobsError,
    isLoading: jobsLoading,
    refetch,
  } = useQuery({
    queryKey: ["jobsRecomm", user?.id, pagination.page, pagination.pageSize],
    queryFn: async () => {
      if (!user?.id) {
        console.error("User not authenticated");
        return [];
      }
      const response = await AxiosApi.get(`jobs/recom/${user.id}/`, {
        params: {
          page: pagination.page,
          page_size: pagination.pageSize,
        },
        timeout: 10000,
      });
      const data = response.data;
      console.log(data);
      setPagination((prev) => ({
        ...prev,
        totalPages: Math.ceil(data.total_results / pagination.pageSize),
        totalResults: data.total_results,
      }));
      return data.recommendations || [];
    },
  });

  const handlePageChange = (event, newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (event) => {
    setPagination((prev) => ({
      ...prev,
      pageSize: event.target.value,
      page: 1,
    }));
  };

  const handleJobClick = (jobId) => {
    navigate(`/applicant/jobs/${jobId}`);
  };

  const handleRefresh = () => {
    refetch();
  };

  if (!user?.cv) {
    return (
      <Box 
        sx={{ 
          p: 4, 
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          background: "linear-gradient(135deg, #f9f9f9 0%, #fff 100%)",
          borderRadius: 3,
          mx: isMobile ? 1 : 3,
          my: 3,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.05)"
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ 
            backgroundColor: "#fff4f4",
            p: 3,
            borderRadius: 3,
            borderLeft: `4px solid ${primaryColor}`,
            maxWidth: 600,
            mb: 4
          }}>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 700,
                color: primaryColor,
                mb: 1
              }}
            >
              <WorkOutline sx={{ verticalAlign: "middle", mr: 1 }} />
              Complete Your Profile
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Upload your CV to unlock personalized job recommendations tailored to your skills and experience.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate("/applicant/profile/edit-cv")}
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
              startIcon={<Upload />}
            >
              Upload CV Now
            </Button>
          </Box>
        </motion.div>
      </Box>
    );
  }

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
              <span style={{ color: primaryColor }}>Recommended</span> Jobs For You
            </Typography>
            <Typography variant="subtitle1" sx={{ 
              color: "#718096",
              display: "flex",
              alignItems: "center",
              gap: 1
            }}>
              <Business sx={{ fontSize: 18, color: primaryColor }} />
              {pagination.totalResults} jobs matched your profile
            </Typography>
          </Box>
          
          <Box sx={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 2,
            flexDirection: isMobile ? "column" : "row",
            width: isMobile ? "100%" : "auto"
          }}>
            <FormControl size="small" sx={{ 
              minWidth: isMobile ? "100%" : 140,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                background: "#fff"
              }
            }}>
              <InputLabel id="page-size-label">Jobs per page</InputLabel>
              <Select
                labelId="page-size-label"
                value={pagination.pageSize}
                onChange={handlePageSizeChange}
                label="Jobs per page"
              >
                {[6, 12, 18, 20, 24].map((size) => (
                  <MenuItem key={size} value={size}>
                    {size}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button 
              variant="contained"
              onClick={handleRefresh} 
              disabled={jobsLoading}
              sx={{
                px: 3,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                width: isMobile ? "100%" : "auto",
                backgroundColor: "#2d3748",
                "&:hover": {
                  backgroundColor: "#1a202c",
                },
                "&:disabled": {
                  backgroundColor: "#e2e8f0",
                }
              }}
              startIcon={<Refresh />}
            >
              Refresh
            </Button>
          </Box>
        </Box>
      </motion.div>

      {jobsLoading ? (
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
      ) : jobsError ? (
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
                <Business sx={{ color: primaryColor }} />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 600, color: "#2d3748" }}>
                  Couldn't load recommendations
                </Typography>
                <Typography variant="body2" sx={{ color: "#718096" }}>
                  {jobsError.message || "Please try refreshing the page"}
                </Typography>
              </Box>
            </Box>
          </Alert>
        </motion.div>
      ) : jobs.length === 0 ? (
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
              <WorkOutline sx={{ 
                fontSize: 40,
                color: primaryColor 
              }} />
            </Box>
            <Typography variant="h6" sx={{ 
              fontWeight: 700,
              mb: 1,
              color: "#2d3748"
            }}>
              No matching jobs found
            </Typography>
            <Typography sx={{ 
              color: "#718096",
              mb: 3,
              maxWidth: 500,
              mx: "auto"
            }}>
              We couldn't find any jobs matching your profile. Try updating your skills or broadening your search criteria.
            </Typography>
            <Button
              variant="outlined"
              onClick={handleRefresh}
              sx={{
                borderColor: primaryColor,
                color: primaryColor,
                fontWeight: 600,
                px: 4,
                "&:hover": {
                  backgroundColor: `${primaryColor}10`,
                  borderColor: primaryColor
                }
              }}
            >
              Try Again
            </Button>
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
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ 
                    duration: 0.4,
                    delay: index * 0.05
                  }}
                  whileHover={{ 
                    y: -5,
                  }}
                >
                  <Box
                    onClick={() => handleJobClick(job.id)}
                    sx={{
                      border: "1px solid",
                      borderColor: "#e2e8f0",
                      borderRadius: "12px",
                      padding: isMobile ? 2 : 3,
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      backgroundColor: "#fff",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      "&:hover": {
                        borderColor: primaryColor,
                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                      },
                      position: "relative",
                      overflow: "hidden"
                    }}
                  >
                    {/* Bookmark button */}
                    <IconButton
                      sx={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        zIndex: 2,
                        color: "#cbd5e0",
                        "&:hover": {
                          color: primaryColor
                        }
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle bookmark logic here
                      }}
                    >
                      <BookmarkBorder />
                    </IconButton>
                    
                    {/* Match score ribbon */}
                    {job.match_score && (
                      <Box sx={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        backgroundColor: primaryColor,
                        color: "white",
                        px: 2,
                        py: 0.5,
                        borderBottomLeftRadius: 12,
                        fontSize: 12,
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        zIndex: 1
                      }}>
                        {job.match_score}% Match
                      </Box>
                    )}

                    <Box sx={{ 
                      display: "flex", 
                      alignItems: "flex-start",
                      mb: 2
                    }}>
                      <Box
                        sx={{
                          width: 64,
                          height: 64,
                          borderRadius: "12px",
                          backgroundColor: "#f8fafc",
                          border: "1px solid #edf2f7",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          overflow: "hidden",
                          flexShrink: 0,
                          mr: 2
                        }}
                      >
                        <img
                          src={
                            job.company_logo ||
                            "https://static.thenounproject.com/png/3198584-200.png"
                          }
                          alt={job.company_name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 700,
                            color: "#2d3748",
                            mb: 0.5,
                            pr: 4
                          }}
                        >
                          {job.title}
                        </Typography>
                        <Box sx={{ 
                          display: "flex",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: 1,
                          mb: 1
                        }}>
                          <Chip
                            icon={<Business sx={{ fontSize: 16 }} />}
                            label={job.company_name}
                            size="small"
                            sx={{
                              backgroundColor: "#f8fafc",
                              color: "#4a5568",
                              fontWeight: 500
                            }}
                          />
                          <Chip
                            icon={<LocationOn sx={{ fontSize: 16 }} />}
                            label={job.location}
                            size="small"
                            sx={{
                              backgroundColor: "#f8fafc",
                              color: "#4a5568",
                              fontWeight: 500
                            }}
                          />
                        </Box>
                        {job.type_of_job && (
                          <Chip
                            icon={<Schedule sx={{ fontSize: 16 }} />}
                            label={job.type_of_job}
                            size="small"
                            sx={{
                              backgroundColor: `${primaryColor}10`,
                              color: primaryColor,
                              fontWeight: 500
                            }}
                          />
                        )}
                      </Box>
                    </Box>

                    <Typography
                      variant="body2"
                      sx={{
                        mt: 2,
                        color: "#4a5568",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        lineHeight: 1.6,
                        position: "relative",
                        "&:after": {
                          content: '""',
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: "32px",
                          background: "linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1))",
                        }
                      }}
                    >
                      {job.description}
                    </Typography>

                    {job.skills_required?.length > 0 && (
                      <Box
                        sx={{ 
                          display: "flex", 
                          flexWrap: "wrap", 
                          gap: 1, 
                          mt: 3,
                          pt: 2,
                          borderTop: `1px solid #edf2f7`
                        }}
                      >
                        {job.skills_required.slice(0, 5).map((skill, index) => (
                          <motion.div
                            key={index}
                            whileHover={{ scale: 1.05 }}
                          >
                            <Chip
                              label={skill}
                              size="small"
                              sx={{
                                backgroundColor: `${primaryColor}10`,
                                color: primaryColor,
                                fontWeight: 500
                              }}
                            />
                          </motion.div>
                        ))}
                        {job.skills_required.length > 5 && (
                          <Chip
                            label={`+${job.skills_required.length - 5} more`}
                            size="small"
                            sx={{
                              backgroundColor: "#edf2f7",
                              color: "#718096"
                            }}
                          />
                        )}
                      </Box>
                    )}

                    <Box sx={{ 
                      display: "flex", 
                      justifyContent: "space-between",
                      alignItems: "center",
                      mt: "auto",
                      pt: 2
                    }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Schedule sx={{ 
                          fontSize: 16, 
                          color: "#718096",
                          mr: 1 
                        }} />
                        <Typography variant="caption" sx={{ color: "#718096" }}>
                          Posted {new Date(job.created_at).toLocaleDateString()}
                        </Typography>
                      </Box>
                      
                      <Button
                        variant="contained"
                        onClick={(e) => handleApplyClick(job.id, e)}
                        sx={{
                          px: 3,
                          py: 1,
                          borderRadius: 2,
                          fontWeight: 600,
                          backgroundColor: primaryColor,
                          "&:hover": {
                            backgroundColor: "#b32828",
                            boxShadow: `0 4px 14px ${primaryColor}33`,
                          },
                          textTransform: "none",
                          fontSize: 14
                        }}
                        endIcon={<ArrowForward />}
                      >
                        Apply Now
                      </Button>
                    </Box>
                  </Box>
                </motion.div>
              ))}
            </AnimatePresence>
          </Box>

          <Box
            sx={{
              mt: "auto",
              display: "flex",
              justifyContent: "center",
              py: 3,
              position: "sticky",
              bottom: 0,
              backgroundColor: "#fff",
              zIndex: 1,
              borderTop: `1px solid #e2e8f0`,
              boxShadow: "0 -4px 12px rgba(0, 0, 0, 0.05)"
            }}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
            >
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
};


export default RecommendedJobs;
