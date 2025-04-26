import React, { useContext, useState, useRef, useEffect } from "react";
import {
  Button,
  TextField,
  Avatar,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Fade,
  Grow,
  Slide
} from "@mui/material";
import { Edit } from "@mui/icons-material"
import { AxiosApi } from "../../../../services/Api";
import { useLocation, useNavigate } from "react-router-dom";
import { userContext } from "../../../../context/UserContext";
import Lottie from "lottie-react";
// import loadingAnimation from "../../../../assets/animations/loading.json";
// import successAnimation from "../../../../assets/animations/success.json";
import '../../../../styles/company/companyteme.css';
import '../../../../styles/company/profile/edit_profile_Personal.css';

const EditPersonalCom = () => {
  const { user, setUser } = useContext(userContext);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [uploadStatus, setUploadStatus] = useState({ img: null });
  const logoRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const id = location.state?.id;

  const [localData, setLocalData] = useState({
    name: "",
    email: "",
    img: "",
    location: "",
    about: "",
    phone: "",
    est: "",
    industry: "",
  });

  useEffect(() => {
    if (user) {
      setLocalData((prev) => ({
        ...prev,
        name: user.name,
        email: user.email,
        img: user.img,
        location: user.location,
        about: user.about,
        phone: user.phone_number,
        est: user.est ? user.est.split("T")[0] : "",
        industry: user.industry,
      }));
    }
  }, [user, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      if (!file.type.match("image.*")) throw new Error("Please upload a valid image.");
      if (file.size > 10 * 1024 * 1024) throw new Error("File size should be less than 10MB");

      setUploadStatus({ img: "uploading" });
      const formData = new FormData();
      formData.append("img", file);

      const response = await AxiosApi.patch(`user/profile/`, formData, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const updatedData = response.data;

      setLocalData((prev) => ({
        ...prev,
        img: updatedData.img,
      }));
      
      setUser((prev) => ({
        ...prev,
        img: updatedData.img,
      }));

      setUploadStatus({ img: "success" });
    } catch (error) {
      console.error("Error uploading img:", error);
      setUploadStatus({ img: "error" });
      setError(error.message);
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const payload = {
        name: localData.name,
        location: localData.location,
        about: localData.about,
        phone_number: localData.phone,
        est: localData.est,
        industry: localData.industry,
      };

      const response = await AxiosApi.patch(`user/profile/`, payload, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      });

      // setUser((prev) => ({
      //   ...prev,
      //   ...response.data,
      // }));

      setSuccess(true);
      setError(null);

      setTimeout(() => navigate("/company/profile"), 2000);
    } catch (err) {
      console.error("Error updating profile:", err);
      const errorMessage = err.response?.data
        ? Object.values(err.response.data).join(" ")
        : "Failed to save changes.";
      setError(errorMessage);
    }
  };

  // console.log("Image source:", localData.img);


  const validateForm = () => {
    const requiredFields = ["name", "location", "phone"];
    const missing = requiredFields.filter((f) => !localData[f]);

    if (missing.length > 0) {
      setError(`Missing required fields: ${missing.join(", ")}`);
      return false;
    }

    return true;
  };

  
 
    return (
      <div className="edit-profile">
        <div className="edit-profile-card">
          <div className="edit-profile-header">
            <h1 className="edit-profile-title">Edit Company Profile</h1>
            <p className="edit-profile-subtitle">Update your company information</p>
          </div>
  
          <div className="edit-profile-content">
            {success ? (
              <div className="form-success">Profile updated successfully! Redirecting...</div>
            ) : (
              <>
                <div className="edit-profile-avatar">
                  <div className="avatar-container">
                    <img
                      src={localData.img || "/placeholder.svg?height=120&width=120"}
                      alt="Company Logo"
                      className="profile-avatar"
                      onClick={() => logoRef.current.click()}
                    />
                    <div className="avatar-upload" onClick={() => logoRef.current.click()}>
                      <Edit fontSize="small" />
                    </div>
                  </div>
                  <span className="avatar-text" onClick={() => logoRef.current.click()}>
                    {localData.img ? "Change Logo" : "Upload Logo"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    ref={logoRef}
                    style={{ display: "none" }}
                    onChange={handleImageUpload}
                  />
                </div>
  
                {error && <div className="form-error">{error}</div>}
  
                <div className="edit-profile-form">
                  <div className="form-field">
                    <label className="form-label">Company Name</label>
                    <input
                      type="text"
                      name="name"
                      value={localData.name}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
  
                  <div className="form-field">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={localData.email}
                      disabled
                      className="form-input form-input--disabled"
                    />
                  </div>
  
                  <div className="form-field">
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={localData.location}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
  
                  <div className="form-field">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="text"
                      name="phone"
                      value={localData.phone}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
  
                  <div className="form-field">
                    <label className="form-label">Establishment Date</label>
                    <input type="date" name="est" value={localData.est} onChange={handleChange} className="form-input" />
                  </div>
  
                  <div className="form-field">
                    <label className="form-label">Industry</label>
                    <input
                      type="text"
                      name="industry"
                      value={localData.industry}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
  
                  <div className="form-field form-field--full">
                    <label className="form-label">About</label>
                    <textarea
                      name="about"
                      value={localData.about}
                      onChange={handleChange}
                      className="form-input form-textarea"
                    ></textarea>
                  </div>
  
                  <div className="form-actions">
                    <button className="form-button form-button--secondary" onClick={() => navigate("/company/profile")}>
                      Cancel
                    </button>
                    <button
                      className="form-button form-button--primary"
                      onClick={handleSave}
                      disabled={uploadStatus.img === "uploading"}
                    >
                      {uploadStatus.img === "uploading" ? "Uploading..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    
  );
};

export default EditPersonalCom;
// import React, { useContext, useState, useRef, useEffect } from "react";
// import {
//   Button,
//   TextField,
//   Avatar,
//   Box,
//   Typography,
//   CircularProgress,
//   Alert,
//   Fade,
//   Grow,
//   Slide
// } from "@mui/material";
// import { AxiosApi } from "../../../../services/Api";
// import { useLocation, useNavigate } from "react-router-dom";
// import { userContext } from "../../../../context/UserContext";
// import Lottie from "lottie-react";
// // import loadingAnimation from "../../../../assets/animations/loading.json";
// // import successAnimation from "../../../../assets/animations/success.json";

// const EditPersonalCom = () => {
//   const { user, setUser } = useContext(userContext);
//   const [success, setSuccess] = useState(false);
//   const [error, setError] = useState(null);
//   const [uploadStatus, setUploadStatus] = useState({ img: null });
//   const logoRef = useRef(null);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const id = location.state?.id;

//   const [localData, setLocalData] = useState({
//     name: "",
//     email: "",
//     img: "",
//     location: "",
//     about: "",
//     phone: "",
//     est: "",
//     industry: "",
//   });

//   useEffect(() => {
//     if (user) {
//       setLocalData((prev) => ({
//         ...prev,
//         name: user.name,
//         email: user.email,
//         img: user.img,
//         location: user.location,
//         about: user.about,
//         phone: user.phone_number,
//         est: user.est ? user.est.split("T")[0] : "",
//         industry: user.industry,
//       }));
//     }
//   }, [user, id]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setLocalData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleImageUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     try {
//       if (!file.type.match("image.*")) throw new Error("Please upload a valid image.");
//       if (file.size > 10 * 1024 * 1024) throw new Error("File size should be less than 10MB");

//       setUploadStatus({ img: "uploading" });
//       const formData = new FormData();
//       formData.append("img", file);

//       const response = await AxiosApi.patch(`user/profile/`, formData, {
//         headers: {
//           Authorization: `Token ${localStorage.getItem("token")}`,
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       const updatedData = response.data;

//       setLocalData((prev) => ({
//         ...prev,
//         img: updatedData.img,
//       }));
      
//       setUser((prev) => ({
//         ...prev,
//         img: updatedData.img,
//       }));

//       setUploadStatus({ img: "success" });
//     } catch (error) {
//       console.error("Error uploading img:", error);
//       setUploadStatus({ img: "error" });
//       setError(error.message);
//     }
//   };

//   const handleSave = async () => {
//     if (!validateForm()) return;

//     try {
//       const payload = {
//         name: localData.name,
//         location: localData.location,
//         about: localData.about,
//         phone_number: localData.phone,
//         est: localData.est,
//         industry: localData.industry,
//       };

//       const response = await AxiosApi.patch(`user/profile/`, payload, {
//         headers: {
//           Authorization: `Token ${localStorage.getItem("token")}`,
//         },
//       });

//       // setUser((prev) => ({
//       //   ...prev,
//       //   ...response.data,
//       // }));

//       setSuccess(true);
//       setError(null);

//       setTimeout(() => navigate("/company/profile"), 2000);
//     } catch (err) {
//       console.error("Error updating profile:", err);
//       const errorMessage = err.response?.data
//         ? Object.values(err.response.data).join(" ")
//         : "Failed to save changes.";
//       setError(errorMessage);
//     }
//   };

//   // console.log("Image source:", localData.img);


//   const validateForm = () => {
//     const requiredFields = ["name", "location", "phone"];
//     const missing = requiredFields.filter((f) => !localData[f]);

//     if (missing.length > 0) {
//       setError(`Missing required fields: ${missing.join(", ")}`);
//       return false;
//     }

//     return true;
//   };

//   // Animation configurations
//   const animationConfig = {
//     // loading: {
//     //   animationData: loadingAnimation,
//     //   style: { width: 80, height: 80 }
//     // },
//   //   success: {
//   //     animationData: successAnimation,
//   //     style: { width: 100, height: 100 }
//   //   }
//    };

//   // Styled components
//   const primaryButtonStyle = {
//     backgroundColor: "#901b26",
//     color: "#fff",
//     "&:hover": {
//       backgroundColor: "#6a1320",
//       transform: "translateY(-2px)",
//       boxShadow: "0 4px 12px rgba(144, 27, 38, 0.3)"
//     },
//     transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
//     py: 1.5,
//     px: 4,
//     fontSize: "1rem"
//   };

//   return (
//     <Fade in timeout={500}>
//       <Box sx={{ 
//         padding: 4,
//         display: "flex",
//         flexDirection: "column",
//         gap: 3,
//         maxWidth: 600,
//         margin: "0 auto",
//         background: "linear-gradient(to bottom right, #fff 0%, #f8f0f2 100%)",
//         borderRadius: 4,
//         boxShadow: 3
//       }}>
//         <Slide in direction="down" timeout={300}>
//           <Typography variant="h4" sx={{ 
//             color: "#901b26",
//             fontWeight: 700,
//             mb: 2,
//             textAlign: "center"
//           }}>
//             Edit Company Profile
//           </Typography>
//         </Slide>

//         {success ? (
//           <Grow in timeout={500}>
//             <Box sx={{ textAlign: "center" }}>
//               {/* <Lottie {...animationConfig.success} /> */}
//               <Alert severity="success" sx={{ mt: 2 }}>
//                 Profile updated successfully!
//               </Alert>
//             </Box>
//           </Grow>
//         ) : (
//           <>
//             <Box sx={{ 
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//               position: "relative"
//             }}>
//               <Avatar
//                 src={localData.img}
//                 sx={{ 
//                   width: 120, 
//                   height: 120, 
//                   cursor: "pointer",
//                   border: "2px solid #901b26",
//                   boxShadow: 3,
//                   transition: "transform 0.3s",
//                   "&:hover": { transform: "scale(1.05)" }
//                 }}
//                 onClick={() => logoRef.current.click()}
//               />
              
//               {uploadStatus.img === "uploading" && (
//                 <Box sx={{ 
//                   position: "absolute",
//                   top: 0,
//                   left: 0,
//                   right: 0,
//                   bottom: 0,
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center"
//                 }}>
//                   <Lottie {...animationConfig.loading} />
//                 </Box>
//               )}

//               <Typography
//                 variant="caption"
//                 sx={{
//                   color: "#901b26",
//                   mt: 1,
//                   cursor: "pointer",
//                   fontWeight: 500,
//                   "&:hover": { textDecoration: "underline" }
//                 }}
//                 onClick={() => logoRef.current.click()}
//               >
//                 {localData.img ? "Change Logo" : "Upload Logo"}
//               </Typography>
//               <input
//                 type="file"
//                 accept="image/*"
//                 ref={logoRef}
//                 style={{ display: "none" }}
//                 onChange={handleImageUpload}
//               />
//             </Box>

//             <Grow in timeout={500} style={{ transitionDelay: '100ms' }}>
//               <TextField
//                 label="Company Name"
//                 name="name"
//                 value={localData.name}
//                 onChange={handleChange}
//                 fullWidth
//                 sx={{ 
//                   '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
//                     borderColor: '#901b26 !important'
//                   }
//                 }}
//               />
//             </Grow>

//             <Grow in timeout={500} style={{ transitionDelay: '150ms' }}>
//               <TextField
//                 label="Email"
//                 name="email"
//                 value={localData.email}
//                 fullWidth
//                 disabled
//               />
//             </Grow>

//             <Grow in timeout={500} style={{ transitionDelay: '200ms' }}>
//               <TextField
//                 label="Location"
//                 name="location"
//                 value={localData.location}
//                 onChange={handleChange}
//                 fullWidth
//               />
//             </Grow>

//             <Grow in timeout={500} style={{ transitionDelay: '250ms' }}>
//               <TextField
//                 label="Phone Number"
//                 name="phone"
//                 value={localData.phone}
//                 onChange={handleChange}
//                 fullWidth
//               />
//             </Grow>

//             <Grow in timeout={500} style={{ transitionDelay: '300ms' }}>
//               <TextField
//                 label="Establishment Date"
//                 name="est"
//                 type="date"
//                 value={localData.est}
//                 onChange={handleChange}
//                 fullWidth
//                 InputLabelProps={{ shrink: true }}
//               />
//             </Grow>

//             <Grow in timeout={500} style={{ transitionDelay: '350ms' }}>
//               <TextField
//                 label="Industry"
//                 name="industry"
//                 value={localData.industry}
//                 onChange={handleChange}
//                 fullWidth
//               />
//             </Grow>

//             {error && (
//               <Fade in timeout={300}>
//                 <Alert severity="error" sx={{ mb: 2 }}>
//                   {error}
//                 </Alert>
//               </Fade>
//             )}

//             <Grow in timeout={500} style={{ transitionDelay: '400ms' }}>
//               <Button 
//                 variant="contained" 
//                 onClick={handleSave} 
//                 sx={primaryButtonStyle}
//                 disabled={uploadStatus.img === "uploading"}
//               >
//                 {uploadStatus.img === "uploading" ? (
//                   <CircularProgress size={24} sx={{ color: "#fff" }} />
//                 ) : (
//                   "Save Changes"
//                 )}
//               </Button>
//             </Grow>
//           </>
//         )}
//       </Box>
//     </Fade>
//   );
// };

// export default EditPersonalCom;