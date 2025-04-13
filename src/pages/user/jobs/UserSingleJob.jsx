import React, { useEffect, useState, useRef, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
// import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import ProcessColumn from "../../../components/companyProcess/ProcessColumn";
import JobDetails from "../../../components/job/JobDetails";
import { Box, Button } from "@mui/material";
import ApplicationForm from "./ApplicationForm";
// import PhasesSwitcher from '../../../components/job/PhasesSwitcher';
import Meeting from "../../../components/job/user/Meeting";
import { useQuery } from "@tanstack/react-query";
import {
  createApplication,
  getApplicationsByUser,
} from "../../../services/Application";
import { userContext } from "../../../context/UserContext";
import { getJobById } from "../../../services/Job";
const UserSingleJob = () => {
  const { jobId } = useParams();
  const { user } = useContext(userContext);
  const navigate = useNavigate();
  const [userJob, setUserJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clickedColumn, setClickedColumn] = useState(1);
  // const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [apply, setApply] = useState(false);

  const [searchFilters, setSearchFilters] = useState({
    user: `${user?.id}`,
    job: `${jobId}` || null,
  });

  const formRef = useRef(null);

  const phases = [
    "Application",
    "Technical Assessment",
    "Technical Interview",
    "Hr Interview",
    "Offer",
  ];

  async function handleClick() {
    try {
      const application = {
        user: `${user.id}`,
        job: `${jobId}`,
        status: `1`,
      };
      const res = await createApplication(application);
      console.log(res);
      userAppRefetch();
    } catch (error) {
      alert('Complete your profile before applying!')
      console.error("Error creating application:", error);
    }
  }

  const {
    data: userApp,
    error: userAppError,
    isLoading: userAppLoading,
    refetch: userAppRefetch,
  } = useQuery({
    queryKey: ["userApp"],
    queryFn: async () => {
      // console.log({ filters: searchFilters, page, pageSize })
      const res = await getApplicationsByUser({
        filters: searchFilters,
        page,
        pageSize,
      });
      // console.log(res)
      setTotal(res.count);
      return res.results[0] || {};
    },
  });
  // console.log(userApp)
  const {
    data: jobsData,
    error: jobsError,
    isLoading: jobsLoading,
  } = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const res = await getJobById(jobId);
      // console.log(res);
      return res;
    },
  });

  if (jobsLoading || userAppLoading)
    return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container mt-2 d-flex flex-column justify-content-center align-items-center">
      <JobDetails job={userApp?.job_details || jobsData} />
      {userApp && Object.keys(userApp).length !== 0 ? (
        <>
          <ProcessColumn
            setter={setClickedColumn}
            column={clickedColumn}
            phases={phases}
          />
          <div
            style={{
              minHeight: "30vh",
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            {clickedColumn === 1 && (
              <ApplicationForm
                questions={userApp?.job_details?.questions}
                answers={userApp?.answers}
                application={userApp}
                refetch={userAppRefetch}
              />
            )}
            {clickedColumn > 1 && (
              <Meeting
                phase={phases[clickedColumn - 1]}
                applicationData={userApp}
                clickedColumn={clickedColumn}
              />
            )}
          </div>
        </>
      ) : (
        <>
          <button
            className="btn mt-2"
            style={{
              width: "fit-content",
              backgroundColor: jobsData?.status === "0" ? "red" : "#28a745",
              color: "white",
            }}
            onClick={() => handleClick()}
            disabled={jobsData?.status === "0"}
          >
            {jobsData?.status === "0" ? "Job is Closed" : "Apply for this job!"}
          </button>
        </>
      )}
    </div>
  );
};

export default UserSingleJob;
