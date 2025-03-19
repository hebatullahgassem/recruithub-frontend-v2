import React, { useState } from "react";
import { TextField, Button, Typography } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const CompanySchedule = ({ applicant, phase, handleClose }) => {
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [meetingLink, setMeetingLink] = useState("");

  // Handle form submission
  const handleSubmit = () => {
    if (!selectedDateTime || !meetingLink) {
      alert("Please fill in all fields: date & time, and meeting link.");
      return;
    }
    handleClose();

    const interviewDetails = {
      interviewDateTime: dayjs(selectedDateTime).format("YYYY-MM-DD HH:mm"),
      meetingLink: meetingLink,
    };

    console.log("Interview Scheduled:", interviewDetails);
    alert(
      `Interview scheduled for ${applicant.Name} on ${interviewDetails.interviewDateTime}.\nMeeting Link: ${interviewDetails.meetingLink}`
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div
        style={{
          padding: 20,
          maxWidth: 600,
          margin: "auto",
          textAlign: "left",
          display: phase != 3 && phase != 4 ? "none" : "initial",
        }}
      >
        {/* Applicant Name Input */}
        <Typography variant="h6" gutterBottom>
          <strong>Schedule Interview for:</strong> {applicant.Name || null}
        </Typography>

        {/* Date & Time Picker */}
        <Typography variant="h6" gutterBottom>
          Select Date & Time:
        </Typography>
        <DateTimePicker
          label="Pick a Date & Time"
          value={selectedDateTime}
          onChange={setSelectedDateTime}
          renderInput={(params) => <TextField {...params} fullWidth />}
        />

        {/* Meeting Link Input */}
        <Typography variant="h6" gutterBottom>
          Meeting Link:
        </Typography>
        <TextField
          fullWidth
          value={meetingLink}
          onChange={(e) => setMeetingLink(e.target.value)}
          placeholder="Enter meeting link (e.g., Zoom, Google Meet)"
        />

        {/* Submit Button */}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSubmit}
        >
          Schedule Interview
        </Button>
      </div>
    </LocalizationProvider>
  );
};

export default CompanySchedule;
