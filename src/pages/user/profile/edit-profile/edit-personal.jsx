import React, { useContext, useState, useRef, useEffect } from "react";
import { userContext } from "../../../../context/UserContext";
import {
  Button,
  TextField,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  Paper,
  Container,
  IconButton,
  useTheme,
  useMediaQuery,
  styled
  
} from "@mui/material";
import { ArrowBack, CloudUpload, CheckCircle, Error, AddAPhoto  } from "@mui/icons-material";
import ProfileStepper from "../../../../components/profile/ProfileStepper";
import { AxiosApi } from "../../../../services/Api";
import { useLocation, useNavigate } from "react-router-dom";

// Style constants
const primaryColor = '#d06c79';
const secondaryColor = '#4a7b9d';
const accentColor = '#901b21';
const backgroundColor = '#f9f5f4';
const textSecondary = '#6c757d'

const ImageUploadWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    '&::after': {
      content: '"Change"',
      position: 'absolute',
      inset: 0,
      background: 'rgba(0,0,0,0.5)',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '8px',
      fontSize: '1.2rem',
    }
  },
}));

const ProfileImage = styled(Box)(({ theme }) => ({
  width: 200,
  height: 200,
  borderRadius: '50%', // Make it circular
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  border: `4px solid ${primaryColor}`,
  boxShadow: theme.shadows[4],
  [theme.breakpoints.down('sm')]: {
    width: 150,
    height: 150,
  },
}));

const IDImage = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: 280,
  height: 180,
  borderRadius: '12px',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  border: `2px solid ${primaryColor}`,
  [theme.breakpoints.down('sm')]: {
    height: 140,
  },
}));


const EditPersonal = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, updateUser, goToNextStep } = useContext(userContext);
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [localData, setLocalData] = useState({
    name: "",
    email: "",
    dob: "",
    location: "",
    about: "",
    phone: "",
    nationalId: "",
    img: "",
    nationalIdImg: "",
  });
  const [uploadStatus, setUploadStatus] = useState({
    img: null,
    nationalIdImg: null,
  });
  const [error, setError] = useState(null);
  const personalImageRef = useRef(null);
  const nationalIdImageRef = useRef(null);
  const location = useLocation();
  const userId = location.state?.userId;

  useEffect(() => {
    if (userId) {
      AxiosApi.get(`user/jobseekers/${userId}/`)
        .then((res) => {
          const data = res.data;
          setLocalData({
            name: data.name || "",
            email: data.email || "",
            dob: data.dob || "",
            location: data.location || "",
            about: data.about || "",
            phone: data.phone_number || "",
            nationalId: data.national_id || "",
            img: data.img || "",
            nationalIdImg: data.national_id_img || "",
          });
        })
        .catch((err) => {
          console.error("Failed to fetch user:", err);
        });
    }
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e, field) => {
    const file = e.target.files[0];
    try {
      if (!file) throw new Error("No file selected");
      if (!file.type.match("image.*"))
        throw new Error("Please upload an image file (JPEG, PNG, etc.)");
      if (file.size > 10 * 1024 * 1024)
        throw new Error("File size should be less than 5MB");
      if (file.size === 0) throw new Error("File is empty");

      setUploadStatus({ ...uploadStatus, [field]: "uploading" });
      setError(null);

      const backendField =
        field === "nationalIdImg" ? "national_id_img" : field;
      const formData = new FormData();
      formData.append(backendField, file);

      const response = await AxiosApi.patch(
        `user/jobseekers/${userId}/`,
        formData,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (!response.data) throw new Error("Upload failed");

      const updatedData = response.data;

      setLocalData((prev) => ({
        ...prev,
        [field]: updatedData[backendField],
      }));

      // updateUser(backendField, updatedData[backendField]);
      setUploadStatus({ ...uploadStatus, [field]: "success" });
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploadStatus({ ...uploadStatus, [field]: "error" });
      setError(error.message);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validatePhoneNumber(localData.phone)) {
      console.log(localData.phone);
      return;
    }
    try {
      const formData = new FormData();

      formData.append("name", localData.name);
      formData.append("dob", localData.dob);
      formData.append("location", localData.location);
      formData.append("about", localData.about);
      formData.append("phone_number", localData.phone);
      formData.append("national_id", localData.nationalId);

      if (localData.img instanceof File) {
        formData.append("img", localData.img);
      }
      if (localData.nationalIdImg instanceof File) {
        formData.append("national_id_img", localData.nationalIdImg);
      }

      const response = await AxiosApi.patch(
        `user/jobseekers/${userId}/`,
        formData,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // updateUser(response.data);
      setSuccess(true);
      setError(null);
      navigate(`/applicant/profile`, { userId });
    } catch (err) {
      console.error("Error updating profile:", err);
      const errorMessage = err.response?.data
        ? Object.values(err.response.data).join(" ")
        : "Failed to save changes. Please check your input.";
      setError('Server Error: ');
    }
  };
  const validatePhoneNumber = (phone) => {
    if (!phone) {
      setError("");
      return true;
    }
  
    // Egyptian mobile number regex (11 digits starting with 010, 011, 012, or 015)
    const phoneRegex = /^01[0-2,5]\d{8}$/;
    
    if (!phoneRegex.test(phone)) {
      setError("Valid format: 11 digits starting with 010, 011, 012, or 015 (e.g., 01123456789)");
      return false;
    }
    
    setError(null);
    return true;
  };
  

  return (
    <Box sx={{ backgroundColor, minHeight: '100vh', p: useMediaQuery(theme.breakpoints.down('md')) ? 2 : 4 }}>
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ color: primaryColor }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" sx={{ fontWeight: 700, color: primaryColor, mt: 2 }}>
          Edit Personal Details
        </Typography>
      </Box>

      <Paper sx={{ p: 4, borderRadius: '16px', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)' }}>
        <form onSubmit={handleSave}>
          <Grid container spacing={3}>
            {/* Left Column */}
            <Grid item xs={12} md={4}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 3,
                alignItems: 'center',
                textAlign: 'center'
              }}>
                {/* Profile Section */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <ImageUploadWrapper onClick={() => personalImageRef.current.click()}>
                    <ProfileImage
                      sx={{
                        backgroundImage: `url(${localData.img || '/default-profile.jpg'})`,
                      }}
                    />
                    <input
                      type="file"
                      hidden
                      ref={personalImageRef}
                      onChange={(e) => handleImageUpload(e, "img")}
                    />
                  </ImageUploadWrapper>
                  
                  <Typography variant="h6" sx={{ 
                    color: primaryColor, 
                    fontWeight: 600,
                    mt: 1
                  }}>
                    {localData.name || "Your Name"}
                  </Typography>

                  {uploadStatus.img && (
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      gap: 1,
                      height: 24
                    }}>
                      {uploadStatus.img === 'uploading' && <CircularProgress size={20} />}
                      {uploadStatus.img === 'success' && 
                        <CheckCircle fontSize="small" sx={{ color: 'success.main' }} />}
                      {uploadStatus.img === 'error' && 
                        <Error fontSize="small" sx={{ color: 'error.main' }} />}
                    </Box>
                  )}
                </Box>

                {/* National ID Section */}
                <Box sx={{ width: '100%', mt: 2 }}>
                  <Typography variant="subtitle1" sx={{ 
                    mb: 2,
                    color: textSecondary,
                    fontWeight: 500
                  }}>
                    National ID Verification
                  </Typography>
                  
                  <ImageUploadWrapper onClick={() => nationalIdImageRef.current.click()}>
                    <IDImage
                      sx={{
                        backgroundImage: localData.nationalIdImg ? 
                          `url(${localData.nationalIdImg})` : 
                          'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
                      }}
                    >
                      {!localData.nationalIdImg && (
                        <Box sx={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: primaryColor
                        }}>
                          <AddAPhoto sx={{ fontSize: 40, mb: 1 }} />
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            Upload National ID
                          </Typography>
                          <Typography variant="caption" sx={{ color: textSecondary }}>
                            JPG or PNG, max 5MB
                          </Typography>
                        </Box>
                      )}
                    </IDImage>
                  </ImageUploadWrapper>
                  
                  <input
                    type="file"
                    hidden
                    ref={nationalIdImageRef}
                    onChange={(e) => handleImageUpload(e, "nationalIdImg")}
                  />

                  {uploadStatus.nationalIdImg && (
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      gap: 1,
                      height: 24,
                      mt: 1
                    }}>
                      {uploadStatus.nationalIdImg === 'uploading' && 
                        <CircularProgress size={20} />}
                      {uploadStatus.nationalIdImg === 'success' && 
                        <CheckCircle fontSize="small" sx={{ color: 'success.main' }} />}
                      {uploadStatus.nationalIdImg === 'error' && 
                        <Error fontSize="small" sx={{ color: 'error.main' }} />}
                    </Box>
                  )}
                </Box>
              </Box>
            </Grid>

            {/* Right Column */}
            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={localData.name}
                    onChange={handleChange}
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={localData.email}
                    disabled
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Date of Birth"
                    name="dob"
                    type="date"
                    value={localData.dob}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Location"
                    name="location"
                    value={localData.location}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="About Me"
                    name="about"
                    value={localData.about}
                    onChange={handleChange}
                    multiline
                    rows={4}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={localData.phone}
                    onChange={handleChange}
                    error={!!error}
                    helperText={error || "Format: +20-1-0125-eleven numbers"}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="National ID"
                    name="nationalId"
                    value={localData.nationalId}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                  />
                </Grid>
              </Grid>

              {success && (
                <Alert severity="success" sx={{ mt: 2, borderRadius: '8px' }}>
                  Profile updated successfully!
                </Alert>
              )}

              <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => navigate(-1)}
                  sx={{ width: isMobile ? '100%' : 'auto' }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    backgroundColor: primaryColor,
                    color: 'white',
                    width: isMobile ? '100%' : 'auto',
                    '&:hover': { backgroundColor: accentColor }
                  }}
                >
                  Save Changes
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
        </Paper>
    </Container>
  </Box>
);
};

export default EditPersonal;
