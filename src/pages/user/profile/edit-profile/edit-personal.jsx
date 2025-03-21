import React, { useContext, useState } from "react";
import { ProfileContext } from "../../../../context/ProfileContext";
import { Button, TextField, Avatar } from "@mui/material";
import ProfileStepper from "../../../../components/profile/ProfileStepper";

const EditPersonal = () => {
  const { profileData, updateProfile, goToNextStep } = useContext(ProfileContext);
  const [localData, setLocalData] = useState(profileData);

  const handleChange = (e) => {
    setLocalData({ ...localData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    updateProfile("name", localData.name);
    updateProfile("email", localData.email);
    goToNextStep("user/profile/edit-education");
  };

  return (
    <div>
      <ProfileStepper activeStep={0} /> {/* Step 1 */}
      <h2>Edit Personal Details</h2>
      <Avatar src={localData.profileImage} sx={{ width: 80, height: 80 }} />
      <TextField label="Name" name="name" value={localData.name} onChange={handleChange} fullWidth />
      <TextField label="Email" name="email" value={localData.email} onChange={handleChange} fullWidth />
      <Button variant="contained" onClick={handleSave}>Next: Education</Button>
    </div>
  );
};

export default EditPersonal;
