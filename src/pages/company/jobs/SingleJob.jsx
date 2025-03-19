import { useParams } from "react-router";
import ProcessColumn from "../../../components/companyProcess/ProcessColumn";
import ProcessCard from "../../../components/companyProcess/ProcessCard";
import { useState } from "react";
import JobDetails from "../../../components/job/JobDetails";

function SingleJob() {
    const phases = ["Applied", "Technical Assessment", "Technical Interview", "Hr Interview", "Offer"]
    const { id } = useParams();
    const [clickedColumn, setClickedColumn] = useState(1);
    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', maxWidth:'100vw' }}>
            <JobDetails />
            <ProcessColumn setter={setClickedColumn} column={clickedColumn} phases={phases}/>
            <ProcessCard column={clickedColumn} phases={phases}/>
        </div>
    )

}

export default SingleJob
