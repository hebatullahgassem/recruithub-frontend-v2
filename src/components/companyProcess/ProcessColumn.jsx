import { Tab, Tabs, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useState } from "react";

function ProcessColumn({setter, column, phases}) {

    return (
        
        <Tabs
            orientation="horizontal"
            sx={{ mt:2, alignSelf:'center', maxWidth:'100vw'}}
            // onChange={handleChange}
            indicatorColor="primary"
            value={column}
            textColor="primary"
            variant="scrollable"
        >
            {phases.map((val, index) => (
                <Tab key={val} label={phases[index]} value={index+1} onClick={() => setter(index+1)} sx={{backgroundColor: index+1 === column ? '#e4e4e4': null}}>
                    {phases[index]}
                </Tab>
            ))}
        </Tabs>
    );
}

export default ProcessColumn;

