import { Button } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import SendIcon from "@mui/icons-material/Send";

function ApplicantFooter() {
    return (
        <div style={{ display: 'flex', gap: '1rem' }}>
            <Button variant="text" startIcon={<SaveIcon />}>
                Save
            </Button>
            <Button variant="text" startIcon={<SendIcon />}>
                Apply
            </Button>
        </div>
    );
}

export default ApplicantFooter;
