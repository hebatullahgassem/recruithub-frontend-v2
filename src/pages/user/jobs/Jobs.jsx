import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import JobCard from "../../../components/job/JobCard";
import { useQuery } from "@tanstack/react-query";
import { getAllJobs } from "../../../services/Job";

function UserJobs() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const { data: jobs, error: jobError, isLoading: jobLoading } = useQuery({
    queryKey: ["jobs", page, pageSize],
    queryFn: async () => {
      const res = await getAllJobs({ page, pageSize });
      console.log(pageSize);
      setTotal(res.data.count);
      return res.data.results;
    },
  });

  return (
    <div className="d-flex flex-column align-items-center justify-content-center w-100">
      <h2>Available Jobs</h2>
      {jobs?.map((job) => (
        <JobCard key={job.id} job={job} user={"user"} />
      ))}
      <div className="d-flex justify-content-between w-100 mt-3">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </button>
        <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
          {[10, 20, 30].map((size) => (
            <option key={size} value={size}>
              {size} per page
            </option>
          ))}
        </select>
        <button
          disabled={page * pageSize >= total}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default UserJobs;
