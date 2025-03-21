import React, { useContext, useState } from "react";
import { ProfileContext } from "../../../../context/ProfileContext";
import { Button, TextField } from "@mui/material";
import ProfileStepper from "../../../../components/profile/ProfileStepper";

const EditEducation = () => {
  const { profileData, updateProfile, goToNextStep } = useContext(ProfileContext);
  const [education, setEducation] = useState([...profileData.education]);

  const handleAdd = () => {
    setEducation([...education, { degree: "", university: "" }]);
  };

  const handleChange = (index, field, value) => {
    const newEducation = [...education];
    newEducation[index][field] = value;
    setEducation(newEducation);
  };

  const handleSave = () => {
    updateProfile("education", education);
    goToNextStep("applicant/profile/edit-experience");
  };

  return (
    <div>
    <ProfileStepper activeStep={1} /> 
      <h2>Edit Education</h2>
      {education.map((edu, index) => (
        <div key={index}>
          <TextField label="Degree" value={edu.degree} onChange={(e) => handleChange(index, "degree", e.target.value)} />
          <TextField label="University" value={edu.university} onChange={(e) => handleChange(index, "university", e.target.value)} />
        </div>
      ))}
      <Button onClick={handleAdd}>Add More</Button>
      <Button onClick={handleSave}>Next: Experience</Button>
    </div>
  );
};

export default EditEducation;
