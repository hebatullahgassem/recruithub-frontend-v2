import React, { useContext, useState } from "react";
import { ProfileContext } from "../../../../context/ProfileContext";
import { useNavigate } from "react-router-dom";
import ProfileStepper from "../../../../components/profile/ProfileStepper";

const EditCV = () => {
  const { profile, setProfile } = useContext(ProfileContext);
  const [cv, setCv] = useState(profile.cv || null);
  const navigate = useNavigate();

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setCv(fileUrl);
    }
  };

  const handleSave = () => {
    setProfile((prev) => ({ ...prev, cv }));
    navigate("/user/profile");
  };

  return (
    <div>
    <ProfileStepper activeStep={4} /> 
      <h2>Upload CV</h2>
      <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileUpload} />
      {cv && (
        <p>
          Uploaded: <a href={cv} download>Download CV</a>
        </p>
      )}
      <Button variant="contained" onClick={handleSave}>Next: Review</Button>
      </div>
  );
};

export default EditCV;
