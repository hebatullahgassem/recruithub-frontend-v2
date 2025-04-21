import { Tab, Tabs, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useEffect, useState } from "react";

function ProcessColumn({setter, column, phases, application}) {
    console.log(application);
    useEffect(() => {
        if(application.status){
            console.log(application.status)
            if(application.status === '1') return
            setter(parseInt(application.status)-1);
        }
    }, [application]);
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

