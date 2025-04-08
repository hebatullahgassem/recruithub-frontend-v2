import React, { useContext, useState, useEffect } from "react";
import { ProfileContext } from "../../../../context/ProfileContext";
import { userContext } from "../../../../context/UserContext";
import ProfileStepper from "../../../../components/profile/ProfileStepper";
import { Button, Box, Typography, Grid, CircularProgress, Alert } from "@mui/material";
import { AxiosApi } from "../../../../services/Api";
import { useLocation, useNavigate } from "react-router-dom";

const EditCV = () => {
  const { updateProfile, goToNextStep } = useContext(ProfileContext);
  const { user } = useContext(userContext);
  const location = useLocation();
  const navigate = useNavigate();

  const locationUserId = location.state?.userId;
  const userId = locationUserId || user?.id;

  const [cvUrl, setCvUrl] = useState(null);
  const [cvName, setCvName] = useState("");
  const [cvFile, setCvFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      navigate("/applicant/profile", { replace: true });
      return;
    }

    const fetchCV = async () => {
      try {
        const res = await AxiosApi.get(`user/jobseekers/${userId}/`, {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        });

        const cvPath = res.data.cv;
        console.log("CV Path:", cvPath);
        if (cvPath) {
          const fullUrl = `https://res.cloudinary.com/dkvyfbtdl/raw/upload/${cvPath}`;
          setCvUrl(fullUrl);
          console.log("CV URL:", fullUrl);
          setCvName(cvPath.split("/").pop());
          console.log("CV Name:", cvName);
        }
      } catch (err) {
        console.error("Error fetching CV:", err);
        setError("Failed to load CV.");
      } finally {
        setLoading(false);
      }
    };

    fetchCV();
  }, [userId]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setCvFile(file);
    setCvName(file.name);

    const formData = new FormData();
    formData.append("cv", file);

    try {
      const formData = new FormData();
      formData.append('cv', file); // 'file' is from input[type="file"]
      
      AxiosApi.patch(`/user/jobseekers/${userId}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Token ${localStorage.getItem("token")}`,
        }
      })
      .then(response => {
        console.log(response.data);
        // handle success
      })
      .catch(error => {
        console.error(error);
        // handle error
      }); } 
      catch (err) {
        console.error("Upload error:", err);
        setError("Failed to upload CV.");
      }
  };

  const handleDelete = async () => {
    try {
      await AxiosApi.patch(
        `user/jobseekers/${userId}/`,
        { cv: "" },
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      );

      setCvFile(null);
      setCvName("");
      setCvUrl(null);
      updateProfile("cv", null); // Remove from context
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete CV.");
    }
  };

  const handleSave = () => {
    goToNextStep("/applicant/profile/review", { userId });
  };

  const handleBack = () => {
    goToNextStep("/applicant/profile/edit-skills", { userId });
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
        <span style={{ marginLeft: "10px" }}>Loading CV...</span>
      </Box>
    );
  }

  return (
    <div>
      <ProfileStepper activeStep={4} />
      <Typography variant="h4" gutterBottom>
        {cvUrl ? "Update CV" : "Upload CV"}
      </Typography>

      <Box sx={{ padding: 2, display: "flex", flexDirection: "column", gap: 2 }}>
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
                hidden
                onChange={handleFileUpload}
              />
            </Button>
            {cvUrl && (
              <Button variant="outlined" color="error" sx={{ px: 2 }} onClick={handleDelete}>
                X
              </Button>
            )}
          </Grid>

          {cvUrl && (
            <Grid item xs={12}>
              <Typography variant="body1">
                Uploaded: <strong>{cvName}</strong>
              </Typography>
              <Typography variant="body1">
                CV Link:{" "}
                <a href={cvUrl+".pdf"} target="_blank" rel="noopener noreferrer">
                  View CV
                </a>
              </Typography>
            </Grid>
          )}
        </Grid>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button variant="outlined" onClick={handleBack}>
            Back: Skills
          </Button>
          <Button variant="contained" onClick={handleSave}>
            Next: Review
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default EditCV;
