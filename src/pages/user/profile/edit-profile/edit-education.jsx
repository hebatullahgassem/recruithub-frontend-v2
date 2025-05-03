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
  Typography,
  IconButton,
  Paper,
  Container,
  useTheme,
  useMediaQuery,
  styled
} from "@mui/material";
import { useParams, useLocation } from "react-router-dom";
import { AxiosApi } from "../../../../services/Api";
import { userContext } from "../../../../context/UserContext";
import { School, Delete, Add, Check } from "@mui/icons-material";
import { showErrorToast, showSuccessToast } from "../../../../confirmAlert/toastConfirm";


const EducationCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(3),
  borderRadius: '12px',
  backgroundColor: '#fff',
  border: `1px solid ${'#901b26'}20`,
  boxShadow: '0 8px 24px rgba(112,43,46,0.08)',
  transition: 'all 0.3s ease',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 28px rgba(112,43,46,0.12)'
  }
}));

const AddButton = styled(Button)(({ theme }) => ({
  padding: `${theme.spacing(1.5)} ${theme.spacing(3)}`,
  borderRadius: '8px',
  fontWeight: 600,
  textTransform: 'none',
  margin: `${theme.spacing(3)} auto`,
  width: 'fit-content',
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

const EditEducation = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  const userId = location.state?.userId;
  const { profileData, updateProfile, goToNextStep } =
    useContext(ProfileContext);
  const { user, isLight } = useContext(userContext);
  const [education, setEducation] = useState([]); // Initialize as empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Consistent Color Palette
  const primaryColor = isLight ? "#901b26" : "#d7323e"; // IIT Maroon
  const secondaryColor = isLight ? "#d7323e" : "#901b26"; // Complementary Gold
  const accentColor = isLight ? "#a0454e" : "#a0454e"; // Darker Maroon
  const backgroundColor = isLight ? "#f8f2ec" : "#242424"; // Off-white
  const lightBackgroundColor = isLight ? "#f8f2ec" : "#121212"; // Off-white
  const textPrimary = isLight ? "#2d2829" : "#fff"; // Dark Charcoal
  const textSecondary = isLight ? "#5a5252" : "#fff"; // Warm Gray

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
      showSuccessToast("Education data saved successfully!", 2000, isLight);
      goToNextStep(`/applicant/profile`);
    } catch (err) {
      console.error("Error updating education:", err);
      showErrorToast("Failed to save education data", 2000, isLight);
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
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4, color: textPrimary }}>
        <CircularProgress sx={{ color: primaryColor }} />
        <Typography variant="body1" sx={{ ml: 2 }}>Loading education data...</Typography>
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
          <School fontSize="large" sx={{ color: primaryColor }} />
          Edit Education
        </Typography>
      </Box>

      <form onSubmit={handleSave}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {education.map((edu, index) => (
            <EducationCard key={index}>
              <Box sx={{ 
                position: 'absolute',
                top: theme.spacing(1),
                right: theme.spacing(1)
              }}>
                <IconButton
                  onClick={() => setEducation(education.filter((_, i) => i !== index))}
                  sx={{ color: accentColor }}
                >
                  <Delete />
                </IconButton>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Degree"
                    value={edu.degree}
                    onChange={(e) => handleChange(index, "degree", e.target.value)}
                    fullWidth
                    required
                    variant="outlined"
                    InputProps={{ sx: { borderRadius: '8px' } }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="School"
                    value={edu.school}
                    onChange={(e) => handleChange(index, "school", e.target.value)}
                    fullWidth
                    required
                    variant="outlined"
                    InputProps={{ sx: { borderRadius: '8px' } }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Field of Study"
                    value={edu.fieldOfStudy}
                    onChange={(e) => handleChange(index, "fieldOfStudy", e.target.value)}
                    fullWidth
                    required
                    variant="outlined"
                    InputProps={{ sx: { borderRadius: '8px' } }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Start Date"
                    type="date"
                    value={edu.startDate}
                    onChange={(e) => handleChange(index, "startDate", e.target.value)}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    required
                    variant="outlined"
                    InputProps={{ sx: { borderRadius: '8px' } }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="End Date"
                    type="date"
                    value={edu.endDate}
                    onChange={(e) => handleChange(index, "endDate", e.target.value)}
                    disabled={edu.endDate === 'Now'}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    required={edu.startDate && edu.endDate !== 'Now'}
                    variant="outlined"
                    InputProps={{ sx: { borderRadius: '8px' } }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    height: '100%',
                    justifyContent: 'flex-end'
                  }}>
                    <Switch
                      checked={edu.endDate === 'Now'}
                      onChange={(e) => handleChange(index, "endDate", e.target.checked ? "Now" : "")}
                      color="primary"
                    />
                    <Typography variant="body2" sx={{ color: textSecondary }}>
                      Currently Studying
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </EducationCard>
          ))}

          <AddButton
            variant="outlined"
            onClick={handleAdd}
            startIcon={<Add />}
            sx={{
              borderColor: primaryColor,
              color: primaryColor,
              '&:hover': {
                backgroundColor: 'rgba(144, 27, 38, 0.08)',
                borderColor: secondaryColor
              }
            }}
          >
            Add Another Education
          </AddButton>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
            <SaveButton
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: primaryColor,
                '&:hover': {
                  backgroundColor: secondaryColor,
                  boxShadow: '0px 4px 12px rgba(215, 50, 62, 0.4)'
                }
              }}
              startIcon={<Check />}
            >
              Save Education
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
        </Box>
      </form>
    </Container>
  );
};
export default EditEducation;