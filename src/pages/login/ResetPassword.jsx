import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, ArrowLeft } from "lucide-react"
import Lottie from "lottie-react";
import animationData from "../../assets/animations/LoginRegister.json";
import { showErrorToast, showSuccessToast,showWarningToast } from "../../confirmAlert/toastConfirm";  
import '../../styles/registerLogin/reset_password.css';
import { userContext } from "../../context/UserContext";


const ResetPassword = () => {
  const { email } = useParams();
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" })
  const [passwordError, setPasswordError] = useState("");
  const [passwordHelpText, setPasswordHelpText] = useState(""); // For password criteria help text
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { isLight } = useContext(userContext);
  // Password complexity regex (same as in registration)
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&_\-])[A-Za-z\d@$!%*?&_\-]{8,}$/;

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/user/password-reset/get-token/${email}/`
        );
        setToken(response.data.token);
      } catch (err) {
        if (
          err.response &&
          err.response.status === 400 &&
          err.response.data?.error === "Daily limit reached"
        ) {
          const errorMessage = "You have reached the password reset limit for today. Please try again tomorrow."
          showWarningToast(errorMessage)
          setStatus({
            type: "error",
            message: errorMessage,
          })
        } else {
          const errorMessage = "Failed to fetch token. Please try again later."
          showErrorToast(errorMessage, 2000, isLight)
          setStatus({
            type: "error",
            message: errorMessage,
          })  
        }
      }
    };
  
    fetchToken();
  }, [email]);
  


  const validatePassword = (password) => {
    if (!passwordRegex.test(password)) {
      return "Password must contain uppercase, lowercase, number, and special character."
    } else if (password.length < 8) {
      return "Password must be at least 8 characters long."
    }
    return ""
  }

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    setPasswordHelpText(validatePassword(value));

    if (confirmPassword) {
      setPasswordError(value !== confirmPassword ? "Passwords do not match" : "")
    }
    // Check password complexity
    // if (!passwordRegex.test(value)) {
    //   setPasswordHelpText(
    //     "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character."
    //   );
    // } else if (value.length < 8) {
    //   setPasswordHelpText("Password must be at least 8 characters long.");
    // } else {
    //   setPasswordHelpText(""); // Clear password help text if valid
    // }
  };


  // Real-time password match and complexity check
  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setPasswordError(newPassword !== value ? "Passwords do not match" : "")
    // Check if passwords match
    // if (newPassword !== value) {
    //   setPasswordError("Passwords do not match");
    // } else {
    //   setPasswordError("");
    // }
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true)
    setStatus({ type: "", message: "" })

    // Check if the passwords match before submitting
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match")
      showErrorToast("Passwords do not match. Please ensure both passwords are identical.", 2000, isLight)
      setIsSubmitting(false)
      return;
    }

    // Check for password complexity and length
    const passwordValidation = validatePassword(newPassword)
    if (passwordValidation) {
      setPasswordHelpText(passwordValidation)
      showErrorToast(passwordValidation, 2000, isLight)
      setIsSubmitting(false)
      return
    }

    // Proceed with password reset
    try {
      const response = await axios.post(
        "http://localhost:8000/user/password-reset/confirm/",
        { email, token, new_password: newPassword }
      );
      setStatus({
        type: "success",
        message: response.data.message || "Password reset successful! You can now log in with your new password.",
      })
      showSuccessToast("Password reset successful! You can now log in with your new password.", 2000, isLight)
      setTimeout(() => navigate("/login"), 3000)
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Something went wrong. Please try again."
      setStatus({
        type: "error",
        message: errorMessage,
      })
      showErrorToast("Password reset failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  };

  // Disable submit button when criteria is not met
  // const isSubmitDisabled = !newPassword || !confirmPassword || passwordError || !passwordRegex.test(newPassword);
  const isSubmitDisabled = !newPassword || !confirmPassword || passwordError || passwordHelpText || isSubmitting
  return (
    <div className="reset-password-container">
      <div className="reset-password-wrapper">
        <div className="reset-password-animation-container">
          <Lottie animationData={animationData} loop={true} className="reset-password-animation" />
        </div>

        <div className="reset-password-form-container">
          <button className="back-button" onClick={() => navigate(-1)} aria-label="Go back">
            <ArrowLeft size={20} />
          </button>

          <div className="reset-password-header">
            <h1 className="reset-password-title">Reset Password</h1>
            <div className="reset-password-divider"></div>
          </div>

          <div className="reset-password-content">
            <p className="reset-password-description">
              Create a new password for your account <strong>{email}</strong>
            </p>

            {/* Replace the status message JSX with an empty fragment since we're using toast now */}
            {status.message && <></>}

            <form onSubmit={handleSubmit} className="reset-password-form">
              <div className="form-group">
                <label htmlFor="new-password" className="form-label">
                  New Password
                </label>
                <div className="input-wrapper">
                  <Lock className="input-icon" size={18} />
                  <input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    className={`form-input ${passwordHelpText ? "error" : ""}`}
                    value={newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter new password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {passwordHelpText && <p className="error-message">{passwordHelpText}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="confirm-password" className="form-label">
                  Confirm New Password
                </label>
                <div className="input-wrapper">
                  <Lock className="input-icon" size={18} />
                  <input
                    id="confirm-password"
                    type={showPassword ? "text" : "password"}
                    className={`form-input ${passwordError ? "error" : ""}`}
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    placeholder="Confirm new password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {passwordError && <p className="error-message">{passwordError}</p>}
              </div>

              <div className="form-group">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    className="checkbox-input"
                    onChange={() => setShowPassword(!showPassword)}
                    checked={showPassword}
                  />
                  <span className="checkbox-label">Show Password</span>
                </label>
              </div>

              <div className="password-requirements">
                <h3>Password Requirements:</h3>
                <ul>
                  <li className={newPassword.length >= 8 ? "valid" : ""}>At least 8 characters</li>
                  <li className={/[A-Z]/.test(newPassword) ? "valid" : ""}>At least one uppercase letter</li>
                  <li className={/[a-z]/.test(newPassword) ? "valid" : ""}>At least one lowercase letter</li>
                  <li className={/[0-9]/.test(newPassword) ? "valid" : ""}>At least one number</li>
                  <li className={/[@$!%*?&_-]/.test(newPassword) ? "valid" : ""}>
                    At least one special character (@$!%*?&_-)
                  </li>
                </ul>
              </div>

              <button
                type="submit"
                className={`reset-password-button ${isSubmitting ? "loading" : ""}`}
                disabled={isSubmitDisabled}
              >
                {isSubmitting ? "Resetting..." : "Reset Password"}
              </button>
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
    //             Reset Password
    //           </Typography>
    //           <Divider sx={{ mb: 4, backgroundColor: "#901b20", height: 2 }} />

    //           <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
    //             <TextField
    //               fullWidth
    //               label="Enter new password"
    //               variant="outlined"
    //               type={showPassword ? "text" : "password"} // Toggle password visibility
    //               value={newPassword}
    //               onChange={handlePasswordChange}
    //               sx={{
    //                 '& .MuiOutlinedInput-root': {
    //                   '& fieldset': { borderColor: '#901b20' },
    //                   '&:hover fieldset': { borderColor: '#901b20' },
    //                 },
    //                 '& .MuiInputLabel-root': { color: '#901b20' },
    //               }}
    //               required
    //               InputProps={{
    //                 endAdornment: (
    //                   <InputAdornment position="end">
    //                     <IconButton
    //                       onClick={() => setShowPassword(!showPassword)} // Toggle visibility
    //                       edge="end"
    //                     >
    //                       {showPassword ? <VisibilityOff /> : <Visibility />}
    //                     </IconButton>
    //                   </InputAdornment>
    //                 ),
    //               }}
    //             />
    //             <TextField
    //               fullWidth
    //               label="Confirm new password"
    //               variant="outlined"
    //               type={showPassword ? "text" : "password"} // Toggle password visibility
    //               value={confirmPassword}
    //               onChange={handleConfirmPasswordChange}
    //               sx={{
    //                 '& .MuiOutlinedInput-root': {
    //                   '& fieldset': { borderColor: '#901b20' },
    //                   '&:hover fieldset': { borderColor: '#901b20' },
    //                 },
    //                 '& .MuiInputLabel-root': { color: '#901b20' },
    //               }}
    //               error={!!passwordError}
    //               helperText={passwordError || passwordHelpText}
    //               required
    //               InputProps={{
    //                 endAdornment: (
    //                   <InputAdornment position="end">
    //                     <IconButton
    //                       onClick={() => setShowPassword(!showPassword)} // Toggle visibility
    //                       edge="end"
    //                     >
    //                       {showPassword ? <VisibilityOff /> : <Visibility />}
    //                     </IconButton>
    //                   </InputAdornment>
    //                 ),
    //               }}
    //             />
    //             {message && (
    //               <Typography color="blue" align="center">{message}</Typography>
    //             )}
    //             {error && (
    //               <Typography color="red" align="center">{error}</Typography>
    //             )}
    //             <Button
    //               fullWidth
    //               variant="contained"
    //               size="large"
    //               onClick={handleSubmit}
    //               disabled={isSubmitDisabled}
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
    //                 opacity: isSubmitDisabled ? 0.6 : 1,
    //               }}
    //             >
    //               Reset Password
    //             </Button>
    //           </Box>
    //         </Box>
    //       </Grid>
    //     </Grid>
    //   </Container>
    // </Box>
  );
};

export default ResetPassword;
