import React, { useState } from "react";
import { useNavigate } from "react-router-dom";  
import { Button, Card, CardContent, Typography, Avatar, Grid } from "@mui/material";

const UserProfile = () => {
  const navigate = useNavigate();  

  // Navigation functions
  const goToEditEducation = () => navigate("/user/profile/edit-education");
  const goToEditExperience = () => navigate("/user/profile/edit-experience");
  const goToEditSkills = () => navigate("/user/profile/edit-skills");
  const goToEditCV = () => navigate("/user/profile/edit-cv");

  const [userData] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    profileImage: "https://via.placeholder.com/150",
    education: "B.Sc. in Computer Science",
    experience: "3 years as a Software Engineer",
    skills: "React, Node.js, MongoDB, Python",
    cv: null,
  });

  return (
    <Grid container sx={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Card sx={{ width: "80%", maxWidth: "900px", height: "90vh", overflowY: "auto", padding: "20px" }}>
        {/* Top Section */}
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item sx={{ display: "flex", alignItems: "center" }}>
            <Avatar src={userData.profileImage} sx={{ width: 100, height: 100, mr: 2 }} />
            <Typography variant="h5">{userData.name}</Typography>
          </Grid>
          <Button variant="contained" color="primary" onClick={() => navigate("/user/profile/edit-personal")}>
            Edit Profile
          </Button>
        </Grid>

        {/* Main Section */}
        <Grid container spacing={2} sx={{ mt: 3 }}>
          {/* Left Side (Details) */}
          <Grid item xs={12} md={6}>
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">Education</Typography>
                <Typography>{userData.education}</Typography>
                <Button variant="outlined" color="primary" onClick={goToEditEducation} sx={{ mt: 1 }}>
                  Edit Education
                </Button>
              </CardContent>
            </Card>

            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">Experience</Typography>
                <Typography>{userData.experience}</Typography>
                <Button variant="outlined" color="primary" onClick={goToEditExperience} sx={{ mt: 1 }}>
                  Edit Experience
                </Button>
              </CardContent>
            </Card>

            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">Skills</Typography>
                <Typography>{userData.skills}</Typography>
                <Button variant="outlined" color="primary" onClick={goToEditSkills} sx={{ mt: 1 }}>
                  Edit Skills
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Side (CV Upload & Display) */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">CV</Typography>
                {userData.cv ? (
                  <a href={URL.createObjectURL(userData.cv)} target="_blank" rel="noopener noreferrer">
                    View CV
                  </a>
                ) : (
                  <Typography>No CV uploaded</Typography>
                )}
                <Button variant="outlined" color="primary" onClick={goToEditCV} sx={{ mt: 1 }}>
                  Edit CV
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Card>
    </Grid>
  );
};

export default UserProfile;
