import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  TextField,
  Button,
  Link,
  Box,
  InputAdornment,
  Divider,
  Grid,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Email, Lock, Person } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import Lottie from "lottie-react";
import animationData from '../../assets/animations/LoginRegister.json';

const Register = () => {
  const [isEmployer, setIsEmployer] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    name: "",
    password: "",
    confirmPassword: "",
    user_type: "jobseeker",
  });

  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for Show Password
  const [passwordHelpText, setPasswordHelpText] = useState(""); // For displaying the password criteria

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

   // Password matching logic
  if (name === "confirmPassword") {
    if (value !== formData.password) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError(""); // Clear error if passwords match
    }
  }

  // Password complexity logic
  if (name === "password" || name === "confirmPassword") {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    
    // If password doesn't match complexity, show help text
    if (!passwordRegex.test(value)) {
      setPasswordHelpText(
        "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character."
      );
    } else if (value.length < 8) {
      setPasswordHelpText("Password must be at least 8 characters long.");
    } else {
      setPasswordHelpText(""); // Clear help text if valid
    }
  }
};

  const handleUserTypeToggle = () => {
    const newUserType = isEmployer ? "jobseeker" : "company";
    setIsEmployer(!isEmployer);
    setFormData((prev) => ({
      ...prev,
      user_type: newUserType,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Ensure passwords match first
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match");
      alert("Passwords do not match. Please ensure both passwords are identical.");
      return;
    }
  
    // If password meets criteria, proceed
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setPasswordError("Password must meet the required complexity.");
      alert(
        "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character."
      );
      return;
    } else if (formData.password.length < 8) {
      setPasswordError("Password must be at least 8 characters long.");
      alert("Password must be at least 8 characters long.");
      return;
    }
  
    // Proceed with registration
    try {
      const formattedData = {
        ...formData,
        user_type: formData.user_type.toUpperCase(),
      };
      await axios.post("http://localhost:8000/user/register/", formattedData);
      localStorage.setItem("email", formData.email);
      navigate("/verify-otp");
    } catch (error) {
      alert("Registration failed. Please check your details.");
      console.error("Registration failed", error);
    }
  };  
  

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "90%",
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                backgroundColor: "#f8f1f1",
                borderRadius: 2,
              }}
            >
              <Lottie
                animationData={animationData}
                loop={true}
                style={{ width: "100%", height: "auto" }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 4,
                boxShadow: 3,
                borderRadius: 2,
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(145, 23, 32, 0.2)",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography 
                variant="h5" 
                align="center" 
                fontWeight="bold" 
                gutterBottom
                sx={{ color: "#911720" }}
              >
                {isEmployer ? "Register as Employer" : "Register as Jobseeker"}
              </Typography>
              <Divider sx={{ mb: 4, backgroundColor: "#911720", height: 2 }} />

              <Button
                fullWidth
                variant="outlined"
                sx={{ 
                  mb: 3, 
                  textTransform: "none", 
                  py: 1,
                  color: "#911720",
                  borderColor: "#911720",
                  '&:hover': {
                    backgroundColor: '#911720',
                    color: '#fff',
                    borderColor: '#911720'
                  }
                }}
                onClick={handleUserTypeToggle}
              >
                {isEmployer ? "Switch to Jobseeker" : "Switch to Employer"}
              </Button>

              <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  variant="outlined"
                  value={formData.email}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: "#911720" }} />
                      </InputAdornment>
                    ),
                  }}
                  required
                />

                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  type="text"
                  variant="outlined"
                  value={formData.username}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: "#911720" }} />
                      </InputAdornment>
                    ),
                  }}
                  required
                />

                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  type="text"
                  variant="outlined"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"} // Toggle between text and password type
                  variant="outlined"
                  value={formData.password}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: "#911720" }} />
                      </InputAdornment>
                    ),
                  }}
                  required
                />

                <TextField
                  fullWidth
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"} // Toggle between text and password type
                  variant="outlined"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: "#911720" }} />
                      </InputAdornment>
                    ),
                  }}
                  error={!!passwordError}
                  helperText={passwordError || passwordHelpText} // Show password error or help text
                  required
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={showPassword}
                      onChange={() => setShowPassword(!showPassword)}
                      sx={{
                        color: "#911720",
                        "& .MuiSvgIcon-root": {
                          fontSize: 18,  // Reduced the checkbox icon size
                        },
                      }}
                    />
                  }
                  label="Show Password"
                  sx={{
                    color: "#911720",
                    fontSize: "0.75rem",  // Reduced font size of the label
                  }}
                />

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  type="submit"
                  sx={{
                    mt: 2,
                    py: 1.5,
                    background: "linear-gradient(45deg, #911720 30%, #c12e3d 90%)",
                    boxShadow: "0 3px 5px 2px rgba(145, 23, 32, .3)",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      transition: "transform 0.2s",
                      background: "#911720",
                    },
                  }}
                >
                  Register
                </Button>

                <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
                  Already have an account?{" "}
                  <Link 
                    component={RouterLink} 
                    to="/login" 
                    underline="hover" 
                    sx={{ color: "#911720", fontWeight: 'bold' }}
                  >
                    Sign In
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Register;
