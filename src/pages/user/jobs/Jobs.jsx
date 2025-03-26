import React from "react";
import { Link } from "react-router-dom";
import JobCard from "../../../components/job/JobCard";

function UserJobs() {
   return (
    <div className="d-flex flex-column align-items-center justify-content-center w-100">
      <h2>Available Jobs</h2>
      <JobCard job={{
            _id: '1',
            title: 'Software Engineer',
            companyName: 'Vois',
            type: 'Full-time',
            workStyle: 'Onsite',
            location: 'New York, NY',
            companyLogo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhO-fRJWu5psjEYHnr8-cuBso-97hktHGIRwBXmSiDHN8w8-FX8G4eemvPvt6kgan2kTc&usqp=CAU',
            description: 'Develop and maintain web applications.',
            keywords: ['JavaScript', 'React', 'Node.js'],
        }} user={"user"}/>
    </div>
  );
}

export default UserJobs