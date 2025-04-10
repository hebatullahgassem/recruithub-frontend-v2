import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleForgotPassword = async () => {
    try {
      await axios.post('http://127.0.0.1:8000/user/password-reset/', { email });
      console.log(email);
      // localStorage.setItem("email", email);
      setMessage('Password reset email sent. Please check your inbox.');
      setError('');
      setTimeout(() => navigate('/login'), 3000);  // Redirect after 3 seconds
    } catch (err) {
      setError('Failed to send password reset email.');
      setMessage('');
    }
  };

  return (
    <Container>
      <Box sx={{ mt: 5, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h4" align="center">Forgot Password</Typography>
        <TextField
          label="Enter your email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
        />
        {message && <Typography color="green" align="center">{message}</Typography>}
        {error && <Typography color="red" align="center">{error}</Typography>}
        <Button
          variant="contained"
          onClick={handleForgotPassword}
          disabled={!email}
          sx={{ mt: 2 }}
        >
          Send Reset Link
        </Button>
      </Box>
    </Container>
  );
}

export default ForgotPassword;
