import toast from "react-hot-toast";
import { Button } from '@mui/material'; 
import React from "react";

export const showConfirmToast = ({ message, onConfirm, onCancel }) => {
  toast.custom((t) => (
    <div
      style={{
        background: "white",
        padding: "1rem",
        borderRadius: "0.5rem",
        boxShadow: "0 4px 14px rgba(0, 0, 0, 0.1)",
        minWidth: "300px",
      }}
    >
      <div style={{ marginBottom: "1rem" }}>{message || "Are you sure?"}</div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
        <Button
          size="small"
          variant="contained"
          color="error"
          onClick={() => {
            toast.dismiss(t.id);
            onConfirm?.();
          }}
        >
          Confirm
        </Button>
        <Button
          size="small"
          variant="outlined"
          onClick={() => {
            toast.dismiss(t.id);
            onCancel?.();
          }}
        >
          Cancel
        </Button>
      </div>
    </div>
  ));
};
