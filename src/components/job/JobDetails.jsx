import { useContext, useState } from "react";
import { userContext } from "../../context/UserContext";
import { patchJob } from "../../services/Job";
import { useNavigate } from "react-router";
// import { Button } from "@mui/material";
import { TbCancel } from "react-icons/tb";
import { FaEdit, FaMapMarkerAlt, FaRegClock, FaBriefcase, FaRegCalendarAlt } from "react-icons/fa";
import { IoIosCloudDone } from "react-icons/io";
import { 
MdOutlineWork,
MdOutlineAttachMoney,
MdBusinessCenter,
MdWorkOutline,
MdOutlineBusinessCenter
 } from "react-icons/md";
import { BsLightningCharge } from "react-icons/bs";
import { BsTools } from "react-icons/bs";
import "../../ComponentsStyles/job/job_details.css";
import { showConfirmToast, showErrorToast } from "../../confirmAlert/toastConfirm";
// interface JobDetailsProps {
//   job: any
//   refetch: () => void
// }

function JobDetails({ job, refetch }) {
  console.log(job);
  if (!job) return null;
  const { user, isLight } = useContext(userContext);
  const navigate = useNavigate();
  const id = job.id;
  const [loading, setLoading] = useState(false);

  const handleActivation = async (state) => {
    setLoading(true);
    try {
    if (
      state === 0 
    ) {
      showConfirmToast({
        message: "Are you sure you want to deactivate this job?", 
        onConfirm: async () => {
          // Implement the deactivation logic here
          console.log("Deactivating job with ID:", id);
          const res = await patchJob(id, { status: 0 });
          console.log(res);
          refetch();
        },
        isLight: isLight
      })
      
    } else if (
      state === 1
    ) {
      showConfirmToast({
        message: "Are you sure you want to activate this job?", 
        onConfirm: async () => {
          // Implement the activation logic here
          console.log("Activating job with ID:", id);
          const res = await patchJob(id, { status: 1 });
          console.log(res);
          refetch();
        }
        ,isLight: isLight
      })   
      
    }
    setLoading(false);
  } catch (error) {
      showErrorToast(error.message, 5000, isLight);
    setLoading(false);
    }
  };


  return (
<div className={`job-details-container ${isLight ? "light-mode" : "dark-mode"}`}>
      <div className="background-pattern"></div>
      
      <div className="job-details-card">
        {/* Status Banner */}
        <div className={`status-banner ${job.status === "1" ? "active" : "inactive"}`}>
          <div className="status-indicator"></div>
          <span className="status-text">
            This position is currently {job.status === "1" ? "open" : "closed"}
          </span>
          
          {user?.user_type === "COMPANY" && (
            <div className="action-buttons">
              {job?.status == 1 ? (
                <button
                  className="action-icon-button deactivate"
                  onClick={() => handleActivation(0)}
                  title="Deactivate Job"
                  disabled={loading}
                >
                  <TbCancel />
                </button>
              ) : (
                <button
                  className="action-icon-button activate"
                  onClick={() => handleActivation(1)}
                  title="Activate Job"
                  disabled={loading}
                >
                  <IoIosCloudDone />
                </button>
              )}

              <button
                className="action-icon-button edit"
                onClick={() => navigate("/company/jobEdit/" + id)}
                title="Edit Job"
              >
                <FaEdit />
              </button>
            </div>
          )}
        </div>
        
        {/* Job Header */}
        <div className="job-header">
          <div className="company-logo-container">
            <img
              src={job.company_logo || "https://static.thenounproject.com/png/3198584-200.png"}
              alt={job.company_name}
              className="company-logo"
            />
          </div>
          
          <div className="job-title-container">
            <h1 className="job-title">{job.title}</h1>
            <div className="company-info">
              <span className="company-name">{job.company_name}</span>
              <span className="location">
                <FaMapMarkerAlt className="location-icon" />
                {job.location}
              </span>
            </div>
          </div>
        </div>
        
        {/* Job Highlights */}
        <div className="job-highlights">
          <div className="highlight-item">
            <div className="highlight-icon">
              <MdWorkOutline />
            </div>
            <div className="highlight-content">
              <span className="highlight-label">Job Type</span>
              <span className="highlight-value">{job.type_of_job}</span>
            </div>
          </div>
          
          <div className="highlight-item">
            <div className="highlight-icon">
              <MdOutlineBusinessCenter />
            </div>
            <div className="highlight-content">
              <span className="highlight-label">Work Mode</span>
              <span className="highlight-value">{job.attend}</span>
            </div>
          </div>
          
          <div className="highlight-item">
            <div className="highlight-icon">
              <FaBriefcase />
            </div>
            <div className="highlight-content">
              <span className="highlight-label">Experience</span>
              <span className="highlight-value">{job.experince || "Not specified"}</span>
            </div>
          </div>
          
          <div className="highlight-item">
            <div className="highlight-icon">
              <FaRegClock />
            </div>
            <div className="highlight-content">
              <span className="highlight-label">Posted</span>
              <span className="highlight-value">{job.posted_date || "Recently"}</span>
            </div>
          </div>
        </div>
        
        {/* Skills Section */}
        {job.keywords && job.keywords.length > 0 && (
          <div className="job-section">
            <h2 className="section-title">Required Skills</h2>
            <div className="skills-container">
              {job.keywords.map((skill, index) => (
                <span key={index} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>
        )}
        
        {/* Job Description */}
        <div className="job-section">
          <h2 className="section-title">Job Description</h2>
          <div className="description-content">{job.description}</div>
        </div>
      </div>
    </div>
  );
}
export default JobDetails;
