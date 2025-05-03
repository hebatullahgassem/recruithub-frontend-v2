import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import {
//   Container,
//   Typography,
//   TextField,
//   Button,
//   Box,
//   InputAdornment,
//   Divider,
//   Grid,
// } from "@mui/material";
// import { Email } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom"
import { Mail, ArrowLeft, AlertCircle, CheckCircle } from "lucide-react"
import Lottie from "lottie-react";
import animationData from "../../assets/animations/LoginRegister.json";
import '../../styles/registerLogin/forget_password.css';
import { showErrorToast, showSuccessToast } from "../../confirmAlert/toastConfirm";
import { userContext } from "../../context/UserContext";
function ForgotPassword() {
  const [email, setEmail] = useState("");
  // const [message, setMessage] = useState("");
  // const [error, setError] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" })
  const [countdown, setCountdown] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { isLight } = useContext(userContext);
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    // } else {
    //   setMessage("");
     }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleForgotPassword = async (e) => {
    e.preventDefault();  // prevent form refresh
    setIsSubmitting(true); 
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND}/user/password-reset/`, { email });
      // setMessage("Password reset email sent. Please check your inbox.");
      // setError("");
      showSuccessToast("Password reset email sent. Please check your inbox.", 2000, isLight)
      setStatus({
        type: "success",
        message: "Password reset email sent. Please check your inbox.",
      })
      setCountdown(30);
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Failed to send password reset email."
      showErrorToast(errorMessage, 2000, isLight)
      setStatus({
        type: "error",
        message: errorMessage,
      }) 
    } finally {
      setIsSubmitting(false)
    
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-wrapper">
        <div className="forgot-password-animation-container">
          <Lottie animationData={animationData} loop={true} className="forgot-password-animation" />
        </div>

        <div className="forgot-password-form-container">
          <button className="back-button" onClick={() => navigate(-1)} aria-label="Go back">
            <ArrowLeft size={20} />
          </button>

          <div className="forgot-password-header">
            <h1 className="forgot-password-title">Forgot Password</h1>
            <div className="forgot-password-divider"></div>
          </div>

          <div className="forgot-password-content">
            <p className="forgot-password-description">
              Enter your email address below and we'll send you a link to reset your password.
            </p>

            <div className="forgot-password-notice">
              <AlertCircle size={18} />
              <p>You can request a password reset up to 3 times per day.</p>
            </div>

            {status.message && (
              <div className={`forgot-password-status ${status.type}`}>
                {status.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                <p>{status.message}</p>
              </div>
            )}

            <form onSubmit={handleForgotPassword} className="forgot-password-form">
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <div className="input-wrapper">
                  <Mail className="input-icon" size={18} />
                  <input
                    id="email"
                    type="email"
                    className="form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>

              {countdown > 0 && <div className="countdown">Please wait {countdown} seconds before trying again</div>}

              <button
                type="submit"
                className={`forgot-password-button ${isSubmitting ? "loading" : ""}`}
                disabled={!email || countdown > 0 || isSubmitting}
              >
                {countdown > 0 ? `Try Again in ${countdown}s` : "Send Reset Link"}
              </button>

              <div className="forgot-password-actions">
                <RouterLink to="/login" className="back-to-login">
                  Back to Login
                </RouterLink>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    // <Box
    //   sx={{
    //     display: "flex",
    //     justifyContent: "center",
    //     alignItems: "center",
    //     width: "90%",
    //     minHeight: "80vh",
    //   }}
    // >
    //   <Container maxWidth="lg">
    //     <Grid container spacing={2}>
    //       <Grid item xs={12} md={6}>
    //         <Box
    //           sx={{
    //             display: "flex",
    //             justifyContent: "center",
    //             alignItems: "center",
    //             height: "100%",
    //             backgroundColor: "rgba(247, 237, 237, 0.95)",
    //             borderRadius: 2,
    //           }}
    //         >
    //           <Lottie
    //             animationData={animationData}
    //             loop={true}
    //             style={{ width: "100%", height: "auto" }}
    //           />
    //         </Box>
    //       </Grid>
    //       <Grid item xs={12} md={6}>
    //         <Box
    //           sx={{
    //             p: 4,
    //             boxShadow: 3,
    //             borderRadius: 2,
    //             backgroundColor: "rgba(255, 255, 255, 0.95)",
    //             backdropFilter: "blur(10px)",
    //             border: "1px solid rgba(144, 27, 32, 0.2)",
    //             height: "100%",
    //             display: "flex",
    //             flexDirection: "column",
    //             justifyContent: "center",
    //           }}
    //         >
    //           <Typography 
    //             variant="h5" 
    //             align="center" 
    //             fontWeight="bold" 
    //             gutterBottom
    //             sx={{ color: "#901b20" }}
    //           >
    //             Forgot Password
    //           </Typography>
    //           <Divider sx={{ 
    //             mb: 4, 
    //             backgroundColor: "#901b20",
    //             height: 2,
    //           }} />

    //           <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
    //             <TextField
    //               fullWidth
    //               label="Enter your email"
    //               variant="outlined"
    //               type="email"
    //               value={email}
    //               onChange={(e) => setEmail(e.target.value)}
    //               InputProps={{
    //                 startAdornment: (
    //                   <InputAdornment position="start">
    //                     <Email sx={{ color: "#901b20" }} />
    //                   </InputAdornment>
    //                 ),
    //               }}
    //               sx={{
    //                 '& .MuiOutlinedInput-root': {
    //                   '& fieldset': { borderColor: '#901b20' },
    //                   '&:hover fieldset': { borderColor: '#901b20' },
    //                 },
    //                 '& .MuiInputLabel-root': { color: '#901b20' },
    //               }}
    //               required
    //             />

    //             <Typography
    //               variant="body2"
    //               align="center"
    //               sx={{
    //                 fontStyle: "bold",
    //                 fontSize: "0.95rem",
    //                 color: "#757575",  // Subtle gray
    //               }}
    //             >
    //               ⚠️ You can request a password reset up to 2 times per day. Please use this feature responsibly.
    //             </Typography>

    //             {message && countdown === 0 && (
    //               <Typography
    //                 color="success.main"
    //                 align="center"
    //                 sx={{
    //                   fontWeight: "bold",
    //                   fontSize: "1.1rem",
    //                   color: "#4CAF50",  // Green color for success message
    //                 }}
    //               >
    //                 {message}
    //               </Typography>
    //             )}
    //             {error && (
    //               <Typography
    //                 color="error.main"
    //                 align="center"
    //                 sx={{
    //                   fontWeight: "bold",
    //                   fontSize: "1.1rem",
    //                   color: "#D32F2F",  // Red color for error message
    //                 }}
    //               >
    //                 {error}
    //               </Typography>
    //             )}
    //             {countdown > 0 && (
    //               <Typography
    //                 color="orange"
    //                 align="center"
    //                 sx={{
    //                   fontWeight: "bold",
    //                   fontSize: "1.1rem",
    //                   color: "#FF9800",  // Orange color for countdown message
    //                 }}
    //               >
    //                 Please wait {countdown} seconds before trying again.
    //               </Typography>
    //             )}
    //             <Button
    //               fullWidth
    //               variant="contained"
    //               size="large"
    //               onClick={handleForgotPassword}
    //               disabled={!email || countdown > 0}
    //               sx={{
    //                 mt: 2,
    //                 py: 1.5,
    //                 background: "linear-gradient(45deg, #901b20 30%, #c12e3d 90%)",
    //                 boxShadow: "0 3px 5px 2px rgba(144, 27, 32, .3)",
    //                 '&:hover': {
    //                   transform: "translateY(-2px)",
    //                   transition: "transform 0.2s",
    //                   background: "#901b20",
    //                 },
    //                 opacity: !email || countdown > 0 ? 0.6 : 1,
    //               }}
    //             >
    //               {countdown > 0 ? `Try Again in ${countdown}s` : "Send Reset Link"}
    //             </Button>
    //           </Box>
    //         </Box>
    //       </Grid>
    //     </Grid>
    //   </Container>
    // </Box>
  );
}

export default ForgotPassword;
