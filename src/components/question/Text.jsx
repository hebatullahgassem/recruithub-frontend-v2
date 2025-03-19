import { TextField, Typography } from "@mui/material";
import { useState } from "react";

function Text() {
  const [textValue, setTextValue] = useState("");
  return (
    <>
      {/* Question 2: Text Input */}
      <Typography variant="h6" gutterBottom>
        Tell us about yourself:
      </Typography>
      <TextField
        multiline
        rows={4}
        fullWidth
        margin="normal"
        value={textValue}
        onChange={(e) => setTextValue(e.target.value)}
        placeholder="Write a short introduction..."
      />
    </>
  );
}

export default Text;
