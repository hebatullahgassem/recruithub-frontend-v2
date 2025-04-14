import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useState } from "react";

function ProcessColumn({setter, column, phases}) {

    return (
        
        <ToggleButtonGroup
            orientation="horizontal"
            sx={{ mt:2, scale:0.8, alignSelf:'center'}}
            // onChange={handleChange}
        >
            {phases.map((val, index) => (
                <ToggleButton key={val} value={index+1} onClick={() => setter(index+1)} sx={{backgroundColor: index+1 === column ? '#e4e4e4': null}}>
                    {phases[index]}
                </ToggleButton>
            ))}
        </ToggleButtonGroup>
    );
}

export default ProcessColumn;

