import { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Lottie from "lottie-react";
import animationData from '../../assets/animations/otp.json';
import { toast } from "react-hot-toast";
import { showErrorToast, showSuccessToast } from "../../confirmAlert/toastConfirm";
import { userContext } from "../../context/UserContext";
const VerifyOTP = () => {
  const [otp, setOtp] = useState(["", "", "", "","",""]);
  const [seconds, setSeconds] = useState(60);
  const [resendDisabled, setResendDisabled] = useState(false);
  const navigate = useNavigate();
  const email = localStorage.getItem("email");
  const location = useLocation();
  const { email: stateEmail } = location.state;
  const { isLight } = useContext(userContext)

  const handleChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  useEffect(() => {
    if (seconds > 0) {
      const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [seconds]);

  const handleVerify = async (e) => {
    e.preventDefault();
    const fullOtp = otp.join("");
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND}user/verify-otp/`, {
        email: email || stateEmail,
        otp: fullOtp,
      });

      if (response.data.message === "OTP verified successfully!") {
        showSuccessToast("OTP Verified Successfully! You can now log in.", 2000, isLight);
        localStorage.removeItem("email");
        navigate("/login");
      } else {
        showErrorToast("Invalid OTP, please try again.", 2000, isLight)
      }
    } catch (error) {
      console.error("OTP verification failed", error);
      showErrorToast("Invalid OTP, please try again.", 2000, isLight)
    }
  };

  const handleResendOtp = async () => {
    setResendDisabled(true);
    setSeconds(60);  // Reset the timer

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND}user/resend-otp/`, {
        email: email || stateEmail,
      });
      
      if (response.data.message === "OTP resent successfully. Check your email for the new OTP.") {
        showSuccessToast("OTP resent successfully. Please check your inbox.", 2000, isLight);
      } else {
        showErrorToast("Failed to resend OTP. Please try again.", 2000, isLight);
      }
    } catch (error) {
      console.error("Resending OTP failed", error);
      showErrorToast("Failed to resend OTP. Please try again.", 2000, isLight);
    } finally {
      // Re-enable the button after a delay of 30 seconds
      setTimeout(() => setResendDisabled(false), 30000);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        px: 2,
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          p: 4,
          borderRadius: 3,
          backgroundColor: "rgba(255, 255, 255, 0.9)", 
          boxShadow: 3,
          textAlign: "center",
          position: "relative",
        }}
      >
        <IconButton 
          onClick={() => navigate(-1)} 
          sx={{ 
            position: 'absolute',
            left: 16,
            top: 16
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        <Box sx={{ height: 180, mb: 2 }}>
          <Lottie
            animationData={animationData}
            loop={true}
            style={{ width: "100%", height: "100%" }}
          />
        </Box>

        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Verify Your Email
        </Typography>
        <Typography variant="body2" mb={3} color="text.secondary">
          We've sent a 6-digit code to <strong>{email}</strong>
        </Typography>

        {/* Add message to check spam */}
        <Typography variant="body2" mb={3} color="text.secondary">
          Didn’t receive the code? Be sure to check your spam or junk folder.
        </Typography>

        <Box component="form" onSubmit={handleVerify}>
          <Grid container spacing={1.5} justifyContent="center" sx={{ mb: 3 }}>
            {otp.map((digit, index) => (
              <Grid item xs={2} sm={2} key={index}>
                <input
                  id={`otp-${index}`}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  maxLength={1}
                  autoFocus={index === 0}
                  style={{
                    width: "100%",
                    height: "56px",
                    textAlign: "center",
                    fontSize: "1.5rem",
                    borderRadius: "8px",
                    border: "1px solid #e0e0e0",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    outline: "none",
                    transition: "all 0.2s ease",
                  }}
                />
              </Grid>
            ))}
          </Grid>

          <Typography variant="body2" color="error" mt={2}>
            {seconds > 0 ? `OTP expires in ${seconds} seconds` : "OTP expired. Please request a new one."}
          </Typography>

          {/* Resend OTP button */}
          <Typography variant="body2" mt={2} color="text.secondary">
            Didn't receive code?{" "}
            <Button 
              variant="text" 
              size="small" 
              sx={{ 
                textTransform: "none",
                color: "#ff5252",
                fontWeight: 'bold',
                fontSize: '0.875rem'
              }}
              onClick={handleResendOtp}
              disabled={resendDisabled}
            >
              Resend OTP
            </Button>
          </Typography>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={otp.join("").length !== 6 || seconds === 0}
            sx={{ 
              mt: 3, 
              py: 1.5,
              backgroundColor: "#ff5252",
              fontSize: "1rem",
              fontWeight: "bold",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "#e53935",
                transform: "translateY(-2px)",
                boxShadow: "0 4px 8px rgba(255,82,82,0.3)"
              },
              "&:disabled": {
                backgroundColor: "#e53935",
                color: "#ffffff"
              },
              transition: "all 0.3s ease",
            }}
          >
            Verify
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default VerifyOTP;
