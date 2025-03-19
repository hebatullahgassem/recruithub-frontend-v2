import React, { useState } from "react";
import { TextField, Button, Typography } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const CompanySchedule = () => {
  const [applicantName, setApplicantName] = useState("");
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [meetingLink, setMeetingLink] = useState("");

  // Handle form submission
  const handleSubmit = () => {
    if (!applicantName || !selectedDateTime || !meetingLink) {
      alert("Please fill in all fields: applicant's name, date & time, and meeting link.");
      return;
    }

    const interviewDetails = {
      applicant: applicantName,
      interviewDateTime: dayjs(selectedDateTime).format("YYYY-MM-DD HH:mm"),
      meetingLink: meetingLink,
    };

    console.log("Interview Scheduled:", interviewDetails);
    alert(`Interview scheduled for ${interviewDetails.applicant} on ${interviewDetails.interviewDateTime}.\nMeeting Link: ${interviewDetails.meetingLink}`);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div style={{ padding: 20, maxWidth: 600, margin: "auto", textAlign: "left" }}>
        <Typography variant="h4" gutterBottom>
          Schedule an Interview
        </Typography>

        {/* Applicant Name Input */}
        <Typography variant="h6" gutterBottom>Applicant's Name:</Typography>
        <TextField
          fullWidth
          margin="normal"
          value={applicantName}
          onChange={(e) => setApplicantName(e.target.value)}
          placeholder="Enter applicant's name"
        />

        {/* Date & Time Picker */}
        <Typography variant="h6" gutterBottom>Select Date & Time:</Typography>
        <DateTimePicker
          label="Pick a Date & Time"
          value={selectedDateTime}
          onChange={setSelectedDateTime}
          renderInput={(params) => <TextField {...params} fullWidth />}
        />

        {/* Meeting Link Input */}
        <Typography variant="h6" gutterBottom>Meeting Link:</Typography>
        <TextField
          fullWidth
          margin="normal"
          value={meetingLink}
          onChange={(e) => setMeetingLink(e.target.value)}
          placeholder="Enter meeting link (e.g., Zoom, Google Meet)"
        />

        {/* Submit Button */}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: 20 }}
          onClick={handleSubmit}
        >
          Schedule Interview
        </Button>
      </div>
    </LocalizationProvider>
  );
};

export default CompanySchedule;
