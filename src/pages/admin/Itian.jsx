import React, { useState, useRef } from "react";
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
} from "@mui/material";
import { FaTrashAlt, FaUserPlus, FaFileUpload } from "react-icons/fa"; // Icons

// Import your API service functions
import {
  getItians,
  createItianSingle,
  createItianBulk,
  deleteItian,
} from "../../services/Admin"; // Adjust path as needed

function AdminItian() {
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
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: "center", mb: 3 }}>
        Manage ITIans
      </Typography>

      {/* Display Feedback Messages */}
      {feedback.message && (
        <Alert severity={feedback.severity} sx={{ mb: 2 }} onClose={() => setFeedback({ message: "", severity: "info"})}>
          {feedback.message}
        </Alert>
      )}

      {/* --- Creation Forms --- */}
      <Grid container spacing={4} sx={{ mb: 4 }}>
        {/* Single Create Form */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Add Single ITIan
            </Typography>
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
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 2, mb: 1 }}
                disabled={singleCreateMutation.isLoading}
                startIcon={singleCreateMutation.isLoading ? <CircularProgress size={20} color="inherit" /> : <FaUserPlus />}
              >
                {singleCreateMutation.isLoading ? "Adding..." : "Add ITIan"}
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Bulk Create Form */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Add ITIans from File
            </Typography>
            <Box component="form" onSubmit={handleBulkSubmit} noValidate>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Upload a .csv or .xlsx file with 'email' and 'national_id' columns.
              </Typography>
              <Button
                variant="outlined"
                component="label" // Makes the button act like a label for the hidden input
                fullWidth
                sx={{ mt: 1, mb: 2 }}
                disabled={bulkCreateMutation.isLoading}
              >
                 {selectedFile ? `File: ${selectedFile.name}` : "Choose File"}
                <input
                  type="file"
                  hidden
                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" // Accept specific types
                  onChange={handleFileChange}
                  ref={fileInputRef} // Assign ref
                  disabled={bulkCreateMutation.isLoading}
                />
              </Button>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={!selectedFile || bulkCreateMutation.isLoading}
                startIcon={bulkCreateMutation.isLoading ? <CircularProgress size={20} color="inherit" /> : <FaFileUpload />}
              >
                {bulkCreateMutation.isLoading ? "Uploading..." : "Upload and Add"}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />
      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
      <TextField
        label="Search by Email or National ID"
        variant="outlined"
        size="small"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setPage(0); // reset to first page when searching
        }}
        sx={{ width: "60%" }}
      />
    </Box>


      {/* --- Itian Table --- */}
      <Typography variant="h5" gutterBottom sx={{ textAlign: "center", mb: 2 }}>
         Existing ITIans
      </Typography>

       {/* Loading/Error/Empty States for Table */}
       {isFetchingItians && !isRefetchingItians && (
           <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
             <CircularProgress />
           </Box>
         )}

         {fetchError && (
           <Alert severity="error" sx={{ mb: 2 }}>
             Failed to load ITIans: {fetchError.message}
           </Alert>
         )}

         {!isFetchingItians && !fetchError && itians.length === 0 && (
            <Typography sx={{ textAlign: "center", mt: 4, color: "text.secondary" }}>
                No ITIans found.
            </Typography>
         )}

       {/* Actual Table */}
       {!isFetchingItians && !fetchError && itians.length > 0 && (
         <Paper sx={{ width: "100%", overflow: "hidden" }}>
            {/* Optional: Indicate background refetching */}
            {isRefetchingItians && (
               <Box sx={{ display: 'flex', justifyContent: 'center', p: 1, opacity: 0.7}}>
                 <CircularProgress size={20} />
                 <Typography sx={{ml: 1}} variant="caption">Updating list...</Typography>
               </Box>
             )}
           <TableContainer sx={{ maxHeight: 600 }}>
             <Table stickyHeader aria-label="itians table">
               <TableHead>
                 <TableRow>
                   <TableCell sx={headerStyle}>Email</TableCell>
                   <TableCell sx={headerStyle}>National ID</TableCell>
                   <TableCell sx={headerStyle} align="center">Action</TableCell>
                 </TableRow>
               </TableHead>
               <TableBody>
                 {itians.map((itian) => (
                   <TableRow hover key={itian.id}>
                     <TableCell>{itian.email}</TableCell>
                     <TableCell>{itian.national_id}</TableCell>
                     <TableCell align="center">
                       <IconButton
                         aria-label="delete itian"
                         color="error"
                         size="small"
                         onClick={() => handleDeleteClick(itian.id)}
                         // Disable button for the specific item being deleted
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