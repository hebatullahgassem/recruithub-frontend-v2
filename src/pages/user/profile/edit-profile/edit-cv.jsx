import React, { useContext, useState, useEffect } from "react";
// import { ProfileContext } from "../../../../context/ProfileContext";
import { userContext } from "../../../../context/UserContext";
// import ProfileStepper from "../../../../components/profile/ProfileStepper";
import {
  Button,
  Box,
  Typography,
  Grid,
  CircularProgress,
  Alert,
} from "@mui/material";
import { AxiosApi } from "../../../../services/Api";
import { useLocation, useNavigate } from "react-router-dom";
import { ca } from "date-fns/locale";

const EditCV = () => {
  try{
  // const { goToNextStep } = useContext(ProfileContext);
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
          setCvUrl(cvPath?.endsWith(".pdf") ? cvPath : `${cvPath}.pdf`);
          console.log("CV URL:", fullUrl);
          setCvName(cvPath.split("/").pop());
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

  const handleFileUpload = async (file) => {
    // const file = event.target.files[0];
    if (!file) return;

    // Validate file type and size
    const allowedTypes = [
      "application/pdf",
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      setError("Only PDF, DOC, and DOCX files are allowed");
      return;
    }

    if (file.size > maxSize) {
      setError("File size must be less than 5MB");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("cv", file);
    // formData.append('name', user.name); // Include other fields if needed
    // formData.append('email', user.email);

    try {
      const response = await AxiosApi.patch(
        `/user/jobseekers/${userId}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
          // Add timeout if needed
          timeout: 30000, // 30 seconds
        }
      );

      // // Update local state with the new CV URL
      // setCvUrl(response.data.cv);
      // setCvName(file.name);

      // // Update context/global state if needed
      // updateProfile("cv", response.data.cv);

      // // Show success message
      // setAlert({
      //   severity: "success",
      //   message: "CV uploaded successfully!",
      // });

      // // Optional: Log the response for debugging
      // console.log("Upload successful:", response.data);
      navigate("/applicant/profile")

    } catch (err) {
      console.error("Upload error:", err);

      let errorMessage = "Failed to upload CV";
      if (err.response) {
        // Server responded with error status
        if (err.response.status === 413) {
          errorMessage = "File too large (max 5MB)";
        } else if (err.response.data) {
          errorMessage = err.response.data.detail || err.response.statusText;
        }
      } else if (err.request) {
        // Request was made but no response
        errorMessage = "Network error - please check your connection";
      }

      setError(errorMessage);
      setAlert({
        severity: "error",
        message: errorMessage,
      });
    } finally {
      setLoading(false);

      // Clear the file input to allow re-uploading the same file
      if (event.target) {
        event.target.value = "";
      }
    }
  };

  const handleSave = () => {
    if (!cvFile) {
      setError("Please upload a CV file before submitting.");
      return;
    }
    handleFileUpload(cvFile);
    goToNextStep("/applicant/profile", { userId });
  };

  const handleBack = () => {
    goToNextStep("/applicant/profile/edit-skills", { userId });
  };
  // const handleDelete = async () => {
  //   setCv

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
      {/* <ProfileStepper activeStep={4} /> */}
      <Typography variant="h4" gutterBottom>
        {cvUrl ? "Update CV" : "Upload CV"}
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
              {cvName ? `Change CV` : "Upload CV"}
              <input
                type="file"
                accept=".pdf"
                hidden
                onChange={()=>setCvFile(event.target.files[0])}
              />
            </Button>
            {cvUrl && (
              <Button
                variant="outlined"
                color="error"
                sx={{ px: 2 }}
                onClick={()=>setCvFile(null)}
                disabled={loading || !cvFile}
              >
                X
              </Button>
            )}
          </Grid>

          {cvUrl && (
            <Grid item xs={12}>
              <Typography variant="body1">
                Uploaded: <strong>{cvFile ? cvFile.name : cvName}</strong>
              </Typography>
              <Typography variant="body1">
                Old CV Link:{" "}
                <a
                  href={cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
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
          {/* <Button variant="outlined" onClick={handleBack}>
            Back: Skills
          </Button> */}
          <Button variant="contained" onClick={handleSave} disabled={loading || !cvFile}>
            Submit CV
          </Button>
        </Box>
      </Box>
    </div>
  );}catch (error) {
    console.error("Error in EditCV component:", error);
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        An unexpected error occurred. Please try again later.
      </Alert>
    );
  }
};

export default EditCV;
