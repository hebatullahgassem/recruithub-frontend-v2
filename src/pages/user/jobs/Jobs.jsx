import React from "react";
import { Link } from "react-router-dom";

function UserJobs() {
   return (
    <div>
      <h2>Available Jobs</h2>
      <Link to="/applicant/applications/1">
        <button>Apply for a Job</button>
      </Link>
    </div>
  );
}

export default UserJobs