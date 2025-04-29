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

        // Modern color palette
        const colors = {
          light: {
            background: "#ffffff",
            cardBg: "#ffffff",
            sectionBg: "#f8f9fa",
            text: "#333333",
            accent: "#e63946", // Modern red
            accentHover: "#d62b3a",
            secondary: "#457b9d", // Blue accent
            muted: "#6c757d",
            border: "#dee2e6",
          },
          dark: {
            background: "#121212",
            cardBg: "#1e1e1e",
            sectionBg: "#242424",
            text: "#f8f9fa",
            accent: "#e63946", // Same red accent for consistency
            accentHover: "#f25d69",
            secondary: "#64b5f6", // Lighter blue for dark mode
            muted: "#adb5bd",
            border: "#343a40",
          },
        };
    
      // Get current theme colors
      const theme = isLight ? colors.light : colors.dark;
  
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

    <div className="recruitment-card slide-in-up" style={{ padding: "1.5rem", margin: "1rem 0", backgroundColor: isLight ? "white" : "rgb(37, 36, 36)"}}>
      <div className="phase-header">
        <h1 className="phase-title" style={{ color: isLight ? "black" : "white"}}>{phases[column - 1]}</h1>
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


  );
}

export default ProcessCard;
