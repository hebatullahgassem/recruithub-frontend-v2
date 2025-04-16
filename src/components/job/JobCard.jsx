// import { useNavigate } from "react-router";
// import ApplicantFooter from "./ApplicantFooter";
// import CompanyFooter from "./CompanyFooter";
// import { useContext, useState } from "react";
// import { userContext } from "../../context/UserContext";

// function JobCard({ job, type }) {
//   const { user } = useContext(userContext);
//   const navigate = useNavigate();
//   const [isHovered, setIsHovered] = useState(false);
//   const [isBookmarked, setIsBookmarked] = useState(false);

//   // Calculate time since posting for freshness indicator
//   const timeSincePosting = (job) => {
//     const postedDate = new Date(job.created_at);
//     const currentDate = new Date();
//     const diffTime = Math.abs(currentDate - postedDate);
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
//     console.log("postedDate",postedDate)
//     const day = `0${postedDate.getDate()}`.slice(-2);
//     const month = `0${postedDate.getMonth()+1}`.slice(-2);
//     const year = postedDate.getFullYear();
//     console.log(diffDays) 
//     console.log(`${day}/${month}/${year}`)
//     return `${day}/${month}/${year}`;
//   };

//   return (
//     <article
//       className="job-card"
//       key={job.id}
//       style={{
//         width: "100%",
//         maxWidth: "680px",
//         border: "1px solid #e0e6ed",
//         borderRadius: "16px",
//         padding: "24px",
//         marginBottom: "24px",
//         display: "flex",
//         flexDirection: "column",
//         backgroundColor: "#fff",
//         transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
//         boxShadow: isHovered 
//           ? "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.04)"
//           : "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
//         transform: isHovered ? "translateY(-4px)" : "translateY(0)",
//         position: "relative",
//         overflow: "hidden"
//       }}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//       aria-labelledby={`job-title-${job.id}`}
//     >
//       {/* Freshness indicator ribbon
//       {job.created_at && (
//         <div style={{
//           position: "absolute",
//           top: "16px",
//           right: "-30px",
//           backgroundColor: "#4f46e5",
//           color: "white",
//           padding: "4px 32px",
//           transform: "rotate(45deg)",
//           fontSize: "12px",
//           fontWeight: 600,
//           boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//           zIndex: 1
//         }}>
//           {/* {timeSincePosting(job.created_at)} */}
//         {/* </div>
//       )} */} 

//       <div style={{ display: "flex", justifyContent: "space-between" }}>
//         <div
//           style={{ 
//             cursor: "pointer",
//             flexGrow: 1,
//             paddingRight: "16px"
//           }}
//           onClick={() =>
//             user.user_type === "COMPANY"
//               ? navigate(`/company/jobs/${job.id}`)
//               : navigate(`/applicant/jobs/${job.id}`)
//           }
//         >
//           <div style={{ 
//             display: "flex", 
//             alignItems: "flex-start",
//             gap: "16px",
//             marginBottom: "16px"
//           }}>
//             <div style={{
//               width: "64px",
//               height: "64px",
//               borderRadius: "12px",
//               backgroundColor: "#f9fafb",
//               border: "1px solid #f0f0f0",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               overflow: "hidden",
//               flexShrink: 0
//             }}>
//               <img
//                 src={
//                   job.company_logo ||
//                   "https://static.thenounproject.com/png/3198584-200.png"
//                 }
//                 alt={job.company_name}
//                 style={{
//                   width: "100%",
//                   height: "100%",
//                   objectFit: "contain",
//                   padding: job.company_logo ? "0" : "8px"
//                 }}
//               />
//             </div>
            
//             <div style={{ flex: 1 }}>
//               <div style={{ 
//                 display: "flex", 
//                 flexWrap: "wrap",
//                 alignItems: "center",
//                 gap: "8px",
//                 marginBottom: "8px"
//               }}>
//                 <h2 
//                   id={`job-title-${job.id}`}
//                   style={{ 
//                     fontSize: "20px", 
//                     margin: 0,
//                     fontWeight: 700,
//                     color: "#111827",
//                     lineHeight: 1.3
//                   }}
//                 >
//                   {job.title}
//                 </h2>
                
//                 <div style={{ 
//                   display: "flex", 
//                   alignItems: "center",
//                   gap: "8px",
//                   flexWrap: "wrap"
//                 }}>
//                   {job.type_of_job && (
//                     <div
//                       style={{
//                         backgroundColor: "#eef2ff",
//                         padding: "6px 10px",
//                         borderRadius: "6px",
//                         color: "#4f46e5",
//                         fontSize: "13px",
//                         fontWeight: 600,
//                         whiteSpace: "nowrap"
//                       }}
//                     >
//                       {job.type_of_job}
//                     </div>
//                   )}
//                   {job.attend && (
//                     <div
//                       style={{
//                         backgroundColor: "#ecfdf5",
//                         padding: "6px 10px",
//                         borderRadius: "6px",
//                         color: "#059669",
//                         fontSize: "13px",
//                         fontWeight: 600,
//                         whiteSpace: "nowrap"
//                       }}
//                     >
//                       {job.attend}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
//                 <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
//                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                     <path d="M19 21V5C19 3.89543 18.1046 3 17 3H7C5.89543 3 5 3.89543 5 5V21M19 21L21 21M19 21H14M5 21L3 21M5 21H10M9 6.99998H10M9 11H10M14 6.99998H15M14 11H15M10 21V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V21M10 21H14" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
//                   </svg>
//                   <span style={{ 
//                     color: "#4b5563",
//                     fontSize: "14px",
//                     fontWeight: 500
//                   }}>
//                     {job.company_name}
//                   </span>
//                 </div>
                
//                 <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
//                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                     <path d="M12 12C13.1046 12 14 11.1046 14 10C14 8.89543 13.1046 8 12 8C10.8954 8 10 8.89543 10 10C10 11.1046 10.8954 12 12 12Z" stroke="#6b7280" strokeWidth="1.5"/>
//                     <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" stroke="#6b7280" strokeWidth="1.5"/>
//                   </svg>
//                   <span style={{ 
//                     color: "#4b5563",
//                     fontSize: "14px",
//                     fontWeight: 500
//                   }}>
//                     {job.location}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           <div style={{ 
//             position: "relative",
//             margin: "16px 0"
//           }}>
//             <h3 style={{
//               margin: "0 0 8px 0",
//               color: "#374151",
//               fontSize: "16px",
//               fontWeight: 600
//             }}>
//               Job Description
//             </h3>
//             <p
//               style={{
//                 margin: 0,
//                 color: "#4b5563",
//                 fontSize: "15px",
//                 lineHeight: "1.6",
//                 overflow: "hidden",
//                 textOverflow: "ellipsis",
//                 display: "-webkit-box",
//                 WebkitLineClamp: 5,
//                 lineClamp: 5,
//                 WebkitBoxOrient: "vertical",
//               }}
//             >
//               {job.description}
//             </p>
//             <div style={{
//               position: "absolute",
//               bottom: 0,
//               left: 0,
//               right: 0,
//               height: "32px",
//               background: "linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1))",
//               pointerEvents: "none"
//             }}></div>
//           </div>
//         </div>
        
//         {/* Bookmark button */}
//         {/* <button 
//           onClick={() => setIsBookmarked(!isBookmarked)}
//           aria-label={isBookmarked ? "Remove bookmark" : "Bookmark this job"}
//           style={{
//             width: "40px",
//             height: "40px",
//             borderRadius: "50%",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             backgroundColor: "transparent",
//             border: "none",
//             cursor: "pointer",
//             transition: "all 0.2s",
//             flexShrink: 0,
//             alignSelf: "flex-start",
//             ":hover": {
//               backgroundColor: "#f3f4f6"
//             }
//           }}
//         >
//           <svg 
//             width="20" 
//             height="20" 
//             viewBox="0 0 24 24" 
//             fill={isBookmarked ? "#4f46e5" : "none"} 
//             stroke={isBookmarked ? "#4f46e5" : "#9ca3af"} 
//             strokeWidth="2"
//           >
//             <path d="M5 5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V21L12 17L5 21V5Z" />
//           </svg>
//         </button> */}
//       </div>
      
//       <div style={{ 
//         display: "flex", 
//         alignItems: "center",
//         justifyContent: "space-between",
//         marginTop: "20px",
//         paddingTop: "20px",
//         borderTop: "1px solid #f3f4f6",
//         flexWrap: "wrap",
//         gap: "12px"
//       }}>
//         <div style={{ 
//           display: "flex",
//           gap: "8px",
//           flexWrap: "wrap"
//         }}>
//         </div>
        
//         <div style={{ 
//           display: "flex",
//           gap: "12px",
//           alignItems: "center"
//         }}>
//           {job.created_at && (
//             <span style={{
//               color: "#9ca3af",
//               fontSize: "13px",
//               whiteSpace: "nowrap"
//             }}>
//               {/* Posted {timeSincePosting(job.created_at)} ago */}
//             </span>
//           )}
          
//           {user.user_type !== "COMPANY" && (
//   <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
//     {job.created_at && (
//       <span style={{
//         color: "#9ca3af",
//         fontSize: "13px",
//         whiteSpace: "nowrap"
//       }}>
//         {/* Posted {timeSincePosting(job.created_at)} ago */}
//       </span>
//     )}
//     <button
//       onClick={() => navigate(`/applicant/jobs/${job.id}`)}
//       style={{
//         background: "none",
//         border: "1px solid #e5e7eb",
//         padding: "8px 16px",
//         cursor: "pointer",
//         display: "flex",
//         alignItems: "center",
//         gap: "8px",
//         color: "#4f46e5",
//         transition: "all 0.2s",
//         borderRadius: "8px",
//         fontWeight: 600,
//         fontSize: "14px",
//         ":hover": {
//           backgroundColor: "#f5f3ff",
//           borderColor: "#c7d2fe"
//         }
//       }}
//       aria-label="Apply for this job"
//     >
//       <span>Apply Now</span>
//       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//         <path d="M5 12H19M19 12L12 5M19 12L12 19" 
//               stroke="currentColor" 
//               strokeWidth="2" 
//               strokeLinecap="round" 
//               strokeLinejoin="round"/>
//       </svg>
//     </button>
//   </div>
//   )}
//         </div>
//       </div>
//     </article>
//   );
// }

// export default JobCard;

import React from "react";
import {
  Box,
  Typography,
  Button,
  Chip,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { motion } from "framer-motion";
import {
  Business,
  LocationOn,
  Schedule,
  ArrowForward
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const JobCard = ({ application, index, primaryColor }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const getStatusChipProps = (status) => {
    switch(status) {
      case 1: // Applied
        return { label: "Applied", color: "default" };
      case 2: // Under Review
        return { label: "Under Review", color: "info" };
      case 3: // Shortlisted
        return { label: "Shortlisted", color: "primary" };
      case 4: // Interview
        return { label: "Interview", color: "warning" };
      case 5: // Offered
        return { label: "Offered", color: "success" };
      case 6: // Rejected
        return { label: "Rejected", color: "error" };
      default:
        return { label: "Unknown", color: "default" };
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <motion.div
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
        onClick={() => navigate(`/applicant/jobs/${application.job_details.id}`)}
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
        {/* Status badge */}
        <Chip
          label={getStatusChipProps(application.status).label}
          color={getStatusChipProps(application.status).color}
          size="small"
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            zIndex: 2,
            fontWeight: 600,
            textTransform: "uppercase",
            fontSize: "0.7rem",
            letterSpacing: "0.5px"
          }}
        />
        
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
                application.job_details.company_logo ||
                "https://static.thenounproject.com/png/3198584-200.png"
              }
              alt={application.job_details.company_name}
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
              {application.job_details.title}
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
                label={application.job_details.company_name}
                size="small"
                sx={{
                  backgroundColor: "#f8fafc",
                  color: "#4a5568",
                  fontWeight: 500
                }}
              />
              <Chip
                icon={<LocationOn sx={{ fontSize: 16 }} />}
                label={application.job_details.location}
                size="small"
                sx={{
                  backgroundColor: "#f8fafc",
                  color: "#4a5568",
                  fontWeight: 500
                }}
              />
            </Box>
            {application.job_details.type_of_job && (
              <Chip
                icon={<Schedule sx={{ fontSize: 16 }} />}
                label={application.job_details.type_of_job}
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

        <Box sx={{ 
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          p: 1.5,
          backgroundColor: "#f8fafc",
          borderRadius: 2
        }}>
          <Box>
            <Typography variant="caption" sx={{ 
              color: "#718096",
              fontWeight: 500,
              display: "block"
            }}>
              Applied On
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {formatDate(application.created_at)}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ 
              color: "#718096",
              fontWeight: 500,
              display: "block"
            }}>
              Last Updated
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {formatDate(application.updated_at)}
            </Typography>
          </Box>
        </Box>

        <Typography
          variant="body2"
          sx={{
            mt: 1,
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
          {application.job_details.description}
        </Typography>

        {application.job_details.skills_required?.length > 0 && (
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
            {application.job_details.skills_required.slice(0, 5).map((skill, index) => (
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
            {application.job_details.skills_required.length > 5 && (
              <Chip
                label={`+${application.job_details.skills_required.length - 5} more`}
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
          <Button
            variant="outlined"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/applicant/applications/${application.id}`);
            }}
            sx={{
              px: 3,
              py: 1,
              borderRadius: 2,
              fontWeight: 600,
              borderColor: primaryColor,
              color: primaryColor,
              "&:hover": {
                backgroundColor: `${primaryColor}10`,
                borderColor: primaryColor
              },
              textTransform: "none",
              fontSize: 14
            }}
          >
            View Details
          </Button>
          
          <Button
            variant="contained"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/applicant/jobs/${application.job_details.id}`);
            }}
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
            View Job
          </Button>
        </Box>
      </Box>
    </motion.div>
  );
};

export default JobCard;