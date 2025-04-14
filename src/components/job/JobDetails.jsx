function JobDetails({ job }) {
  console.log(job);
  if (!job) return null;

  // Status badge style
  const statusBadgeStyle = {
    display: 'inline-block',
    padding: '0.25rem 0.75rem',
    borderRadius: '1rem',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: 'white',
    background: job.status === "1" ? '#2ecc71' : '#e74c3c'
  };

  // Detail item style
  const detailItemStyle = {
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem'
  };

  // Icon style
  const iconStyle = {
    color: '#7f8c8d',
    fontSize: '1.1rem',
    marginTop: '0.2rem'
  };

  return (
    <div className="mt-4" style={{ 
      maxWidth: '100vw', 
      minWidth: '50vw',
      '@media (maxWidth: 768px)': {
        minWidth: '100%'
      }
    }}>
      <div className="card p-4 shadow-sm border-0">
        {/* Header Section */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ 
            fontWeight: '700', 
            color: '#2c3e50',
            marginBottom: '1rem'
          }}>
            {job.title}
          </h2>
          
          {/* Company Info */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '1.5rem',
            '@media (maxWidth: 768px)': {
              flexDirection: 'column',
              alignItems: 'flex-start'
            }
          }}>
            <img
              src={job.company_logo || 'https://static.thenounproject.com/png/3198584-200.png'}
              alt={job.company_name}
              style={{ 
                width: "70px", 
                height: "70px", 
                objectFit: "cover",
                borderRadius: '50%',
                marginRight: '1rem',
                border: '1px solid #eee',
                '@media (maxWidth: 768px)': {
                  marginBottom: '1rem',
                  marginRight: '0'
                }
              }}
            />
            <div>
              <p style={{ 
                marginBottom: '0.25rem', 
                fontSize: '1.1rem', 
                color: '#34495e' 
              }}>
                <strong>Company:</strong> {job.company_name}
              </p>
              <span style={statusBadgeStyle}>
                {job.status === "1" ? 'Open' : 'Closed'}
              </span>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ 
            fontSize: '1.25rem',
            marginBottom: '0.75rem',
            color: '#2c3e50'
          }}>
            Job Description
          </h3>
          <div style={{ 
            lineHeight: '1.6', 
            color: '#4a4a4a',
            whiteSpace: 'pre-line'
          }}>
            {job.description}
          </div>
        </div>

        {/* Details Grid */}
        <div className="row g-4">
          <div className="col-md-6">
            <div style={detailItemStyle}>
              <i className="bi bi-geo-alt-fill" style={iconStyle}></i>
              <div>
                <strong>Location:</strong> {job.location}
              </div>
            </div>
            
            {job.keywords && job.keywords.length > 0 && (
              <div style={detailItemStyle}>
                <i className="bi bi-tools" style={iconStyle}></i>
                <div>
                  <strong>Skills:</strong> {job.keywords.join(", ")}
                </div>
              </div>
            )}
            
            <div style={detailItemStyle}>
              <i className="bi bi-briefcase-fill" style={iconStyle}></i>
              <div>
                <strong>Experience:</strong> {job.experience || 'Not specified'}
              </div>
            </div>
          </div>
          
          <div className="col-md-6">
            <div style={detailItemStyle}>
              <i className="bi bi-file-earmark-text-fill" style={iconStyle}></i>
              <div>
                <strong>Job Type:</strong> {job.type_of_job}
              </div>
            </div>
            
            <div style={detailItemStyle}>
              <i className="bi bi-building" style={iconStyle}></i>
              <div>
                <strong>Attendance:</strong> {job.attend}
              </div>
            </div>
            
            <div style={detailItemStyle}>
              <i className="bi bi-calendar-check-fill" style={iconStyle}></i>
              <div>
                <strong>Posted:</strong> {job.posted_date || 'Recently'}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {/* <div style={{ 
          display: 'flex',
          gap: '0.75rem',
          marginTop: '2.5rem'
        }}>
          <button className="btn btn-primary px-4 py-2">
            Apply Now
          </button>
          <button className="btn btn-outline-secondary px-4 py-2">
            Save Job
          </button>
        </div> */}
      </div>
    </div>
  );
}
// export default JobDetails;






















// function JobDetails({ job }) {
//   console.log(job);
//   if(job) return (
//       <div className="mt-4" style={{maxWidth:'100vw', minWidth:'50vw'}}>
//         <div className="card p-4 shadow-sm">
//           <h2 className="text-primary">{job.title}</h2>
//           <div className="d-flex align-items-center mt-1">
//             <img
//               src={job.company_logo || 'https://static.thenounproject.com/png/3198584-200.png'}
//               alt={job.company_name}
//               className="rounded-circle me-3"
//               style={{ width: "60px", height: "60px", objectFit: "cover" }}
//             />
//             <p className="mb-0">
//               <strong>Company:</strong> {job.company_name}
//             </p>
//           </div>
//           <p><strong>Description: </strong>{job.description}</p>

//           <div className="row">
//             <div className="col-md-6">
//               <p>
//                 <strong>Location:</strong> {job.location}
//               </p>
//               <p>
//                 {/* <strong>Skills:</strong> {job.keywords.join(", ")} */}
//               </p>
//               <p>
//                 <strong>Experience:</strong> {job.experince}
//               </p>
//             </div>
//             <div className="col-md-6">
//               <p style={{ color: job.status === "1" ? "black" : "red" }}>
//                 <strong>Status:</strong> {job.status === "1" ? "Open" : "Closed"}
//               </p>
//               <p>
//                 <strong>Type of Job:</strong> {job.type_of_job}
//               </p>
//               <p>
//                 <strong>Attendance Style:</strong> {job.attend}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//   );
// }

export default JobDetails;
