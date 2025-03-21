import React, { useContext, useState } from "react";
import { ProfileContext } from "../../../../context/ProfileContext";
import { Button } from "@mui/material";
import ProfileStepper from "../../../../components/profile/ProfileStepper";

const EditExperience = () => {
  const { profileData, updateProfile, goToNextStep } = useContext(ProfileContext); // ✅ Correct context usage
  const [experiences, setExperiences] = useState(profileData.experience || []);

  const handleAddExperience = () => {
    setExperiences([...experiences, { title: "", company: "", years: "" }]);
  };

  const handleChange = (index, key, value) => {
    const updatedExperiences = [...experiences];
    updatedExperiences[index][key] = value;
    setExperiences(updatedExperiences);
  };

  const handleSave = () => {
    updateProfile("experience", experiences); // ✅ Correctly updating context
    goToNextStep("/applicant/profile/edit-skills"); // ✅ Consistent navigation
  };

  return (
    <div>
    <ProfileStepper activeStep={2} /> 
      <h2>Edit Experience</h2>
      {experiences.map((exp, index) => (
        <div key={index}>
          <input
            type="text"
            placeholder="Job Title"
            value={exp.title}
            onChange={(e) => handleChange(index, "title", e.target.value)}
          />
          <input
            type="text"
            placeholder="Company Name"
            value={exp.company}
            onChange={(e) => handleChange(index, "company", e.target.value)}
          />
          <input
            type="text"
            placeholder="Years"
            value={exp.years}
            onChange={(e) => handleChange(index, "years", e.target.value)}
          />
        </div>
      ))}
      <button onClick={handleAddExperience}>+ Add Experience</button>
      <Button variant="contained" onClick={handleSave}>Next: Skills</Button>
    </div>
  );
};

export default EditExperience;
