import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useState } from "react";

function ProcessColumn({setter, column, phases}) {

    return (
        <>
        
        <ToggleButtonGroup
            orientation="horizontal"
            exclusive
            fullWidth
            sx={{width: "90vw", mt:2}}
            // onChange={handleChange}
        >
            {[1, 2, 3, 4, 5].map((val) => (
                <ToggleButton key={val} value={val} onClick={() => setter(val)} sx={{backgroundColor: val === column ? '#e4e4e4': null}}>
                    {phases[val-1]}
                </ToggleButton>
            ))}
        </ToggleButtonGroup>
        </>
    );
}

export default ProcessColumn;

