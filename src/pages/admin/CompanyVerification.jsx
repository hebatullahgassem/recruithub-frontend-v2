import { useState } from "react";
import { Button } from "@mui/material";
import { verifyCompany } from "../services/Auth.js";

const CompanyVerification = ({ companyId, onSuccess, buttonProps = {}}) => {
  const [status, setStatus] = useState("");
  const token = localStorage.getItem("token");

  const handleVerify = async () => {
    try {
      await verifyCompany(companyId, token);
      setStatus("Company verified successfully ✅");
      if (onSuccess) onSuccess();
    } catch (err) {
      setStatus(`Error: ${err.message}`);
    }
  };

  return (
    <div>
      <Button onClick={handleVerify} {...buttonProps}>Verify Company</Button>
      {status && <p>{status}</p>}
    </div>
  );
};

export default CompanyVerification;
