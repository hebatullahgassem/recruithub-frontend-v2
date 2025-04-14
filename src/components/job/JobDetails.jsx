// function JobDetails({ job }) {
//   console.log(job);
//      if(job) return (
//     <div className="mt-4 job-details-container" style={{ maxWidth: '100vw', minWidth: '50vw' }}>
//       <div className="card p-4 shadow-sm border-0">
//         {/* Header Section */}
//         <div className="mb-4">
//           <h2 className="text-dark mb-3" style={{ fontWeight: '700', color: '#2c3e50' }}>{job.title}</h2>
          
//           {/* Company Info */}
//           <div className="d-flex align-items-center mb-4">
//             <img
//               src={job.company_logo || 'https://static.thenounproject.com/png/3198584-200.png'}
//               alt={job.company_name}
//               className="rounded-circle me-3 border"
//               style={{ 
//                 width: "70px", 
//                 height: "70px", 
//                 objectFit: "cover",
//                 border: '1px solid #eee !important'
//               }}
//             />
//             <div>
//               <p className="mb-1" style={{ fontSize: '1.1rem', color: '#34495e' }}>
//                 <strong>Company:</strong> {job.company_name}
//               </p>
//               <span className={`status-badge ${statusClass}`}>
//                 {statusText}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Description Section */}
//         <div className="mb-4">
//           <h3 className="h5 mb-3" style={{ color: '#2c3e50' }}>Job Description</h3>
//           <div className="job-description" style={{ lineHeight: '1.6', color: '#4a4a4a' }}>
//             {job.description}
//           </div>
//         </div>

//         {/* Details Grid */}
//         <div className="row g-4">
//           <div className="col-md-6">
//             <div className="detail-item">
//               <i className="bi bi-geo-alt-fill"></i>
//               <div>
//                 <strong>Location:</strong> {job.location}
//               </div>
//             </div>
            
//             {job.keywords && job.keywords.length > 0 && (
//               <div className="detail-item">
//                 <i className="bi bi-tools"></i>
//                 <div>
//                   <strong>Skills:</strong> {job.keywords.join(", ")}
//                 </div>
//               </div>
//             )}
            
//             <div className="detail-item">
//               <i className="bi bi-briefcase-fill"></i>
//               <div>
//                 <strong>Experience:</strong> {job.experience || 'Not specified'}
//               </div>
//             </div>
//           </div>
          
//           <div className="col-md-6">
//             <div className="detail-item">
//               <i className="bi bi-file-earmark-text-fill"></i>
//               <div>
//                 <strong>Job Type:</strong> {job.type_of_job}
//               </div>
//             </div>
            
//             <div className="detail-item">
//               <i className="bi bi-building"></i>
//               <div>
//                 <strong>Attendance:</strong> {job.attend}
//               </div>
//             </div>
            
//             <div className="detail-item">
//               <i className="bi bi-calendar-check-fill"></i>
//               <div>
//                 <strong>Posted:</strong> {job.posted_date || 'Recently'}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="d-flex gap-3 mt-5">
//           <button className="btn btn-primary px-4 py-2">
//             Apply Now
//           </button>
//           <button className="btn btn-outline-secondary px-4 py-2">
//             Save Job
//           </button>
//         </div>
//       </div>

//       {/* CSS Styles */}
//       <style jsx>{`
//         .job-description {
//           white-space: pre-line;
//         }
//         .detail-item {
//           margin-bottom: 1rem;
//           display: flex;
//           align-items: flex-start;
//           gap: 0.75rem;
//         }
//         .detail-item i {
//           color: #7f8c8d;
//           font-size: 1.1rem;
//           margin-top: 0.2rem;
//         }
//         .status-badge {
//           display: inline-block;
//           padding: 0.25rem 0.75rem;
//           border-radius: 1rem;
//           font-size: 0.85rem;
//           font-weight: 600;
//         }
//         .status-open {
//           background: #2ecc71;
//           color: white;
//         }
//         .status-closed {
//           background: #e74c3c;
//           color: white;
//         }
//         @media (max-width: 768px) {
//           .job-details-container {
//             min-width: 100% !important;
//           }
//           .d-flex.align-items-center {
//             flex-direction: column;
//             align-items: flex-start !important;
//           }
//           .d-flex.align-items-center img {
//             margin-bottom: 1rem;
//             margin-right: 0 !important;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }

// export default JobDetails;






















function JobDetails({ job }) {
  console.log(job);
  if(job) return (
      <div className="mt-4" style={{maxWidth:'100vw', minWidth:'50vw'}}>
        <div className="card p-4 shadow-sm">
          <h2 className="text-primary">{job.title}</h2>
          <div className="d-flex align-items-center mt-1">
            <img
              src={job.company_logo || 'https://static.thenounproject.com/png/3198584-200.png'}
              alt={job.company_name}
              className="rounded-circle me-3"
              style={{ width: "60px", height: "60px", objectFit: "cover" }}
            />
            <p className="mb-0">
              <strong>Company:</strong> {job.company_name}
            </p>
          </div>
          <p><strong>Description: </strong>{job.description}</p>

          <div className="row">
            <div className="col-md-6">
              <p>
                <strong>Location:</strong> {job.location}
              </p>
              <p>
                {/* <strong>Skills:</strong> {job.keywords.join(", ")} */}
              </p>
              <p>
                <strong>Experience:</strong> {job.experince}
              </p>
            </div>
            <div className="col-md-6">
              <p style={{ color: job.status === "1" ? "black" : "red" }}>
                <strong>Status:</strong> {job.status === "1" ? "Open" : "Closed"}
              </p>
              <p>
                <strong>Type of Job:</strong> {job.type_of_job}
              </p>
              <p>
                <strong>Attendance Style:</strong> {job.attend}
              </p>
            </div>
          </div>
        </div>
      </div>
  );
}

export default JobDetails;
