import React, { useContext, useState, useEffect } from "react";
import { ProfileContext } from "../../../../context/ProfileContext";
import ProfileStepper from "../../../../components/profile/ProfileStepper";
import { Button, TextField, Box, Chip, Grid, CircularProgress, Alert } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { AxiosApi } from "../../../../services/Api";

const EditSkills = () => {
  const { profileData, updateProfile, goToNextStep } = useContext(ProfileContext);
  const location = useLocation();
  const navigate = useNavigate();
  const locationUserId = location.state?.userId;
  const userId = locationUserId || profileData?.id;

  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      navigate("/applicant/profile", { replace: true });
      return;
    }

    const fetchSkills = async () => {
      try {
        const res = await AxiosApi.get(`user/jobseekers/${userId}/`, {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        });

        const skillData = res.data?.skills;

        if (!skillData) {
          setSkills([]);
        } else if (Array.isArray(skillData)) {
          setSkills(skillData);
        } else {
          try {
            const parsed = JSON.parse(skillData);
            setSkills(Array.isArray(parsed) ? parsed : [parsed]);
          } catch (err) {
            console.error("Invalid JSON in skills:", err);
            setSkills([]);
          }
        }
      } catch (err) {
        console.error("Error fetching skills:", err);
        setError("Failed to load skills.");
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, [userId]);

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleDeleteSkill = (skillToDelete) => {
    setSkills(skills.filter((skill) => skill !== skillToDelete));
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("skills", JSON.stringify(skills));

      await AxiosApi.patch(`user/jobseekers/${userId}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      updateProfile("skills", skills);
      goToNextStep("/applicant/profile/edit-cv", { userId });
    } catch (err) {
      console.error("Error saving skills:", err);
      setError("Failed to save skills.");
    }
  };

  const handleBack = () => {
    updateProfile("skills", skills);
    goToNextStep("/applicant/profile/edit-experience", { userId });
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
        <span style={{ marginLeft: "10px" }}>Loading skills...</span>
      </Box>
    );
  }

  return (
    <div>
      <ProfileStepper activeStep={3} />
      <h2>Edit Skills</h2>
      <Box sx={{ padding: 2, display: "flex", flexDirection: "column", gap: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Enter a skill"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              fullWidth
              color={skills.includes(newSkill.trim()) ? "error" : "primary"}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="outlined"
              onClick={handleAddSkill}
              disabled={!newSkill || skills.includes(newSkill.trim()) || skills.length > 9}
            >
              + Add Skill
            </Button>
          </Grid>
        </Grid>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {skills.map((skill, index) => (
            <Chip
              key={index}
              label={skill}
              onDelete={() => handleDeleteSkill(skill)}
              color="primary"
              variant="outlined"
            />
          ))}
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button variant="outlined" onClick={handleBack}>
            Back: Experience
          </Button>
          <Button variant="contained" onClick={handleSave}>
            Next: CV
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

export default EditSkills;
