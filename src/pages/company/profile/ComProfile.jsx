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

import { userContext } from "../../../context/UserContext";
import { SiLeetcode } from "react-icons/si";
import '../../../styles/company/profile/Comprofile.css';
import '../../../styles/company/companyteme.css';

const ComProfile = () => {
  const navigate = useNavigate();
  // const { profileData } = useContext(ComProfileContext);
  const {user: profileData, refetchUser} = useContext(userContext);

  // Navigation handler
  const handleNavigation = (path) => () => {
    navigate(`/company/profile/${path}`, { state: { id: profileData?.id } });
  };

  useEffect(() => {
    refetchUser()
  }
  , [])


  return (
    <div className="company-profile">
    <div className="company-card">
      <div className="company-header">
        <img
          src={profileData?.img || "/placeholder.svg?height=120&width=120"}
          alt={profileData?.name}
          className="company-avatar"
        />

        <div className="company-info">
          <h1 className="company-name">{profileData?.name || "Company Name"}</h1>
          <p className="company-tagline">{profileData?.est || "Innovating tomorrow's solutions today"}</p>
        </div>
      </div>

      <div className="company-content">
        <div className="company-section">
          <h2 className="company-section-title">Company Profile</h2>

          <div className="company-detail">
            <div className="company-detail-icon">
              <Business />
            </div>
            <span className="company-detail-label">Industry:</span>
            <span className="company-detail-value">{profileData?.industry || "Not specified"}</span>
          </div>

          <div className="company-detail">
            <div className="company-detail-icon">
              <LocationOn />
            </div>
            <span className="company-detail-label">Location:</span>
            <span className="company-detail-value">{profileData?.location || "Location not provided"}</span>
          </div>

          <div className="company-detail">
            <div className="company-detail-icon">
              <Phone />
            </div>
            <span className="company-detail-label">Phone:</span>
            <span className="company-detail-value">{profileData?.phone_number || "Not provided"}</span>
          </div>

          <div className="company-detail">
            <div className="company-detail-icon">
              <CalendarToday />
            </div>
            <span className="company-detail-label">Established:</span>
            <span className="company-detail-value">
              {profileData?.est ? new Date(profileData.est).toLocaleDateString() : "Not provided"}
            </span>
          </div>

          <div className="company-detail">
            <div className="company-detail-icon">
              <Info />
            </div>
            <span className="company-detail-label">About:</span>
            <span className="company-detail-value">{profileData?.about || "No description provided"}</span>
          </div>

          <div className="company-actions">
            <button className="company-button company-button--primary" onClick={handleNavigation("edit-personal")}>
              Update Profile
            </button>
          </div>
        </div>

        <div className="company-section">
          <h2 className="company-section-title">Social Accounts</h2>

          <div className="company-social">
            {Object.keys(profileData?.accounts || {}).map((type) => (
              <a
                key={type}
                href={profileData.accounts[type]}
                target="_blank"
                rel="noopener noreferrer"
                className="company-social-link"
                title={type}
              >
                {type === "linkedin" && <LinkedIn />}
                {type === "github" && <GitHub />}
                {type === "personal website" && <InsertLink />}
                {type === "leetcode" && <SiLeetcode />}
              </a>
            ))}

            <Link to="/company/profile/edit-accounts" className="company-social-link" title="Edit Accounts">
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