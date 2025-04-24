import React, { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Box,
  CircularProgress,
  Typography,
  Alert,
  Grid,
  Divider,
  IconButton,
} from "@mui/material";
import { FaTrashAlt, FaFileUpload } from "react-icons/fa";
import { createRag, deleteRag, getRag } from "../../services/ChatBot";
import { set } from "date-fns";

function AdminRag() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);

  // State for file upload form
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null); // To reset file input

  // State for feedback messages
  const [feedback, setFeedback] = useState({ message: "", severity: "info" });

  // --- Utility to show feedback ---
  const showFeedback = (message, severity = "info") => {
    setFeedback({ message, severity });
    // Optional: auto-hide feedback after a delay
    // setTimeout(() => setFeedback({ message: "", severity: "info" }), 5000);
  };

  // --- Invalidate Query and Reset Forms ---
  const handleMutationSuccess = (successMessage) => {
    showFeedback(successMessage, "success");
    queryClient.invalidateQueries({ queryKey: ["rags"] });
    // Reset file input
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset file input visually
    }
    setLoading(false);
  };

  const handleMutationError = (error, defaultMessage) => {
    const errorMessage =
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      error.message ||
      defaultMessage;
    showFeedback(errorMessage, "error");
    setLoading(false);
  };

  // --- Data Fetching (RAG List) ---
  const {
    data: ragData,
    error: fetchError,
    isLoading: isFetchingRags,
    isFetching: isRefetchingRags,
  } = useQuery({
    queryKey: ["rags", page, rowsPerPage], // Key includes pagination
    queryFn: async () => {
      // API expects 1-based page number
      const data = await getRag(page + 1, rowsPerPage);
      return data;
    },
    keepPreviousData: true, // Keep previous data visible while fetching next page
  });

  // --- File Upload Mutation (Create RAG) ---
  const createRagMutation = useMutation({
    mutationFn: createRag, // Our placeholder or actual service call
    onSuccess: (data) =>
      handleMutationSuccess(data.message || "File uploaded and processed!"),
    onError: (error) => handleMutationError(error, "Failed to upload file."),
  });

  // --- Deletion Mutation ---
  const deleteMutation = useMutation({
    mutationFn: deleteRag, // Our placeholder or actual service call
    onSuccess: (data, ragId) => {
      // ragId is the variable passed to mutate
      showFeedback(data.message || `RAG item deleted successfully!`, "success");
      queryClient.invalidateQueries({ queryKey: ["rags"] }); // Refetch list after deletion
    },
    onError: (error, ragId) => {
      handleMutationError(error, `Failed to delete RAG item ${ragId}.`);
    },
  });

  // --- Event Handlers ---
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when changing rows per page
  };

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      showFeedback(`Selected file: ${file.name}`, "info"); // Show selected file name
    } else {
      setSelectedFile(null);
    }
  };

  const handleBulkSubmit = (event) => {
    event.preventDefault();
    if (!selectedFile) {
      showFeedback("Please select a file to upload.", "warning");
      return;
    }
    setLoading(true);
    setFeedback({ message: "", severity: "info" }); // Clear previous feedback

    // Create FormData object to send the file
    const formData = new FormData();
    formData.append("pdf", selectedFile); // 'pdf' should match the key expected by your backend

    createRagMutation.mutate(selectedFile); // Pass the file object to the mutation
  };

  const handleDeleteClick = (rag) => {
    // Optional: Add confirmation dialog here
    if (
      window.confirm(`Are you sure you want to delete RAG: ${rag.name}?\nThis action cannot be undone.`)
    ) {
      setFeedback({ message: "", severity: "info" }); // Clear previous feedback
      deleteMutation.mutate(rag._id); // Pass the ID to the mutation
    }
  };

  // --- Render Logic ---
  const rags = ragData?.results || [];
  const totalRags = ragData?.count || 0;
  useEffect(() => {
    
    console.log(loading);
  }, [loading]);
  return (
    <Box sx={{ padding: 3, maxWidth: "100%", overflowX: "auto" }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: "center", mb: 3 }}>
        Manage RAG Documents
      </Typography>

      {/* Display Feedback Messages */}
      {feedback.message && (
        <Alert
          severity={feedback.severity}
          sx={{ mb: 2 }}
          onClose={() => setFeedback({ message: "", severity: "info" })}
        >
          {feedback.message}
        </Alert>
      )}

      {/* --- File Upload Form (Bulk Creation) --- */}
      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          {" "}
          {/* Use full width for just one form */}
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Upload Document for RAG
            </Typography>
            <Box component="form" onSubmit={(e) => { handleBulkSubmit(e) }} noValidate>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Upload a PDF document (.pdf).
              </Typography>
              <Button
                variant="outlined"
                component="label" // Makes the button act like a label for the hidden input
                fullWidth
                sx={{ mt: 1, mb: 2 }}
                disabled={createRagMutation.isLoading}
              >
                {selectedFile
                  ? `File: ${selectedFile.name}`
                  : "Choose PDF File"}
                <input
                  type="file"
                  hidden
                  accept=".pdf" // Accept only PDF files
                  onChange={handleFileChange}
                  ref={fileInputRef} // Assign ref
                  disabled={createRagMutation.isLoading}
                />
              </Button>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={!selectedFile || loading}
                startIcon={
                  loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <FaFileUpload />
                  )
                }
              >
                {loading
                  ? "Uploading..."
                  : "Upload and Process"}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* --- RAG Table --- */}
      <Typography variant="h5" gutterBottom sx={{ textAlign: "center", mb: 2 }}>
        Existing RAG Documents
      </Typography>

      {/* Loading/Error/Empty States for Table */}
      {isFetchingRags && !isRefetchingRags && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
          <CircularProgress />
        </Box>
      )}

      {fetchError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load RAG documents: {fetchError.message}
        </Alert>
      )}

      {!isFetchingRags && !fetchError && rags.length === 0 && (
        <Typography
          sx={{ textAlign: "center", mt: 4, color: "text.secondary" }}
        >
          No RAG documents found.
        </Typography>
      )}

      {/* Actual Table */}
      {!isFetchingRags && !fetchError && rags.length > 0 && (
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          {/* Optional: Indicate background refetching */}
          {isRefetchingRags && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                p: 1,
                opacity: 0.7,
              }}
            >
              <CircularProgress size={20} />
              <Typography sx={{ ml: 1 }} variant="caption">
                Updating list...
              </Typography>
            </Box>
          )}
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader aria-label="rag documents table">
              <TableHead>
                <TableRow>
                  {/* Assuming _id and name are the relevant fields */}
                  <TableCell sx={headerStyle}>ID</TableCell>
                  <TableCell sx={headerStyle}>Name</TableCell>
                  <TableCell sx={headerStyle} align="center">
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rags.map((rag) => (
                  <TableRow hover key={rag._id}>
                    <TableCell>{rag._id}</TableCell>
                    <TableCell>{rag.name}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        aria-label="delete rag document"
                        color="error"
                        size="small"
                        onClick={() => handleDeleteClick(rag)} // Use _id for deletion
                        // Disable button for the specific item being deleted
                        disabled={
                          deleteMutation.isLoading &&
                          deleteMutation.variables === rag._id
                        }
                      >
                        {/* Show spinner only for the deleting item */}
                        {deleteMutation.isLoading &&
                        deleteMutation.variables === rag._id ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          <FaTrashAlt />
                        )}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={totalRags}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}
    </Box>
  );
}

// Header style definition (same as AdminItian)
const headerStyle = {
  backgroundColor: "black",
  color: "#ffffff",
  fontWeight: "bold",
};

export default AdminRag;
