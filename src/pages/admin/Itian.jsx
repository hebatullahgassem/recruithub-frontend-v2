import React, { useState,useContext, useRef, useEffect } from "react";
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
  TextField,
  Grid,
  Divider,
  IconButton, // For delete icon button
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { FaTrashAlt, FaUserPlus, FaFileUpload } from "react-icons/fa"; // Icons
import { userContext } from "../../context/UserContext";


// Import your API service functions
import {
  getItians,
  createItianSingle,
  createItianBulk,
  deleteItian,
} from "../../services/Admin"; // Adjust path as needed

function AdminItian() {
  const { isLight } = useContext(userContext);
  
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // State for single creation form
  const [email, setEmail] = useState("");
  const [nationalId, setNationalId] = useState("");

  // State for bulk creation form
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null); // To reset file input

  // State for feedback messages
  const [feedback, setFeedback] = useState({ message: "", severity: "info" });

  const [searchQuery, setSearchQuery] = useState("");

  const [openSingleForm, setOpenSingleForm] = useState(false);
  const [openBulkForm, setOpenBulkForm] = useState(false);

  // Modern color palette
  const colors = {
    light: {
      background: "#ffffff",
      cardBg: "#ffffff",
      sectionBg: "#f8f9fa",
      text: "#333333",
      accent: "#e63946", // Modern red
      accentHover: "#d62b3a",
      secondary: "#457b9d", // Blue accent
      muted: "#6c757d",
      border: "#dee2e6",
    },
    dark: {
      background: "#121212",
      cardBg: "#1e1e1e",
      sectionBg: "#242424",
      text: "#f8f9fa",
      accent: "#e63946", // Same red accent for consistency
      accentHover: "#f25d69",
      secondary: "#64b5f6", // Lighter blue for dark mode
      muted: "#adb5bd",
      border: "#343a40",
    },
  };

  // Get current theme colors
  const theme = isLight ? colors.light : colors.dark;

  // --- Data Fetching ---
  const {
    data: itianData,
    error: fetchError,
    isLoading: isFetchingItians,
    isFetching: isRefetchingItians,
  } = useQuery({
    queryKey: ["itians", page, rowsPerPage, searchQuery], // include searchQuery in key
    queryFn: async () => {
      const data = await getItians(page + 1, rowsPerPage, searchQuery); // pass search query to API
      return data;
    },
    keepPreviousData: true,
  });
  
  // --- Utility to show feedback ---
  const showFeedback = (message, severity = "info") => {
    setFeedback({ message, severity });
    // Optional: auto-hide feedback after a delay
    setTimeout(() => setFeedback({ message: "", severity: "info" }), 5000);
  };

   // --- Invalidate Query and Reset Forms ---
   const handleMutationSuccess = (successMessage) => {
    showFeedback(successMessage, "success");
    queryClient.invalidateQueries({ queryKey: ["itians"] });
    // Reset forms
    setEmail("");
    setNationalId("");
    setSelectedFile(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset file input visually
    }
   };

   const handleMutationError = (error, defaultMessage) => {
       const errorMessage = error?.response?.data?.error || error?.response?.data?.message || error.message || defaultMessage;
       showFeedback(errorMessage, "error");
   };


  // --- Single Creation Mutation ---
  const singleCreateMutation = useMutation({
    mutationFn: createItianSingle,
    onSuccess: (data) => handleMutationSuccess(data.message || "Itian created successfully!"),
    onError: (error) => handleMutationError(error, "Failed to create Itian."),
  });

  // --- Bulk Creation Mutation ---
  const bulkCreateMutation = useMutation({
    mutationFn: createItianBulk,
    onSuccess: (data) => handleMutationSuccess(data.message || "Bulk creation processed!"),
    onError: (error) => handleMutationError(error, "Failed to process file."),
  });

  // --- Deletion Mutation ---
  const deleteMutation = useMutation({
    mutationFn: deleteItian,
    onSuccess: (data, itianId) => {
        showFeedback(data.message || `Itian deleted successfully!`, "success");
        // Invalidate query to refetch *after* successful deletion
        queryClient.invalidateQueries({ queryKey: ["itians"] });
    },
    onError: (error, itianId) => {
        handleMutationError(error, `Failed to delete Itian ${itianId}.`)
    },
  });


  // --- Event Handlers ---
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      showFeedback(`Selected file: ${event.target.files[0].name}`, "info"); // Show selected file name
    } else {
       setSelectedFile(null);
    }
  };

  const handleSingleSubmit = (event) => {
    event.preventDefault();
    if (!email || !nationalId) {
      showFeedback("Email and National ID are required.", "warning");
      return;
    }
    setFeedback({ message: "", severity: "info" }); // Clear previous feedback
    singleCreateMutation.mutate({ email, national_id: nationalId });
  };

  const handleBulkSubmit = (event) => {
    event.preventDefault();
    if (!selectedFile) {
      showFeedback("Please select a file to upload.", "warning");
      return;
    }
    setFeedback({ message: "", severity: "info" }); // Clear previous feedback
    bulkCreateMutation.mutate(selectedFile);
  };

  const handleDeleteClick = (itianId) => {
     // Optional: Add confirmation dialog here
     if (window.confirm(`Are you sure you want to delete Itian ID: ${itianId}?`)) {
        setFeedback({ message: "", severity: "info" }); // Clear previous feedback
        deleteMutation.mutate(itianId);
     }
  };


  // --- Render Logic ---
  const itians = itianData?.results || [];
  const totalItians = itianData?.count || 0;

  
  return (
    <Box 
        sx={{ 
          padding: 3, 
          backgroundColor: theme.background, 
          color: theme.text, 
          minHeight: "100vh", 
          padding: 3,
          width: "70%"
          }}
    >

      {/* Display Feedback Messages */}
      {feedback.message && (
        <Alert severity={feedback.severity} sx={{ mb: 2 }} onClose={() => setFeedback({ message: "", severity: "info"})}>
          {feedback.message}
        </Alert>
      )}

      {/* --- Itian Table --- */}
      <Typography variant="h5" gutterBottom sx={{ textAlign: "center", mb: 4, color: isLight ? "black" : "white", }}>
        ITIans
      </Typography>

      {/* Search Bar */}
      <Grid container xs={12} md={12} sx={{ mb: 4, justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Buttons to trigger modals */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<FaUserPlus />}
            onClick={() => setOpenSingleForm(true)}
          >
            Add Single ITian
          </Button>
          <Button
            variant="contained"
            startIcon={<FaFileUpload />}
            onClick={() => setOpenBulkForm(true)}
          >
            Add ITIans from File
          </Button>
        </Box>

        {/* --- Modal for Single ITian Form --- */}
        <Dialog open={openSingleForm} onClose={() => setOpenSingleForm(false)}>
          <DialogTitle>Add Single ITian</DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleSingleSubmit} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={singleCreateMutation.isLoading}
                sx={{
                  backgroundColor: isLight ? "white" : "rgba(255, 255, 255, 0.1)",
                  color: isLight ? "black" : "white",
                  "& .MuiInputLabel-root": {
                    color: isLight ? "black" : "white",
                  },
                  "& .MuiInputBase-root": {
                    color: isLight ? "black" : "white",
                  },
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="nationalId"
                label="National ID"
                name="nationalId"
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value)}
                disabled={singleCreateMutation.isLoading}
                sx={{
                  backgroundColor: isLight ? "white" : "rgba(255, 255, 255, 0.1)",
                  color: isLight ? "black" : "white",
                  "& .MuiInputLabel-root": {
                    color: isLight ? "black" : "white",
                  },
                  "& .MuiInputBase-root": {
                    color: isLight ? "black" : "white",
                  },
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 2, mb: 1 }}
                disabled={singleCreateMutation.isLoading}
                startIcon={singleCreateMutation.isLoading ? <CircularProgress size={20} color="inherit" /> : <FaUserPlus />}
              >
                {singleCreateMutation.isLoading ? "Adding..." : "Add ITian"}
              </Button>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenSingleForm(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* --- Modal for Bulk ITian Form --- */}
        <Dialog open={openBulkForm} onClose={() => setOpenBulkForm(false)}>
          <DialogTitle>Add ITIans from File</DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleBulkSubmit} noValidate>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Upload a .csv or .xlsx file with 'email' and 'national_id' columns.
              </Typography>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{
                  mt: 1,
                  mb: 2,
                  backgroundColor: isLight ? "white" : "rgba(255, 255, 255, 0.1)",
                  color: isLight ? "black" : "white",
                  "&:hover": {
                    backgroundColor: isLight ? "#f5f5f5" : "rgba(255, 255, 255, 0.2)",
                  },
                }}
                disabled={bulkCreateMutation.isLoading}
              >
                {selectedFile ? `File: ${selectedFile.name}` : "Choose File"}
                <input
                  type="file"
                  hidden
                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  disabled={bulkCreateMutation.isLoading}
                />
              </Button>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={!selectedFile || bulkCreateMutation.isLoading}
                startIcon={bulkCreateMutation.isLoading ? <CircularProgress size={20} color="inherit" /> : <FaFileUpload />}
                sx={{
                  backgroundColor: isLight ? "primary.main" : "rgba(255, 255, 255, 0.1)",
                  color: isLight ? "white" : "black",
                  "&:hover": {
                    backgroundColor: isLight ? "primary.dark" : "rgba(255, 255, 255, 0.2)",
                  },
                }}
              >
                {bulkCreateMutation.isLoading ? "Uploading..." : "Upload and Add"}
              </Button>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenBulkForm(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        <Grid item xs={6}>
          <TextField
            label="Search by Email or National ID"
            variant="outlined"
            size="small"
            fullWidth
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(0); // Reset page on search
            }}
            sx={{
              backgroundColor: isLight ? "white" : "rgba(255, 255, 255, 0.1)",
              color: isLight ? "black" : "white",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: isLight ? "grey.300" : "rgba(255, 255, 255, 0.5)",
              },
            }}
          />
        </Grid>
      </Grid>

       {/* Loading/Error/Empty States for Table */}
      {isFetchingItians && !isRefetchingItians && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
          <CircularProgress sx={{ color: isLight ? "primary.main" : "rgba(255, 255, 255, 0.7)" }} />
        </Box>
      )}

      {fetchError && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 2, 
            backgroundColor: isLight ? "rgba(255, 255, 255, 0.9)" : "rgba(33, 33, 33, 0.8)", 
            color: isLight ? "error.main" : "white",
            borderColor: isLight ? "error.main" : "rgba(255, 255, 255, 0.5)",
            borderWidth: 1,
          }}
        >
          Failed to load ITIans: {fetchError.message}
        </Alert>
      )}

      {!isFetchingItians && !fetchError && itians.length === 0 && (
        <Typography 
          sx={{ 
            textAlign: "center", 
            mt: 4, 
            color: isLight ? "text.secondary" : "rgba(255, 255, 255, 0.7)" 
          }}
        >
          No ITIans found.
        </Typography>
      )}

      {/* Actual Table */}
      {!isFetchingItians && !fetchError && itians.length > 0 && (
        <Paper 
          sx={{ 
            width: "100%", 
            overflow: "hidden", 
            backgroundColor: isLight ? "white" : "rgba(33, 33, 33, 0.9)", 
            transition: "background-color 0.5s ease",
            mb: 12
          }}
        >
          {/* Optional: Indicate background refetching */}
          {isRefetchingItians && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 1, opacity: 0.7 }}>
              <CircularProgress size={20} sx={{ color: isLight ? "primary.main" : "rgba(255, 255, 255, 0.7)" }} />
              <Typography sx={{ ml: 1, color: isLight ? "text.primary" : "white" }} variant="caption">
                Updating list...
              </Typography>
            </Box>
          )}
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader aria-label="itians table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: isLight ? "text.primary" : "black", borderColor: isLight ? "grey.300" : "rgba(255, 255, 255, 0.5)", backgroundColor: isLight ? "rgba(202, 200, 200, 0.5)" : "white"}}>
                    Email
                  </TableCell>
                  <TableCell sx={{ color: isLight ? "text.primary" : "black", borderColor: isLight ? "grey.300" : "rgba(255, 255, 255, 0.5)", backgroundColor: isLight ? "rgba(202, 200, 200, 0.5)" : "white" }}>
                    National ID
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      color: isLight ? "text.primary" : "black", 
                      borderColor: isLight ? "grey.300" : "rgba(255, 255, 255, 0.5)",
                      textAlign: "center",
                      backgroundColor: isLight ? "rgba(202, 200, 200, 0.5)" : "white"
                    }} 
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {itians.map((itian) => (
                  <TableRow hover key={itian.id}>
                    <TableCell sx={{ color: isLight ? "text.primary" : "white" }}>{itian.email}</TableCell>
                    <TableCell sx={{ color: isLight ? "text.primary" : "white" }}>{itian.national_id}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        aria-label="delete itian"
                        color="error"
                        size="small"
                        onClick={() => handleDeleteClick(itian.id)}
                        disabled={deleteMutation.isLoading && deleteMutation.variables === itian.id}
                      >
                        {/* Show spinner only for the deleting item */}
                        {deleteMutation.isLoading && deleteMutation.variables === itian.id ? (
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
            sx={{backgroundColor: isLight ? "rgba(255, 255, 255, 0.9)" : "white"}}
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={totalItians}
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

// Header style definition
const headerStyle = {
  backgroundColor: "black",
  color: "#ffffff",
  fontWeight: "bold",
};

export default AdminItian;