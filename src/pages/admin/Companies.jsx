import React, { useState } from "react";
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
  TextField,
  Button,
  Box,
  CircularProgress,
  Typography,
  Alert, // For showing errors/success
} from "@mui/material";
import { FaCheckCircle } from "react-icons/fa"; // Using a check icon for verify

// Import your API service functions
import { getUnverifiedCompanies, verifyCompany } from "../../services/Admin"; // Adjust path as needed

function AdminCompany() {
  const queryClient = useQueryClient(); // Get QueryClient instance
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [verificationStatus, setVerificationStatus] = useState({ // For feedback
    message: "",
    severity: "info", // 'success' or 'error'
    companyId: null,
  });
  const [searchQuery, setSearchQuery] = useState("");


  // --- Data Fetching ---
  const {
    data: companyData, // Rename data to be more specific
    error: fetchError,
    isLoading: isFetching,
    isFetching: isRefetching, // Indicates background refetching
  } = useQuery({
    // Unique query key including pagination parameters
    queryKey: ["unverifiedCompanies", page, rowsPerPage, searchQuery],
    queryFn: async () => {
      // Pass current page and rowsPerPage to the API call
      // API uses 1-based indexing for page, MUI uses 0-based
      const data = await getUnverifiedCompanies(page + 1, rowsPerPage, searchQuery);
      return data; // Expect { count, results }
    },
    keepPreviousData: true, // Keep showing old data while fetching new page
    staleTime: 5 * 60 * 1000, // Optional: Data considered fresh for 5 minutes
  });

  // --- Data Mutation (Verification) ---
  const verifyMutation = useMutation({
    mutationFn: verifyCompany, // The function that performs the PATCH request
    onSuccess: (data, companyId) => {
      console.log("Verification successful:", data);
      setVerificationStatus({
        message: data.message || `Company verified successfully!`,
        severity: "success",
        companyId: companyId,
      });
      // Invalidate the query to trigger a refetch
      // This will refetch the *current* page
      queryClient.invalidateQueries({ queryKey: ["unverifiedCompanies"] });
      // Optionally, clear the success message after a few seconds
      setTimeout(() => setVerificationStatus({ message: "", severity: "info", companyId: null }), 3000);
    },
    onError: (error, companyId) => {
      console.error("Verification failed:", error);
      setVerificationStatus({
        message: `Failed to verify company ${companyId}. ${error?.response?.data?.detail || error.message}`,
        severity: "error",
        companyId: companyId,
      });
      // Optionally, clear the error message after some time
      setTimeout(() => setVerificationStatus({ message: "", severity: "info", companyId: null }), 5000);
    },
  });

  // --- Event Handlers ---
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when changing rows per page
  };

  const handleVerifyClick = (companyId) => {
     setVerificationStatus({ message: "", severity: "info", companyId: null }); // Clear previous status
     verifyMutation.mutate(companyId); // Trigger the mutation
  };

  // --- Render Logic ---
  const companies = companyData?.results || [];
  const totalCompanies = companyData?.count || 0;

  return (
    <Box sx={{ padding: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
      <TextField
        label="Search by Name or Email"
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

      <Typography variant="h4" gutterBottom sx={{ textAlign: "center", mb: 3 }}>
        Verify Companies
      </Typography>

      {/* Display Feedback Messages */}
      {verificationStatus.message && verificationStatus.companyId && (
        <Alert severity={verificationStatus.severity} sx={{ mb: 2 }}>
          {verificationStatus.message}
        </Alert>
      )}

      {isFetching && !isRefetching && ( // Show main loading spinner only on initial load/page change
        <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
          <CircularProgress />
        </Box>
      )}

      {fetchError && ( // Show fetch error
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load companies: {fetchError.message}
        </Alert>
      )}

      {!isFetching && !fetchError && companies.length === 0 && (
         <Typography sx={{ textAlign: "center", mt: 4, color: "text.secondary" }}>
             No unverified companies found.
         </Typography>
      )}

      {!isFetching && !fetchError && companies.length > 0 && (
        <Paper sx={{ width: "100%", overflow: "hidden", mt: isRefetching ? 1 : 0 }}>
           {/* Optional: Indicate background refetching */}
           {isRefetching && (
             <Box sx={{ display: 'flex', justifyContent: 'center', p: 1, opacity: 0.7}}>
               <CircularProgress size={20} />
               <Typography sx={{ml: 1}} variant="caption">Updating...</Typography>
             </Box>
           )}
          <TableContainer sx={{ maxHeight: 600 }}> {/* Adjust max height as needed */}
            <Table stickyHeader aria-label="unverified companies table">
              <TableHead>
                <TableRow>
                  <TableCell sx={headerStyle}>Company Name</TableCell>
                  <TableCell sx={headerStyle}>Email</TableCell>
                  <TableCell sx={headerStyle} align="center">Accounts</TableCell>
                  <TableCell sx={headerStyle} align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {companies.map((company, index) => (
                  <TableRow
                    hover // Add hover effect
                    key={company.id}
                    sx={{
                      backgroundColor: index % 2 === 0 ? "#ffffff" : "#f9f9f9", // Subtle striping
                    }}
                  >
                    <TableCell>{company.name || "N/A"}</TableCell>
                    <TableCell>{company.email || "N/A"}</TableCell>
                    
                    <TableCell>
                      {company.accounts ? (
                        Object.entries(company.accounts).map(([key, value]) => (
                          value ? (
                            <a
                              key={key}
                              href={value}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {key.charAt(0).toUpperCase() + key.slice(1)}{" "}
                            </a>
                          ) : null
                        ))
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          N/A
                        </Typography>
                      )}
                    </TableCell>
                    {/* Add other cells */}
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        color="success" // Use success color for verify action
                        size="small"
                        startIcon={verifyMutation.isLoading && verifyMutation.variables === company.id ? <CircularProgress size={16} color="inherit" /> : <FaCheckCircle />}
                        onClick={() => handleVerifyClick(company.id)}
                        disabled={verifyMutation.isLoading && verifyMutation.variables === company.id} // Disable only the button clicked while processing
                      >
                        {verifyMutation.isLoading && verifyMutation.variables === company.id ? 'Verifying...' : 'Verify'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]} // Standard options
            component="div"
            count={totalCompanies} // Total number of items from API
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
  backgroundColor: "black", // Or theme primary color: theme.palette.primary.main
  color: "#ffffff",
  fontWeight: "bold",
};

export default AdminCompany;