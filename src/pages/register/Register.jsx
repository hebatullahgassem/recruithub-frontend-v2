import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import * as React from "react";
import { Link as RouterLink } from "react-router";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  FormHelperText,
  Divider,
  Box,
  Link,
} from "@mui/material";
import { Lock, Person, Email } from "@mui/icons-material";

function Register() {
  const [formValues, setFormValues] = useState({
    fname: "",
    lname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState({
    fnameError: null,
    lnameError: null,
    emailError: null,
    usernameError: null,
    passwordError: null,
    confirmPasswordError: null,
  });
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  function handleSubmit(e) {
    e.preventDefault();
    handleRegister();
  }
  async function handleRegister() {
    try {
      const res = await axios.post("https://goodreads-node-production.up.railway.app/auth/register", {
        fName: formValues.fname,
        lName: formValues.lname,
        username: formValues.username,
        email: formValues.email,
        password: formValues.password,
      });
      navigate("/otp", { state: formValues });
    } catch (error) {
      console.log(error.response.data.message)
    }
  }
  function handleChange(e) {
    if (e.target.name === "fname") {
      setFormValues({ ...formValues, fname: e.target.value });
      setFormErrors({
        ...formErrors,
        fnameError:
          e.target.value.length === 0 ? "First Name is required" : null,
      });
    }
    if (e.target.name === "lname") {
      setFormValues({ ...formValues, lname: e.target.value });
      setFormErrors({
        ...formErrors,
        lnameError:
          e.target.value.length === 0 ? "Last Name is required" : null,
      });
    }
    if (e.target.name === "username") {
      setFormValues({ ...formValues, username: e.target.value });
      setFormErrors({
        ...formErrors,
        usernameError:
          e.target.value.length === 0 ? "Username is required" : null,
      });
    }
    if (e.target.name === "email") {
      setFormValues({ ...formValues, email: e.target.value });
      setFormErrors({
        ...formErrors,
        emailError: e.target.value.length === 0 ? "Email is required" : null,
      });
      setFormErrors({
        ...formErrors,
        emailError: e.target.value.match(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        )
          ? null
          : "Email is not valid",
      });
    }
    if (e.target.name === "password") {
      setFormValues({ ...formValues, password: e.target.value });
      setFormErrors({
        ...formErrors,
        passwordError:
          e.target.value.length === 0 ? "Password is required" : null,
      });
      setFormErrors({
        ...formErrors,
        passwordError: e.target.value.match(
          /^(?=(.*[a-z]))(?=(.*[A-Z]))(?=(.*\d))(?=(.*[@%$#]))[A-Za-z\d@%$#]{8,}$/
        )
          ? null
          : "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character",
      });
    }
    if (e.target.name === "confirmPassword") {
      setFormValues({ ...formValues, confirmPassword: e.target.value });
      setFormErrors({
        ...formErrors,
        confirmPasswordError:
          e.target.value.length === 0 ? "Confirm Password is required" : null,
      });
      setFormErrors({
        ...formErrors,
        confirmPasswordError:
          e.target.value === formValues.password
            ? null
            : "Passwords do not match",
      });
    }
  }
  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
        marginY: "20px",
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          p: 4,
          boxShadow: 3,
          borderRadius: 2,
          backdropFilter: "blur(10px)", // Softens background
          border: "1px solid rgba(78, 78, 78, 0.34)", // Subtle border
        }}
      >
        <h2 align="center" className="b612-bold" style={{ fontWeight: "bold" }}>Sign up to Wuzzuf</h2>
        <Container
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
        <Button variant="contained" sx={{ ml: 1 }} onClick={() => navigate("/login")}>Login</Button>
        <Button variant="contained" sx={{ ml: 1 }} onClick={() => navigate("/register-company")}>Sign Up as Company</Button>
        </Container>
        <Divider sx={{ mb: 4 }} />

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                placeholder="John"
                variant="outlined"
                value={formValues.fname}
                name="fname"
                onChange={handleChange}
                error={!!formErrors.fnameError}
                helperText={formErrors.fnameError}
                InputProps={{
                  startAdornment: (
                    <Person sx={{ color: "action.active", mr: 1 }} />
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                placeholder="Doe"
                variant="outlined"
                value={formValues.lname}
                name="lname"
                onChange={handleChange}
                error={!!formErrors.lnameError}
                helperText={formErrors.lnameError}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                placeholder="john.doe@example.com"
                variant="outlined"
                type="email"
                value={formValues.email}
                name="email"
                onChange={handleChange}
                error={!!formErrors.emailError}
                helperText={formErrors.emailError}
                InputProps={{
                  startAdornment: (
                    <Email sx={{ color: "action.active", mr: 1 }} />
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Username"
                placeholder="johndoe123"
                variant="outlined"
                value={formValues.username}
                name="username"
                onChange={handleChange}
                error={!!formErrors.usernameError}
                helperText={formErrors.usernameError}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                variant="outlined"
                placeholder="••••••••"
                value={formValues.password}
                name="password"
                onChange={handleChange}
                error={!!formErrors.passwordError}
                helperText={formErrors.passwordError}
                InputProps={{
                  startAdornment: <Lock sx={{ color: "action.active", mr: 1 }} />,
                }}
              />
              <FormHelperText sx={{ mt: 1, fontSize: "0.8rem" }}>
                Password must contain at least:
                <ul>
                  <li>8 characters</li>
                  <li>1 uppercase letter</li>
                  <li>1 lowercase letter</li>
                  <li>1 number</li>
                  <li>1 special character</li>
                </ul>
              </FormHelperText>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                variant="outlined"
                placeholder="••••••••"
                value={formValues.confirmPassword}
                name="confirmPassword"
                onChange={handleChange}
                error={!!formErrors.confirmPasswordError}
                helperText={formErrors.confirmPasswordError}
                InputProps={{
                  startAdornment: <Lock sx={{ color: "action.active", mr: 1 }} />,
                }}
              />
            </Grid>
          </Grid>

          <Button
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            type="submit"
            disabled={
              Object.values(formErrors).some((error) => error !== null) ||
              Object.values(formValues).some((value) => value === "")
            }
            sx={{
              background: "rgba(148,187,233)",
              borderRadius: 1,
              mt: 2,
              "&:hover": {
                background: "linear-gradient(90deg, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)",
              },
            }}
          >
            Create Account
          </Button>

          <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
            Already have an account?{" "}
            <Link
              component={RouterLink}
              to="/login"
              underline="hover"
              color="primary"
            >
              Sign In
            </Link>
          </Typography>
        </Box>

      </Container>
    </Box>
  );
}

export default Register;