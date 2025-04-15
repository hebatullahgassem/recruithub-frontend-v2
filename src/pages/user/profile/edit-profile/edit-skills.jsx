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
  const { user } = useContext(userContext);
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

      await updateUserProfile(userId, formData);

      navigate("/applicant/profile", { replace: true });
    } catch (err) {
      console.error("Error saving skills:", err);
      setError("Failed to save skills.");
    }
  };

  const handleBack = () => {
    navigate("/applicant/profile/edit-experience", { userId });
  };

 
  if (loading) {
    return (
      <Box sx={{ 
        display: "flex", 
        justifyContent: "center", 
        mt: 4,
        color: textPrimary
      }}>
        <CircularProgress sx={{ color: primaryColor }} />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Loading skills...
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ 
          fontWeight: 700, 
          color: textPrimary,
          fontSize: isMobile ? '1.8rem' : '2.125rem',
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <Build fontSize="large" sx={{ color: primaryColor }} />
          Edit Skills
        </Typography>
      </Box>

      <SkillCard>
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
                sx: { borderRadius: '8px' }
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <AddButton
              fullWidth
              variant="outlined"
              onClick={handleAddSkill}
              disabled={!newSkill || skills.includes(newSkill.trim()) || skills.length > 9}
              sx={{
                height: '56px',
                borderColor: primaryColor,
                color: "rgb(116, 108, 108)",
                '&:hover': {
                  backgroundColor: 'rgba(144, 27, 38, 0.08)',
                  borderColor: secondaryColor
                }
              }}
              startIcon={<Add />}
            >
              Add Skill
            </AddButton>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ 
              display: "flex", 
              flexWrap: "wrap", 
              gap: 1,
              minHeight: 100,
              p: 2,
              borderRadius: '8px',
              backgroundColor: backgroundColor
            }}>
              {skills.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  onDelete={() => handleDeleteSkill(skill)}
                  color="primary"
                  variant="outlined"
                  sx={{
                    '& .MuiChip-deleteIcon': {
                      color: accentColor,
                      '&:hover': {
                        color: secondaryColor
                      }
                    },
                    borderColor: primaryColor,
                    backgroundColor: '#fff',
                    '&:hover': {
                      backgroundColor: `${primaryColor}08`
                    }
                  }}
                />
              ))}
              {skills.length === 0 && (
                <Typography variant="body2" sx={{ color: textSecondary }}>
                  No skills added yet. Start typing to add skills!
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end',
          mt: 4
        }}>
          <SaveButton
            variant="contained"
            onClick={handleSave}
            sx={{
              backgroundColor: primaryColor,
              '&:hover': {
                backgroundColor: secondaryColor,
                boxShadow: '0px 4px 12px rgba(215, 50, 62, 0.4)'
              }
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
              borderRadius: '12px',
              '& .MuiAlert-message': { color: textPrimary }
            }}
          >
            {error}
          </Alert>
        )}
      </SkillCard>
    </Container>
  );
};

export default EditSkills;