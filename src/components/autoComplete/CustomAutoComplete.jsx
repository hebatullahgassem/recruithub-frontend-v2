import { Autocomplete, TextField } from "@mui/material";
import { useContext } from "react";
import { userContext } from "../../context/UserContext";

const CustomAutoComplete = ({setter, getter}) => {
  const { isLight } = useContext(userContext);
  const specializationOptions = [
    "Game Development",
    "Graphic Design",
    "Embedded Systems",
    "System Administration & Cloud",
    "Cybersecurity",
    "Geographic Information Systems",
    "ERP and CRM Development",
    "Data Science & AI",
    "Web Development",
    "Mobile App Development",
    "UI/UX Design",
    "Software Testing",
  ];

  return (
    <Autocomplete
      options={specializationOptions}
      sx={{
        height: "auto",
        width: "100%",
        "& .MuiOutlinedInput-root": {
          borderRadius: 2,
          background: isLight ? "#fff" : "#242424",
          color: isLight ? "black" : "white",
          "& fieldset": {
            borderColor: isLight ? "#ddd5d6" : "#2a2b2f",
          },
          "&:hover fieldset": {
            borderColor: "#901b20",
          },
        },
        "& .MuiInputLabel-root": {
          color: isLight ? "black" : "white",
        },
        "& .MuiInputBase-input": {
          backgroundColor: isLight ? "rgba(255, 255, 255, 0.95)" : "#242424",
          color: isLight ? "black" : "white",
          paddingLeft: 1,
        },
        '.css-1umw9bq-MuiSvgIcon-root': {
          color: isLight ? "black" : "white",
        }
      }}
      renderInput={(params) => <TextField {...params} label="Specialization" />}
      value={getter}
      onChange={(event, newInputValue) => {
        setter((prev) => ({
          ...prev,
          specialization: newInputValue,
        }));
      }}
    />
  );
};

export default CustomAutoComplete;
