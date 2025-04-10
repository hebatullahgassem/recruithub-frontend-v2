import { useState, useEffect } from "react";
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
        const response = await axios.get(`http://localhost:8000/user/password-reset/get-token/${email}/`);
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
      const response = await axios.post("http://localhost:8000/user/password-reset/confirm/", { 
        email, 
        token, 
        new_password: newPassword
      });
      setMessage(response.data.message);
      setTimeout(() => navigate("/login"), 2000); // Redirect after success
    } catch (err) {
      setError(err.response?.data?.token || "Something went wrong");
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
      </form>
      {message && <p>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default ResetPassword;
