import React, { useContext, useState, useRef, useEffect } from "react";
import { userContext } from "../../../../context/UserContext";
import {
  Button,
  TextField,
  Avatar,
  Box,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import ProfileStepper from "../../../../components/profile/ProfileStepper";
import { AxiosApi } from "../../../../services/Api";
import { useLocation, useNavigate } from "react-router-dom";

const EditPersonal = () => {
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
    } // Allow empty phone number
    const phoneRegex = /^(?:\01)?[0125]\d{8}$/;
    if (!phoneRegex.test(phone)) {
      setError("Correct phone format: +20-1-0125-Eight numbers");
      return false;
    }else {
      setError(null);
      return true;
    }
  };

  // const validateForm = () => {
  //   const requiredFields = ['name', 'dob', 'phone'];
  //   const missingFields = requiredFields.filter(field => !localData[field]);

  //   if (missingFields.length > 0) {
  //     setError(`Missing required fields: ${missingFields.join(', ')}`);
  //     return false;
  //   }

  //   if (!/^\d{11}$/.test(localData.phone)) {
  //     setError('Correct phone format: +20-1-0125-Eight numbers');
  //     return false;
  //   }

  //   return true;
  // };

  return (
    <div>
      <form
        onSubmit={(e) => {
          handleSave(e);
        }}
      >
        <Box
          sx={{ padding: 2, display: "flex", flexDirection: "column", gap: 2 }}
        >
          <h2>Edit Personal Details</h2>

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

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar
              src={localData.img}
              sx={{ width: 80, height: 80, cursor: "pointer" }}
              onClick={() => personalImageRef.current.click()}
            />
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                variant="caption"
                color="textSecondary"
                sx={{ margin: 0, cursor: "pointer" }}
                onClick={() => personalImageRef.current.click()}
              >
                {localData.img
                  ? "Change Profile Image"
                  : "Upload Profile Image"}
              </Typography>
              {uploadStatus.img === "uploading" && (
                <CircularProgress size={14} />
              )}
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
            required
            error={!localData.name}
            helperText={`Current: ${user?.name || "Not set"}`}
          />

          <TextField
            label="Email"
            name="email"
            value={localData.email}
            onChange={handleChange}
            fullWidth
            disabled
            helperText={`Current: ${user?.email || "Not set"}`}
          />

          <TextField
            label="Date of Birth"
            name="dob"
            type="date"
            value={localData.dob}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            helperText={`Current: ${user?.dob || "Not set"}`}
          />

          <TextField
            label="Location"
            name="location"
            value={localData.location}
            onChange={handleChange}
            fullWidth
            helperText={`Current: ${user?.location || "Not set"}`}
          />

          <TextField
            label="About"
            name="about"
            value={localData.about}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            helperText={`Current: ${user?.about || "Not set"}`}
          />

          <TextField
            label="Phone Number"
            name="phone"
            value={localData.phone}
            onChange={handleChange}
            fullWidth
            // error={!validatePhoneNumber(localData.phone)}
            helperText={`Current: ${user?.phone || "Not set"}`}
          />

          <TextField
            label="National ID"
            name="nationalId"
            value={localData.nationalId}
            disabled
            onChange={handleChange}
            fullWidth
            helperText={`Current: ${user?.national_id || "Not set"}`}
          />

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Avatar
              src={localData.nationalIdImg}
              sx={{
                width: 160,
                height: 100,
                cursor: "pointer",
                borderRadius: 2,
              }}
              onClick={() => nationalIdImageRef.current.click()}
              variant="square"
            />
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                variant="caption"
                color="textSecondary"
                sx={{ margin: 0, cursor: "pointer" }}
                onClick={() => nationalIdImageRef.current.click()}
              >
                {localData.nationalIdImg
                  ? "Change National ID Image"
                  : "Upload National ID Image"}
              </Typography>
              {uploadStatus.nationalIdImg === "uploading" && (
                <CircularProgress size={14} />
              )}
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
            // onClick={handleSave}
            type="submit"
            sx={{ mt: 2 }}
          >
            Save Changes
          </Button>
        </Box>
      </form>
    </div>
  );
};

export default EditPersonal;
