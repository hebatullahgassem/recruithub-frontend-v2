function JobDetails() {
  const dummyJob = {
    id: "1",
    title: "Backend Developer",
    description:
      "We are looking for a highly skilled and experienced backend developer to join our team. The ideal candidate should have experience in developing scalable and secure backend applications",
    location: "New York, NY",
    keywords: ["Node.js", "Express", "MongoDB", "JavaScript"],
    experience: "3-5 years",
    status: "Available",
    type_of_job: "Full-time",
    created_at: "2022-11-16T14:30:00.000Z",

    workStyle: "Onsite",
    companyName: "Vois",
    companyLogo:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhO-fRJWu5psjEYHnr8-cuBso-97hktHGIRwBXmSiDHN8w8-FX8G4eemvPvt6kgan2kTc&usqp=CAU",
  };
  return (
    
      <div className="mt-4" style={{maxWidth:'100vw'}}>
        <div className="card p-4 shadow-sm">
          <h2 className="text-primary">{dummyJob.title}</h2>
          <div className="d-flex align-items-center mt-1">
            <img
              src={dummyJob.companyLogo}
              alt={dummyJob.companyName}
              className="rounded-circle me-3"
              style={{ width: "60px", height: "60px", objectFit: "cover" }}
            />
            <p className="mb-0">
              <strong>Company:</strong> {dummyJob.companyName}
            </p>
          </div>
          <p className="text-muted">{dummyJob.description}</p>

          <div className="row">
            <div className="col-md-6">
              <p>
                <strong>Location:</strong> {dummyJob.location}
              </p>
              <p>
                <strong>Skills:</strong> {dummyJob.keywords.join(", ")}
              </p>
              <p>
                <strong>Experience:</strong> {dummyJob.experience}
              </p>
            </div>
            <div className="col-md-6">
              <p>
                <strong>Status:</strong> {dummyJob.status}
              </p>
              <p>
                <strong>Type of Job:</strong> {dummyJob.type_of_job}
              </p>
              <p>
                <strong>Work Style:</strong> {dummyJob.workStyle}
              </p>
            </div>
          </div>
        </div>
      </div>
  );
}

export default JobDetails;
