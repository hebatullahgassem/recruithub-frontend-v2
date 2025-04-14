import React, { useContext, useState, useEffect } from "react";
import { ProfileContext } from "../../../../context/ProfileContext";
import {
  Button,
  TextField,
  Box,
  Grid,
  CircularProgress,
  Alert,
  Switch,
} from "@mui/material";
import ProfileStepper from "../../../../components/profile/ProfileStepper";
import { useParams } from "react-router-dom";
import { AxiosApi } from "../../../../services/Api";
import { useLocation } from "react-router-dom";
import { userContext } from "../../../../context/UserContext";

const EditEducation = () => {
  const location = useLocation();
  const userId = location.state?.userId;
  const { profileData, updateProfile, goToNextStep } =
    useContext(ProfileContext);
  const { user } = useContext(userContext);
  const [education, setEducation] = useState([]); // Initialize as empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("User ID:", userId);
  console.log("Education Data:", education);
  // Fetch existing education data when component mounts
  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const response = await AxiosApi.get(`user/jobseekers/${userId}/`, {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        });

        // Handle both array and single object responses
        const eduData = response.data?.education;

        if (!eduData) {
          setEducation([]);
        } else if (Array.isArray(eduData) && typeof eduData[0] === "string") {
          // Parse the JSON string from backend
          const parsed = JSON.parse(eduData[0]);
          setEducation(parsed);
        } else if (Array.isArray(eduData)) {
          setEducation(eduData);
        } else if (typeof eduData === "string") {
          setEducation(JSON.parse(eduData));
        } else {
          setEducation([]);
        }
      } catch (err) {
        console.error("Error fetching education data:", err);
        setError(`Failed to load education data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchEducation();
  }, [userId]);

  const handleAdd = () => {
    setEducation([
      ...education,
      { degree: "", school: "", fieldOfStudy: "", startDate: "", endDate: "" },
    ]);
  };

  const handleChange = (index, field, value) => {
    const newEducation = [...education];
    newEducation[index][field] = value;
    setEducation(newEducation);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("education", JSON.stringify(education));

      await AxiosApi.patch(`user/jobseekers/${userId}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // updateProfile("education", education);
      goToNextStep(`/applicant/profile`, { userId });
    } catch (err) {
      console.error("Error updating education:", err);
      setError("Failed to save education data");
      setLoading(false);
    }
  };

  const handleBack = () => {
    updateProfile("education", education);
    goToNextStep(`/applicant/profile/edit-personal`);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
        <span style={{ marginLeft: "10px" }}>Loading education data...</span>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <div>
      <form onSubmit={(e) => handleSave(e)}>
        {/* <ProfileStepper activeStep={1} /> Step 2 */}
        <h2 className="m-3">Edit Education</h2>
        <Box
          sx={{
            padding: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            minHeight: "40vh",
          }}
        >
          {education.map((edu, index) => (
            <Box
              key={index}
              sx={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: 3,
                marginBottom: 2,
                position: "relative",
              }}
            >
              <Button
                variant="outlined"
                color="error"
                onClick={() => {
                  const newEducation = education.filter((_, i) => i !== index);
                  setEducation(newEducation);
                }}
                sx={{ position: "absolute", top: 0, right: 0, padding: 0 }}
              >
                X
              </Button>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Degree"
                    value={edu.degree || ""}
                    onChange={(e) =>
                      handleChange(index, "degree", e.target.value)
                    }
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="School"
                    value={edu.school || ""}
                    onChange={(e) =>
                      handleChange(index, "school", e.target.value)
                    }
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Field of Study"
                    value={edu.fieldOfStudy || ""}
                    onChange={(e) =>
                      handleChange(index, "fieldOfStudy", e.target.value)
                    }
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Start Date"
                    type="date"
                    value={edu.startDate || ""}
                    onChange={(e) =>
                      handleChange(index, "startDate", e.target.value)
                    }
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="End Date"
                    type="date"
                    value={edu.endDate || ""}
                    onChange={(e) =>
                      handleChange(index, "endDate", e.target.value)
                    }
                    disabled={edu.endDate === 'Now'}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    required={edu.startDate && edu.endDate != 'Now'}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <label style={{ marginRight: "8px" }}>
                      Currently Studing
                    </label>
                    <Switch
                      checked={edu.endDate === "Now"}
                      onChange={(e) =>
                        handleChange(
                          index,
                          "endDate",
                          e.target.checked ? "Now" : ""
                        )
                      }
                      color="primary"
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          ))}
          <Button variant="outlined" onClick={handleAdd}>
            Add More
          </Button>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            {/* <Button variant="outlined" onClick={handleBack}>
            Back: Personal Info
          </Button> */}
            <Button variant="contained" type="submit" disabled={loading}>
              Submit Education
            </Button>
          </Box>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Box>
      </form>
    </div>
  );
};

export default EditEducation;
