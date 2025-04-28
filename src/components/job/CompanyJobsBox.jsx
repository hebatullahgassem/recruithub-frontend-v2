import { useContext } from "react";
import { userContext } from "../../context/UserContext";
import { Link } from "react-router";

const CompanyJobsBox = ({ profileData, job }) => {
  const { isLight } = useContext(userContext);
  console.log("profileData",profileData);
  const textColor = isLight ? "#121212" : "#fff";
  const style = {
    card: {
      backgroundColor: isLight ? "#fff" : "#121212",
      color: textColor,
      padding: "0.5rem",
      borderRadius: "0.75rem",
      //   margin: "auto",
      width: "100%",
      maxHeight: "fit-content",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    button: {
      background: "transparent",
      border: `2px solid ${textColor}`,
      color: textColor,
      padding: "0.5rem 1rem",
      borderRadius: "0.5rem",
      cursor: "pointer",
      transition: "background 0.3s, color 0.3s",
    },
    icon: { fill: textColor, width: "24px", height: "24px" },
  };

  console.log(job);
  return (
    <div style={style.card} className="mt-2 rounded-lg p-4">
      <div>
        <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", color: textColor }}>
          {profileData?.name} Jobs
        </h1>
        {/* <p style={{ fontSize: "1rem", color: textColor }}>{profileData?.est}</p> */}
      </div>
      {job && job?.map((job) => (
        <div key={job.id} >
          <Link to={`/applicant/jobs/${job.id}`} style={{ fontSize: "1rem", cursor: "pointer", color: 'blue' }} className="m-0 p-0">
            {job.title}
          </Link>
        </div>
      ))}
    </div>
  );
};

export default CompanyJobsBox;
