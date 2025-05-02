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
  ArrowForward,
  Language,
  Code
} from "@mui/icons-material";
import { SiLeetcode } from "react-icons/si"
import { userContext } from "../../../context/UserContext";
import '../../../styles/company/profile/Comprofile.css';


const ComProfile = () => {
  const navigate = useNavigate();
  // const { profileData } = useContext(ComProfileContext);
  const {user: profileData, refetchUser,isLight} = useContext(userContext);
  // const primaryColor = "#e53946"
  // const backgroundColor = isLight ? "#ffffff" : "#121212"
  // const textColor = isLight ? "#2d3748" : "#e2e8f0"
  // const borderColor = isLight ? "#e3cdcd" : "#2d3748"
  // const cardBackground = isLight ? "#ffffff" : "#1e1e1e"
  // const sectionBackground = isLight ? "#f9f9f9" : "#242424"

  // Navigation handler
  const handleNavigation = (path) => () => {
    navigate(`/company/profile/${path}`, { state: { id: profileData?.id } });
  };

  useEffect(() => {
    refetchUser()
  }
  , [])

  const getAccountIcon = (accountType) => {
    switch (accountType.toLowerCase()) {
      case "github":
        return <GitHub />;
      case "linkedin":
        return <LinkedIn />;
      case "personal website":
        return <Language />;
      case "leetcode":
        return <SiLeetcode />;
      default:
        return <InsertLink />;
    }
  };

  return (
    <div className={`company-profile-container ${isLight ? "light-mode" : "dark-mode"}`}>
    <div className="background-pattern"></div>
    
    <div className="company-profile-content">
      <div className="company-header-card">
        <div className="company-header-left">
          <div className="company-avatar-container">
            <img
              src={profileData?.img || "/placeholder.svg?height=120&width=120"}
              alt={profileData?.name}
              className="company-avatar"
            />
          </div>
          <div className="company-header-info">
            <h1 className="company-name">{profileData?.name || "Company Name"}</h1>
            <p className="company-tagline">{profileData?.est || "Innovating tomorrow's solutions today"}</p>
            
            <div className="company-quick-info">
              {profileData?.industry && (
                <div className="quick-info-item">
                  <Business className="quick-info-icon" />
                  <span>{profileData.industry}</span>
                </div>
              )}
              
              {profileData?.location && (
                <div className="quick-info-item">
                  <LocationOn className="quick-info-icon" />
                  <span>{profileData.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="company-header-actions">
          <button
            className="edit-profile-button"
            onClick={handleNavigation("edit-personal")}
          >
            <Edit className="button-icon" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>
      
      <div className="company-content-grid">
        <div className="company-about-card">
          <div className="card-header">
            <h2>About Company</h2>
            <div className="card-header-line"></div>
          </div>
          
          <div className="company-about-content">
            <p className="company-about-text">
              {profileData?.about || "No description provided. Add information about your company, mission, vision, and values to help others understand what you do."}
            </p>
            
            <div className="company-details-grid">
              <div className="company-detail-item">
                <Phone className="detail-icon" />
                <div className="detail-content">
                  <h3>Phone</h3>
                  <p>{profileData?.phone_number || "Not provided"}</p>
                </div>
              </div>
              
              <div className="company-detail-item">
                <CalendarToday className="detail-icon" />
                <div className="detail-content">
                  <h3>Established</h3>
                  <p>{profileData?.est ? new Date(profileData.est).toLocaleDateString() : "Not provided"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="company-social-card">
          <div className="card-header">
            <h2>Social Accounts</h2>
            <div className="card-header-line"></div>
          </div>
          
          <div className="social-accounts-content">
            {Object.keys(profileData?.accounts || {}).length > 0 ? (
              <div className="social-accounts-grid">
                {Object.entries(profileData?.accounts || {}).map(([type, url]) => (
                  <a
                    key={type}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-account-item"
                  >
                    <div className="social-account-icon">
                      {getAccountIcon(type)}
                    </div>
                    <div className="social-account-details">
                      <h3>{type}</h3>
                      <p className="social-account-url">{url}</p>
                    </div>
                    <ArrowForward className="social-account-arrow" />
                  </a>
                ))}
              </div>
            ) : (
              <div className="no-accounts-message">
                <InsertLink className="no-accounts-icon" />
                <p>No social accounts added yet</p>
              </div>
            )}
            
            <Link
              to="/company/profile/edit-accounts"
              className="manage-accounts-button"
            >
              <Edit className="button-icon" />
              <span>Manage Social Accounts</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}

export default ComProfile;