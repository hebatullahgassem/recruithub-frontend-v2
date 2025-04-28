import { Autocomplete, TextField } from "@mui/material";
import { useContext } from "react";
import { userContext } from "../../context/UserContext";

const CustomAutoComplete = ({setter, getter}) => {
  const { isLight } = useContext(userContext);
  const specializationOptions = [
    "Game Development",
    "Graphic Design",
    "Embedded Systems",
    "Systems Administration and Cloud",
    "Cyber Security",
    "Geographic Information Systems",
    "ERP & CRM Development",
    "Data Science and AI",
    "Web Development",
    "Mobile Development",
    "UI/UX Developer",
    "Software Tester",
  ];

  return (
    <Autocomplete
      options={specializationOptions}
      sx={{
        width: "100%",
        "& .MuiOutlinedInput-root": {
          borderRadius: 2,
          background: isLight ? "#fff" : "#121212",
          color: isLight ? "black" : "white",
          "& fieldset": {
            borderColor: "#901b20",
          },
          "&:hover fieldset": {
            borderColor: "#901b20",
          },
        },
        "& .MuiInputLabel-root": {
          color: isLight ? "black" : "white",
        },
        "& .MuiInputBase-input": {
          backgroundColor: isLight ? "rgba(255, 255, 255, 0.95)" : "#121212",
          color: isLight ? "black" : "white",
          paddingLeft: 1,
        },
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
