import { useNavigate } from "react-router";
import { useContext } from "react";
import { userContext } from "../../context/UserContext";
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Button,
  useTheme,
  useMediaQuery
} from "@mui/material";
import {
  BookmarkBorder,
  LocationOn,
  Business,
  Schedule,
  ArrowForward
} from "@mui/icons-material";
import { motion } from "framer-motion";
function JobCard({ job, type }) {
  // const keywords = job?.keywords?.join(" · ") || "";
  const {user} = useContext(userContext)
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
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
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
            onClick={(e) => {
              e.stopPropagation();
              handleJobClick(job.id);
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
            View Details
          </Button>
        </Box>
      </Box>
    </motion.div>
  );
}

export default JobCard;