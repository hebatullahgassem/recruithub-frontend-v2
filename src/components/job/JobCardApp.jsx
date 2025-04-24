 import React from "react";
 import { Box, Typography, Button, Chip, useMediaQuery, useTheme } from "@mui/material"
 import { motion } from "framer-motion"
 import { Building, MapPin, Clock, ArrowRight } from "lucide-react"
 import { useNavigate } from "react-router-dom";
 import '../../ComponentsStyles/job/jobcardApp.css'
 const  JobCardApp  = ({ application, index, primaryColor }) => {
   const theme = useTheme();
   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
   const navigate = useNavigate();
 
   const getStatusChipProps = (status) => {
     switch(status) {
       case '1': // Applied
         return { label: "Applied", color: "default" };
       case '2': // Under Review
         return { label: "Under Review", color: "info" };
       case '3': // Shortlisted
         return { label: "Shortlisted", color: "primary" };
       case '4': // Interview
         return { label: "Interview", color: "warning" };
       case '5': // Offered
         return { label: "Offered", color: "success" };
       case '6': // Rejected
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
      delay: index * 0.05,
    }}
    whileHover={{
      y: -5,
    }}
    className="job-application-card-container"
  >
    <Box onClick={() => navigate(`/applicant/jobs/${application.job_details.id}`)} className="job-application-card">
      {/* Status badge */}
      <Chip
        label={getStatusChipProps(application.status).label}
        color={getStatusChipProps(application.status).color}
        size="small"
        className="job-application-card-status"
      />

      <Box className="job-application-card-header">
        <Box className="job-application-card-logo-container">
          <img
            src={
              application.job_details.company_logo ||
              "https://static.thenounproject.com/png/3198584-200.png" ||
              "/placeholder.svg"
            }
            alt={application.job_details.company_name}
            className="job-application-card-logo"
          />
        </Box>
        <Box className="job-application-card-title-container">
          <Typography className="job-application-card-title">{application.job_details.title}</Typography>
          <Box className="job-application-card-company-info">
            <Chip
              icon={<Building className="job-application-card-icon" />}
              label={application.job_details.company_name}
              size="small"
              className="job-application-card-company-chip"
            />
            <Chip
              icon={<MapPin className="job-application-card-icon" />}
              label={application.job_details.location}
              size="small"
              className="job-application-card-location-chip"
            />
          </Box>
          {application.job_details.type_of_job && (
            <Chip
              icon={<Clock className="job-application-card-icon" />}
              label={application.job_details.type_of_job}
              size="small"
              className="job-application-card-job-type-chip"
              style={{
                backgroundColor: `${primaryColor}10`,
                color: primaryColor,
              }}
            />
          )}
        </Box>
      </Box>

      <Box className="job-application-card-dates" style={{ marginTop: isMobile ? "8px" : "16px"  }}> 
        <Box className="job-application-card-date-item">
          <Typography className="job-application-card-date-label">Applied on </Typography>
          <Typography className="job-application-card-date-value">{formatDate(application.job_details.created_at)}</Typography>
        </Box>
      </Box>

      <Typography className="job-application-card-description">{application.job_details.description}</Typography>

      {application.job_details.skills_required?.length > 0 && (
        <Box className="job-application-card-skills">
          {application.job_details.skills_required.slice(0, 5).map((skill, index) => (
            <motion.div key={index} whileHover={{ scale: 1.05 }}>
              <Chip
                label={skill}
                size="small"
                className="job-application-card-skill-chip"
                style={{
                  backgroundColor: `${primaryColor}10`,
                  color: primaryColor,
                }}
              />
            </motion.div>
          ))}
          {application.job_details.skills_required.length > 5 && (
            <Chip
              label={`+${application.job_details.skills_required.length - 5} more`}
              size="small"
              className="job-application-card-more-skills-chip"
            />
          )}
        </Box>
      )}

      <Box className="job-application-card-actions">
        <Button
          variant="outlined"
          onClick={(e) => {
            e.stopPropagation()
            navigate(`/applicant/applications/${application.id}`)
          }}
          className="job-application-card-details-button"
          style={{
            borderColor: primaryColor,
            color: primaryColor,
          }}
        >
          View Details
        </Button>

        <Button
          variant="contained"
          onClick={(e) => {
            e.stopPropagation()
            navigate(`/applicant/jobs/${application.job_details.id}`)
          }}
          className="job-application-card-job-button"
          style={{
            backgroundColor: primaryColor,
          }}
          endIcon={<ArrowRight />}
        >
          View Job  Details
        </Button>
      </Box>
    </Box>
  </motion.div>

   );
 };
 
 
 
export default JobCardApp;
