import { Tab, Tabs } from "@mui/material";
import { useEffect, useState } from "react";
import '../../ComponentsStyles/process_column.css';
import'../../styles/theme.css';

function ProcessColumn({setter, column, phases, application}) {
    console.log(application);
    useEffect(() => {
        if(application?.status){
            console.log(application.status)
            if(application.status === '1') return
            setter(parseInt(application.status)-1);
        }
    }, [application, setter]);
    return (
    <div className="process-column-container">
        <Tabs
          orientation="horizontal"
          value={column}
          variant="scrollable"
          scrollButtons="auto"
          className="process-tabs"
          TabIndicatorProps={{
            style: {
              backgroundColor: "#722732",
            },
          }}
        >
          {phases.map((phase, index) => (
            <Tab
              key={phase}
              label={phase}
              value={index + 1}
              onClick={() => setter(index + 1)}
              className={`process-tab ${index + 1 === column ? "active" : ""}`}
            />
          ))}
        </Tabs>
      </div>
        
        // <Tabs
        //     orientation="horizontal"
        //     sx={{ mt:2, alignSelf:'center', maxWidth:'100vw'}}
        //     // onChange={handleChange}
        //     indicatorColor="primary"
        //     value={column}
        //     textColor="primary"
        //     variant="scrollable"
        // >
        //     {phases.map((val, index) => (
        //         <Tab key={val} label={phases[index]} value={index+1} onClick={() => setter(index+1)} sx={{backgroundColor: index+1 === column ? '#e4e4e4': null}}>
        //             {phases[index]}
        //         </Tab>
        //     ))}
        // </Tabs>
    );
}

export default ProcessColumn;

