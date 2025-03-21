import React, { useContext, useState } from "react";
import { ProfileContext } from "../../../../context/ProfileContext";
import ProfileStepper from "../../../../components/profile/ProfileStepper";
import { Button } from "@mui/material";

const EditSkills = () => {
  const { profileData, updateProfile, goToNextStep } = useContext(ProfileContext);
  const [skills, setSkills] = useState(profileData?.skills || []);
  const [newSkill, setNewSkill] = useState("");

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleSave = () => {
    updateProfile("skills", skills);  // ✅ Correct function from ProfileContext
    goToNextStep("/user/profile/edit-cv"); // ✅ Correct navigation function
  };

  return (
    <div>
      <ProfileStepper activeStep={3} />
      <h2>Edit Skills</h2>
      <input
        type="text"
        placeholder="Enter a skill"
        value={newSkill}
        onChange={(e) => setNewSkill(e.target.value)}
      />
      <button onClick={handleAddSkill}>+ Add Skill</button>

      <ul>
        {skills.map((skill, index) => (
          <li key={index}>{skill}</li>
        ))}
      </ul>
      <Button variant="contained" onClick={handleSave}>Next: CV</Button>
    </div>
  );
};

export default EditSkills;
