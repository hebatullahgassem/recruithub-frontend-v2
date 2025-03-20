import React, { useContext } from "react";
import { ProfileContext } from "../../../../context/ProfileContext";
import { Button, Typography, Avatar, List, ListItem, ListItemText } from "@mui/material";
import ProfileStepper from "../../../../components/profile/ProfileStepper";

const ReviewProfile = () => {
  const { profileData, goToNextStep } = useContext(ProfileContext);

  return (
    <div>
      <ProfileStepper activeStep={5} /> {/* Last Step */}
      <h2>Review Your Profile</h2>
      
      <Avatar src={profileData.profileImage} sx={{ width: 100, height: 100 }} />
      <Typography variant="h5">{profileData.name}</Typography>
      <Typography variant="subtitle1">{profileData.email}</Typography>

      <h3>Education</h3>
      <List>
        {profileData.education.map((edu, index) => (
          <ListItem key={index}>
            <ListItemText primary={`${edu.degree} at ${edu.university}`} />
          </ListItem>
        ))}
      </List>

      <h3>Experience</h3>
      <List>
        {profileData.experience.map((exp, index) => (
          <ListItem key={index}>
            <ListItemText primary={`${exp.jobTitle} at ${exp.company}`} />
          </ListItem>
        ))}
      </List>

      <h3>Skills</h3>
      <List>
        {profileData.skills.map((skill, index) => (
          <ListItem key={index}>
            <ListItemText primary={skill} />
          </ListItem>
        ))}
      </List>

      <h3>CV</h3>
      {profileData.cv ? <p>CV Uploaded: {profileData.cv.name}</p> : <p>No CV uploaded</p>}

      <Button variant="contained" color="primary" onClick={() => alert("Profile submitted successfully!")}>
        Submit Profile
      </Button>
    </div>
  );
};

export default ReviewProfile;
