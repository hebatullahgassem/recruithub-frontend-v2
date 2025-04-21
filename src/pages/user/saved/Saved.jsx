// import React, { useContext, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import JobCard from "../../../components/job/JobCard";
// import { useQuery } from "@tanstack/react-query";
// import { getAllJobs } from "../../../services/Job";
// import { getApplicationsByUser } from "../../../services/Application";
// import { userContext } from "../../../context/UserContext";
// import CustomPagination from "../../../components/pagination/pagination";
// import { 
//   Box,
//   Typography,
//   Button,
//   Container,
//   TextField,
//   InputAdornment,
//   Grid,
//   Paper,
//   IconButton,
//   useTheme,
//   useMediaQuery,
//   Fade,
// } from "@mui/material";
// import { motion, AnimatePresence } from "framer-motion"
// import { Search, Briefcase, Filter, X, ChevronDown, ChevronUp, User, FileText, Clock } from "lucide-react";
// function UserSaved() {
//   const theme = useTheme()
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
//   const isTablet = useMediaQuery(theme.breakpoints.down("md"))
//   const primaryColor = "#d43132"
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [total, setTotal] = useState(0);
//   const { user } = useContext(userContext);
//   const navigate = useNavigate();
//   const [filtersOpen, setFiltersOpen] = useState(false)
//   const [filters, setFilters] = useState({
//     user: "",
//     job_title: "",
//     company_name: "",
//     status: "",
//   });

//   const [searchFilters, setSearchFilters] = useState({
//     user: `${user.id}`,
//     job_title: "",
//     company_name: "",
//     status: "1",
//   });

//   const {
//     data: saved,
//     error: savedError,
//     isLoading: savedLoading,
//     refetch,
//   } = useQuery({
//     queryKey: ["saved", page, pageSize, searchFilters],
//     queryFn: async () => {
//       const res = await getApplicationsByUser({
//         filters: searchFilters,
//         page,
//         pageSize,
//       });
//       console.log(res);
//       setTotal(res.count);
//       return res.results;
//     },
//   });

//   const handleChange = (e) => {
//     setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleSearch = () => {
//     setSearchFilters(filters); // Update search filters
//     setPage(1); // Reset to first page
//     refetch(); // Fetch with new filters
//     if (isMobile) setFiltersOpen(false)
//   };

//   const handleReset = () => {
//     setFilters({ user: "", job_title: "", company_name: "", status: "" });
//     setSearchFilters({ user: "", job_title: "", company_name: "", status: "" });
//     setPage(1); // Reset page
//     refetch(); // Fetch without filters
//   };
   
//   const hasActiveFilters =  filters.job_title || filters.company_name || filters.status;

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//       },
//     },
//   };
//   const itemVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { opacity: 1, y: 0 },
//   };
//   return (
//     // <div className="d-flex flex-column align-items-center w-100" style={{ minHeight: "70vh" }}>
//     //   <h2 className="m-3">Your Saved Jobs</h2>
//     //   {/* <div className="filters mb-3 d-flex flex-column align-items-center gap-2">
//     //     <div className="d-flex gap-2">
//     //       <input
//     //         type="text"
//     //         className="form-control"
//     //         placeholder="User"
//     //         name="user"
//     //         value={filters.user}
//     //         onChange={handleChange}
//     //       />
//     //       <input
//     //         type="text"
//     //         className="form-control"
//     //         placeholder="Job"
//     //         name="job"
//     //         value={filters.job}
//     //         onChange={handleChange}
//     //       />
//     //       <input
//     //         type="text"
//     //         className="form-control"
//     //         placeholder="Status"
//     //         name="status"
//     //         value={filters.status}
//     //         onChange={handleChange}
//     //       />
//     //     </div>
//     //     <div className="d-flex gap-2">
//     //       <button
//     //         disabled={
//     //           !(
//     //             filters.user ||
//     //             filters.job ||
//     //             filters.status
//     //           )
//     //         }
//     //         onClick={handleReset}
//     //         className="btn btn-danger"
//     //       >
//     //         Reset
//     //       </button>
//     //       <button
//     //         disabled={
//     //           !(
//     //             filters.user ||
//     //             filters.job ||
//     //             filters.status
//     //           )
//     //         }
//     //         onClick={handleSearch}
//     //         className="btn btn-primary"
//     //       >
//     //         Search
//     //       </button>
//     //     </div>
//     //   </div> */}
//     //   {saved && saved.length ? (
//     //     saved?.map((save) => (
//     //       <JobCard
//     //         key={save.id}
//     //         job={save.job_details}
//     //         user={"user"}
//     //         type={"saved"}
//     //       />
//     //     ))
//     //   ) : (
//     //     <div
//     //       style={{
//     //         minHeight: "30vh",
//     //         display: "flex",
//     //         flexDirection: "column",
//     //         justifyContent: "center",
//     //         alignItems: "center",
//     //       }}
//     //     >
//     //       <Typography variant="h4">No applications found</Typography>
//     //       <button
//     //         className="btn btn-primary"
//     //         onClick={() => navigate("/applicant/jobs")}
//     //       >
//     //         Browse Jobs
//     //       </button>
//     //     </div>
//     //   )}
//     //   {saved && saved.length > 0 && (
//     //     <CustomPagination
//     //       page={page}
//     //       setPage={setPage}
//     //       pageSize={pageSize}
//     //       setPageSize={setPageSize}
//     //       total={total}
//     //     />
//     //   )}
//     // </div>
//     <Container maxWidth="lg" sx={{ py: 4 }}>
//       <Box
//         component={motion.div}
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         sx={{
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           width: "100%",
//           minHeight: "70vh",
//         }}
//       >
//         {/* Header Section */}
//         <Box
//           sx={{
//             width: "100%",
//             mb: 3,
//             display: "flex",
//             flexDirection: isMobile ? "column" : "row",
//             justifyContent: "space-between",
//             alignItems: isMobile ? "flex-start" : "center",
//             gap: 2,
//           }}
//         >
//           <Box>
//             <Typography
//               variant="h4"
//               component="h1"
//               sx={{
//                 fontWeight: 700,
//                 color: "#2d3748",
//                 mb: 1,
//               }}
//             >
//               Your Saved Jobs
//             </Typography>
//             <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600 }}>
//               Track and manage all the positions you've saved for future reference
//             </Typography>
//           </Box>

//           <Box sx={{ display: "flex", gap: 2 }}>
//             <Button
//               variant="outlined"
//               startIcon={<Filter size={18} />}
//               endIcon={filtersOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//               onClick={() => setFiltersOpen(!filtersOpen)}
//               sx={{
//                 borderColor: "#e2e8f0",
//                 color: "#4a5568",
//                 borderRadius: "8px",
//                 px: 2,
//                 py: 1,
//                 fontWeight: 600,
//                 "&:hover": {
//                   borderColor: primaryColor,
//                   backgroundColor: `${primaryColor}05`,
//                 },
//                 textTransform: "none",
//               }}
//             >
//               Filters
//             </Button>

//             <Button
//               variant="contained"
//               startIcon={<Search size={18} />}
//               onClick={() => navigate("/applicant/jobs")}
//               sx={{
//                 backgroundColor: primaryColor,
//                 borderRadius: "8px",
//                 px: 3,
//                 py: 1,
//                 fontWeight: 600,
//                 "&:hover": {
//                   backgroundColor: "#b32828",
//                   boxShadow: `0 4px 14px ${primaryColor}33`,
//                 },
//                 textTransform: "none",
//               }}
//             >
//               Browse Jobs
//             </Button>
//           </Box>
//         </Box>

//         {/* Filters Section */}
//         <AnimatePresence>
//           {filtersOpen && (
//             <motion.div
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: "auto" }}
//               exit={{ opacity: 0, height: 0 }}
//               transition={{ duration: 0.3 }}
//               style={{ width: "100%", overflow: "hidden" }}
//             >
//               <Paper
//                 elevation={0}
//                 sx={{
//                   p: 3,
//                   mb: 3,
//                   borderRadius: "12px",
//                   border: "1px solid #e2e8f0",
//                   width: "100%",
//                 }}
//               >
//                 <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
//                   <Typography variant="h6" sx={{ fontWeight: 600, color: "#2d3748" }}>
//                     Filter Saved Jobs
//                   </Typography>

//                   <IconButton size="small" onClick={() => setFiltersOpen(false)} sx={{ color: "#718096" }}>
//                     <X size={18} />
//                   </IconButton>
//                 </Box>

//                 <Grid container spacing={2}>
//                   <Grid item xs={12} md={4}>
//                     <TextField
//                       fullWidth
//                       placeholder="User ID"
//                       name="user"
//                       value={filters.user}
//                       onChange={handleChange}
//                       variant="outlined"
//                       size="small"
//                       InputProps={{
//                         startAdornment: (
//                           <InputAdornment position="start">
//                             <User size={18} color="#718096" />
//                           </InputAdornment>
//                         ),
//                       }}
//                       sx={{
//                         "& .MuiOutlinedInput-root": {
//                           borderRadius: "8px",
//                         },
//                       }}
//                     />
//                   </Grid>

//                   <Grid item xs={12} md={4}>
//                     <TextField
//                       fullWidth
//                       placeholder="Job Title"
//                       name="job"
//                       value={filters.job}
//                       onChange={handleChange}
//                       variant="outlined"
//                       size="small"
//                       InputProps={{
//                         startAdornment: (
//                           <InputAdornment position="start">
//                             <FileText size={18} color="#718096" />
//                           </InputAdornment>
//                         ),
//                       }}
//                       sx={{
//                         "& .MuiOutlinedInput-root": {
//                           borderRadius: "8px",
//                         },
//                       }}
//                     />
//                   </Grid>

//                   <Grid item xs={12} md={4}>
//                     <FormControl fullWidth size="small" variant="outlined">
//                       <Select
//                         name="status"
//                         value={filters.status}
//                         onChange={handleChange}
//                         displayEmpty
//                         renderValue={
//                           filters.status !== ""
//                             ? undefined
//                             : () => (
//                                 <Box sx={{ display: "flex", alignItems: "center", color: "#718096" }}>
//                                   <Clock size={18} style={{ marginRight: "8px" }} />
//                                   <span>Select Status</span>
//                                 </Box>
//                               )
//                         }
//                         sx={{
//                           borderRadius: "8px",
//                         }}
//                       >
//                         <MenuItem value="">
//                           <em>None</em>
//                         </MenuItem>
//                         <MenuItem value="1">Applied</MenuItem>
//                         <MenuItem value="2">Under Review</MenuItem>
//                         <MenuItem value="3">Shortlisted</MenuItem>
//                         <MenuItem value="4">Interview</MenuItem>
//                         <MenuItem value="5">Offered</MenuItem>
//                         <MenuItem value="6">Rejected</MenuItem>
//                       </Select>
//                     </FormControl>
//                   </Grid>
//                 </Grid>

//                 <Box
//                   sx={{
//                     display: "flex",
//                     justifyContent: "flex-end",
//                     gap: 2,
//                     mt: 3,
//                     flexDirection: isMobile ? "column" : "row",
//                   }}
//                 >
//                   <Button
//                     variant="outlined"
//                     disabled={!hasActiveFilters}
//                     onClick={handleReset}
//                     startIcon={<X size={18} />}
//                     sx={{
//                       borderColor: "#e2e8f0",
//                       color: "#718096",
//                       borderRadius: "8px",
//                       px: 3,
//                       "&:hover": {
//                         borderColor: "#cbd5e0",
//                         backgroundColor: "#f7fafc",
//                       },
//                       textTransform: "none",
//                       fontWeight: 600,
//                       width: isMobile ? "100%" : "auto",
//                     }}
//                   >
//                     Reset
//                   </Button>

//                   <Button
//                     variant="contained"
//                     disabled={!hasActiveFilters}
//                     onClick={handleSearch}
//                     startIcon={<Search size={18} />}
//                     sx={{
//                       backgroundColor: primaryColor,
//                       borderRadius: "8px",
//                       px: 3,
//                       "&:hover": {
//                         backgroundColor: "#b32828",
//                       },
//                       textTransform: "none",
//                       fontWeight: 600,
//                       width: isMobile ? "100%" : "auto",
//                     }}
//                   >
//                     Apply Filters
//                   </Button>
//                 </Box>

//                 {hasActiveFilters && (
//                   <Box sx={{ mt: 3, pt: 2, borderTop: "1px solid #e2e8f0" }}>
//                     <Typography variant="body2" sx={{ color: "#718096", mb: 1 }}>
//                       Active filters:
//                     </Typography>
//                     <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
//                       {filters.user && (
//                         <Chip
//                           label={`User: ${filters.user}`}
//                           onDelete={() => setFilters((prev) => ({ ...prev, user: "" }))}
//                           size="small"
//                           sx={{
//                             backgroundColor: `${primaryColor}10`,
//                             color: primaryColor,
//                             fontWeight: 500,
//                           }}
//                         />
//                       )}
//                       {filters.job && (
//                         <Chip
//                           label={`Job: ${filters.job}`}
//                           onDelete={() => setFilters((prev) => ({ ...prev, job: "" }))}
//                           size="small"
//                           sx={{
//                             backgroundColor: `${primaryColor}10`,
//                             color: primaryColor,
//                             fontWeight: 500,
//                           }}
//                         />
//                       )}
//                       {filters.status && (
//                         <Chip
//                           label={`Status: ${
//                             filters.status === "1"
//                               ? "Applied"
//                               : filters.status === "2"
//                                 ? "Under Review"
//                                 : filters.status === "3"
//                                   ? "Shortlisted"
//                                   : filters.status === "4"
//                                     ? "Interview"
//                                     : filters.status === "5"
//                                       ? "Offered"
//                                       : filters.status === "6"
//                                         ? "Rejected"
//                                         : filters.status
//                           }`}
//                           onDelete={() => setFilters((prev) => ({ ...prev, status: "" }))}
//                           size="small"
//                           sx={{
//                             backgroundColor: `${primaryColor}10`,
//                             color: primaryColor,
//                             fontWeight: 500,
//                           }}
//                         />
//                       )}
//                     </Box>
//                   </Box>
//                 )}
//               </Paper>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Content Section */}
//         {savedLoading ? (
//           <Box sx={{ width: "100%", py: 4 }}>
//             {[1, 2, 3].map((_, index) => (
//               <Paper
//                 key={index}
//                 elevation={0}
//                 sx={{
//                   p: 3,
//                   mb: 3,
//                   borderRadius: "12px",
//                   border: "1px solid #e2e8f0",
//                   width: "100%",
//                   height: "200px",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   backgroundColor: "#f8fafc",
//                 }}
//               >
//                 <motion.div
//                   animate={{
//                     opacity: [0.5, 1, 0.5],
//                   }}
//                   transition={{
//                     repeat: Number.POSITIVE_INFINITY,
//                     duration: 1.5,
//                   }}
//                 >
//                   <Typography variant="body1" color="text.secondary">
//                     Loading saved jobs...
//                   </Typography>
//                 </motion.div>
//               </Paper>
//             ))}
//           </Box>
//         ) : savedError ? (
//           <Paper
//             elevation={0}
//             sx={{
//               p: 4,
//               borderRadius: "12px",
//               border: "1px solid #fed7d7",
//               backgroundColor: "#fff5f5",
//               width: "100%",
//               textAlign: "center",
//               my: 4,
//             }}
//           >
//             <Typography variant="h6" sx={{ color: "#c53030", mb: 1 }}>
//               Error Loading Saved Jobs
//             </Typography>
//             <Typography variant="body2" sx={{ color: "#742a2a", mb: 2 }}>
//               There was a problem retrieving your saved jobs. Please try again later.
//             </Typography>
//             <Button
//               variant="outlined"
//               onClick={() => refetch()}
//               sx={{
//                 borderColor: "#c53030",
//                 color: "#c53030",
//                 "&:hover": {
//                   backgroundColor: "#fff5f5",
//                   borderColor: "#9b2c2c",
//                 },
//               }}
//             >
//               Retry
//             </Button>
//           </Paper>
//         ) : saved && saved.length > 0 ? (
//           <Box
//             component={motion.div}
//             variants={containerVariants}
//             initial="hidden"
//             animate="visible"
//             sx={{ width: "100%" }}
//           >
//             <Box sx={{ mb: 2 }}>
//               <Typography variant="body2" color="text.secondary">
//                 Showing {saved.length} of {total} saved jobs
//               </Typography>
//             </Box>

//             {saved.map((save, index) => (
//               <Box component={motion.div} key={save.id} variants={itemVariants} custom={index} sx={{ mb: 3 }}>
//                 <JobCard job={save.job_details} user={"user"} type={"saved"} />
//               </Box>
//             ))}

//             {total > pageSize && (
//               <Box
//                 sx={{
//                   mt: 4,
//                   display: "flex",
//                   justifyContent: "center",
//                   p: 2,
//                   borderRadius: "12px",
//                   backgroundColor: "#f8fafc",
//                 }}
//               >
//                 <CustomPagination
//                   page={page}
//                   setPage={setPage}
//                   pageSize={pageSize}
//                   setPageSize={setPageSize}
//                   total={total}
//                 />
//               </Box>
//             )}
//           </Box>
//         ) : (
//           <Box
//             component={motion.div}
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.5 }}
//             sx={{
//               width: "100%",
//               py: 8,
//               display: "flex",
//               flexDirection: "column",
//               justifyContent: "center",
//               alignItems: "center",
//               gap: 3,
//               backgroundColor: "#f8fafc",
//               borderRadius: "16px",
//               border: "1px dashed #e2e8f0",
//             }}
//           >
//             <Box
//               sx={{
//                 width: 80,
//                 height: 80,
//                 borderRadius: "50%",
//                 backgroundColor: `${primaryColor}10`,
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 mb: 2,
//               }}
//             >
//               <Briefcase size={40} color={primaryColor} />
//             </Box>
//             <Typography
//               variant="h5"
//               sx={{
//                 fontWeight: 700,
//                 textAlign: "center",
//                 color: "#2d3748",
//               }}
//             >
//               No Saved Jobs Found
//             </Typography>
//             <Typography
//               variant="body1"
//               color="text.secondary"
//               sx={{
//                 textAlign: "center",
//                 maxWidth: 500,
//                 mb: 2,
//                 px: 3,
//               }}
//             >
//               You haven't saved any jobs yet. Browse available positions and save the ones you're interested in for
//               future reference.
//             </Typography>
//             <Button
//               variant="contained"
//               size="large"
//               onClick={() => navigate("/applicant/jobs")}
//               sx={{
//                 backgroundColor: primaryColor,
//                 borderRadius: "8px",
//                 px: 4,
//                 py: 1.5,
//                 fontWeight: 600,
//                 "&:hover": {
//                   backgroundColor: "#b32828",
//                   boxShadow: `0 4px 14px ${primaryColor}33`,
//                 },
//                 textTransform: "none",
//               }}
//             >
//               Browse Available Jobs
//             </Button>
//           </Box>
//         )}
//       </Box>
//     </Container>
//   );
// }

// export default UserSaved;
"use client"

import { useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import JobCard from "../../../components/job/JobCard"
import { useQuery } from "@tanstack/react-query"
import { getApplicationsByUser } from "../../../services/Application"
import { userContext } from "../../../context/UserContext"
import CustomPagination from "../../../components/pagination/pagination"
import {
  Box,
  Typography,
  Button,
  Container,
  TextField,
  InputAdornment,
  Grid,
  Paper,
  IconButton,
  useTheme,
  useMediaQuery,
  Fade,
} from "@mui/material"
import { motion } from "framer-motion"
import { Search, Briefcase, X, FileText } from "lucide-react"
import { Building2 } from "lucide-react" // Import Building2 icon

function UserSaved() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.down("md"))
  const primaryColor = "#d43132"
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const { user } = useContext(userContext)
  const navigate = useNavigate()

  // Search states
  const [jobTitle, setJobTitle] = useState("")
  const [company, setCompany] = useState("")
  const [debouncedJobTitle, setDebouncedJobTitle] = useState("")
  const [debouncedCompany, setDebouncedCompany] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  // Filters state
  const [filters, setFilters] = useState({
    user: `${user.id}`,
    job_title: "",
    company_name: "",
    status: "1",
  })

  const [searchFilters, setSearchFilters] = useState({
    user: `${user.id}`,
    job_title: "",
    company_name: "",
    status: "1",
  })

  // Debounce job title input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedJobTitle(jobTitle)
      setFilters((prev) => ({ ...prev, job_title: jobTitle }))
    }, 500)
    return () => clearTimeout(timer)
  }, [jobTitle])

  // Debounce company input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCompany(company)
      setFilters((prev) => ({ ...prev, company_name: company }))
    }, 500)
    return () => clearTimeout(timer)
  }, [company])

  // Update search when debounced values change
  useEffect(() => {
    if (debouncedJobTitle !== "" || debouncedCompany !== "") {
      setIsSearching(true)
      handleSearch()
    } else if (debouncedJobTitle === "" && debouncedCompany === "" && isSearching) {
      setIsSearching(false)
      handleReset()
    }
  }, [debouncedJobTitle, debouncedCompany])

  const {
    data: saved,
    error: savedError,
    isLoading: savedLoading,
    refetch,
  } = useQuery({
    queryKey: ["saved", page, pageSize, searchFilters],
    queryFn: async () => {
      const res = await getApplicationsByUser({
        filters: searchFilters,
        page,
        pageSize,
      })
      setTotal(res.count)
      return res.results
    },
  })

  const handleSearch = () => {
    setSearchFilters({
      ...filters,
      user: `${user.id}`,
      status: "1",
    })
    setPage(1)
    refetch()
  }

  const handleReset = () => {
    setFilters({
      user: `${user.id}`,
      job_title: "",
      company_name: "",
      status: "1",
    })
    setSearchFilters({
      user: `${user.id}`,
      job_title: "",
      company_name: "",
      status: "1",
    })
    setPage(1)
    refetch()
  }

  const handleClearSearch = () => {
    setJobTitle("")
    setCompany("")
    setIsSearching(false)
    handleReset()
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        minHeight: "70vh",
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          width: "100%",
          mb: 3,
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: isMobile ? "flex-start" : "center",
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              color: "#2d3748",
              mb: 1,
            }}
          >
            Your Saved Jobs
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600 }}>
            Track and manage all the positions you've saved for future reference
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Search size={18} />}
          onClick={() => navigate("/applicant/jobs")}
          sx={{
            backgroundColor: primaryColor,
            borderRadius: "8px",
            px: 3,
            py: 1,
            fontWeight: 600,
            "&:hover": {
              backgroundColor: "#b32828",
              boxShadow: `0 4px 14px ${primaryColor}33`,
            },
            textTransform: "none",
          }}
        >
          Browse Jobs
        </Button>
      </Box>

      {/* Search Section */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
          width: "100%",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              placeholder="Search by job title"
              name="job_title"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FileText size={18} color="#718096" />
                  </InputAdornment>
                ),
                endAdornment: jobTitle ? (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setJobTitle("")}>
                      <X size={16} />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            />
          </Grid>

          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              placeholder="Search by company"
              name="company_name"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Building2 size={18} color="#718096" />
                  </InputAdornment>
                ),
                endAdornment: company ? (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setCompany("")}>
                      <X size={16} />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              disabled={!isSearching}
              onClick={handleClearSearch}
              startIcon={<X size={18} />}
              sx={{
                height: "40px",
                borderColor: "#e2e8f0",
                color: "#718096",
                borderRadius: "8px",
                "&:hover": {
                  borderColor: "#cbd5e0",
                  backgroundColor: "#f7fafc",
                },
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Clear
            </Button>
          </Grid>
        </Grid>

        {isSearching && (
          <Fade in={isSearching}>
            <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid #e2e8f0" }}>
              <Typography variant="body2" sx={{ color: "#718096" }}>
                Filtering by: {debouncedJobTitle && `Job Title containing "${debouncedJobTitle}"`}
                {debouncedJobTitle && debouncedCompany && " and "}
                {debouncedCompany && `Company containing "${debouncedCompany}"`}
              </Typography>
            </Box>
          </Fade>
        )}
      </Paper>

      {/* Content Section */}
      {savedLoading ? (
        <Box sx={{ width: "100%", py: 4 }}>
          {[1, 2, 3].map((_, index) => (
            <Paper
              key={index}
              elevation={0}
              sx={{
                p: 3,
                mb: 3,
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                width: "100%",
                height: "200px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f8fafc",
              }}
            >
              <motion.div
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 1.5,
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  Loading saved jobs...
                </Typography>
              </motion.div>
            </Paper>
          ))}
        </Box>
      ) : savedError ? (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: "12px",
            border: "1px solid #fed7d7",
            backgroundColor: "#fff5f5",
            width: "100%",
            textAlign: "center",
            my: 4,
          }}
        >
          <Typography variant="h6" sx={{ color: "#c53030", mb: 1 }}>
            Error Loading Saved Jobs
          </Typography>
          <Typography variant="body2" sx={{ color: "#742a2a", mb: 2 }}>
            There was a problem retrieving your saved jobs. Please try again later.
          </Typography>
          <Button
            variant="outlined"
            onClick={() => refetch()}
            sx={{
              borderColor: "#c53030",
              color: "#c53030",
              "&:hover": {
                backgroundColor: "#fff5f5",
                borderColor: "#9b2c2c",
              },
            }}
          >
            Retry
          </Button>
        </Paper>
      ) : saved && saved.length > 0 ? (
        <Box
          component={motion.div}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          sx={{ width: "100%" }}
        >
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Showing {saved.length} of {total} saved jobs
              {isSearching && " matching your search"}
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {saved.map((save, index) => (
              <Grid item xs={12} md={6} key={save.id}>
                <Box component={motion.div} variants={itemVariants} custom={index}>
                  <JobCard job={save.job_details} user={"user"} type={"saved"} />
                </Box>
              </Grid>
            ))}
          </Grid>

          {total > pageSize && (
            <Box
              sx={{
                mt: 4,
                display: "flex",
                justifyContent: "center",
                p: 2,
                borderRadius: "12px",
                backgroundColor: "#f8fafc",
              }}
            >
              <CustomPagination
                page={page}
                setPage={setPage}
                pageSize={pageSize}
                setPageSize={setPageSize}
                total={total}
              />
            </Box>
          )}
        </Box>
      ) : (
        <Box
          component={motion.div}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          sx={{
            width: "100%",
            py: 8,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 3,
            backgroundColor: "#f8fafc",
            borderRadius: "16px",
            border: "1px dashed #e2e8f0",
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              backgroundColor: `${primaryColor}10`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <Briefcase size={40} color={primaryColor} />
          </Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              textAlign: "center",
              color: "#2d3748",
            }}
          >
            {isSearching ? "No Matching Jobs Found" : "No Saved Jobs Found"}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              textAlign: "center",
              maxWidth: 500,
              mb: 2,
              px: 3,
            }}
          >
            {isSearching
              ? "Try adjusting your search criteria to find more results."
              : "You haven't saved any jobs yet. Browse available positions and save the ones you're interested in for future reference."}
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={isSearching ? handleClearSearch : () => navigate("/applicant/jobs")}
            sx={{
              backgroundColor: primaryColor,
              borderRadius: "8px",
              px: 4,
              py: 1.5,
              fontWeight: 600,
              "&:hover": {
                backgroundColor: "#b32828",
                boxShadow: `0 4px 14px ${primaryColor}33`,
              },
              textTransform: "none",
            }}
          >
            {isSearching ? "Clear Search" : "Browse Available Jobs"}
          </Button>
        </Box>
      )}
    </Box>
  </Container>
  )
}

export default UserSaved
