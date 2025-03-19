import { FormControlLabel, Radio, RadioGroup, Typography } from "@mui/material";
import { useState } from "react";

function Boolean({question, setValue}) {
  const [radioValue, setRadioValue] = useState("");
  return (
    <>
      {/* Question 1: Yes/No Radio */}
      <Typography variant="h6" gutterBottom>
        Are you currently employed?
      </Typography>
      <RadioGroup
        value={radioValue}
        onChange={(e) => setRadioValue(e.target.value)}
      >
        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
        <FormControlLabel value="no" control={<Radio />} label="No" />
      </RadioGroup>
    </>
  );
}

export default Boolean;
