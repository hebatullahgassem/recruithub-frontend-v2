import React, { useState,useEffect } from "react";
import { TextField, Button, Typography } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import axios from "axios";

const CompanySchedule = ({ applicant, phase, handleClose }) => {
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [meetingLink, setMeetingLink] = useState("");
  const [loading, setLoading] = useState(false);
  
  
  // Populate state with applicant's existing interview details
  useEffect(() => {
    if (phase === 3) {
      setSelectedDateTime(applicant.interview_time ? dayjs(applicant.interview_time) : null);
      setMeetingLink(applicant.interview_link || "");
    } else if (phase === 4) {
      setSelectedDateTime(applicant.hr_time ? dayjs(applicant.hr_time) : null);
      setMeetingLink(applicant.hr_link || "");
    }
  }, [applicant, phase]);


  // Handle form submission
  const handleSubmit = async() => {
    if (!selectedDateTime || !meetingLink) {
      alert("Please fill in all fields: date & time, and meeting link.");
      return;
    }
    try{
    setLoading(true);

    const updateData = {
        interview_time: dayjs(selectedDateTime).format("YYYY-MM-DD HH:mm"),
        interview_link: meetingLink,
        phase,
    };
      if (phase === 3) { 
        updateData.interview_link = meetingLink;
        updateData.interview_time = dayjs(selectedDateTime).format("YYYY-MM-DD HH:mm");
      } else if (phase === 4) { 
        updateData.hr_link = meetingLink;
        updateData.hr_time = dayjs(selectedDateTime).format("YYYY-MM-DD HH:mm");
      }
      const response = await axios.patch(
        `http://127.0.0.1:8000/applications/${applicant.id}/schedule_interview/`,
        updateData,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      console.log("Update successful:", response.data);
      alert(
        `Interview scheduled for ${applicant.user_name} on ${dayjs(selectedDateTime).format("YYYY-MM-DD HH:mm")}.\nMeeting Link: ${meetingLink}`
      );
      handleClose();
    } catch (error) {
      console.error("Error updating interview details:", error);
      alert("Failed to schedule interview. Please try again.");
    } finally {
      setLoading(false);
    } 
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
          <strong>Schedule Interview for:</strong> {applicant.user_name || null}
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
          disabled={loading}
        >
          {loading ? "Scheduling..." : "Schedule Interview"}
        </Button>
      </div>
    </LocalizationProvider>
  );
};

export default CompanySchedule;
