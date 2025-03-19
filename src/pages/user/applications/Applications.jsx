import React, { useState } from "react";
import { TextField, RadioGroup, FormControlLabel, Radio, Button, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import Voice from "../../../components/question/Voice";
import Text from "../../../components/question/Text";
import Boolean from "../../../components/question/Boolean";

const JobApplication = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  
  

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div style={{ padding: 20, maxWidth: 600, margin: "auto", textAlign: "left" }}>
        <Typography variant="h4" gutterBottom>
          Job Application
        </Typography>

        <Boolean/>

        <Text/>

        <Voice />

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
