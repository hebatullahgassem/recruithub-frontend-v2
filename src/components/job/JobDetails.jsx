import { useContext, useState } from "react";
import { userContext } from "../../context/UserContext";
import { patchJob } from "../../services/Job";
import { useNavigate } from "react-router";
// import { Button } from "@mui/material";
import { TbCancel } from "react-icons/tb";
import { FaEdit } from "react-icons/fa";
import { IoIosCloudDone } from "react-icons/io";
import "../../ComponentsStyles/job/job_details.css";
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
    if (
      state === 0 &&
      window.confirm("Are you sure you want to deactivate this job?")
    ) {
      // Implement the deactivation logic here
      console.log("Deactivating job with ID:", id);
      const res = await patchJob(id, { status: 0 });
      console.log(res);
      refetch();
    } else if (
      state === 1 &&
      window.confirm("Are you sure you want to activate this job?")
    ) {
      // Implement the activation logic here
      console.log("Activating job with ID:", id);
      const res = await patchJob(id, { status: 1 });
      console.log(res);
      refetch();
    }
    setLoading(false);
  };

  // // Status badge style
  // const statusBadgeStyle = {
  //   display: "inline-block",
  //   padding: "0.25rem 0.75rem",
  //   borderRadius: "1rem",
  //   fontSize: "0.85rem",
  //   fontWeight: "600",
  //   color: "white",
  //   background: job.status === "1" ? "#2ecc71" : "#e74c3c",
  // };

  // // Detail item style
  // const detailItemStyle = {
  //   marginBottom: "1rem",
  //   display: "flex",
  //   alignItems: "flex-start",
  //   gap: "0.75rem",
  // };

  // // Icon style
  // const iconStyle = {
  //   color: "#7f8c8d",
  //   fontSize: "1.1rem",
  //   marginTop: "0.2rem",
  // };

  return (
    <div
      className="job-details-container"
      style={{
        minWidth: "80vw",
        backgroundColor: isLight ? "#fff" : "#121212",
        borderRadius: "10px",
        padding:'2rem',
        position: "relative",
      }}
    >
      {user?.user_type === "COMPANY" && (
        <div className="job-actions">
          {job?.status == 1 ? (
            <button
              className="action-icon deactivate"
              onClick={() => handleActivation(0)}
              title="Deactivate Job"
              disabled={loading}
            >
              <TbCancel />
            </button>
          ) : (
            <button
              className="action-icon activate"
              onClick={() => handleActivation(1)}
              title="Activate Job"
              disabled={loading}
            >
              <IoIosCloudDone />
            </button>
          )}

          <button
            className="action-icon edit"
            onClick={() => navigate("/company/jobEdit/" + id)}
            title="Edit Job"
          >
            <FaEdit />
          </button>
        </div>
      )}

      <div className="job-card">
        <div className="job-header">
          <h1 className="job-title" style={{ color: isLight ? "#121212" : "#fff" }}>{job.title}</h1>

          <div className="company-info">
            <img
              src={
                job.company_logo ||
                "https://static.thenounproject.com/png/3198584-200.png" ||
                "/placeholder.svg"
              }
              alt={job.company_name}
              className="company-logo"
            />
            <div>
              <p className="company-name" style={{ color: isLight ? "#121212" : "#fff" }}>
                <span className="label" style={{ color: isLight ? "#3498db" : "#882024 " }}>Company:</span> {job.company_name}
              </p>
              <span
                className={`status-badge ${
                  job.status === "1" ? "active" : "inactive"
                }`}
                style={{ backgroundColor: job.status === "1" ? (isLight ? "#2ecc71" : "#27ae60") : (isLight ? "#e74c3c" : "#c0392b") }}
              >
                {job.status === "1" ? "Open" : "Closed"}
              </span>
            </div>
          </div>
        </div>

        <div className="job-details-grid">
          <div className="details-column">
            <div className="detail-item">
              <span className="detail-icon" style={{ color: isLight ? "#3498db" : "#2980b9" }}>📍</span>
              <div style={{ color: isLight ? "#121212" : "#fff" }}>
                <span className="label" style={{ color: isLight ? "#3498db" : "#882024 " }}>Location:</span> {job.location}
              </div>
            </div>

            {job.keywords && job.keywords.length > 0 && (
              <div className="detail-item">
                <span className="detail-icon" style={{ color: isLight ? "#3498db" : "#2980b9" }}>🔧</span>
                <div style={{ color: isLight ? "#121212" : "#fff" }}>
                  <span className="label"  style={{ color: isLight ? "#3498db" : "#882024 " }}>Skills:</span>{" "}
                  {job.keywords.join(", ")}
                </div>
              </div>
            )}

            <div className="detail-item">
              <span className="detail-icon" style={{ color: isLight ? "#3498db" : "#2980b9" }}>💼</span>
              <div style={{ color: isLight ? "#121212" : "#fff" }}>
                <span className="label"  style={{ color: isLight ? "#3498db" : "#882024 " }}>Experience:</span>{" "}
                {job.experience || "Not specified"}
              </div>
            </div>
          </div>

          <div className="details-column">
            <div className="detail-item">
              <span className="detail-icon" style={{ color: isLight ? "#3498db" : "#2980b9" }}>📄</span>
              <div style={{ color: isLight ? "#121212" : "#fff" }}>
                <span className="label"  style={{ color: isLight ? "#3498db" : "#882024 " }}>Job Type:</span> {job.type_of_job}
              </div>
            </div>

            <div className="detail-item">
              <span className="detail-icon" style={{ color: isLight ? "#3498db" : "#2980b9" }}>🏢</span>
              <div style={{ color: isLight ? "#121212" : "#fff" }}>
                <span className="label"  style={{ color: isLight ? "#3498db" : "#882024 " }}>Attendance:</span> {job.attend}
              </div>
            </div>

            <div className="detail-item">
              <span className="detail-icon" style={{ color: isLight ? "#3498db" : "#2980b9" }}>📅</span>
              <div style={{ color: isLight ? "#121212" : "#fff" }}>
                <span className="label"  style={{ color: isLight ? "#3498db" : "#882024 " }}>Posted:</span>{" "}
                {job.posted_date || "Recently"}
              </div>
            </div>
          </div>
        </div>

        <div className="job-description">
          <h2 className="section-title" style={{ color: isLight ? "#3498db" : "#882024 " }}>Job Description</h2>
          <div className="description-content" style={{ color: isLight ? "#121212" : "#fff" }}>{job.description}</div>
        </div>
      </div>
    </div>
    // <div
    //   className="mt-4"
    //   style={{
    //     maxWidth: "100vw",
    //     minWidth: "100%",
    //     "@media (maxWidth: 768px)": {
    //       minWidth: "100%",
    //     },
    //     position: "relative",
    //     border:'1px solid #e3cdcd'
    //   }}
    // >
    //   <div
    //     style={{
    //       zIndex: "1",
    //       gap: "20px",
    //       position: "absolute",
    //       top: "30px",
    //       right: "20px",
    //       display:user?.user_type === "COMPANY"?'flex' : 'none'
    //     }}
    //   >
    //     {job?.status == 1 ? (
    //       <TbCancel
    //         onClick={() => handleActivation(0)}
    //         style={{ cursor: "pointer", color: "red", scale: "1.5" }}
    //         title="Deactivate Job"
    //       />
    //     ) : (
    //       <IoIosCloudDone
    //         onClick={() => handleActivation(1)}
    //         title="Activate Job"
    //         style={{ cursor: "pointer", color: "#0d6efd", scale: "1.5" }}
    //       />
    //     )}

    //     <FaEdit
    //       onClick={() => navigate("/company/jobEdit/" + id)}
    //       title="Edit Job"
    //       style={{ cursor: "pointer", color: "#0d6efd", scale: "1.5" }}
    //     />
    //   </div>
    //   <div className="card p-4 shadow-sm border-0">
    //     {/* Header Section */}
    //     <div style={{ marginBottom: "1.5rem" }}>
    //       <h2
    //         style={{
    //           fontWeight: "700",
    //           color: "#2c3e50",
    //           marginBottom: "1rem",
    //         }}
    //       >
    //         {job.title}
    //       </h2>

    //       {/* Company Info */}
    //       <div
    //         style={{
    //           display: "flex",
    //           alignItems: "center",
    //           marginBottom: "1.5rem",
    //           "@media (maxWidth: 768px)": {
    //             flexDirection: "column",
    //             alignItems: "flex-start",
    //           },
    //         }}
    //       >
    //         <img
    //           src={
    //             job.company_logo ||
    //             "https://static.thenounproject.com/png/3198584-200.png"
    //           }
    //           alt={job.company_name}
    //           style={{
    //             width: "70px",
    //             height: "70px",
    //             objectFit: "cover",
    //             borderRadius: "50%",
    //             marginRight: "1rem",
    //             border: "1px solid #eee",
    //             "@media (maxWidth: 768px)": {
    //               marginBottom: "1rem",
    //               marginRight: "0",
    //             },
    //           }}
    //         />
    //         <div>
    //           <p
    //             style={{
    //               marginBottom: "0.25rem",
    //               fontSize: "1.1rem",
    //               color: "#34495e",
    //             }}
    //           >
    //             <strong>Company:</strong> {job.company_name}
    //           </p>
    //           <span style={statusBadgeStyle}>
    //             {job.status === "1" ? "Open" : "Closed"}
    //           </span>
    //         </div>
    //       </div>
    //     </div>

    //     {/* Details Grid */}
    //     <div className="row g-4">
    //       <div className="col-md-6">
    //         <div style={detailItemStyle}>
    //           <i className="bi bi-geo-alt-fill" style={iconStyle}></i>
    //           <div>
    //             <strong>Location:</strong> {job.location}
    //           </div>
    //         </div>

    //         {job.keywords && job.keywords.length > 0 && (
    //           <div style={detailItemStyle}>
    //             <i className="bi bi-tools" style={iconStyle}></i>
    //             <div>
    //               <strong>Skills:</strong> {job.keywords.join(", ")}
    //             </div>
    //           </div>
    //         )}

    //         <div style={detailItemStyle}>
    //           <i className="bi bi-briefcase-fill" style={iconStyle}></i>
    //           <div>
    //             <strong>Experience:</strong> {job.experience || "Not specified"}
    //           </div>
    //         </div>
    //       </div>

    //       <div className="col-md-6">
    //         <div style={detailItemStyle}>
    //           <i className="bi bi-file-earmark-text-fill" style={iconStyle}></i>
    //           <div>
    //             <strong>Job Type:</strong> {job.type_of_job}
    //           </div>
    //         </div>

    //         <div style={detailItemStyle}>
    //           <i className="bi bi-building" style={iconStyle}></i>
    //           <div>
    //             <strong>Attendance:</strong> {job.attend}
    //           </div>
    //         </div>

    //         <div style={detailItemStyle}>
    //           <i className="bi bi-calendar-check-fill" style={iconStyle}></i>
    //           <div>
    //             <strong>Posted:</strong> {job.posted_date || "Recently"}
    //           </div>
    //         </div>
    //       </div>
    //     </div>

    //     {/* Description Section */}
    //     <div style={{ marginBottom: "1.5rem" }}>
    //       <h3
    //         style={{
    //           fontSize: "1.25rem",
    //           marginBottom: "0.75rem",
    //           color: "#2c3e50",
    //         }}
    //       >
    //         Job Description
    //       </h3>
    //       <div
    //         style={{
    //           lineHeight: "1.6",
    //           color: "#4a4a4a",
    //           whiteSpace: "pre-line",
    //         }}
    //       >
    //         {job.description}
    //       </div>
    //     </div>

    //     {/* Action Buttons */}
    //     {/* <div style={{
    //       display: 'flex',
    //       gap: '0.75rem',
    //       marginTop: '2.5rem'
    //     }}>
    //       <button className="btn btn-primary px-4 py-2">
    //         Apply Now
    //       </button>
    //       <button className="btn btn-outline-secondary px-4 py-2">
    //         Save Job
    //       </button>
    //     </div> */}
    //   </div>
    // </div>
  );
}
export default JobDetails;
