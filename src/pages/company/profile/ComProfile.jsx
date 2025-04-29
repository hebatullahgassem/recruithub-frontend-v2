import React, { use, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Edit,
  GitHub,
  InsertLink,
  LinkedIn,
  Business,
  LocationOn,
  Phone,
  CalendarToday,
  Info,
} from "@mui/icons-material"
import { SiLeetcode } from "react-icons/si"
import { userContext } from "../../../context/UserContext";
import '../../../styles/company/profile/Comprofile.css';


const ComProfile = () => {
  const navigate = useNavigate();
  // const { profileData } = useContext(ComProfileContext);
  const {user: profileData, refetchUser,isLight} = useContext(userContext);
  const primaryColor = "#e53946"
  const backgroundColor = isLight ? "#ffffff" : "#121212"
  const textColor = isLight ? "#2d3748" : "#e2e8f0"
  const borderColor = isLight ? "#e3cdcd" : "#2d3748"
  const cardBackground = isLight ? "#ffffff" : "#1e1e1e"
  const sectionBackground = isLight ? "#f9f9f9" : "#242424"

  // Navigation handler
  const handleNavigation = (path) => () => {
    navigate(`/company/profile/${path}`, { state: { id: profileData?.id } });
  };

  useEffect(() => {
    refetchUser()
  }
  , [])


  return (
    <div className={`company-profile-container ${isLight ? "light-mode" : "dark-mode"}`}>
      <div
        className="company-card"
        style={{
          backgroundColor: cardBackground,
          borderColor: borderColor,
        }}
      >
        <div className="company-header">
          <img
            src={profileData?.img || "/placeholder.svg?height=120&width=120"}
            alt={profileData?.name}
            className="company-avatar"
          />

          <div className="company-info">
            <h1 className="company-name" style={{ color: textColor }}>
              {profileData?.name || "Company Name"}
            </h1>
            <p className="company-tagline" style={{ color: isLight ? "#718096" : "#a0aec0" }}>
              {profileData?.est || "Innovating tomorrow's solutions today"}
            </p>
          </div>
        </div>

        <div className="company-content">
          <div
            className="company-section"
            style={{
              backgroundColor: sectionBackground,
              borderColor: borderColor,
            }}
          >
            <h2 className="company-section-title" style={{ color: primaryColor }}>
              Company Profile
            </h2>

            <div className="company-detail">
              <div className="company-detail-icon" style={{ color: primaryColor }}>
                <Business />
              </div>
              <span className="company-detail-label" style={{ color: textColor }}>
                Industry:
              </span>
              <span className="company-detail-value" style={{ color: isLight ? "#718096" : "#a0aec0" }}>
                {profileData?.industry || "Not specified"}
              </span>
            </div>

            <div className="company-detail">
              <div className="company-detail-icon" style={{ color: primaryColor }}>
                <LocationOn />
              </div>
              <span className="company-detail-label" style={{ color: textColor }}>
                Location:
              </span>
              <span className="company-detail-value" style={{ color: isLight ? "#718096" : "#a0aec0" }}>
                {profileData?.location || "Location not provided"}
              </span>
            </div>

            <div className="company-detail">
              <div className="company-detail-icon" style={{ color: primaryColor }}>
                <Phone />
              </div>
              <span className="company-detail-label" style={{ color: textColor }}>
                Phone:
              </span>
              <span className="company-detail-value" style={{ color: isLight ? "#718096" : "#a0aec0" }}>
                {profileData?.phone_number || "Not provided"}
              </span>
            </div>

            <div className="company-detail">
              <div className="company-detail-icon" style={{ color: primaryColor }}>
                <CalendarToday />
              </div>
              <span className="company-detail-label" style={{ color: textColor }}>
                Established:
              </span>
              <span className="company-detail-value" style={{ color: isLight ? "#718096" : "#a0aec0" }}>
                {profileData?.est ? new Date(profileData.est).toLocaleDateString() : "Not provided"}
              </span>
            </div>

            <div className="company-detail">
              <div className="company-detail-icon" style={{ color: primaryColor }}>
                <Info />
              </div>
              <span className="company-detail-label" style={{ color: textColor }}>
                About:
              </span>
              <span className="company-detail-value" style={{ color: isLight ? "#718096" : "#a0aec0" }}>
                {profileData?.about || "No description provided"}
              </span>
            </div>

            <div className="company-actions">
              <button
                className="company-button company-button--primary"
                onClick={handleNavigation("edit-personal")}
                style={{
                  backgroundColor: primaryColor,
                  color: "#ffffff",
                }}
              >
                Update Profile
              </button>
            </div>
          </div>

          <div
            className="company-section"
            style={{
              backgroundColor: sectionBackground,
              borderColor: borderColor,
            }}
          >
            <h2 className="company-section-title" style={{ color: primaryColor }}>
              Social Accounts
            </h2>

            <div className="company-social">
              {Object.keys(profileData?.accounts || {}).map((type) => (
                <a
                  key={type}
                  href={profileData.accounts[type]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="company-social-link"
                  title={type}
                  style={{
                    backgroundColor: isLight ? "#f8f9fa" : "#2d3748",
                    color: isLight ? "#4a5568" : "#e2e8f0",
                  }}
                >
                  {type === "linkedin" && <LinkedIn />}
                  {type === "github" && <GitHub />}
                  {type === "personal website" && <InsertLink />}
                  {type === "leetcode" && <SiLeetcode />}
                </a>
              ))}

              <Link
                to="/company/profile/edit-accounts"
                className="company-social-link"
                title="Edit Accounts"
                style={{
                  backgroundColor: `${primaryColor}15`,
                  color: primaryColor,
                }}
              >
                <Edit />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
);
}

export default ComProfile;