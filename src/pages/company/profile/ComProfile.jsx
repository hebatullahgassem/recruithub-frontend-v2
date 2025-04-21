import React, { use, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Button, 
  Card, 
  Typography, 
  Avatar, 
  Grid, 
  Box, 
  useTheme,
  Fade,
  Grow,
  Slide 
} from "@mui/material";
import { ComProfileContext } from "../../../context/ComProfileContext";
import Lottie from "lottie-react";
import { userContext } from "../../../context/UserContext";

const ComProfile = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  // const { profileData } = useContext(ComProfileContext);
  const {user: profileData, refetchUser} = useContext(userContext);

  // Animation configuration
  const lottieConfig = {
    loop: true,
    autoplay: true,
    rendererSettings: { preserveAspectRatio: "xMidYMid slice" }
  };

  // Color scheme
  const primaryColor = "#901b26";
  const secondaryColor = "#6a1320";
  const accentColor = "#f8e9ec";

  // Unified card styling
  const cardStyle = {
    p: 3,
    borderRadius: 4,
    boxShadow: 3,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    background: `linear-gradient(145deg, ${accentColor} 0%, ${theme.palette.background.paper} 100%)`,
    "&:hover": {
      transform: "translateY(-8px)",
      boxShadow: `0 12px 24px -8px ${primaryColor}33`
    }
  };

  // Navigation handler
  const handleNavigation = (path) => () => {
    navigate(`/company/profile/${path}`, { state: { id: profileData?.id } });
  };

  useEffect(() => {
    refetchUser()
  }
  , [])


  return (
    <Fade in timeout={800}>
      <Box sx={{
        minHeight: "100vh",
        p: 4,
        background: `radial-gradient(circle at top left, ${accentColor} 0%, ${theme.palette.background.default} 100%)`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <Grid container spacing={4} sx={{ maxWidth: 1440 }}>
          {/* Profile Header Section */}
          <Grid item xs={12}>
            <Slide in direction="down" timeout={500}>
              <Card sx={{
                ...cardStyle,
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background: `linear-gradient(45deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
                  opacity: 0.1,
                  zIndex: 0
                }
              }}>
                <Box display="flex" alignItems="center" gap={4} p={3} position="relative">
                  <Box sx={{
                    position: "relative",
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: `3px solid ${primaryColor}`,
                    boxShadow: `0 8px 24px -4px ${primaryColor}40`
                  }}>
                    {profileData?.img ? (
                      <Avatar 
                        src={profileData.img} 
                        sx={{ width: 140, height: 140 }}
                      />
                    ) : (
                      <Lottie 
                        {...lottieConfig}
                        style={{ width: 140, height: 140 }}
                      />
                    )}
                  </Box>
                  
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h2" sx={{
                      fontWeight: 800,
                      color: primaryColor,
                      mb: 1,
                      letterSpacing: "-0.5px"
                    }}>
                      {profileData?.name || "Company Name"}
                    </Typography>
                    
                    <Typography variant="h6" sx={{
                      color: secondaryColor,
                      fontWeight: 500,
                      fontSize: "1.4rem",
                      lineHeight: 1.4
                    }}>
                      {profileData?.est || "Innovating tomorrow's solutions today"}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Slide>
          </Grid>

          {/* Company Details Section */}
          <Grid item xs={12} md={6}>
            <Grow in timeout={800}>
              <Card sx={cardStyle}>
                <Typography variant="h5" sx={{
                  fontWeight: 700,
                  mb: 3,
                  color: primaryColor,
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5
                }}>
                  <span>🏢</span> Company Profile
                </Typography>

                <DetailItem 
                  title="Industry Sector"
                  value={profileData?.industry}
                  icon="🏭"
                  fallback="Not specified"
                />

                <DetailItem 
                  title="Global Headquarters"
                  value={profileData?.location}
                  icon="🌍"
                  fallback="Location not provided"
                />

                <Button 
                  onClick={handleNavigation("edit-personal")}
                  sx={buttonStyle(primaryColor)}
                  fullWidth
                >
                  ✏️ Update Profile
                </Button>
              </Card>
            </Grow>
          </Grid>

          {/* Brand Identity Section */}
          {/* <Grid item xs={12} md={6}>
            <Grow in timeout={800} style={{ transitionDelay: '150ms' }}>
              <Card sx={{ ...cardStyle, height: "100%" }}>
                <Typography variant="h5" sx={{
                  fontWeight: 700,
                  mb: 3,
                  color: primaryColor,
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5
                }}>
                  <span>🎨</span> Brand Identity
                </Typography>

                <Box sx={{ 
                  height: 240, 
                  mb: 3,
                  borderRadius: 3,
                  overflow: "hidden",
                  position: "relative",
                  border: `2px solid ${primaryColor}20`
                }}>
                  {profileData?.logo ? (
                    <img 
                      src={profileData.logo} 
                      alt="Brand Logo" 
                      style={{ 
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        padding: 16
                      }} 
                    />
                  ) : (
                    <Lottie
                      {...lottieConfig}
                      style={{ width: "100%", height: "100%" }}
                    />
                  )}
                </Box>

                <Button 
                  onClick={handleNavigation("edit-logo")}
                  sx={buttonStyle(primaryColor)}
                  fullWidth
                >
                  🖌️ Update Brand Assets
                </Button>
              </Card>
            </Grow>
          </Grid> */}
        </Grid>
      </Box>
    </Fade>
  );
};

// Reusable styled button
const buttonStyle = (color) => ({
  backgroundColor: color,
  color: "#fff",
  fontWeight: 600,
  py: 1.5,
  borderRadius: 2,
  transition: "all 0.3s",
  "&:hover": {
    backgroundColor: `${color}dd`,
    transform: "translateY(-2px)",
    boxShadow: `0 6px 12px -4px ${color}40`
  }
});

// Enhanced DetailItem component
const DetailItem = ({ title, value, icon, fallback }) => (
  <Box sx={{ 
    mb: 3,
    p: 2,
    borderRadius: 2,
    background: "#ffffff08",
    backdropFilter: "blur(4px)",
    border: "1px solid #ffffff12"
  }}>
    <Box display="flex" alignItems="center" gap={2}>
      <Typography variant="h6" sx={{ 
        color: "#901b26aa",
        fontSize: "1.8rem",
        lineHeight: 1 
      }}>
        {icon}
      </Typography>
      <Box>
        <Typography variant="subtitle1" sx={{ 
          fontWeight: 600,
          color: "#901b26",
          mb: 0.5
        }}>
          {title}
        </Typography>
        <Typography variant="body1" sx={{ 
          color: "text.primary",
          fontWeight: 500,
          fontSize: "1.1rem"
        }}>
          {value || fallback}
        </Typography>
      </Box>
    </Box>
  </Box>
);

export default ComProfile;