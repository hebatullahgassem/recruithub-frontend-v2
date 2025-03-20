import React, { useContext, useState } from "react";
import { ProfileContext } from "../../../../context/ProfileContext";
import { useNavigate } from "react-router-dom";
import ProfileStepper from "../../../../components/profile/ProfileStepper";

const EditExperience = () => {
  const { profile, setProfile } = useContext(ProfileContext);
  const [experiences, setExperiences] = useState(profile?.experience || []);
  const navigate = useNavigate();

  const handleAddExperience = () => {
    setExperiences([...experiences, { title: "", company: "", years: "" }]);
  };

  const handleChange = (index, key, value) => {
    const updatedExperiences = [...experiences];
    updatedExperiences[index][key] = value;
    setExperiences(updatedExperiences);
  };

  const handleSave = () => {
    setProfile((prev) => ({ ...prev, experience: experiences }));
    navigate("/user/profile");
  };

  return (
    <div>
     <ProfileStepper activeStep={2} /> 
      <h2>Edit Experience</h2>
      {experiences.map((exp, index) => (
        <div key={index} style={{ marginBottom: "10px" }}>
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
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default EditExperience;
