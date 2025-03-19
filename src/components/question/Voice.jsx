import { Typography } from "@mui/material";
import { useState } from "react";

function Voice() {
  const [voiceFile, setVoiceFile] = useState(null);
  // Handle file upload
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size <= 5 * 1024 * 1024) {
        setVoiceFile(file);
        console.log("Uploaded file:", file.name);
      } else {
        alert("File size must be less than 5MB");
      }
    }
  };
  return (
    <>
      {/* Question 3: Voice Input */}
      <Typography variant="h6" gutterBottom>
        Record your introduction (Audio file, max 5MB):
      </Typography>
      <input
        type="file"
        accept="audio/*"
        onChange={handleFileChange}
        style={{ marginBottom: 10 }}
      />
      {voiceFile && (
        <Typography variant="body2">Uploaded: {voiceFile.name}</Typography>
      )}
    </>
  );
}

export default Voice;
