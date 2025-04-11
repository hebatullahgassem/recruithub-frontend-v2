import React, { useState, useEffect } from "react";
import { TextField, Button, Box, Typography, Container } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const { email } = useParams();  // Get email from URL params
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("Email from URL params:", email); // Debugging

    const fetchToken = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/user/password-reset/get-token/${email}/`
        );
        console.log("Token received:", response.data.token);
        setToken(response.data.token);
      } catch (err) {
        setError("Failed to fetch token");
      }
    };

    fetchToken();
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const response = await axios.post(
        "http://localhost:8000/user/password-reset/confirm/",
        { email, token, new_password: newPassword }
      );
      setMessage(response.data.message);
      setTimeout(() => navigate("/login"), 2000); // Redirect after success
    } catch (err) {
      setError(err.response?.data?.token || "Something went wrong");
    }
  };

  return (
    <Container>
      <Box sx={{ mt: 5, display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h4" align="center">Reset Password</Typography>
        <TextField
          label="Enter new password"
          type="password"
          variant="outlined"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          fullWidth
          required
        />
        {message && (
          <Typography color="blue" align="center">{message}</Typography>
        )}
        {error && (
          <Typography color="red" align="center">{error}</Typography>
        )}
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!newPassword}
          sx={{ mt: 2 }}
        >
          Reset Password
        </Button>
      </Box>
    </Container>
  );
};

export default ResetPassword;
