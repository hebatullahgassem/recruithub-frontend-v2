import React, { useContext, useState } from "react";
import { ProfileContext } from "../../../../context/ProfileContext";
import { useNavigate } from "react-router-dom";
import ProfileStepper from "../../../../components/profile/ProfileStepper";

const EditSkills = () => {
  const { profile, setProfile } = useContext(ProfileContext);
  const [skills, setSkills] = useState(profile.skills || []);
  const [newSkill, setNewSkill] = useState("");
  const navigate = useNavigate();

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleSave = () => {
    setProfile((prev) => ({ ...prev, skills }));
    navigate("/user/profile");
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
