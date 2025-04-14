import React, { useContext, useState, useEffect } from "react";
import { userContext } from "../../../../context/UserContext";
import { Button, TextField, Box, Grid, CircularProgress, Alert } from "@mui/material";
import ProfileStepper from "../../../../components/profile/ProfileStepper";
import { useLocation, useNavigate } from "react-router-dom";
import { AxiosApi } from "../../../../services/Api";

const EditExperience = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const locationUserId = location.state?.userId;
  const { user } = useContext(userContext);
  const userId = locationUserId || user?.id;

  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch experience on mount
  useEffect(() => {
    if (!userId) {
      navigate("/applicant/profile", { replace: true });
      return;
    }

    const fetchExperience = async () => {
      try {
        const res = await AxiosApi.get(`user/jobseekers/${userId}/`, {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        });

        const expData = res.data?.experience;

        if (!expData) {
          setExperiences([]);
        } else if (Array.isArray(expData)) {
          setExperiences(expData);
        } else {
          try {
            const parsed = JSON.parse(expData);
            setExperiences(Array.isArray(parsed) ? parsed : [parsed]);
          } catch (err) {
            console.error("Invalid JSON in experience:", err);
            setExperiences([]);
          }
        }
      } catch (err) {
        console.error("Error fetching experience:", err);
        setError("Failed to load experience data.");
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, [userId]);

  const handleAddExperience = () => {
    setExperiences([
      ...experiences,
      {
        title: "",
        company: "",
        location: "",
        description: "",
        employmentType: "",
        startDate: "",
        endDate: "",
      },
    ]);
  };

  const handleChange = (index, key, value) => {
    const updatedExperiences = [...experiences];
    updatedExperiences[index][key] = value;
    setExperiences(updatedExperiences);
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("experience", JSON.stringify(experiences));

      await AxiosApi.patch(`user/jobseekers/${userId}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/applicant/profile" );
    } catch (err) {
      console.error("Error saving experience:", err);
      setError("Failed to save experience.");
    }
  };


  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
        <span style={{ marginLeft: "10px" }}>Loading experience data...</span>
      </Box>
    );
  }

  return (
    <div>
      {/* <ProfileStepper activeStep={2} /> */}
      <h2>Edit Experience</h2>
      <Box sx={{ padding: 2, display: "flex", flexDirection: "column", gap: 2 }}>
        {experiences.map((exp, index) => (
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
              onClick={() =>
                setExperiences(experiences.filter((_, i) => i !== index))
              }
              sx={{ position: "absolute", top: 0, right: 0, padding: 0 }}
            >
              X
            </Button>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Job Title"
                  value={exp.title}
                  onChange={(e) => handleChange(index, "title", e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Company Name"
                  value={exp.company}
                  onChange={(e) => handleChange(index, "company", e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Location"
                  value={exp.location}
                  onChange={(e) => handleChange(index, "location", e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  SelectProps={{ native: true }}
                  value={exp.employmentType}
                  onChange={(e) =>
                    handleChange(index, "employmentType", e.target.value)
                  }
                  fullWidth
                >
                  <option value="">Select Employment Type</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="freelance">Freelance</option>
                  <option value="intern">Intern</option>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  value={exp.description}
                  onChange={(e) => handleChange(index, "description", e.target.value)}
                  fullWidth
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Start Date"
                  type="date"
                  value={exp.startDate}
                  onChange={(e) => handleChange(index, "startDate", e.target.value)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="End Date"
                  type="date"
                  value={exp.endDate}
                  onChange={(e) => handleChange(index, "endDate", e.target.value)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </Box>
        ))}

        <Button variant="outlined" onClick={handleAddExperience}>
          Add More
        </Button>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button variant="contained" onClick={handleSave}>
            submit skills 
          </Button>
        </Box>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Box>
    </div>
  );
};

export default EditExperience;

