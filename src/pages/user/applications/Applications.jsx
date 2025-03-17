import React, { useState } from "react";
import { TextField, RadioGroup, FormControlLabel, Radio, Button, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const JobApplication = () => {
  const [radioValue, setRadioValue] = useState("");
  const [textValue, setTextValue] = useState("");
  const [voiceFile, setVoiceFile] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

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
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div style={{ padding: 20, maxWidth: 600, margin: "auto", textAlign: "left" }}>
        <Typography variant="h4" gutterBottom>
          Job Application
        </Typography>

        {/* Question 1: Yes/No Radio */}
        <Typography variant="h6" gutterBottom>Are you currently employed?</Typography>
        <RadioGroup value={radioValue} onChange={(e) => setRadioValue(e.target.value)}>
          <FormControlLabel value="yes" control={<Radio />} label="Yes" />
          <FormControlLabel value="no" control={<Radio />} label="No" />
        </RadioGroup>

        {/* Question 2: Text Input */}
        <Typography variant="h6" gutterBottom>Tell us about yourself:</Typography>
        <TextField
          multiline
          rows={4}
          fullWidth
          margin="normal"
          value={textValue}
          onChange={(e) => setTextValue(e.target.value)}
          placeholder="Write a short introduction..."
        />

        {/* Question 3: Voice Input */}
        <Typography variant="h6" gutterBottom>Record your introduction (Audio file, max 5MB):</Typography>
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          style={{ marginBottom: 10 }}
        />
        {voiceFile && <Typography variant="body2">Uploaded: {voiceFile.name}</Typography>}

        {/* Question 4: Date Picker */}
        <Typography variant="h6" gutterBottom>When can you start?</Typography>
        <DatePicker
          label="Select a Date"
          value={selectedDate}
          onChange={(newValue) => {
            setSelectedDate(newValue);
            console.log("Date changed:", newValue ? dayjs(newValue).format("YYYY-MM-DD") : null);
          }}
        />

        {/* Submit Button */}
        <Button variant="contained" color="primary" fullWidth style={{ marginTop: 20 }}>
          Submit
        </Button>
      </div>
    </LocalizationProvider>
  );
};

export default JobApplication;
