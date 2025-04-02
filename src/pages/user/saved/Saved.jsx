import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import JobCard from "../../../components/job/JobCard";
import { useQuery } from "@tanstack/react-query";
import { getAllJobs } from "../../../services/Job";
import { getApplicationsByUser } from "../../../services/Application";
import { userContext } from "../../../context/UserContext";

function UserSaved() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const {user} = useContext(userContext)
  
  const [filters, setFilters] = useState({
    user: "",
    job: "",
    status: "",
  });

  const [searchFilters, setSearchFilters] = useState({
    user: `${user.id}`,
    job: "",
    status: "1",
  });

  const {
    data: saved,
    error: savedError,
    isLoading: savedLoading,
    refetch,
  } = useQuery({
    queryKey: ["saved", page, pageSize, searchFilters],
    queryFn: async () => {
      const res = await getApplicationsByUser({ filters: searchFilters, page, pageSize });
      console.log(res)
      setTotal(res.count);
      return res.results;
    },
  });

  const handleChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSearch = () => {
    setSearchFilters(filters); // Update search filters
    setPage(1); // Reset to first page
    refetch(); // Fetch with new filters
  };

  const handleReset = () => {
    setFilters({ user: "", job: "", status: "" });
    setSearchFilters({ user: "", job: "", status: "" });
    setPage(1); // Reset page
    refetch(); // Fetch without filters
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center w-100">
      <h2>Your Saved Jobs</h2>
      {/* <div className="filters mb-3 d-flex flex-column align-items-center gap-2">
        <div className="d-flex gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="User"
            name="user"
            value={filters.user}
            onChange={handleChange}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Job"
            name="job"
            value={filters.job}
            onChange={handleChange}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Status"
            name="status"
            value={filters.status}
            onChange={handleChange}
          />
        </div>
        <div className="d-flex gap-2">
          <button
            disabled={
              !(
                filters.user ||
                filters.job ||
                filters.status
              )
            }
            onClick={handleReset}
            className="btn btn-danger"
          >
            Reset
          </button>
          <button
            disabled={
              !(
                filters.user ||
                filters.job ||
                filters.status
              )
            }
            onClick={handleSearch}
            className="btn btn-primary"
          >
            Search
          </button>
        </div>
      </div> */}
      {console.log(saved)}
      {saved.length ? saved?.map((save) => (
        <JobCard key={save.id} job={save.job_details} user={"user"} type={"saved"} />
      )) : (
        <div style={{ minHeight: '50vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <h4>No Saved Jobs</h4>
        </div>
      )}
      <div className="d-flex justify-content-between w-100 mt-3">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className="btn btn-primary"
        >
          Previous
        </button>
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
        >
          {[10, 20, 30].map((size) => (
            <option key={size} value={size}>
              {size} per page
            </option>
          ))}
        </select>
        <button
          disabled={page * pageSize >= total}
          onClick={() => setPage((prev) => prev + 1)}
          className="btn btn-primary"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default UserSaved;

