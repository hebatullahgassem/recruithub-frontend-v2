import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Container } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setMessage(''); // Clear message when countdown ends
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleForgotPassword = async () => {
    try {
      await axios.post('http://127.0.0.1:8000/user/password-reset/', { email });
      setMessage('Password reset email sent. Please check your inbox.');
      setError('');
      setCountdown(30);
      // setTimeout(() => navigate('/login'), 3000);  // Redirect after 3 seconds
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
        {message && countdown > 0 && ( // Message disappears with countdown
          <Typography color="blue" align="center">{message}</Typography>
        )}
        {error && <Typography color="red" align="center">{error}</Typography>}
        {countdown > 0 && (
          <Typography color="orange" align="center">
            Please wait {countdown} seconds before trying again.
          </Typography>
        )}
        <Button
          variant="contained"
          onClick={handleForgotPassword}
          disabled={!email || countdown > 0}
          sx={{ mt: 2 }}
        >
          {countdown > 0 ? `Try Again in ${countdown}s` : 'Send Reset Link'}
        </Button>
      </Box>
    </Container>
  );
}

export default ForgotPassword;
