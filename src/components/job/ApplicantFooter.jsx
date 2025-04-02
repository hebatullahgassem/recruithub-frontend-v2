import { Button } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import SendIcon from "@mui/icons-material/Send";
import { createApplication } from "../../services/Application";

function ApplicantFooter({type}) {
    function handleClick(phase){
        const application = {
            "user": null,
            "job": null,
            "status": "",
        };
        createApplication()
    }
    return (
        <div style={{ display: 'flex', gap: '1rem' }}>
            {type != 'saved' && <Button variant="text" startIcon={<SaveIcon />}>
                Save
            </Button>}
            <Button variant="text" startIcon={<SendIcon />}>
                Apply
            </Button>
        </div>
    );
}

export default ApplicantFooter;
