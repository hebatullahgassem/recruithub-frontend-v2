import React, { useContext, useState, useEffect } from "react";
import { ProfileContext } from "../../../../context/ProfileContext";
import ProfileStepper from "../../../../components/profile/ProfileStepper";
import { Button, Box, Typography, Grid } from "@mui/material";
import { userContext } from "../../../../context/UserContext";
import { AxiosApi } from "../../../../services/Api";
import { useLocation } from "react-router-dom";
const EditCV = () => {
  const { user } = useContext(userContext);
  const location = useLocation();
  const { userId } = location.state || {};
  const [cv, setCv] = useState(null);
  const [cvName, setCvName] = useState('');
  const [cvFile, setCvFile] = useState(null);

  
  console.log("User ID:", userId);
  console.log("CV:", cv);
  useEffect(() => {
    if (userId) {
      AxiosApi.get(`user/jobseekers/${userId}/`)
        .then((response) => {
          const cvId = response.data.cv;
          if (cvId) {
            const fullUrl = `https://res.cloudinary.com/dkvyfbtdl/raw/upload/${cvId}.pdf`;
            setCv(fullUrl);
            setCvName(cvId.split('/').pop());
          }
        })
        .catch((error) => console.log(error));
    }
  }, [userId]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCv(file);
      setCvName(file.name);

      const formData = new FormData();
      formData.append('cv', file);
      AxiosApi.patch(`user/jobseekers/${userId}/`, formData, {
        headers: {
          'Authorization': `Token ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        }
      })
        .then(response => {
          updateProfile(userId, "cv", response.data.cv);
          goToNextStep(`/applicant/profile/review/${userId}`);
        })
        .catch(error => console.log(error));
    }
  };

  const handleSave = () => {
    // if (!cv) return;
    goToNextStep(`/applicant/profile/review/${userId}`);
  };
  const handleBack = () => {
    updateProfile("cv", cv);
    goToNextStep("/applicant/profile/edit-skills");
  }

  return (
    <div>
      <ProfileStepper activeStep={4} />
      <Typography variant="h4" gutterBottom>
        {cv ? "Update CV" : "Upload CV"}
      </Typography>
      <Box
        sx={{ padding: 2, display: "flex", flexDirection: "column", gap: 2 }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ padding: 2, textTransform: "none" }}
            >
              {cvName ? `Change ${cvName}` : "Upload CV"}
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                hidden
              />
            </Button>
            <Button
              variant="outlined"
              color="error"
              sx={{ padding: 0 }}
              onClick={() => setCv(null)}
            >
              X
            </Button>
          </Grid>
          {cv && (
            <Grid item xs={12}>
              <Typography variant="body1">
                Uploaded: <strong>{cvName}</strong>
              </Typography>
            </Grid>
          )}
          {user?.cv && (
            <Grid item xs={12}>
              <Typography variant="body1">
                CV Link:{" "}
                <a href={cv} target="_blank" rel="noopener noreferrer">
                  View CV
                </a>
              </Typography>
            </Grid>
          )}
        </Grid>
        <Button
          variant="outlined"
          onClick={handleBack}
        >
          Back: Skills
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
        >
          Next: Review
        </Button>
      </Box>
    </div>
  );
};

export default EditCV;

