import React, { useContext, useState, useRef, useEffect } from "react";
import { ProfileContext } from "../../../../context/ProfileContext";
import { Button, TextField, Avatar, Box, Typography, CircularProgress, Alert } from "@mui/material";
import ProfileStepper from "../../../../components/profile/ProfileStepper";
import { AxiosApi } from "../../../../services/Api";
import { useLocation } from "react-router-dom";


const EditPersonal = () => {
  const { profileData, updateProfile, goToNextStep } = useContext(ProfileContext);
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
    nationalIdImg: null
  });
  const [error, setError] = useState(null);
  const personalImageRef = useRef(null);
  const nationalIdImageRef = useRef(null);
  const location = useLocation();
  const userId = location.state?.userId;
  

  console.log("userId", userId);

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
    // setLocalData({ ...localData, [e.target.name]: e.target.value });
    const { name, value } = e.target;
    setLocalData((prev) => ({ ...prev, [name]: value }));
  };
/////////////////
  const validateFile = (file) => {
    // Check file type
    if (!file.type.match('image.*')) {
      throw new Error('Please upload an image file (JPEG, PNG, etc.)');
    }

    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size should be less than 5MB');
    }

    return true;
  };

  const handleImageUpload = async (e, field) => {
    const file = e.target.files[0];
    // if (!file) return;

    try {
      // Validate file
      if (!file) throw new Error('No file selected');
    if (!file.type.match('image.*')) throw new Error('Please upload an image file (JPEG, PNG, etc.)');
    if (file.size > 10 * 1024 * 1024) throw new Error('File size should be less than 5MB');
    if (file.size === 0) throw new Error('File is empty');

    // Then proceed with upload if validation passes
    setUploadStatus({ ...uploadStatus, [field]: 'uploading' });
    setError(null);

      const backendField = field === 'nationalIdImg' ? 'national_id_img' : field;
      const formData = new FormData();
      formData.append(backendField, file);

      const response = await AxiosApi.patch(
        `user/jobseekers/${userId}/`,
        formData, {
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (!response.data) throw new Error('Upload failed');

      const updatedData = response.data;

      setLocalData(prev => ({
        ...prev,
        [field]: updatedData[backendField],
      }));

      updateProfile(backendField, updatedData[backendField]);
      setUploadStatus({ ...uploadStatus, [field]: 'success' });
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadStatus({ ...uploadStatus, [field]: 'error' });
      setError(error.message);
    }
  };
 //////////shofy de w shofy validate file

  // const handleSave = async () => {
  //   if (!validateForm()) return;
  //   try {
  //     // Prepare the data payload with correct backend field names
  //     const payload = {
  //       name: localData.name,
  //       dob: localData.dob,
  //       location: localData.location,
  //       about: localData.about,
  //       phone_number: localData.phone,  // Match backend field name
  //       national_id: localData.nationalId,  // Match backend field name
  //     };
  
  //     const response = await AxiosApi.patch(
  //       `user/jobseekers/${userId}/`,
  //       payload,
  //       {
  //         headers: {
  //           'Authorization': `Token ${localStorage.getItem('token')}`,
  //           'Content-Type': 'application/json',
  //         }
  //       }
  //     );
  
  //     // Update context with the latest data
  //     updateProfile({
  //       ...profileData,
  //       ...response.data,
  //       phone_number: response.data.phone_number || localData.phone,
  //       national_id: response.data.national_id || localData.nationalId,
  //     });
  //     setSuccess(true);
  //     setError(null);
      
  //     setTimeout(() => {
  //       goToNextStep();
  //     }, 3000);

  //   } catch (err) {
  //     console.error("Error updating profile:", err);
      
  //     // Handle error messages
  //     const errorMessage = err.response?.data 
  //       ? Object.values(err.response.data).join(' ') 
  //       : "Failed to save changes. Please check your input.";
      
  //     setError(errorMessage);
  //   }
  // };
  const handleSave = async () => {
    if (!validateForm()) return;
    
    try {
      const formData = new FormData();
      
      // Append all fields including files
      formData.append('name', localData.name);
      formData.append('dob', localData.dob);
      formData.append('location', localData.location);
      formData.append('about', localData.about);
      formData.append('phone_number', localData.phone);
      formData.append('national_id', localData.nationalId);
  
      // Append images if they exist
      if (localData.img instanceof File) {
        formData.append('img', localData.img);
      }
      if (localData.nationalIdImg instanceof File) {
        formData.append('national_id_img', localData.nationalIdImg);
      }
  
      const response = await AxiosApi.patch(
        `user/jobseekers/${userId}/`,
        formData,
        {
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          }
        }
      );
  
      updateProfile(response.data);
      setSuccess(true);
      setError(null);
      
      setTimeout(() => {
        goToNextStep(`/applicant/profile/education/${userId}`);
      }, 3000);
  
    } catch (err) {
      console.error("Error updating profile:", err);
      const errorMessage = err.response?.data 
        ? Object.values(err.response.data).join(' ') 
        : "Failed to save changes. Please check your input.";
      setError(errorMessage);
    }
  };

  const validateForm = () => {
    const requiredFields = ['name', 'dob', 'phone'];
    const missingFields = requiredFields.filter(field => !localData[field]);
    
    if (missingFields.length > 0) {
      setError(`Missing required fields: ${missingFields.join(', ')}`);
      return false;
    }
    
    if (!/^\d{11}$/.test(localData.phone)) {
      setError('Phone number must be 11 digits');
      return false;
    }
  
    return true;
  };
  

  return (
    <div>
      <ProfileStepper activeStep={0} />
      <Box sx={{ padding: 2, display: "flex", flexDirection: "column", gap: 2 }}>
        <h2>Edit Personal Details</h2>
         
        {/* Success Alert */}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Profile updated successfully! Redirecting in 3 seconds...
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Avatar
            src={localData.img}
            sx={{ width: 80, height: 80, cursor: "pointer" }}
            onClick={() => personalImageRef.current.click()}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              variant="caption"
              color="textSecondary"
              sx={{ margin: 0, cursor: "pointer" }}
              onClick={() => personalImageRef.current.click()}
            >
              {localData.img ? "Change Profile Image" : "Upload Profile Image"}
            </Typography>
            {uploadStatus.img === 'uploading' && <CircularProgress size={14} />}
          </Box>
          <input
            type="file"
            accept="image/*"
            ref={personalImageRef}
            style={{ display: "none" }}
            onChange={(e) => handleImageUpload(e, "img")}
          />
        </Box>

        <TextField
          label="Name"
          name="name"
          value={localData.name}
          onChange={handleChange}
          fullWidth
          helperText={`Current: ${profileData?.name || "Not set"}`}
        />

        <TextField
          label="Email"
          name="email"
          value={localData.email}
          onChange={handleChange}
          fullWidth
          disabled
          helperText={`Current: ${profileData?.email || "Not set"}`}
        />

        <TextField
          label="Date of Birth"
          name="dob"
          type="date"
          value={localData.dob}
          onChange={handleChange}
          fullWidth
          InputLabelProps={{ shrink: true }}
          helperText={`Current: ${profileData?.dob || "Not set"}`}
        />

        <TextField
          label="Location"
          name="location"
          value={localData.location}
          onChange={handleChange}
          fullWidth
          helperText={`Current: ${profileData?.location || "Not set"}`}
        />

        <TextField
          label="About"
          name="about"
          value={localData.about}
          onChange={handleChange}
          fullWidth
          multiline
          rows={4}
          helperText={`Current: ${profileData?.about || "Not set"}`}
        />

        <TextField
          label="Phone Number"
          name="phone"
          value={localData.phone}
          onChange={handleChange}
          fullWidth
          helperText={`Current: ${profileData?.phone || "Not set"}`}
        />

        <TextField
          label="National ID"
          name="nationalId"
          value={localData.nationalId}
          onChange={handleChange}
          fullWidth
          helperText={`Current: ${profileData?.national_id || "Not set"}`}
        />

        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
          <Avatar
            src={localData.nationalIdImg}
            sx={{ width: 160, height: 100, cursor: "pointer", borderRadius: 2 }}
            onClick={() => nationalIdImageRef.current.click()}
            variant="square"
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              variant="caption"
              color="textSecondary"
              sx={{ margin: 0, cursor: "pointer" }}
              onClick={() => nationalIdImageRef.current.click()}
            >
              {localData.nationalIdImg ? "Change National ID Image" : "Upload National ID Image"}
            </Typography>
            {uploadStatus.nationalIdImg === 'uploading' && <CircularProgress size={14} />}
          </Box>
          <input
            type="file"
            accept="image/*"
            ref={nationalIdImageRef}
            style={{ display: "none" }}
            onChange={(e) => handleImageUpload(e, "nationalIdImg")}
          />
        </Box>

        <Button 
          variant="contained" 
          onClick={handleSave} 
          sx={{ mt: 2 }}
          // disabled={uploadStatus.img === 'uploading' || uploadStatus.nationalIdImg === 'uploading'}
        >
          Save Changes and Proceed to Education
        </Button>
      </Box>
    </div>
  );
};

export default EditPersonal;