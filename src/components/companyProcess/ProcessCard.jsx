import { Checkbox, Slider } from "@mui/material";
import ApplicantsTable from "./ApplicantsTable";
import { useContext, useState } from "react";
import {
  updateApplicationAts,
  updateApplicationCsv,
} from "../../services/Application";
import { ArrowUpRight, FileSpreadsheet, Filter, RefreshCw, X } from "lucide-react"
import { userContext } from "../../context/UserContext";
import '../../ComponentsStyles/CompanyProcess/process_card.css';
import '../../styles/theme.css';
import { showErrorToast, showSuccessToast,showConfirmToast } from "../../confirmAlert/toastConfirm";

function ProcessCard({ column, phases, job }) {
  const [ats, setAts] = useState(50);
  const { isLight } = useContext(userContext);
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
          showConfirmToast({
      message: `Are you sure you want to send applicants with ATS score higher than ${ats}% to next phase?` +
        (fail
          ? `\nThis will also fail applicants with ATS score lower than ${ats}%.`
          : ""),
      onConfirm: async () => {
        // Proceed with the action
      },
      onCancel: () => {
        // Cancel the action
      },
      confirmText: "Confirm",
      cancelText: "Cancel",
      isLight,
    })
    ) {
      return;
    }
    if (ats === 50) {
      showErrorToast({
        message: "Please select a score",
    });
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
    showConfirmToast({
      message: `Are you sure you want to send applicants in the csv with score higher than ${ats}% to next phase?` +
        (fail
          ? `\nThis will also fail applicants in csv with score lower than ${ats}%.`
          : ""),
      onConfirm: async () => {
        // Proceed with the action
      },
      onCancel: () => {
        // Cancel the action
      },
      confirmText: "Confirm",
      cancelText: "Cancel",
      isLight,
    })
    ) {
      return;
    }
    if (ats === 50) {
      showErrorToast({
        message: "Please select a score",
    });
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
    <div className={`recruitment-card ${isLight ? "light" : "dark"}`}>
    <div className="phase-header">
      <h1 className="phase-title">{phases[column - 1]}</h1>
      <div className="phase-actions">
        {column === 1 && filters && (
          <button className={`action-button ${display ? "active" : ""}`} onClick={() => setDisplay(!display)}>
            {display ? (
              <>
                <X size={16} />
                <span>Hide ATS Filter</span>
              </>
            ) : (
              <>
                <Filter size={16} />
                <span>Filter by ATS</span>
              </>
            )}
          </button>
        )}
        {column !== 1 && filters && (
          <button
            className={`action-button ${csvDisplay ? "active" : ""}`}
            onClick={() => setCsvDisplay(!csvDisplay)}
          >
            {csvDisplay ? (
              <>
                <X size={16} />
                <span>Hide CSV Filter</span>
              </>
            ) : (
              <>
                <FileSpreadsheet size={16} />
                <span>Filter by CSV</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>

    {column === 1 && filters && display && (
      <div className="filter-container">
        <div className="filter-header">
          <h2 className="filter-title">Next Phase ATS Score</h2>
          <span className="filter-badge">{ats}%</span>
        </div>

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
                color: "#d43132",
                height: 8,
                "& .MuiSlider-track": {
                  border: "none",
                },
                "& .MuiSlider-thumb": {
                  height: 20,
                  width: 20,
                  backgroundColor: "#d43132",
                  "&:hover, &.Mui-focusVisible": {
                    boxShadow: "0px 0px 0px 8px rgba(212, 49, 50, 0.16)",
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
                color: "#d43132",
                "&.Mui-checked": {
                  color: "#d43132",
                },
              }}
            />
            <label className="checkbox-label">Fail applicants under {ats}%</label>
          </div>
        </div>
        <button className="update-button" onClick={() => updateAts()} disabled={isLoading}>
          {isLoading ? (
            <>
              <RefreshCw className="spin" size={16} />
              <span>Updating...</span>
            </>
          ) : (
            <>
              <ArrowUpRight size={16} />
              <span>Update</span>
            </>
          )}
        </button>
      </div>
    )}

    {column !== 1 && filters && csvDisplay && (
      <div className="filter-container">
        <div className="filter-header">
          <h2 className="filter-title">Next Phase CSV Score</h2>
          <span className="filter-badge">{ats}%</span>
        </div>

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
                color: "#d43132",
                height: 8,
                "& .MuiSlider-track": {
                  border: "none",
                },
                "& .MuiSlider-thumb": {
                  height: 20,
                  width: 20,
                  backgroundColor: "#d43132",
                  "&:hover, &.Mui-focusVisible": {
                    boxShadow: "0px 0px 0px 8px rgba(212, 49, 50, 0.16)",
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
                color: "#d43132",
                "&.Mui-checked": {
                  color: "#d43132",
                },
              }}
            />
            <label className="checkbox-label">Fail applicants under {ats}%</label>
          </div>
          <div className="file-input-container">
            <label className="file-input-label">
              <span>Upload CSV File</span>
              <input
                type="file"
                onChange={(e) => {
                  setCsvFile(e.target.files[0])
                }}
                accept=".csv, .xlsx, .xls"
                className="file-input"
              />
            </label>
            {csvFile && (
              <div className="file-name">
                <FileSpreadsheet size={16} />
                <span>{csvFile.name}</span>
              </div>
            )}
          </div>
        </div>
        <button className="update-button" onClick={() => updateCsv()} disabled={!csvFile || isLoading}>
          {isLoading ? (
            <>
              <RefreshCw className="spin" size={16} />
              <span>Updating...</span>
            </>
          ) : (
            <>
              <ArrowUpRight size={16} />
              <span>Update</span>
            </>
          )}
        </button>
      </div>
    )}

    <ApplicantsTable phase={column} setFilters={setFilters} fetch={fetch} />
  </div>

    // <div className="recruitment-card slide-in-up" style={{ padding: "1.5rem", margin: "1rem 0", backgroundColor: isLight ? "white" : "rgb(37, 36, 36)"}}>
    //   <div className="phase-header">
    //     <h1 className="phase-title" style={{ color: isLight ? "black" : "white"}}>{phases[column - 1]}</h1>
    //     <div className="phase-actions">
    //       {column === 1 && filters && (
    //         <button className="btn-primary" onClick={() => setDisplay(!display)}>
    //           {display ? "Hide ATS Filter" : "Filter by ATS"}
    //         </button>
    //       )}
    //       {column !== 1 && filters && (
    //         <button className="btn-primary" onClick={() => setCsvDisplay(!csvDisplay)}>
    //           {csvDisplay ? "Hide CSV Filter" : "Filter by CSV"}
    //         </button>
    //       )}
    //     </div>
    //   </div>

    //   {column === 1 && filters && display && (
    //     <div className="filter-container slide-in-up">
    //       <h2 className="filter-title">Next Phase ATS Score</h2>

    //       <div className="filter-controls">
    //         <div className="slider-container">
    //           <Slider
    //             defaultValue={50}
    //             aria-label="Default"
    //             valueLabelDisplay="auto"
    //             onChange={(e) => {
    //               setAts(e.target.value)
    //             }}
    //             sx={{
    //               color: "#722732",
    //               "& .MuiSlider-thumb": {
    //                 "&:hover, &.Mui-focusVisible": {
    //                   boxShadow: "0px 0px 0px 8px rgba(114, 39, 50, 0.16)",
    //                 },
    //               },
    //             }}
    //           />
    //         </div>
    //         <div className="checkbox-container">
    //           <Checkbox
    //             checked={fail || false}
    //             onChange={(e) => setFail(e.target.checked)}
    //             sx={{
    //               color: "#722732",
    //               "&.Mui-checked": {
    //                 color: "#722732",
    //               },
    //             }}
    //           />
    //           <label className="checkbox-label">Fail applicants under {ats}%</label>
    //         </div>
    //       </div>
    //       <button className="btn-primary" onClick={() => updateAts()} disabled={isLoading}>
    //         {isLoading ? "Updating..." : "Update"}
    //       </button>
    //     </div>
    //   )}

    //   {column !== 1 && filters && csvDisplay && (
    //     <div className="filter-container slide-in-up">
    //       <h2 className="filter-title">Next Phase CSV Score</h2>

    //       <div className="filter-controls">
    //         <div className="slider-container">
    //           <Slider
    //             defaultValue={50}
    //             aria-label="Default"
    //             valueLabelDisplay="auto"
    //             onChange={(e) => {
    //               setAts(e.target.value)
    //             }}
    //             sx={{
    //               color: "#722732",
    //               "& .MuiSlider-thumb": {
    //                 "&:hover, &.Mui-focusVisible": {
    //                   boxShadow: "0px 0px 0px 8px rgba(114, 39, 50, 0.16)",
    //                 },
    //               },
    //             }}
    //           />
    //         </div>
    //         <div className="checkbox-container">
    //           <Checkbox
    //             checked={fail || false}
    //             onChange={(e) => setFail(e.target.checked)}
    //             sx={{
    //               color: "#722732",
    //               "&.Mui-checked": {
    //                 color: "#722732",
    //               },
    //             }}
    //           />
    //           <label className="checkbox-label">Fail applicants under {ats}%</label>
    //         </div>
    //         <div className="file-input-container">
    //           <input
    //             type="file"
    //             onChange={(e) => {
    //               setCsvFile(e.target.files[0])
    //             }}
    //             accept=".csv, .xlsx, .xls"
    //             className="form-control"
    //           />
    //         </div>
    //       </div>
    //       <button className="btn-primary" onClick={() => updateCsv()} disabled={!csvFile || isLoading}>
    //         {isLoading ? "Updating..." : 'Update'}
    //       </button>
    //     </div>
    //   )}

    //   <ApplicantsTable phase={column} setFilters={setFilters} fetch={fetch}/>
    // </div>


  );
}

export default ProcessCard;
