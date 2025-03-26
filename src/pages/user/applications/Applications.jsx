import React, { useState } from "react";
import { TextField, RadioGroup, FormControlLabel, Radio, Button, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import Voice from "../../../components/question/Voice";
import Text from "../../../components/question/Text";
import Boolean from "../../../components/question/Boolean";
import JobCard from "../../../components/job/JobCard";

const JobApplication = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  
  

  return (
      <div className="d-flex flex-column align-items-center w-100">
        <Typography variant="h4" gutterBottom>
          Job Application
        </Typography>
        <JobCard job={{
            _id: '1',
            title: 'Software Engineer',
            companyName: 'Vois',
            type: 'Full-time',
            workStyle: 'Onsite',
            location: 'New York, NY',
            companyLogo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhO-fRJWu5psjEYHnr8-cuBso-97hktHGIRwBXmSiDHN8w8-FX8G4eemvPvt6kgan2kTc&usqp=CAU',
            description: 'Develop and maintain web applications.',
            keywords: ['JavaScript', 'React', 'Node.js'],
        }} user={"user"}/>
        
      </div>
  );
};

export default JobApplication;
