// import { useNavigate } from "react-router";
// import ApplicantFooter from "./ApplicantFooter";
// import CompanyFooter from "./CompanyFooter";
// import { useContext } from "react";
// import { userContext } from "../../context/UserContext";

// function JobCard({ job, type }) {
//   // const keywords = job?.keywords?.join(" · ") || "";
//   const {user} = useContext(userContext)
//   const navigate = useNavigate();
//   return (
//     <div
//       className="job-card"
//       key={job.id}
//       style={{
//         width: "50%",
//         border: "1px solid #e1e9ee",
//         borderRadius: "8px",
//         boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//         padding: "16px",
//         marginBottom: "16px",
//         display: "flex",
//         flexDirection: "column",
//       }}
//     >
//       <div
//         style={{ cursor: "pointer" }}
//         onClick={() =>
//           user.user_type === "COMPANY"
//             ? navigate(`/company/jobs/${job.id}`)
//             : navigate(`/applicant/jobs/${job.id}`)
//         }
//       >
//         <div style={{ display: "flex", alignItems: "center" }}>
//           <img
//             src={
//               job.company_logo ||
//               "https://static.thenounproject.com/png/3198584-200.png"
//             }
//             alt={job.company_name}
//             style={{
//               width: "50px",
//               height: "50px",
//               borderRadius: "50%",
//               marginRight: "16px",
//             }}
//           />
//           <div style={{ maxWidth: "100%" }}>
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "8px",
//                 maxWidth: "50%",
//                 flexWrap: "wrap"
//               }}
//             >
//               <h2 style={{ fontSize: "18px", margin: "0" }}>{job.title} </h2>
//               <div style={{ display: "flex", alignItems: "center" }}>
//                 {job.type_of_job && (
//                   <div
//                     style={{
//                       backgroundColor: "#f5f5f5",
//                       padding: "1px 2px",
//                       marginRight: "8px",
//                       borderRadius: "4px",
//                       color: "#901b20"
//                     }}
//                   >
//                     {job.type_of_job}
//                   </div>
//                 )}
//                 {job.attend && (
//                   <div
//                     style={{
//                       backgroundColor: "#f5f5f5",
//                       padding: "1px 2px",
//                       marginRight: "8px",
//                       borderRadius: "4px",
//                       color: "#901b20"
//                     }}
//                   >
//                     {job.attend}
//                   </div>
//                 )}
//               </div>
//             </div>

//             <p style={{ margin: "4px 0", color: "#666" }}>
//               {job.company_name} - {job.location}
//             </p>
//           </div>
//         </div>
//         <p
//           style={{
//             margin: "16px 0 8px",
//             color: "#333",
//             flexGrow: 1,
//             overflow: "hidden",
//             textOverflow: "ellipsis",
//             display: "-webkit-box",
//             WebkitLineClamp: 5,
//             lineClamp: 5,
//             WebkitBoxOrient: "vertical",
//           }}
//         >
//           {job.description}
//         </p>
//       </div>
//       {/* <p style={{ color: "#666" }}>{keywords}</p> */}
//       {/* {user === "company" ? <CompanyFooter /> : <ApplicantFooter type={type} job_id={job.id}/>} */}
//     </div>
//   );
// }

// export default JobCard;


import { useNavigate } from "react-router";
import ApplicantFooter from "./ApplicantFooter";
import CompanyFooter from "./CompanyFooter";
import { useContext, useState } from "react";
import { userContext } from "../../context/UserContext";

function JobCard({ job, type }) {
  const { user } = useContext(userContext);
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Calculate time since posting for freshness indicator
  const timeSincePosting = (job) => {
    const postedDate = new Date(job.created_at);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate - postedDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    console.log("postedDate",postedDate)
    const day = `0${postedDate.getDate()}`.slice(-2);
    const month = `0${postedDate.getMonth()+1}`.slice(-2);
    const year = postedDate.getFullYear();
    console.log(diffDays) 
    console.log(`${day}/${month}/${year}`)
    return `${day}/${month}/${year}`;
  };

  return (
    <article
      className="job-card"
      key={job.id}
      style={{
        width: "100%",
        maxWidth: "680px",
        border: "1px solid #e0e6ed",
        borderRadius: "16px",
        padding: "24px",
        marginBottom: "24px",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fff",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: isHovered 
          ? "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.04)"
          : "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
        transform: isHovered ? "translateY(-4px)" : "translateY(0)",
        position: "relative",
        overflow: "hidden"
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-labelledby={`job-title-${job.id}`}
    >
      {/* Freshness indicator ribbon
      {job.created_at && (
        <div style={{
          position: "absolute",
          top: "16px",
          right: "-30px",
          backgroundColor: "#4f46e5",
          color: "white",
          padding: "4px 32px",
          transform: "rotate(45deg)",
          fontSize: "12px",
          fontWeight: 600,
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          zIndex: 1
        }}>
          {/* {timeSincePosting(job.created_at)} */}
        {/* </div>
      )} */} 

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div
          style={{ 
            cursor: "pointer",
            flexGrow: 1,
            paddingRight: "16px"
          }}
          onClick={() =>
            user.user_type === "COMPANY"
              ? navigate(`/company/jobs/${job.id}`)
              : navigate(`/applicant/jobs/${job.id}`)
          }
        >
          <div style={{ 
            display: "flex", 
            alignItems: "flex-start",
            gap: "16px",
            marginBottom: "16px"
          }}>
            <div style={{
              width: "64px",
              height: "64px",
              borderRadius: "12px",
              backgroundColor: "#f9fafb",
              border: "1px solid #f0f0f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              flexShrink: 0
            }}>
              <img
                src={
                  job.company_logo ||
                  "https://static.thenounproject.com/png/3198584-200.png"
                }
                alt={job.company_name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  padding: job.company_logo ? "0" : "8px"
                }}
              />
            </div>
            
            <div style={{ flex: 1 }}>
              <div style={{ 
                display: "flex", 
                flexWrap: "wrap",
                alignItems: "center",
                gap: "8px",
                marginBottom: "8px"
              }}>
                <h2 
                  id={`job-title-${job.id}`}
                  style={{ 
                    fontSize: "20px", 
                    margin: 0,
                    fontWeight: 700,
                    color: "#111827",
                    lineHeight: 1.3
                  }}
                >
                  {job.title}
                </h2>
                
                <div style={{ 
                  display: "flex", 
                  alignItems: "center",
                  gap: "8px",
                  flexWrap: "wrap"
                }}>
                  {job.type_of_job && (
                    <div
                      style={{
                        backgroundColor: "#eef2ff",
                        padding: "6px 10px",
                        borderRadius: "6px",
                        color: "#4f46e5",
                        fontSize: "13px",
                        fontWeight: 600,
                        whiteSpace: "nowrap"
                      }}
                    >
                      {job.type_of_job}
                    </div>
                  )}
                  {job.attend && (
                    <div
                      style={{
                        backgroundColor: "#ecfdf5",
                        padding: "6px 10px",
                        borderRadius: "6px",
                        color: "#059669",
                        fontSize: "13px",
                        fontWeight: 600,
                        whiteSpace: "nowrap"
                      }}
                    >
                      {job.attend}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 21V5C19 3.89543 18.1046 3 17 3H7C5.89543 3 5 3.89543 5 5V21M19 21L21 21M19 21H14M5 21L3 21M5 21H10M9 6.99998H10M9 11H10M14 6.99998H15M14 11H15M10 21V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V21M10 21H14" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span style={{ 
                    color: "#4b5563",
                    fontSize: "14px",
                    fontWeight: 500
                  }}>
                    {job.company_name}
                  </span>
                </div>
                
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12C13.1046 12 14 11.1046 14 10C14 8.89543 13.1046 8 12 8C10.8954 8 10 8.89543 10 10C10 11.1046 10.8954 12 12 12Z" stroke="#6b7280" strokeWidth="1.5"/>
                    <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" stroke="#6b7280" strokeWidth="1.5"/>
                  </svg>
                  <span style={{ 
                    color: "#4b5563",
                    fontSize: "14px",
                    fontWeight: 500
                  }}>
                    {job.location}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div style={{ 
            position: "relative",
            margin: "16px 0"
          }}>
            <h3 style={{
              margin: "0 0 8px 0",
              color: "#374151",
              fontSize: "16px",
              fontWeight: 600
            }}>
              Job Description
            </h3>
            <p
              style={{
                margin: 0,
                color: "#4b5563",
                fontSize: "15px",
                lineHeight: "1.6",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                lineClamp: 3,
                WebkitBoxOrient: "vertical",
              }}
            >
              {job.description}
            </p>
            <div style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "32px",
              background: "linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1))",
              pointerEvents: "none"
            }}></div>
          </div>
        </div>
        
        {/* Bookmark button */}
        <button 
          onClick={() => setIsBookmarked(!isBookmarked)}
          aria-label={isBookmarked ? "Remove bookmark" : "Bookmark this job"}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
            transition: "all 0.2s",
            flexShrink: 0,
            alignSelf: "flex-start",
            ":hover": {
              backgroundColor: "#f3f4f6"
            }
          }}
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill={isBookmarked ? "#4f46e5" : "none"} 
            stroke={isBookmarked ? "#4f46e5" : "#9ca3af"} 
            strokeWidth="2"
          >
            <path d="M5 5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V21L12 17L5 21V5Z" />
          </svg>
        </button>
      </div>
      
      <div style={{ 
        display: "flex", 
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: "20px",
        paddingTop: "20px",
        borderTop: "1px solid #f3f4f6",
        flexWrap: "wrap",
        gap: "12px"
      }}>
        <div style={{ 
          display: "flex",
          gap: "8px",
          flexWrap: "wrap"
        }}>
        </div>
        
        <div style={{ 
          display: "flex",
          gap: "12px",
          alignItems: "center"
        }}>
          {job.created_at && (
            <span style={{
              color: "#9ca3af",
              fontSize: "13px",
              whiteSpace: "nowrap"
            }}>
              {/* Posted {timeSincePosting(job.created_at)} ago */}
            </span>
          )}
          
          {user.user_type !== "COMPANY" && (
  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
    {job.created_at && (
      <span style={{
        color: "#9ca3af",
        fontSize: "13px",
        whiteSpace: "nowrap"
      }}>
        {/* Posted {timeSincePosting(job.created_at)} ago */}
      </span>
    )}
    <button
      onClick={() => navigate(`/applicant/jobs/${job.id}`)}
      style={{
        background: "none",
        border: "1px solid #e5e7eb",
        padding: "8px 16px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        color: "#4f46e5",
        transition: "all 0.2s",
        borderRadius: "8px",
        fontWeight: 600,
        fontSize: "14px",
        ":hover": {
          backgroundColor: "#f5f3ff",
          borderColor: "#c7d2fe"
        }
      }}
      aria-label="Apply for this job"
    >
      <span>Apply Now</span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 12H19M19 12L12 5M19 12L12 19" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"/>
      </svg>
    </button>
  </div>
  )}
        </div>
      </div>
    </article>
  );
}

export default JobCard;