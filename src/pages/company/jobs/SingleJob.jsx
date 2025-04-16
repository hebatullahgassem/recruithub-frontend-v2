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
import CalenderSwitcher from "../../../components/companyProcess/CalenderSwitcher";

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
  useEffect(() => {
    if (!user) return;
    if (!jobData) return;
    console.log(user, jobData);

    if (
      user.user_type !== "COMPANY" ||
      (jobData && parseInt(user.id) != jobData.company)
    ) {
      navigate("/company/jobs");
    }
  }, [user, jobData]);
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
      <JobDetails job={jobData} refetch={refetch} />
      <div
        style={{
          border: "1px solid #e3cdcd",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor:'white',
          marginTop:'10px',
          padding:'20px',
          minWidth:'80vw',
          maxWidth:'100vw'
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: "5px",
            // marginTop: "10px",
            minWidth: "fit-content",
          }}
        >
          <h5>Applicants Table</h5>
          <CalenderSwitcher setCalender={setCalender} calender={calender} />
          <h5>Meetings Table</h5>
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
            <MeetingsTable column={clickedColumn} phases={phases.slice(2, 5)} />
          </>
        )}
      </div>
    </div>
  );
}

export default SingleJob;
