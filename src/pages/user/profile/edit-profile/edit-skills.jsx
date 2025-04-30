import React, { useContext, useState, useEffect } from "react";
import { userContext } from "../../../../context/UserContext";
import { 
  Button, 
  TextField, 
  Box, 
  Chip, 
  Grid, 
  CircularProgress, 
  Alert,
  Typography,
  Container,
  useTheme,
  useMediaQuery,
  styled,
  IconButton,
  Paper 
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { AxiosApi } from "../../../../services/Api";
import { updateUserProfile } from "../../../../services/Auth";
import { Add, Check, Build, Delete } from "@mui/icons-material";
import Loading from "../../../helpers/Loading";
import { showErrorToast, showSuccessToast } from "../../../../confirmAlert/toastConfirm";

// Consistent Color Palette
const primaryColor = '#d7323e'; // IIT Maroon
const secondaryColor = '#901b26'; // Complementary Gold
const accentColor = '#d7323e'; // Darker Maroon
const backgroundColor = '#e8e8e8'; // Off-white
const textPrimary = '#2d2829'; // Dark Charcoal
const textSecondary = '#5a5252'; // Warm Gray

const SkillCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(3),
  borderRadius: '12px',
  backgroundColor: '#fff',
  border: `1px solid ${primaryColor}20`,
  boxShadow: '0 8px 24px rgba(112,43,46,0.08)',
  transition: 'all 0.3s ease',
  position: 'relative',
}));

const AddButton = styled(Button)(({ theme }) => ({
  padding: `${theme.spacing(1.5)} ${theme.spacing(3)}`,
  borderRadius: '8px',
  fontWeight: 600,
  textTransform: 'none',
  borderWidth: 2,
  '&:hover': {
    borderWidth: 2
  }
}));

const SaveButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: '8px',
  fontWeight: 700,
  textTransform: 'none',
  fontSize: '1.1rem',
  minWidth: 200,
  letterSpacing: 0.5,
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
}));

const EditSkills = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user, isLight } = useContext(userContext);
  const location = useLocation();
  const navigate = useNavigate();
  const locationUserId = location.state?.userId;
  const userId = locationUserId || user?.id;

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
            // const parsed = JSON.parse(skillData);
            setSkills(Array.isArray(skillData) ? skillData : [skillData]);
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

      await updateUserProfile(userId, formData);
      showSuccessToast("Skills updated successfully.", 2000, isLight);
      navigate("/applicant/profile");
    } catch (err) {
      console.error("Error saving skills:", err);
      showErrorToast("Failed to save skills.", 2000, isLight);
      setError("Failed to save skills.");
    }
  };

  const handleBack = () => {
    navigate("/applicant/profile/edit-experience", { userId });
  };

 
  if (loading) {
    return (
      <Loading />
    );
  }

  return (
    <Box sx={{ backgroundColor: isLight ? "#f8f2ec" : "#242424", minWidth: "100vw" }}>
    <Container maxWidth="md" sx={{ py: 4, minHeight: "80vh", backgroundColor: isLight ? "#e8e8e8" : "#121212" }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            color: isLight ? "#d7323e" : "#901b26",
            fontSize: isMobile ? "1.8rem" : "2.125rem",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Build fontSize="large" sx={{ color: isLight ? "#d7323e" : "#901b26" }} />
          Edit Skills
        </Typography>
      </Box>

      <SkillCard style={{ backgroundColor: isLight ? "#f8f2ec" : "#242424" }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <TextField
              label="Enter a skill"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              fullWidth
              variant="outlined"
              color="rgb(111, 108, 108)"
              InputProps={{
                sx: { borderRadius: "8px" },
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  background: isLight ? "#fff" : "#121212",
                  color: isLight ? "black" : "white",
                  "& fieldset": {
                    borderColor: "#901b20",
                  },
                  "&:hover fieldset": {
                    borderColor: "#901b20",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: isLight ? "black" : "white",
                },
                "& .MuiInputBase-input": {
                  backgroundColor: isLight
                    ? "rgba(255, 255, 255, 0.95)"
                    : "#121212",
                  color: isLight ? "black" : "white",
                  paddingLeft: 1,
                  borderRadius: "10px",
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <AddButton
              fullWidth
              variant="outlined"
              onClick={handleAddSkill}
              disabled={
                !newSkill ||
                skills.includes(newSkill.trim()) ||
                skills.length > 9
              }
              // sx={{
              //   height: "56px",
              //   borderColor: primaryColor,
              //   color: "rgb(116, 108, 108)",
              //   "&:hover": {
              //     backgroundColor: "rgba(144, 27, 38, 0.08)",
              //     borderColor: secondaryColor,
              //   },
              // }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  background: isLight ? "#fff" : "#121212",
                  color: isLight ? "black" : "white",
                  "& fieldset": {
                    borderColor: "#901b20",
                  },
                  "&:hover fieldset": {
                    borderColor: "#901b20",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: isLight ? "black" : "white",
                },
                "& .MuiInputBase-input": {
                  backgroundColor: isLight
                    ? "rgba(255, 255, 255, 0.95)"
                    : "#121212",
                  color: isLight ? "black" : "white",
                  paddingLeft: 1,
                  borderRadius: "10px",
                },
              }}
              startIcon={<Add />}
            >
              Add Skill
            </AddButton>
          </Grid>

          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
                minHeight: 100,
                p: 2,
                borderRadius: "8px",
                backgroundColor: isLight ? "#e8e8e8" : "#121212",
              }}
            >
              {skills.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  onDelete={() => handleDeleteSkill(skill)}
                  color="primary"
                  variant="outlined"
                  sx={{
                    "& .MuiChip-deleteIcon": {
                      color: isLight ? "#d7323e" : "#901b26",
                      "&:hover": {
                        color: isLight ? "#901b26" : "#d7323e",
                      },
                    },
                    borderColor: isLight ? "#d7323e" : "#901b26",
                    backgroundColor: "#fff",
                    "&:hover": {
                      backgroundColor: isLight ? "#d7323e" : "#901b26",
                    },
                  }}
                />
              ))}
              {skills.length === 0 && (
                <Typography variant="body2" sx={{ color: isLight ? "#d7323e" : "#901b26" }}>
                  No skills added yet. Start typing to add skills!
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mt: 4,
          }}
        >
          <SaveButton
            variant="contained"
            onClick={handleSave}
            sx={{
              backgroundColor: isLight ? "#d7323e" : "#901b26",
              "&:hover": {
                backgroundColor: isLight ? "#901b26" : "#d7323e",
                boxShadow: "0px 4px 12px rgba(215, 50, 62, 0.4)",
              },
            }}
            startIcon={<Check />}
          >
            Save Skills
          </SaveButton>
        </Box>

        {error && (
          <Alert
            severity="error"
            sx={{
              mt: 2,
              borderRadius: "12px",
              "& .MuiAlert-message": { color: textPrimary },
            }}
          >
            {error}
          </Alert>
        )}
      </SkillCard>
    </Container>
    </Box>
  );
};

export default EditSkills;