import { useNavigate } from "react-router";
import { useContext } from "react";
import { userContext } from "../../context/UserContext";
import {
  Box,
  Typography,
  Chip,
  Button,
  Card,
  CardContent,
  Divider,
  Avatar,
  useTheme,
  useMediaQuery,
  Tooltip,
  Stack,
  IconButton,
} from "@mui/material";
import {
  LocationOn,
  Business,
  Schedule,
  ArrowForward,
  AttachMoney,
  AccessTime,
  Star,
  House,
  BookmarkBorder,
  Stairs,
  DateRange,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import {
  deleteApplication,
  getApplicationsByUser,
} from "../../services/Application";
import { showConfirmToast, showSuccessToast } from "../../confirmAlert/toastConfirm";
function JobCard({ job, type, isSelected, refetch }) {
  // const keywords = job?.keywords?.join(" · ") || "";
  const { user, isLight } = useContext(userContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const primaryColor = "#d43132";

  const handleJobClick = (jobId) => {
    navigate(
      user.user_type === "COMPANY"
        ? `/company/jobs/${jobId}`
        : `/applicant/jobs/${jobId}`
    );
  };

  // Format date to relative time
  const getRelativeTime = (dateString) => {
    if (!dateString) return "Recent";

    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return "Today";
    } else if (diffInDays === 1) {
      return "Yesterday";
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else if (diffInDays < 30) {
      return `${Math.floor(diffInDays / 7)} weeks ago`;
    } else {
      return `${Math.floor(diffInDays / 30)} months ago`;
    }
  };

  // Animation variants
  // const cardVariants = {
  //   initial: { opacity: 0, y: 20 },
  //   animate: { opacity: 1, y: 0 },
  //   hover: {
  //     y: -8,
  //     boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  //     borderColor: primaryColor,
  //   },
  // }

  // const logoVariants = {
  //   initial: { scale: 0.8, opacity: 0 },
  //   animate: { scale: 1, opacity: 1, transition: { delay: 0.2 } },
  //   hover: { scale: 1.05, transition: { duration: 0.2 } },
  // }

  // const chipVariants = {
  //   initial: { opacity: 0, x: -10 },
  //   animate: { opacity: 1, x: 0 },
  //   hover: { y: -2 },
  // }
  const handleDeleteJob = async () => {
    try {
      const app = await getApplicationsByUser({
        filters: { user: user?.id, job: job?.id },
      });
      const res = await deleteApplication(app.results[0].id);
      showSuccessToast("Job unsaved successfully", 2000, isLight);
      refetch();
    } catch (err) {
      console.log(err);
      refetch();
    }
  };
  const handleSaveJob = async () => {
    showConfirmToast({
      message: `Are you sure you want to unsave job: ${job?.title}?`,
      onConfirm: handleDeleteJob,
      onCancel: () => {},
      confirmText: "Unsave",
      cancelText: "Cancel",
      isLight,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -8,
        transition: { duration: 0.3 },
      }}
      transition={{ duration: 0.4 }}
      style={{ width: "100%", height: "100%" }}
    >
      <Card
        sx={{
          width: "100%",
          height: "100%",
          minHeight: 280,
          display: "flex",
          flexDirection: "column",
          borderRadius: "16px",
          cursor: "pointer",
          border: isSelected
            ? `2px solid ${primaryColor}`
            : "1px solid #e2e8f0",
          backgroundColor: isLight ? "#fff" : " #242424",
          transition: "all 0.3s ease",
          "&:hover": {
            borderColor: primaryColor,
            boxShadow:
              "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          },
          overflow: "hidden",
          position: "relative",
        }}
      >
        {type === "saved" && (
          <IconButton
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
            }}
            onClick={() => handleSaveJob(job?.id)}
          >
            <BookmarkBorder />
          </IconButton>
        )}
        <CardContent
          onClick={() => handleJobClick(job?.id)}
          sx={{
            p: 0,
            display: "flex",
            flexDirection: "column",
            height: "100%",
            "&:last-child": { pb: 0 }, // Override Material UI default padding
          }}
        >
          {/* Header Section */}
          <Box sx={{ p: 3, pb: 2 }}>
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <Avatar
                src={
                  job?.company_logo ||
                  "https://static.thenounproject.com/png/3198584-200.png"
                }
                alt={job?.company_name || "Company"}
                variant="rounded"
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: "12px",
                  backgroundColor: "#f9fafb",
                  border: "1px solid #f0f0f0",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                }}
              />

              <Box sx={{ flex: 1, overflow: "hidden" }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: isLight ? "#2d3748" : "white",
                    mb: 0.5,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                    lineHeight: 1.4,
                  }}
                >
                  {job?.title || "Job Title"}
                </Typography>

                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={0.5}
                  sx={{ mb: 0.5 }}
                >
                  <Business
                    sx={{ fontSize: 16, color: isLight ? "#718096" : "white" }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      color: isLight ? "#4a5568" : "white",
                      fontWeight: 500,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {job?.company_name || "Company Name"}
                  </Typography>
                </Stack>

                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <LocationOn
                    sx={{ fontSize: 16, color: isLight ? "#718096" : "white" }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      color: isLight ? "#718096" : "white",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {job?.location || "Location"}
                  </Typography>
                </Stack>
              </Box>
            </Stack>

            <Stack
              direction="row"
              spacing={1}
              sx={{ mt: 2, flexWrap: "wrap", gap: 1 }}
            >
              <Chip
                icon={
                  <DateRange
                    sx={{ fontSize: 14, color: isLight ? "#718096" : "white" }}
                  />
                }
                label={getRelativeTime(job?.created_at)}
                size="small"
                sx={{
                  backgroundColor: isLight ? "#f8fafc" : "#121212",
                  color: isLight ? "#718096" : "white",
                  fontWeight: 500,
                  height: 24,
                  fontSize: "0.7rem",
                }}
              />

              {job?.type_of_job && (
                <Chip
                  icon={<Schedule sx={{ fontSize: 14 }} />}
                  label={job.type_of_job}
                  size="small"
                  sx={{
                    backgroundColor: `${primaryColor}20`,
                    color: isLight ? primaryColor : "white",
                    fontWeight: 500,
                    height: 24,
                    fontSize: "0.7rem",
                  }}
                />
              )}

              {job?.attend && (
                <Chip
                  icon={<House sx={{ fontSize: 14 }} />}
                  label={job.attend}
                  size="small"
                  sx={{
                    backgroundColor: isLight ? "#f0fdf4" : "#121212",
                    color: "#16a34a",
                    fontWeight: 500,
                    height: 24,
                    fontSize: "0.7rem",
                  }}
                />
              )}
              {job?.experince && (
                <Chip
                  icon={<Stairs sx={{ fontSize: 14 }} />}
                  label={job.experince}
                  size="small"
                  sx={{
                    backgroundColor: isLight ? "#f0fdf4" : "#121212",
                    color: "#16a34a",
                    fontWeight: 500,
                    height: 24,
                    fontSize: "0.7rem",
                  }}
                />
              )}
            </Stack>
          </Box>

          <Divider />

          {/* Description Section */}
          <Box sx={{ p: 3, pt: 2, flex: "1 0 auto" }}>
            <Typography
              variant="body2"
              sx={{
                color: isLight ? "#4a5568" : "white",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                lineHeight: 1.6,
                mb: 2,
                minHeight: "4.8em", // Minimum height for 3 lines
                position: "relative",
                "&:after": {
                  content: '""',
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "24px",
                  background: isLight
                    ? "linear-gradient(to bottom,rgba(245, 245, 245, 0.47), #fff)"
                    : "linear-gradient(to bottom,rgba(29, 29, 29, 0.57), #121212)",
                },
              }}
            >
              {job?.description ||
                "No description available for this position. Please click for more details about this job opportunity."}
            </Typography>

            {/* Skills Section */}
            {job?.skills_required && job.skills_required.length > 0 && (
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  flexWrap: "wrap",
                  gap: 1,
                  mb: 2,
                }}
              >
                {job.skills_required.slice(0, 3).map((skill, index) => (
                  <Chip
                    key={index}
                    icon={<Star sx={{ fontSize: 14 }} />}
                    label={skill}
                    size="small"
                    sx={{
                      backgroundColor: "#edf2f7",
                      color: "#4a5568",
                      fontWeight: 500,
                      height: 24,
                      fontSize: "0.7rem",
                    }}
                  />
                ))}
                {job.skills_required.length > 3 && (
                  <Tooltip title={job.skills_required.slice(3).join(", ")}>
                    <Chip
                      label={`+${job.skills_required.length - 3} more`}
                      size="small"
                      sx={{
                        backgroundColor: "#edf2f7",
                        color: "#718096",
                        height: 24,
                        fontSize: "0.7rem",
                        cursor: "help",
                      }}
                    />
                  </Tooltip>
                )}
              </Stack>
            )}
          </Box>

          {/* Action Section - Always at the bottom */}
          <Box
            sx={{
              p: 3,
              pt: 2,
              pb: 3,
              mt: "auto", // Push to bottom
              backgroundColor: isLight ? "#f8fafc" : "#242424",
              borderTop: "1px solid #edf2f7",
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ width: "100%" }}
            >
              {/* <Button
            {/* <Button
              variant="outlined"
              onClick={(e) => {
                e.stopPropagation()
                // Apply logic here
                console.log("Apply for job:", job?.id)
              }}
              sx={{
                flex: { xs: "1 1 auto", sm: 1 },
                py: 1.2,
                borderRadius: 2,
                fontWeight: 600,
                borderColor: primaryColor,
                color: primaryColor,
                "&:hover": {
                  backgroundColor: `${primaryColor}10`,
                  borderColor: primaryColor,
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                },
                textTransform: "none",
                fontSize: 14,
                transition: "all 0.3s ease",
              }}
            >
              Apply Now
            </Button> */}

              <Button
                variant="contained"
                onClick={(e) => {
                  e.stopPropagation();
                  handleJobClick(job?.id);
                }}
                sx={{
                  flex: { xs: "1 1 auto", sm: 1 },
                  py: 1.2,
                  borderRadius: 2,
                  fontWeight: 600,
                  backgroundColor: primaryColor,
                  "&:hover": {
                    backgroundColor: "#b32828",
                    boxShadow: `0 4px 14px ${primaryColor}33`,
                    transform: "translateY(-2px)",
                  },
                  textTransform: "none",
                  fontSize: 14,
                  transition: "all 0.3s ease",
                  color: isLight ? "black" : "white",
                }}
                endIcon={<ArrowForward />}
              >
                Apply Now
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default JobCard;

// import React from "react";
// import {
//   Box,
//   Typography,
//   Button,
//   Chip,
//   useMediaQuery,
//   useTheme
// } from "@mui/material";
// import { motion } from "framer-motion";
// import {
//   Business,
//   LocationOn,
//   Schedule,
//   ArrowForward
// } from "@mui/icons-material";
// import { useNavigate } from "react-router-dom";

// const JobCard = ({ application, index, primaryColor }) => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
//   const navigate = useNavigate();
//   console.log(application, "application")

//   const getStatusChipProps = (status) => {
//     switch(status) {
//       case 1: // Applied
//         return { label: "Applied", color: "default" };
//       case 2: // Under Review
//         return { label: "Under Review", color: "info" };
//       case 3: // Shortlisted
//         return { label: "Shortlisted", color: "primary" };
//       case 4: // Interview
//         return { label: "Interview", color: "warning" };
//       case 5: // Offered
//         return { label: "Offered", color: "success" };
//       case 6: // Rejected
//         return { label: "Rejected", color: "error" };
//       default:
//         return { label: "Unknown", color: "default" };
//     }
//   };

//   const formatDate = (dateString) => {
//     const options = { year: 'numeric', month: 'short', day: 'numeric' };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -20 }}
//       transition={{
//         duration: 0.4,
//         delay: index * 0.05
//       }}
//       whileHover={{
//         y: -5,
//       }}
//     >
//       <Box
//         onClick={() => navigate(`/applicant/jobs/${application.job_details.id}`)}
//         sx={{
//           border: "1px solid",
//           borderColor: "#e2e8f0",
//           borderRadius: "12px",
//           padding: isMobile ? 2 : 3,
//           cursor: "pointer",
//           transition: "all 0.3s ease",
//           backgroundColor: "#fff",
//           height: "100%",
//           display: "flex",
//           flexDirection: "column",
//           "&:hover": {
//             borderColor: primaryColor,
//             boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
//           },
//           position: "relative",
//           overflow: "hidden"
//         }}
//       >
//         {/* Status badge */}
//         <Chip
//           label={getStatusChipProps(application?.status).label}
//           color={getStatusChipProps(application?.status).color}
//           size="small"
//           sx={{
//             position: "absolute",
//             top: 12,
//             right: 12,
//             zIndex: 2,
//             fontWeight: 600,
//             textTransform: "uppercase",
//             fontSize: "0.7rem",
//             letterSpacing: "0.5px"
//           }}
//         />

//         <Box sx={{
//           display: "flex",
//           alignItems: "flex-start",
//           mb: 2
//         }}>
//           <Box
//             sx={{
//               width: 64,
//               height: 64,
//               borderRadius: "12px",
//               backgroundColor: "#f8fafc",
//               border: "1px solid #edf2f7",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               overflow: "hidden",
//               flexShrink: 0,
//               mr: 2
//             }}
//           >
//             <img
//               src={
//                 application?.job_details?.company_logo ||
//                 "https://static.thenounproject.com/png/3198584-200.png"
//               }
//               alt={application?.job_details?.company_name}
//               style={{
//                 width: "100%",
//                 height: "100%",
//                 objectFit: "cover",
//               }}
//             />
//           </Box>
//           <Box sx={{ flex: 1 }}>
//             <Typography
//               variant="h6"
//               sx={{
//                 fontWeight: 700,
//                 color: "#2d3748",
//                 mb: 0.5,
//                 pr: 4
//               }}
//             >
//               {application?.job_details.title}
//             </Typography>
//             <Box sx={{
//               display: "flex",
//               alignItems: "center",
//               flexWrap: "wrap",
//               gap: 1,
//               mb: 1
//             }}>
//               <Chip
//                 icon={<Business sx={{ fontSize: 16 }} />}
//                 label={application?.job_details.company_name}
//                 size="small"
//                 sx={{
//                   backgroundColor: "#f8fafc",
//                   color: "#4a5568",
//                   fontWeight: 500
//                 }}
//               />
//               <Chip
//                 icon={<LocationOn sx={{ fontSize: 16 }} />}
//                 label={application?.job_details.location}
//                 size="small"
//                 sx={{
//                   backgroundColor: "#f8fafc",
//                   color: "#4a5568",
//                   fontWeight: 500
//                 }}
//               />
//             </Box>
//             {application?.job_details.type_of_job && (
//               <Chip
//                 icon={<Schedule sx={{ fontSize: 16 }} />}
//                 label={application?.job_details.type_of_job}
//                 size="small"
//                 sx={{
//                   backgroundColor: `${primaryColor}10`,
//                   color: primaryColor,
//                   fontWeight: 500
//                 }}
//               />
//             )}
//           </Box>
//         </Box>

//         <Box sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           mb: 2,
//           p: 1.5,
//           backgroundColor: "#f8fafc",
//           borderRadius: 2
//         }}>
//           <Box>
//             <Typography variant="caption" sx={{
//               color: "#718096",
//               fontWeight: 500,
//               display: "block"
//             }}>
//               Applied On
//             </Typography>
//             <Typography variant="body2" sx={{ fontWeight: 600 }}>
//               {formatDate(application?.created_at)}
//             </Typography>
//           </Box>
//           <Box>
//             <Typography variant="caption" sx={{
//               color: "#718096",
//               fontWeight: 500,
//               display: "block"
//             }}>
//               Last Updated
//             </Typography>
//             <Typography variant="body2" sx={{ fontWeight: 600 }}>
//               {formatDate(application?.updated_at)}
//             </Typography>
//           </Box>
//         </Box>

//         <Typography
//           variant="body2"
//           sx={{
//             mt: 1,
//             color: "#4a5568",
//             overflow: "hidden",
//             textOverflow: "ellipsis",
//             display: "-webkit-box",
//             WebkitLineClamp: 3,
//             WebkitBoxOrient: "vertical",
//             lineHeight: 1.6,
//             position: "relative",
//             "&:after": {
//               content: '""',
//               position: "absolute",
//               bottom: 0,
//               left: 0,
//               right: 0,
//               height: "32px",
//               background: "linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1))",
//             }
//           }}
//         >
//           {application?.job_details.description}
//         </Typography>

//         {application?.job_details.skills_required?.length > 0 && (
//           <Box
//             sx={{
//               display: "flex",
//               flexWrap: "wrap",
//               gap: 1,
//               mt: 3,
//               pt: 2,
//               borderTop: `1px solid #edf2f7`
//             }}
//           >
//             {application?.job_details.skills_required.slice(0, 5).map((skill, index) => (
//               <motion.div
//                 key={index}
//                 whileHover={{ scale: 1.05 }}
//               >
//                 <Chip
//                   label={skill}
//                   size="small"
//                   sx={{
//                     backgroundColor: `${primaryColor}10`,
//                     color: primaryColor,
//                     fontWeight: 500
//                   }}
//                 />
//               </motion.div>
//             ))}
//             {application?.job_details.skills_required.length > 5 && (
//               <Chip
//                 label={`+${application?.job_details.skills_required.length - 5} more`}
//                 size="small"
//                 sx={{
//                   backgroundColor: "#edf2f7",
//                   color: "#718096"
//                 }}
//               />
//             )}
//           </Box>
//         )}

//         <Box sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           mt: "auto",
//           pt: 2
//         }}>
//           <Button
//             variant="outlined"
//             onClick={(e) => {
//               e.stopPropagation();
//               navigate(`/applicant/applications/${application.id}`);
//             }}
//             sx={{
//               px: 3,
//               py: 1,
//               borderRadius: 2,
//               fontWeight: 600,
//               borderColor: primaryColor,
//               color: primaryColor,
//               "&:hover": {
//                 backgroundColor: `${primaryColor}10`,
//                 borderColor: primaryColor
//               },
//               textTransform: "none",
//               fontSize: 14
//             }}
//           >
//             View Details
//           </Button>

//           <Button
//             variant="contained"
//             onClick={(e) => {
//               e.stopPropagation();
//               navigate(`/applicant/jobs/${application.job_details.id}`);
//             }}
//             sx={{
//               px: 3,
//               py: 1,
//               borderRadius: 2,
//               fontWeight: 600,
//               backgroundColor: primaryColor,
//               "&:hover": {
//                 backgroundColor: "#b32828",
//                 boxShadow: `0 4px 14px ${primaryColor}33`,
//               },
//               textTransform: "none",
//               fontSize: 14
//             }}
//             endIcon={<ArrowForward />}
//           >
//             View Job
//           </Button>
//         </Box>
//       </Box>
//     </motion.div>
//   );
// };

// export default JobCard;
