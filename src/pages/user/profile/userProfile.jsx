import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Avatar,
  Grid,
  Box,
  Divider,
} from "@mui/material";
import { userContext } from "../../../context/UserContext";

const UserProfile = () => {
  const navigate = useNavigate();
  const { user, refetchUser } = useContext(userContext);

  useEffect(() => {
    refetchUser();
  }, []);

  // Navigation functions
  const goToEditEducation = () => navigate("/applicant/profile/edit-education");
  const goToEditExperience = () =>
    navigate("/applicant/profile/edit-experience");
  const goToEditSkills = () => navigate("/applicant/profile/edit-skills");
  const goToEditCV = () => {
    if (user?.id) {
      navigate("/applicant/profile/edit-cv", {
        state: { userId: user.id },
      });
    } else {
      console.error("No user ID available");
    }
  };
  const goToEditPersonal = () => {
    if (user?.id) {
      navigate("/applicant/profile/edit-personal", {
        state: { userId: user.id }, 
      });
    } else {
      console.error("No user ID available");
    }
  };

  const ShowRecommendedJobs = () => {
    
    if (user?.id) {
      console.log("User ID:", user.id)
      navigate(`/applicant/profile/recom`, { 
        state: { userId: user.id } 
      });
    } else {
      console.error("No user ID available");
    }
  };

  if (user)
    return (
      <Grid
        container
        sx={{
          // backgroundColor: "rgba(86, 0, 0, 0.8)",
          minHeight: "100vh",
          padding: "20px",
          justifyContent: "center",
        }}
      >
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* Top Section */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
                paddingBottom: "20px",
                borderBottom: "1px solid #ddd",
              }}
            >
              <Avatar
                src={user.img || "/default-avatar.png"}
                sx={{ width: 100, height: 100 }}
              />
              <Box>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  {user.name || "Your Name"}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {user.about ||
                    "Add a headline or summary about yourself"}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {user.location || "Not provided"}
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={goToEditPersonal}
                  sx={{ mt: 1 }}
                >
                  Edit Profile
                </Button>
              </Box>
            </Box>

            {/* Main Section */}
            <Grid container spacing={3} sx={{ mt: 2 }}>
              {/* Left Side */}
              <Grid item xs={12} md={6}>
                <Card sx={{ mb: 2, padding: "15px" }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Education
                  </Typography>
                    {user.education ? (user.education || []).map?.((edu, index) => (
                    <Typography key={index} sx={{ marginTop: "10px", fontSize: "14px" }}>
                      <strong>{edu.degree}</strong> at {edu.school} majoring{" "}
                      {edu.fieldOfStudy} from {edu.startDate} till {edu.endDate}
                    </Typography>
                  )) : (
                    <Typography sx={{ marginTop: "10px", fontSize: "14px" }}>
                      No education added
                    </Typography>
                  )}

                  <Button
                    variant="text"
                    color="primary"
                    onClick={goToEditEducation}
                    sx={{ mt: 1 }}
                  >
                    Edit Education
                  </Button>
                </Card>

                <Card sx={{ mb: 2, padding: "15px" }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Experience
                  </Typography>
                  {user.experience &&
                  user.experience.length > 0 ? (
                    user.experience.map((exp, index) => (
                      <Typography
                        key={index}
                        sx={{ marginTop: "10px", fontSize: "14px" }}
                      >
                        <strong>{exp.title}</strong> at {exp.company} from {exp.startDate} till {exp.endDate}
                      </Typography>
                    ))
                  ) : (
                    <Typography sx={{ marginTop: "10px", fontSize: "14px" }}>
                      No experience added
                    </Typography>
                  )}
                  <Button
                    variant="text"
                    color="primary"
                    onClick={goToEditExperience}
                    sx={{ mt: 1 }}
                  >
                    Edit Experience
                  </Button>
                </Card>
              </Grid>

              {/* Right Side */}
              <Grid item xs={12} md={6}>
                <Card sx={{ mb: 2, padding: "15px" }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Skills
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {user.skills && user.skills.length > 0 ? (
                      user.skills.map((skill, index) => (
                        <Typography
                          key={index}
                          sx={{ marginTop: "10px", fontSize: "14px" }}
                        >
                          {skill}
                        </Typography>
                      ))
                    ) : (
                      <Typography sx={{ marginTop: "10px", fontSize: "14px" }}>
                        No skills added
                      </Typography>
                    )}
                  </Box>
                  <Button
                    variant="text"
                    color="primary"
                    onClick={goToEditSkills}
                    sx={{ mt: 1 }}
                  >
                    Edit Skills
                  </Button>
                </Card>

                <Card sx={{ padding: "15px" }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    CV
                  </Typography>
                  {user.cv ? (
                    <a
                      href={user?.cv?.endsWith(".pdf") ? user.cv : `${user.cv}.pdf`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "block",
                        marginTop: "10px",
                        fontSize: "14px",
                        color: "#0073b1",
                        textDecoration: "none",
                      }}
                    >
                      View CV
                    </a>
                  ) : (
                    <Typography sx={{ marginTop: "10px", fontSize: "14px" }}>
                      No CV uploaded
                    </Typography>
                  )}
                  <Button
                    variant="text"
                    color="primary"
                    onClick={goToEditCV}
                    sx={{ mt: 1 }}
                  >
                    Edit CV
                  </Button>
                </Card>
              </Grid>
            </Grid>
              {/* <Card sx={{ mt: 2, padding: "15px" }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                    Job Recommendations
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Based on your profile, we've found some jobs that might interest you.
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => ShowRecommendedJobs()}
                    sx={{ mt: 2, mb: 2, width: "100%" }}
                  >
                    View Recommended Jobs
                  </Button>
                </Card> */}
          </Card>
        </Grid>
      </Grid>
    );

  return null;
};

export default UserProfile;

