import React, { useContext, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllJobs } from '../../../services/Job';
import { getAllApplications } from '../../../services/Application';
import { userContext } from '../../../context/UserContext';
import { useNavigate } from 'react-router';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Typography, 
  Box, 
  CircularProgress, 
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const STATUS_MAP = {
  '1': "Saved",
  '2': "Applied",
  '3': "Technical Assessment",
  '4': "Technical Interview",
  '5': "HR Interview",
  '6': "Offer Interview"
};

const JobsDashboard = () => {
  const { user } = useContext(userContext);
  const navigate = useNavigate();
  const [expandedJob, setExpandedJob] = useState(null);
  const [jobStats, setJobStats] = useState({});
  console.log("user",user);
  // Fetch all jobs
  const { 
    data: jobsResponse, 
    isLoading: jobsLoading, 
    error: jobsError 
  } = useQuery({
    queryKey: ['allJobs'],
    queryFn: () => getAllJobs({ filters: {company: user.id}, page: 1, pageSize: 1000 })
  });

  // Extract jobs data from response
  const alljobs = jobsResponse?.data?.results || [];
  // console.log ("job companyid",jobs.company.id)
  console.log("companyid",user?.comapny_id)
  const jobs= alljobs.filter(job => job.company.id === user?.company_id);
  console.log("jobs",jobs);
  // Fetch all applications
  const { 
    data: applicationsResponse, 
    isLoading: appsLoading, 
    error: appsError 
  } = useQuery({
    queryKey: ['allApplications'],
    queryFn:() => getAllApplications().then(res => {
      // Handle both paginated and non-paginated responses
      return Array.isArray(res) ? res : (res.results || []);
    })
  });

  // Extract applications data from response
  const applications = applicationsResponse?.data || applicationsResponse || [];
  console.log("applications",applications);
  // Calculate statistics when data loads
  useEffect(() => {
    if (jobs.length > 0 && applications.length > 0) {
      const stats = {};
      
      jobs.forEach(job => {
        // Ensure we're working with an array before filtering
        const jobApps = Array.isArray(applications) 
          ? applications.filter(app => app.job === job.id)
          : [];
        
        const statusCounts = {};
        const statusFailCounts = {};
        
        // Initialize counts for all statuses
        Object.keys(STATUS_MAP).forEach(status => {
          statusCounts[status] = 0;
          statusFailCounts[status] = 0;
        });
        
        // Count applications in each status
        jobApps.forEach(app => {
          const status = app.status?.toString(); 
          if (status && statusCounts[status] !== undefined) {
            statusCounts[status]++;
            if (app.fail) {
              statusFailCounts[status]++;
            }
          }
        });
        
        // Calculate pass rates
        const passRates = {};
        Object.keys(STATUS_MAP).forEach(status => {
          if (statusCounts[status] > 0) {
            passRates[status] = 
              ((statusCounts[status] - statusFailCounts[status]) / statusCounts[status] * 100).toFixed(1);
          } else {
            passRates[status] = 0;
          }
        });
        
        // For closed jobs, calculate final acceptance rate
        let finalAcceptance = null;
        if (job.status !== "1") { // Job is closed
          const offerApps = jobApps.filter(app => app.status?.toString() === "6");
          const acceptedApps = offerApps.filter(app => !app.fail);
          finalAcceptance = offerApps.length > 0 
            ? (acceptedApps.length / offerApps.length * 100).toFixed(1)
            : 0;
        }
        
        stats[job.id] = {
          totalApplicants: jobApps.length,
          statusCounts,
          statusFailCounts,
          passRates,
          finalAcceptance
        };
      });
      
      setJobStats(stats);
    }
  }, [jobs, applications]);

  if (jobsLoading || appsLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (jobsError || appsError) {
    return (
      <Typography color="error">
        Error loading data: {jobsError?.message || appsError?.message}
      </Typography>
    );
  }

  const handleJobExpand = (jobId) => {
    setExpandedJob(expandedJob === jobId ? null : jobId);
  };

  return (
    <Box sx={{ p: 2, width: '90%' }}>
      <Typography variant="h4" gutterBottom>
        Jobs Dashboard
      </Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Job Title</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Total Applicants</TableCell>
              <TableCell>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobs?.map((job) => (
              <React.Fragment key={job.id}>
                <TableRow>
                  <TableCell>{job.title}</TableCell>
                  <TableCell>{job.company_name}</TableCell>
                  <TableCell>
                    <Chip 
                      label={job.status === "1" ? "Open" : "Closed"} 
                      color={job.status === "1" ? "success" : "error"} 
                    />
                  </TableCell>
                  <TableCell>
                    {jobStats[job.id]?.totalApplicants || 0}
                  </TableCell>
                  <TableCell>
                    <Button 
                      onClick={() => handleJobExpand(job.id)}
                      endIcon={<ExpandMoreIcon />}
                    >
                      {expandedJob === job.id ? 'Hide' : 'Show'} Details
                    </Button>
                  </TableCell>
                </TableRow>
                
                {expandedJob === job.id && (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ p: 0 }}>
                      <Accordion expanded={expandedJob === job.id} sx={{ boxShadow: 'none' }}>
                        <AccordionSummary sx={{ display: 'none' }} />
                        <AccordionDetails>
                          <Box sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                              Application Statistics
                            </Typography>
                            
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Stage</TableCell>
                                  <TableCell>Total Applicants</TableCell>
                                  <TableCell>Passed</TableCell>
                                  <TableCell>Failed</TableCell>
                                  <TableCell>Pass Rate</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {Object.entries(STATUS_MAP).map(([status, label]) => (
                                  <TableRow key={status}>
                                    <TableCell>{label}</TableCell>
                                    <TableCell>
                                      {jobStats[job.id]?.statusCounts[status] || 0}
                                    </TableCell>
                                    <TableCell>
                                      {(jobStats[job.id]?.statusCounts[status] || 0) - 
                                       (jobStats[job.id]?.statusFailCounts[status] || 0)}
                                    </TableCell>
                                    <TableCell>
                                      {jobStats[job.id]?.statusFailCounts[status] || 0}
                                    </TableCell>
                                    <TableCell>
                                      {jobStats[job.id]?.passRates[status] || 0}%
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                            
                            {job.status !== "1" && jobStats[job.id]?.finalAcceptance !== null && (
                              <Box mt={3}>
                                <Typography variant="h6">
                                  Final Acceptance Rate: {jobStats[job.id]?.finalAcceptance || 0}%
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                  ({jobStats[job.id]?.statusCounts["6"] - 
                                    (jobStats[job.id]?.statusFailCounts["6"] || 0)} accepted out of {
                                    jobStats[job.id]?.statusCounts["6"] || 0} who reached offer stage)
                                </Typography>
                              </Box>
                            )}
                            
                            <Box mt={2}>
                              <Button 
                                variant="contained" 
                                onClick={() => navigate(`/company/jobs/${job.id}`)}
                              >
                                View Job Details
                              </Button>
                            </Box>
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default JobsDashboard;














// import React, { useContext, useState, useEffect } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import { getAllJobs } from '../../../services/Job';
// import { getAllApplications } from '../../../services/Application';
// import { userContext } from '../../../context/UserContext';
// import { useNavigate } from 'react-router';
// import { 
//   Table, 
//   TableBody, 
//   TableCell, 
//   TableContainer, 
//   TableHead, 
//   TableRow, 
//   Paper, 
//   Typography, 
//   Box, 
//   CircularProgress, 
//   Button,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
//   Chip,
//   Grid,
//   Card,
//   CardContent,
//   LinearProgress,
//   Divider,
//   IconButton,
//   Tooltip
// } from '@mui/material';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import BarChartIcon from '@mui/icons-material/BarChart';
// import PeopleIcon from '@mui/icons-material/People';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import CancelIcon from '@mui/icons-material/Cancel';

// const STATUS_MAP = {
//   '1': "Applied",
//   '2': "Application Accepted",
//   '3': "Technical Assessment",
//   '4': "Technical Interview",
//   '5': "HR Interview",
//   '6': "Offer Interview"
// };

// const statusColors = {
//   '1': '#4e73df',
//   '2': '#1cc88a',
//   '3': '#36b9cc',
//   '4': '#f6c23e',
//   '5': '#e74a3b',
//   '6': '#5a5c69'
// };

// const JobsDashboard = () => {
//   const { user } = useContext(userContext);
//   const navigate = useNavigate();
//   const [expandedJob, setExpandedJob] = useState(null);
//   const [jobStats, setJobStats] = useState({});

//   // Filter jobs by company ID from user context
//   const filters = user?.company_id ? { company: user.company_id } : {};
// console.log(filters);
//   // Fetch all jobs for the current company
//   const { 
//     data: jobsResponse, 
//     isLoading: jobsLoading, 
//     error: jobsError 
//   } = useQuery({
//     queryKey: ['companyJobs', user?.company_id],
//     queryFn: () => getAllJobs({ filters, page: 1, pageSize: 1000 }),
//     enabled: !!user?.company_id // Only fetch if company_id exists
//   });

//   // Extract jobs data from response
//   const jobs = jobsResponse?.data?.results || [];
//   // console.log(jobsResponse?.data?.results);
//   // console.log(jobsResponse?.data?.results.length);
//   // console.log(jobsResponse?.data?.results[0]?.id);
//   // console.log(jobsResponse?.data?.results[0]?.title);
//   // console.log(jobsResponse?.data?.results[0]?.company_name);
//   // console.log(jobsResponse?.data?.results[0]?.status);
//   // console.log(jobsResponse?.data?.results[0]?.company_id);
//   // Fetch all applications
//   const { 
//     data: applicationsResponse, 
//     isLoading: appsLoading, 
//     error: appsError 
//   } = useQuery({
//     queryKey: ['allApplications'],
//     queryFn: getAllApplications
//   });

//   // Extract applications data from response
//   const applications = applicationsResponse?.data || applicationsResponse || [];
//   // console.log(applicationsResponse?.data);
//   // console.log(applicationsResponse?.data.length);
//   // // Calculate statistics when data loads
//   useEffect(() => {
//     if (jobs.length > 0 && applications.length > 0) {
//       const stats = {};
      
//       jobs.forEach(job => {
//         const jobApps = Array.isArray(applications) 
//           ? applications.filter(app => app.job === job.id)
//           : [];
        
//         const statusCounts = {};
//         const statusFailCounts = {};
        
//         Object.keys(STATUS_MAP).forEach(status => {
//           statusCounts[status] = 0;
//           statusFailCounts[status] = 0;
//         });
        
//         jobApps.forEach(app => {
//           const status = app.status?.toString();
//           if (status && statusCounts[status] !== undefined) {
//             statusCounts[status]++;
//             if (app.fail) {
//               statusFailCounts[status]++;
//             }
//           }
//         });
        
//         const passRates = {};
//         Object.keys(STATUS_MAP).forEach(status => {
//           if (statusCounts[status] > 0) {
//             passRates[status] = 
//               ((statusCounts[status] - statusFailCounts[status]) / statusCounts[status] * 100).toFixed(1);
//           } else {
//             passRates[status] = 0;
//           }
//         });
        
//         let finalAcceptance = null;
//         if (job.status !== "1") {
//           const offerApps = jobApps.filter(app => app.status?.toString() === "6");
//           const acceptedApps = offerApps.filter(app => !app.fail);
//           finalAcceptance = offerApps.length > 0 
//             ? (acceptedApps.length / offerApps.length * 100).toFixed(1)
//             : 0;
//         }
        
//         stats[job.id] = {
//           totalApplicants: jobApps.length,
//           statusCounts,
//           statusFailCounts,
//           passRates,
//           finalAcceptance,
//           jobApps // Store all job applications for detailed view
//         };
//       });
      
//       setJobStats(stats);
//     }
//   }, [jobs, applications]);

//   if (jobsLoading || appsLoading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
//         <CircularProgress size={60} />
//       </Box>
//     );
//   }

//   if (jobsError || appsError) {
//     return (
//       <Box sx={{ p: 3, bgcolor: 'error.light', color: 'error.contrastText', borderRadius: 2 }}>
//         <Typography variant="h6">Error loading data</Typography>
//         <Typography>{jobsError?.message || appsError?.message}</Typography>
//       </Box>
//     );
//   }

//   // if (jobs.length === 0) {
//   //   return (
//   //     <Box sx={{ p: 3, textAlign: 'center' }}>
//   //       <Typography variant="h5" gutterBottom>
//   //         No Jobs Found
//   //       </Typography>
//   //       <Typography variant="body1" color="text.secondary">
//   //         You haven't posted any jobs yet. Create your first job posting to get started.
//   //       </Typography>
//   //       <Button 
//   //         variant="contained" 
//   //         sx={{ mt: 2 }}
//   //         onClick={() => navigate('/company/jobs/create')}
//   //       >
//   //         Create New Job
//   //       </Button>
//   //     </Box>
//   //   );
//   // }

//   const handleJobExpand = (jobId) => {
//     setExpandedJob(expandedJob === jobId ? null : jobId);
//   };

//   return (
//     <Box sx={{ p: 3 }}>
//       <Box sx={{ mb: 4 }}>
//         <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
//           Jobs Dashboard
//         </Typography>
//         <Typography variant="body1" color="text.secondary">
//           Track and analyze applications for your job postings
//         </Typography>
//       </Box>

//       {/* Summary Cards */}
//       <Grid container spacing={3} sx={{ mb: 4 }}>
//         <Grid item xs={12} md={4}>
//           <Card elevation={3}>
//             <CardContent>
//               <Box display="flex" justifyContent="space-between">
//                 <div>
//                   <Typography color="text.secondary" gutterBottom>
//                     Total Jobs Posted
//                   </Typography>
//                   <Typography variant="h4">{jobs.length}</Typography>
//                 </div>
//                 <Box sx={{ bgcolor: 'primary.main', p: 2, borderRadius: '50%', color: 'white' }}>
//                   <BarChartIcon fontSize="large" />
//                 </Box>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} md={4}>
//           <Card elevation={3}>
//             <CardContent>
//               <Box display="flex" justifyContent="space-between">
//                 <div>
//                   <Typography color="text.secondary" gutterBottom>
//                     Total Applicants
//                   </Typography>
//                   <Typography variant="h4">
//                     {Object.values(jobStats).reduce((sum, stat) => sum + stat.totalApplicants, 0)}
//                   </Typography>
//                 </div>
//                 <Box sx={{ bgcolor: 'secondary.main', p: 2, borderRadius: '50%', color: 'white' }}>
//                   <PeopleIcon fontSize="large" />
//                 </Box>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} md={4}>
//           <Card elevation={3}>
//             <CardContent>
//               <Box display="flex" justifyContent="space-between">
//                 <div>
//                   <Typography color="text.secondary" gutterBottom>
//                     Open Positions
//                   </Typography>
//                   <Typography variant="h4">
//                     {jobs.filter(job => job.status === "1").length}
//                   </Typography>
//                 </div>
//                 <Box sx={{ bgcolor: 'success.main', p: 2, borderRadius: '50%', color: 'white' }}>
//                   <CheckCircleIcon fontSize="large" />
//                 </Box>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>

//       <Card elevation={3}>
//         <TableContainer>
//           <Table>
//             <TableHead sx={{ bgcolor: 'background.default' }}>
//               <TableRow>
//                 <TableCell sx={{ fontWeight: 600 }}>Job Title</TableCell>
//                 <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
//                 <TableCell sx={{ fontWeight: 600 }}>Applicants</TableCell>
//                 <TableCell sx={{ fontWeight: 600 }}>Current Stage</TableCell>
//                 <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {jobs.map((job) => (
//                 <React.Fragment key={job.id}>
//                   <TableRow hover>
//                     <TableCell>
//                       <Typography fontWeight={500}>{job.title}</Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         {job.company_name}
//                       </Typography>
//                     </TableCell>
//                     <TableCell>
//                       <Chip 
//                         label={job.status === "1" ? "Open" : "Closed"} 
//                         color={job.status === "1" ? "success" : "error"}
//                         variant="outlined"
//                         size="small"
//                       />
//                     </TableCell>
//                     <TableCell>
//                       <Box display="flex" alignItems="center">
//                         <PeopleIcon color="action" sx={{ mr: 1 }} />
//                         <Typography>
//                           {jobStats[job.id]?.totalApplicants || 0}
//                         </Typography>
//                       </Box>
//                     </TableCell>
//                     <TableCell>
//                       {jobStats[job.id] ? (
//                         <Box>
//                           {Object.entries(STATUS_MAP).reverse().find(([status]) => 
//                             jobStats[job.id].statusCounts[status] > 0
//                           )?.[1] || 'No applicants yet'}
//                         </Box>
//                       ) : (
//                         <Typography variant="body2">Loading...</Typography>
//                       )}
//                     </TableCell>
//                     <TableCell>
//                       <Button 
//                         variant="outlined" 
//                         size="small"
//                         onClick={() => handleJobExpand(job.id)}
//                         endIcon={<ExpandMoreIcon />}
//                         sx={{ mr: 1 }}
//                       >
//                         Details
//                       </Button>
//                       <Button 
//                         variant="contained" 
//                         size="small"
//                         onClick={() => navigate(`/company/jobs/${job.id}`)}
//                       >
//                         View
//                       </Button>
//                     </TableCell>
//                   </TableRow>
                  
//                   {expandedJob === job.id && (
//                     <TableRow>
//                       <TableCell colSpan={5} sx={{ p: 0, borderBottom: 'none' }}>
//                         <Box sx={{ p: 3, bgcolor: 'background.paper' }}>
//                           <Grid container spacing={3}>
//                             <Grid item xs={12} md={6}>
//                               <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
//                                 Application Funnel
//                               </Typography>
//                               <Box sx={{ mb: 3 }}>
//                                 {Object.entries(STATUS_MAP).map(([status, label]) => (
//                                   <Box key={status} sx={{ mb: 2 }}>
//                                     <Box display="flex" justifyContent="space-between" mb={0.5}>
//                                       <Typography variant="body2">{label}</Typography>
//                                       <Typography variant="body2" fontWeight={500}>
//                                         {jobStats[job.id]?.statusCounts[status] || 0} applicants
//                                       </Typography>
//                                     </Box>
//                                     <LinearProgress 
//                                       variant="determinate" 
//                                       value={jobStats[job.id]?.passRates[status] || 0}
//                                       sx={{ 
//                                         height: 8, 
//                                         borderRadius: 4,
//                                         backgroundColor: `${statusColors[status]}20`,
//                                         '& .MuiLinearProgress-bar': {
//                                           backgroundColor: statusColors[status]
//                                         }
//                                       }}
//                                     />
//                                     <Box display="flex" justifyContent="space-between" mt={0.5}>
//                                       <Typography variant="caption" color="text.secondary">
//                                         Pass rate: {jobStats[job.id]?.passRates[status] || 0}%
//                                       </Typography>
//                                       <Typography variant="caption" color="text.secondary">
//                                         {((jobStats[job.id]?.statusCounts[status] || 0) - 
//                                          (jobStats[job.id]?.statusFailCounts[status] || 0))} passed
//                                       </Typography>
//                                     </Box>
//                                   </Box>
//                                 ))}
//                               </Box>
//                             </Grid>
                            
//                             <Grid item xs={12} md={6}>
//                               <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
//                                 Quick Stats
//                               </Typography>
//                               <Grid container spacing={2}>
//                                 <Grid item xs={6}>
//                                   <Card variant="outlined" sx={{ height: '100%' }}>
//                                     <CardContent>
//                                       <Typography variant="body2" color="text.secondary">
//                                         Total Applicants
//                                       </Typography>
//                                       <Typography variant="h4" sx={{ mt: 1 }}>
//                                         {jobStats[job.id]?.totalApplicants || 0}
//                                       </Typography>
//                                     </CardContent>
//                                   </Card>
//                                 </Grid>
//                                 <Grid item xs={6}>
//                                   <Card variant="outlined" sx={{ height: '100%' }}>
//                                     <CardContent>
//                                       <Typography variant="body2" color="text.secondary">
//                                         Current Stage
//                                       </Typography>
//                                       <Typography variant="h4" sx={{ mt: 1 }}>
//                                         {Object.entries(STATUS_MAP).reverse().find(([status]) => 
//                                           jobStats[job.id]?.statusCounts[status] > 0
//                                         )?.[1] || 'N/A'}
//                                       </Typography>
//                                     </CardContent>
//                                   </Card>
//                                 </Grid>
//                                 {job.status !== "1" && jobStats[job.id]?.finalAcceptance !== null && (
//                                   <Grid item xs={12}>
//                                     <Card variant="outlined">
//                                       <CardContent>
//                                         <Typography variant="body2" color="text.secondary">
//                                           Final Acceptance Rate
//                                         </Typography>
//                                         <Box display="flex" alignItems="center" mt={1}>
//                                           <Typography variant="h4" sx={{ mr: 2 }}>
//                                             {jobStats[job.id]?.finalAcceptance || 0}%
//                                           </Typography>
//                                           <Typography variant="body2" color="text.secondary">
//                                             ({jobStats[job.id]?.statusCounts["6"] - 
//                                              (jobStats[job.id]?.statusFailCounts["6"] || 0)} accepted out of {
//                                              jobStats[job.id]?.statusCounts["6"] || 0})
//                                           </Typography>
//                                         </Box>
//                                       </CardContent>
//                                     </Card>
//                                   </Grid>
//                                 )}
//                               </Grid>
                              
//                               <Box sx={{ mt: 3 }}>
//                                 <Button 
//                                   variant="contained" 
//                                   fullWidth
//                                   onClick={() => navigate(`/company/jobs/${job.id}/applications`)}
//                                   startIcon={<PeopleIcon />}
//                                 >
//                                   View All Applications
//                                 </Button>
//                               </Box>
//                             </Grid>
//                           </Grid>
//                         </Box>
//                       </TableCell>
//                     </TableRow>
//                   )}
//                 </React.Fragment>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Card>
//     </Box>
//   );
// };

// export default JobsDashboard;