import { Checkbox, Slider } from "@mui/material";
import ApplicantsTable from "./ApplicantsTable";
import { useContext, useState } from "react";
import {
  updateApplicationAts,
  updateApplicationCsv,
} from "../../services/Application";
import { userContext } from "../../context/UserContext";
import '../../ComponentsStyles/process_card.css';
import '../../styles/theme.css';
import { toast } from "react-hot-toast";
import { set } from "date-fns";
function ProcessCard({ column, phases, job }) {
  const [ats, setAts] = useState(50);
  const [fail, setFail] = useState(false);
  const [filters, setFilters] = useState(false);
  const [display, setDisplay] = useState(false);
  const [csvDisplay, setCsvDisplay] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [fetch, setFetch] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(userContext);
  const updateAts = async () => {
    if (
      !confirm(
        `Are you sure you want to send applicants with ATS score higher than ${ats}% to next phase?` +
          (fail
            ? `\nThis will also fail applicants with ATS score lower than ${ats}%.`
            : "")
      )
    ) {
      return;
    }
    setIsLoading(true);
    const data = {
      ats: ats,
      new_status: column + 2,
      fail: fail,
      old_status: column + 1,
      company: user.id,
      job: job.id,
    };
    const response = await updateApplicationAts(data);
    console.log(response);
    setAts(50);
    setFail(false);
    setFetch(fetch + 1);
    setDisplay(false);
    setIsLoading(false);
    toast.success(response.message);
  };
  const updateCsv = async () => {
    if (
      !confirm(
        `Are you sure you want to send applicants in the csv with score higher than ${ats}% to next phase?` +
          (fail
            ? `\nThis will also fail applicants in csv with score lower than ${ats}%.`
            : "")
      )
    ) {
      return;
    }
    setIsLoading(true);
    const dataForm = new FormData();
    dataForm.append("file", csvFile);
    dataForm.append("success", ats);
    dataForm.append("fail", fail);
    dataForm.append("new_status", column + 2);
    dataForm.append("old_status", column + 1);
    dataForm.append("company", user.id);
    dataForm.append("job", job.id);
    const response = await updateApplicationCsv(dataForm);
    console.log(response);
    setAts(50);
    setFail(false);
    setFetch(fetch + 1);
    setIsLoading(false);
    setCsvDisplay(false);
    toast.success(response.message);
  };
  //   const status = [
  //     "Applied",
  //     "Technical Assessment",
  //     "Technical Interview",
  //     "Hr Interview",
  //     "Offer",
  //   ];
  return (

    <div className="recruitment-card slide-in-up" style={{ padding: "1.5rem", margin: "1rem 0" }}>
      <div className="phase-header">
        <h1 className="phase-title">{phases[column - 1]}</h1>
        <div className="phase-actions">
          {column === 1 && filters && (
            <button className="btn-primary" onClick={() => setDisplay(!display)}>
              {display ? "Hide ATS Filter" : "Filter by ATS"}
            </button>
          )}
          {column !== 1 && filters && (
            <button className="btn-primary" onClick={() => setCsvDisplay(!csvDisplay)}>
              {csvDisplay ? "Hide CSV Filter" : "Filter by CSV"}
            </button>
          )}
        </div>
      </div>

      {column === 1 && filters && display && (
        <div className="filter-container slide-in-up">
          <h2 className="filter-title">Next Phase ATS Score</h2>

          <div className="filter-controls">
            <div className="slider-container">
              <Slider
                defaultValue={50}
                aria-label="Default"
                valueLabelDisplay="auto"
                onChange={(e) => {
                  setAts(e.target.value)
                }}
                sx={{
                  color: "#722732",
                  "& .MuiSlider-thumb": {
                    "&:hover, &.Mui-focusVisible": {
                      boxShadow: "0px 0px 0px 8px rgba(114, 39, 50, 0.16)",
                    },
                  },
                }}
              />
            </div>
            <div className="checkbox-container">
              <Checkbox
                checked={fail || false}
                onChange={(e) => setFail(e.target.checked)}
                sx={{
                  color: "#722732",
                  "&.Mui-checked": {
                    color: "#722732",
                  },
                }}
              />
              <label className="checkbox-label">Fail applicants under {ats}%</label>
            </div>
          </div>
          <button className="btn-primary" onClick={() => updateAts()} disabled={isLoading}>
            {isLoading ? "Updating..." : "Update"}
          </button>
        </div>
      )}

      {column !== 1 && filters && csvDisplay && (
        <div className="filter-container slide-in-up">
          <h2 className="filter-title">Next Phase CSV Score</h2>

          <div className="filter-controls">
            <div className="slider-container">
              <Slider
                defaultValue={50}
                aria-label="Default"
                valueLabelDisplay="auto"
                onChange={(e) => {
                  setAts(e.target.value)
                }}
                sx={{
                  color: "#722732",
                  "& .MuiSlider-thumb": {
                    "&:hover, &.Mui-focusVisible": {
                      boxShadow: "0px 0px 0px 8px rgba(114, 39, 50, 0.16)",
                    },
                  },
                }}
              />
            </div>
            <div className="checkbox-container">
              <Checkbox
                checked={fail || false}
                onChange={(e) => setFail(e.target.checked)}
                sx={{
                  color: "#722732",
                  "&.Mui-checked": {
                    color: "#722732",
                  },
                }}
              />
              <label className="checkbox-label">Fail applicants under {ats}%</label>
            </div>
            <div className="file-input-container">
              <input
                type="file"
                onChange={(e) => {
                  setCsvFile(e.target.files[0])
                }}
                accept=".csv, .xlsx, .xls"
                className="form-control"
              />
            </div>
          </div>
          <button className="btn-primary" onClick={() => updateCsv()} disabled={!csvFile || isLoading}>
            {isLoading ? "Updating..." : 'Update'}
          </button>
        </div>
      )}

      <ApplicantsTable phase={column} setFilters={setFilters} fetch={fetch}/>
    </div>


    // <div
    //   style={{
    //     display: "flex",
    //     flexDirection: "column",
    //     justifyContent: "center",
    //     alignItems: "center",
    //     maxWidth: "inherit",
    //   }}
    // >
    //   <div style={{ display: "flex", alignItems: "center" }}>
    //     <h1 style={{ fontSize: "2rem", margin: "1rem" }}>
    //       {phases[column - 1]}
    //     </h1>
    //     {column === 1 && filters && (
    //       <button
    //         className="btn btn-primary"
    //         onClick={() => setDisplay(!display)}
    //       >
    //         Filter by ats
    //       </button>
    //     )}
    //     {column != 1 && filters && (
    //       <button
    //         className="btn btn-primary"
    //         onClick={() => setCsvDisplay(!csvDisplay)}
    //       >
    //         Filter by CSV file
    //       </button>
    //     )}
    //   </div>
    //   {column === 1 && filters && display && (
    //     <div
    //       style={{
    //         width: "60%",
    //         display: "flex",
    //         flexDirection: "column",
    //         alignItems: "center",
    //         marginBottom: "1rem",
    //         maxWidth: "50vw",
    //         padding: "10px",
    //         flexWrap: "wrap",
    //         overflow: "hidden",
    //       }}
    //     >
    //       <h2 style={{ fontSize: "1.5rem" }}>Next Phase ATS Score</h2>

    //       <div style={{ display: "flex", alignItems: "center", gap: "5rem" }}>
    //         <Slider
    //           defaultValue={50}
    //           aria-label="Default"
    //           valueLabelDisplay="auto"
    //           onChange={(e) => {
    //             setAts(e.target.value);
    //           }}
    //         />
    //         <div style={{ display: "flex" }}>
    //           <Checkbox
    //             checked={fail || false}
    //             onChange={(e) => setFail(e.target.checked)}
    //           ></Checkbox>
    //           <label className="text-sm">Fail applicants under {ats}%</label>
    //         </div>
    //       </div>
    //       <button className="btn btn-primary" onClick={() => updateAts()}>
    //         Update
    //       </button>
    //     </div>
    //   )}
    //   {column != 1 && filters && csvDisplay && (
    //     <div
    //       style={{
    //         width: "100%",
    //         display: "flex",
    //         flexDirection: "column",
    //         alignItems: "center",
    //         marginBottom: "1rem",
    //         maxWidth: "90vw",
    //         padding: "10px",
    //         flexWrap: "wrap",
    //       }}
    //     >
    //       <h2 style={{ fontSize: "1.5rem" }}>Next Phase CSV Score</h2>

    //       <div style={{ display: "flex", alignItems: "center", gap: "2rem", marginBottom: "1rem" }}>
    //         <Slider
    //           defaultValue={50}
    //           aria-label="Default"
    //           valueLabelDisplay="auto"
    //           onChange={(e) => {
    //             setAts(e.target.value);
    //           }}
    //         />
    //         <div style={{ display: "flex" }}>
    //           <Checkbox
    //             checked={fail || false}
    //             onChange={(e) => setFail(e.target.checked)}
    //           ></Checkbox>
    //           <label className="text-sm">Fail applicants under {ats}%</label>
    //         </div>
    //         <input
    //           type="file"
    //           onChange={(e) => {
    //             setCsvFile(e.target.files[0]);
    //           }}
    //           accept=".csv, .xlsx, .xls"
    //           className="form-control"
    //         ></input>
    //       </div>
    //       <button className="btn btn-primary" onClick={() => updateCsv()}>
    //         Update
    //       </button>
    //     </div>
    //   )}
    //   <ApplicantsTable phase={column} setFilters={setFilters}/>
    // </div>
  );
}

export default ProcessCard;
