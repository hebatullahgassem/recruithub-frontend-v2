import { Navigate, useNavigate, useParams } from "react-router";
import ProcessColumn from "../../../components/companyProcess/ProcessColumn";
import ProcessCard from "../../../components/companyProcess/ProcessCard";
import { useContext, useEffect, useState } from "react";
import JobDetails from "../../../components/job/JobDetails";
import { useQuery } from "@tanstack/react-query";
import { getJobById, patchJob } from "../../../services/Job";
import { Button } from "@mui/material";
import { userContext } from "../../../context/UserContext";
import MeetingsTable from "../../../components/companyProcess/MeetingsTable";

function SingleJob() {
  const phases = [
    "Applied",
    "Technical Assessment",
    "Technical Interview",
    "Hr Interview",
    "Offer",
  ];
  const { id } = useParams();
  const [clickedColumn, setClickedColumn] = useState(1);
  const [calender, setCalender] = useState(false);
  const { user } = useContext(userContext);
  const navigate = useNavigate();

  const handleActivation = async (state) => {
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
  };

  const {
    data: jobData,
    error: jobError,
    isLoading: jobLoading,
    refetch,
  } = useQuery({
    queryKey: ["job", id],
    queryFn: async () => {
      const res = await getJobById(id);
      console.log(res);
      return res;
    },
  });
  // useEffect(() => {
  //   if (!user) return;
  //   if(!jobData) return;
  //   console.log(user, jobData)

  //   if (user.user_type !== "COMPANY" || (jobData && parseInt(user.id) != jobData.company)) {
  //     navigate("/company/jobs");
  //   }
  // }, [user, jobData]);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        maxWidth: "100vw",
      }}
    >
      <JobDetails job={jobData} />
      <div>
        {jobData?.status == 1 ? (
          <Button
            variant="contained"
            color="error"
            onClick={() => handleActivation(0)}
            style={{ marginTop: "10px" }}
          >
            Daectivate Job
          </Button>
        ) : (
          <Button
            variant="contained"
            color="success"
            onClick={() => handleActivation(1)}
            style={{ marginTop: "10px", marginLeft: "10px" }}
          >
            Activate Job
          </Button>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/company/jobEdit/" + id)}
          style={{ marginTop: "10px", marginLeft: "10px" }}
        >
          Edit Job
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setCalender(!calender)}
          style={{ marginTop: "10px", marginLeft: "10px" }}
        >
          {calender ? "Hide Calender" : "Show Calender"}
        </Button>
      </div>
      {!calender ? (
        <>
          <ProcessColumn
            setter={setClickedColumn}
            column={clickedColumn}
            phases={phases}
          />
          <ProcessCard column={clickedColumn} phases={phases} job={jobData} />
        </>
      ) : (
        <>
          <ProcessColumn
            setter={setClickedColumn}
            column={clickedColumn}
            phases={phases.slice(2, 5)}
          />
          <MeetingsTable column={clickedColumn} phases={phases.slice(2,5)} />
        </>
      )}
    </div>
  );
}

export default SingleJob;
