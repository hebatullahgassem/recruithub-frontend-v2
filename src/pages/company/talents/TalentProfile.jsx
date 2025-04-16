// import {
//   Box,
//   Typography,
//   Button,
//   CircularProgress,
//   Grid,
//   Avatar,
//   Link,
//   useTheme,
//   useMediaQuery,
//   Container,
//   Chip,
//   Tab,
//   Tabs,
//   Card,
//   CardContent,
//   IconButton,
//   Tooltip,
// } from "@mui/material"
// import {
//   LocationOn,
//   School,
//   Email,
//   Phone,
//   CalendarToday,
//   Download,
//   ArrowBack,
//   LinkedIn,
//   GitHub,
//   Language,
//   Person,
//   Code,
//   History,
//   MenuBook,
//   ContactMail,
//   Share,
// } from "@mui/icons-material"
// import { motion } from "framer-motion"
// import { useNavigate, useLocation } from "react-router-dom"
// import { useQuery } from "@tanstack/react-query"
// import { getTalentById } from "../../../services/Talents"
// import { styled } from "@mui/material/styles"
// import { useState } from "react"

// // Custom color palette with #d43132 as primary
// const atheistTheme = {
//   primary: "#d43132",
//   secondary: "#2d2d2d",
//   background: "#ffffff",
//   textPrimary: "#1a1a1a",
//   textSecondary: "#4a4a4a",
//   divider: "#e0e0e0",
//   lightBackground: "#f9f9f9",
//   accent: "#f5e6e6",
//   cardBackground: "#ffffff",
//   darkAccent: "#c02829",
// }

// const StyledTabs = styled(Tabs)(({ theme }) => ({
//   borderBottom: `1px solid ${atheistTheme.divider}`,
//   "& .MuiTabs-indicator": {
//     backgroundColor: atheistTheme.primary,
//     height: 3,
//   },
//   "& .MuiTab-root": {
//     textTransform: "none",
//     fontWeight: 600,
//     fontSize: "0.95rem",
//     minWidth: 100,
//     padding: "16px 24px",
//     color: atheistTheme.textSecondary,
//     "&.Mui-selected": {
//       color: atheistTheme.primary,
//     },
//   },
// }))

// const ProfileHeader = styled(Box)(({ theme }) => ({
//   background: `linear-gradient(135deg, ${atheistTheme.primary} 0%, ${atheistTheme.darkAccent} 100%)`,
//   color: "#fff",
//   padding: theme.spacing(6, 4),
//   borderRadius: "16px 16px 0 0",
//   position: "relative",
//   overflow: "hidden",
//   "&::after": {
//     content: '""',
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     background: "url('https://www.transparenttextures.com/patterns/cubes.png')",
//     opacity: 0.1,
//     zIndex: 1,
//   },
// }))

// const ProfileAvatar = styled(Avatar)(({ theme }) => ({
//   width: 140,
//   height: 140,
//   border: "4px solid #fff",
//   boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
//   zIndex: 2,
//   [theme.breakpoints.down("sm")]: {
//     width: 120,
//     height: 120,
//   },
// }))

// const SocialButton = styled(IconButton)(({ theme }) => ({
//   backgroundColor: "#ffffff",
//   color: atheistTheme.primary,
//   width: 40,
//   height: 40,
//   "&:hover": {
//     backgroundColor: atheistTheme.accent,
//   },
//   margin: theme.spacing(0, 0.5),
//   boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
// }))

// const InfoCard = styled(Card)(({ theme }) => ({
//   borderRadius: 12,
//   boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
//   height: "100%",
//   transition: "transform 0.3s ease, box-shadow 0.3s ease",
//   "&:hover": {
//     transform: "translateY(-4px)",
//     boxShadow: "0 8px 30px rgba(0, 0, 0, 0.1)",
//   },
//   overflow: "visible",
// }))

// const CardHeader = styled(Box)(({ theme }) => ({
//   background: atheistTheme.lightBackground,
//   padding: theme.spacing(2, 3),
//   borderBottom: `1px solid ${atheistTheme.divider}`,
//   display: "flex",
//   alignItems: "center",
//   borderRadius: "12px 12px 0 0",
// }))

// const CardIcon = styled(Box)(({ theme }) => ({
//   backgroundColor: atheistTheme.primary,
//   color: "#fff",
//   width: 40,
//   height: 40,
//   borderRadius: 8,
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   marginRight: theme.spacing(2),
//   boxShadow: "0 4px 12px rgba(212, 49, 50, 0.2)",
// }))

// const SkillBar = styled(Box)(({ theme }) => ({
//   backgroundColor: atheistTheme.lightBackground,
//   borderRadius: 8,
//   height: 10,
//   width: "100%",
//   position: "relative",
//   marginTop: theme.spacing(1),
//   marginBottom: theme.spacing(2),
// }))

// const SkillProgress = styled(Box)(({ width }) => ({
//   position: "absolute",
//   left: 0,
//   top: 0,
//   height: "100%",
//   width: `${width}%`,
//   borderRadius: 8,
//   background: `linear-gradient(90deg, ${atheistTheme.primary} 0%, ${atheistTheme.darkAccent} 100%)`,
// }))

// const ActionButton = styled(Button)(({ theme, variant }) => ({
//   borderRadius: 8,
//   padding: theme.spacing(1.2, 3),
//   fontWeight: 600,
//   textTransform: "none",
//   boxShadow: variant === "contained" ? "0 4px 14px rgba(212, 49, 50, 0.25)" : "none",
//   transition: "all 0.3s ease",
//   ...(variant === "contained"
//     ? {
//         backgroundColor: atheistTheme.primary,
//         color: "#fff",
//         "&:hover": {
//           backgroundColor: atheistTheme.darkAccent,
//           boxShadow: "0 6px 20px rgba(212, 49, 50, 0.35)",
//         },
//       }
//     : {
//         color: variant === "primary" ? atheistTheme.primary : atheistTheme.textPrimary,
//         borderColor: variant === "primary" ? atheistTheme.primary : atheistTheme.divider,
//         "&:hover": {
//           borderColor: atheistTheme.primary,
//           color: atheistTheme.primary,
//           backgroundColor: variant === "primary" ? atheistTheme.accent : "rgba(0, 0, 0, 0.03)",
//         },
//       }),
// }))

// const TimelineItem = styled(Box)(({ theme }) => ({
//   position: "relative",
//   paddingLeft: theme.spacing(4),
//   paddingBottom: theme.spacing(4),
//   "&:before": {
//     content: '""',
//     position: "absolute",
//     left: 0,
//     top: 0,
//     bottom: 0,
//     width: 2,
//     backgroundColor: atheistTheme.divider,
//   },
//   "&:after": {
//     content: '""',
//     position: "absolute",
//     left: -4,
//     top: 8,
//     width: 10,
//     height: 10,
//     borderRadius: "50%",
//     backgroundColor: atheistTheme.primary,
//     zIndex: 1,
//   },
//   "&:last-child": {
//     paddingBottom: 0,
//     "&:before": {
//       display: "none",
//     },
//   },
// }))

// const ContactItem = styled(Box)(({ theme }) => ({
//   display: "flex",
//   alignItems: "center",
//   marginBottom: theme.spacing(3),
//   padding: theme.spacing(2),
//   backgroundColor: atheistTheme.lightBackground,
//   borderRadius: 8,
//   transition: "all 0.3s ease",
//   "&:hover": {
//     backgroundColor: atheistTheme.accent,
//     transform: "translateX(4px)",
//   },
// }))

// const parseJSONField = (field) => {
//   try {
//     return field ? JSON.parse(field) : []
//   } catch (e) {
//     return []
//   }
// }

// const TalentProfile = () => {
//   const theme = useTheme()
//   const isMobile = useMediaQuery(theme.breakpoints.down("md"))
//   const navigate = useNavigate()
//   const location = useLocation()
//   const talentId = location.state?.talentId
//   const [activeTab, setActiveTab] = useState(0)

//   const handleTabChange = (event, newValue) => {
//     setActiveTab(newValue)
//   }

//   const {
//     data: talent,
//     isLoading,
//     isError,
//     error,
//   } = useQuery({
//     queryKey: ["talent", talentId],
//     queryFn: () => getTalentById(talentId),
//     enabled: !!talentId,
//   })

//   const education = parseJSONField(talent?.education)
//   const experience = parseJSONField(talent?.experience)
//   const skills = parseJSONField(talent?.skills)

//   if (isLoading) {
//     return (
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           minHeight: "80vh",
//           flexDirection: "column",
//           gap: 3,
//         }}
//       >
//         <CircularProgress size={60} thickness={4} sx={{ color: atheistTheme.primary }} />
//         <Typography variant="h6" sx={{ color: atheistTheme.textSecondary }}>
//           Loading talent profile...
//         </Typography>
//       </Box>
//     )
//   }

//   if (isError || !talent) {
//     return (
//       <Container maxWidth="md" sx={{ textAlign: "center", padding: theme.spacing(8) }}>
//         <Box
//           component={motion.div}
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           sx={{
//             backgroundColor: atheistTheme.lightBackground,
//             p: 6,
//             borderRadius: "16px",
//             border: `1px solid ${atheistTheme.divider}`,
//           }}
//         >
//           <Typography variant="h4" gutterBottom sx={{ color: atheistTheme.textPrimary, fontWeight: 700 }}>
//             {isError ? "Error Loading Profile" : "Profile Not Found"}
//           </Typography>
//           <Typography variant="body1" sx={{ color: atheistTheme.textSecondary, mb: 4, maxWidth: 500, mx: "auto" }}>
//             {isError
//               ? error.message
//               : "The requested talent profile could not be found. Please check the URL or try again later."}
//           </Typography>
//           <ActionButton variant="outlined" onClick={() => navigate(-1)} startIcon={<ArrowBack />}>
//             Go Back
//           </ActionButton>
//         </Box>
//       </Container>
//     )
//   }

//   const tabContent = [
//     // About Tab
//     <Box key="about" sx={{ py: 4 }}>
//       <Grid container spacing={4}>
//         <Grid item xs={12}>
//           <InfoCard component={motion.div} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
//             <CardHeader>
//               <CardIcon>
//                 <Person />
//               </CardIcon>
//               <Typography variant="h6" sx={{ fontWeight: 600 }}>
//                 Professional Summary
//               </Typography>
//             </CardHeader>
//             <CardContent sx={{ p: 3 }}>
//               <Typography variant="body1" sx={{ lineHeight: 1.8, color: atheistTheme.textSecondary }}>
//                 {talent.about || "No professional summary available."}
//               </Typography>
//             </CardContent>
//           </InfoCard>
//         </Grid>

//         <Grid item xs={12} md={6}>
//           <InfoCard
//             component={motion.div}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.1 }}
//           >
//             <CardHeader>
//               <CardIcon>
//                 <ContactMail />
//               </CardIcon>
//               <Typography variant="h6" sx={{ fontWeight: 600 }}>
//                 Contact Information
//               </Typography>
//             </CardHeader>
//             <CardContent sx={{ p: 3 }}>
//               {talent.location && (
//                 <ContactItem>
//                   <LocationOn sx={{ color: atheistTheme.primary, mr: 2 }} />
//                   <Typography variant="body1" sx={{ fontWeight: 500 }}>
//                     {talent.location}
//                   </Typography>
//                 </ContactItem>
//               )}

//               {talent.email && (
//                 <ContactItem>
//                   <Email sx={{ color: atheistTheme.primary, mr: 2 }} />
//                   <Link
//                     href={`mailto:${talent.email}`}
//                     underline="hover"
//                     sx={{
//                       fontWeight: 500,
//                       color: atheistTheme.textPrimary,
//                       "&:hover": { color: atheistTheme.primary },
//                     }}
//                   >
//                     {talent.email}
//                   </Link>
//                 </ContactItem>
//               )}

//               {talent.phone_number && (
//                 <ContactItem>
//                   <Phone sx={{ color: atheistTheme.primary, mr: 2 }} />
//                   <Link
//                     href={`tel:${talent.phone_number}`}
//                     underline="hover"
//                     sx={{
//                       fontWeight: 500,
//                       color: atheistTheme.textPrimary,
//                       "&:hover": { color: atheistTheme.primary },
//                     }}
//                   >
//                     {talent.phone_number}
//                   </Link>
//                 </ContactItem>
//               )}

//               {talent.dob && (
//                 <ContactItem>
//                   <CalendarToday sx={{ color: atheistTheme.primary, mr: 2 }} />
//                   <Typography variant="body1" sx={{ fontWeight: 500 }}>
//                     {new Date(talent.dob).toLocaleDateString("en-US", {
//                       year: "numeric",
//                       month: "long",
//                       day: "numeric",
//                     })}
//                   </Typography>
//                 </ContactItem>
//               )}
//             </CardContent>
//           </InfoCard>
//         </Grid>

//         <Grid item xs={12} md={6}>
//           <InfoCard
//             component={motion.div}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.2 }}
//             sx={{ height: "100%" }}
//           >
//             <CardHeader>
//               <CardIcon>
//                 <Share />
//               </CardIcon>
//               <Typography variant="h6" sx={{ fontWeight: 600 }}>
//                 Connect & Share
//               </Typography>
//             </CardHeader>
//             <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", height: "calc(100% - 64px)" }}>
//               <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
//                 {talent.linkedin && (
//                   <ActionButton
//                     variant="outlined"
//                     startIcon={<LinkedIn />}
//                     href={talent.linkedin}
//                     target="_blank"
//                     sx={{ flex: 1 }}
//                   >
//                     LinkedIn
//                   </ActionButton>
//                 )}
//                 {talent.github && (
//                   <ActionButton
//                     variant="outlined"
//                     startIcon={<GitHub />}
//                     href={talent.github}
//                     target="_blank"
//                     sx={{ flex: 1 }}
//                   >
//                     GitHub
//                   </ActionButton>
//                 )}
//               </Box>

//               {talent.website && (
//                 <ActionButton
//                   variant="outlined"
//                   startIcon={<Language />}
//                   href={talent.website}
//                   target="_blank"
//                   sx={{ mb: 3 }}
//                 >
//                   Personal Website
//                 </ActionButton>
//               )}

//               {talent.cv && (
//                 <ActionButton
//                   variant="contained"
//                   startIcon={<Download />}
//                   href={talent.cv}
//                   target="_blank"
//                   sx={{ mt: "auto" }}
//                 >
//                   Download CV
//                 </ActionButton>
//               )}
//             </CardContent>
//           </InfoCard>
//         </Grid>
//       </Grid>
//     </Box>,

//     // Skills Tab
//     <Box key="skills" sx={{ py: 4 }}>
//       <InfoCard component={motion.div} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
//         <CardHeader>
//           <CardIcon>
//             <Code />
//           </CardIcon>
//           <Typography variant="h6" sx={{ fontWeight: 600 }}>
//             Technical Skills
//           </Typography>
//         </CardHeader>
//         <CardContent sx={{ p: 3 }}>
//           {skills.length > 0 ? (
//             <Grid container spacing={3}>
//               {skills.map((skill, index) => (
//                 <Grid item xs={12} sm={6} md={4} key={index}>
//                   <Box sx={{ mb: 3 }}>
//                     <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//                       <Typography variant="body1" sx={{ fontWeight: 600, color: atheistTheme.textPrimary }}>
//                         {skill.name || skill}
//                       </Typography>
//                       {skill.proficiency && (
//                         <Typography variant="body2" sx={{ fontWeight: 600, color: atheistTheme.primary }}>
//                           {skill.proficiency}%
//                         </Typography>
//                       )}
//                     </Box>
//                     <SkillBar>
//                       <SkillProgress width={skill.proficiency || 85} />
//                     </SkillBar>
//                   </Box>
//                 </Grid>
//               ))}
//             </Grid>
//           ) : (
//             <Typography variant="body1" sx={{ color: atheistTheme.textSecondary }}>
//               No skills information available.
//             </Typography>
//           )}
//         </CardContent>
//       </InfoCard>
//     </Box>,

//     // Experience Tab
//     <Box key="experience" sx={{ py: 4 }}>
//       <InfoCard component={motion.div} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
//         <CardHeader>
//           <CardIcon>
//             <History />
//           </CardIcon>
//           <Typography variant="h6" sx={{ fontWeight: 600 }}>
//             Work Experience
//           </Typography>
//         </CardHeader>
//         <CardContent sx={{ p: 3 }}>
//           {experience.length > 0 ? (
//             <Box sx={{ pl: 2 }}>
//               {experience.map((exp, index) => (
//                 <TimelineItem key={index}>
//                   <Box
//                     component={motion.div}
//                     initial={{ opacity: 0, x: -10 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: index * 0.1 }}
//                   >
//                     <Typography variant="h6" sx={{ fontWeight: 700, color: atheistTheme.textPrimary }}>
//                       {exp.title}
//                     </Typography>
//                     <Typography variant="subtitle1" sx={{ color: atheistTheme.primary, fontWeight: 600, mb: 1 }}>
//                       {exp.company} • {exp.location}
//                     </Typography>
//                     <Chip
//                       label={`${exp.startDate} — ${exp.endDate || "Present"}`}
//                       size="small"
//                       sx={{
//                         backgroundColor: atheistTheme.accent,
//                         color: atheistTheme.primary,
//                         fontWeight: 500,
//                         mb: 2,
//                       }}
//                     />
//                     <Chip
//                       label={exp.employmentType}
//                       size="small"
//                       sx={{
//                         backgroundColor: atheistTheme.lightBackground,
//                         color: atheistTheme.textSecondary,
//                         fontWeight: 500,
//                         ml: 1,
//                         mb: 2,
//                       }}
//                     />
//                     {exp.description && (
//                       <Typography variant="body1" sx={{ lineHeight: 1.8, color: atheistTheme.textSecondary }}>
//                         {exp.description}
//                       </Typography>
//                     )}
//                   </Box>
//                 </TimelineItem>
//               ))}
//             </Box>
//           ) : (
//             <Typography variant="body1" sx={{ color: atheistTheme.textSecondary }}>
//               No experience information available.
//             </Typography>
//           )}
//         </CardContent>
//       </InfoCard>
//     </Box>,

//     // Education Tab
//     <Box key="education" sx={{ py: 4 }}>
//       <InfoCard component={motion.div} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
//         <CardHeader>
//           <CardIcon>
//             <MenuBook />
//           </CardIcon>
//           <Typography variant="h6" sx={{ fontWeight: 600 }}>
//             Education
//           </Typography>
//         </CardHeader>
//         <CardContent sx={{ p: 3 }}>
//           {education.length > 0 ? (
//             <Grid container spacing={3}>
//               {education.map((edu, index) => (
//                 <Grid item xs={12} md={6} key={index}>
//                   <Card
//                     sx={{
//                       borderRadius: 2,
//                       boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
//                       overflow: "hidden",
//                       transition: "transform 0.3s ease",
//                       "&:hover": {
//                         transform: "translateY(-4px)",
//                       },
//                     }}
//                     component={motion.div}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: index * 0.1 }}
//                   >
//                     <Box
//                       sx={{
//                         p: 2,
//                         background: `linear-gradient(135deg, ${atheistTheme.primary} 0%, ${atheistTheme.darkAccent} 100%)`,
//                         color: "#fff",
//                       }}
//                     >
//                       <Typography variant="h6" sx={{ fontWeight: 600 }}>
//                         {edu.degree}
//                       </Typography>
//                     </Box>
//                     <CardContent>
//                       <Typography variant="subtitle1" sx={{ fontWeight: 600, color: atheistTheme.primary, mb: 1 }}>
//                         {edu.school}
//                       </Typography>
//                       <Typography variant="body2" sx={{ color: atheistTheme.textSecondary, mb: 2 }}>
//                         {edu.fieldOfStudy}
//                       </Typography>
//                       <Chip
//                         label={`${edu.startDate} — ${edu.endDate || "Present"}`}
//                         size="small"
//                         sx={{
//                           backgroundColor: atheistTheme.accent,
//                           color: atheistTheme.primary,
//                           fontWeight: 500,
//                         }}
//                       />
//                     </CardContent>
//                   </Card>
//                 </Grid>
//               ))}
//             </Grid>
//           ) : (
//             <Typography variant="body1" sx={{ color: atheistTheme.textSecondary }}>
//               No education information available.
//             </Typography>
//           )}
//         </CardContent>
//       </InfoCard>
//     </Box>,
//   ]

//   return (
//     <Container maxWidth="lg" sx={{ py: 6 }}>
//       <Card
//         sx={{
//           borderRadius: "16px",
//           overflow: "hidden",
//           boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
//         }}
//         component={motion.div}
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//       >
//         {/* Profile Header */}
//         <ProfileHeader>
//           <Grid container spacing={4} alignItems="center" sx={{ position: "relative", zIndex: 2 }}>
//             <Grid item xs={12} md={8}>
//               <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 3 }}>
//                 <ProfileAvatar src={talent.img} alt={talent.name} />
//                 <Box>
//                   <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
//                     {talent.name}
//                   </Typography>
//                   {talent.title && (
//                     <Typography variant="h6" sx={{ fontWeight: 500, mb: 2, opacity: 0.9 }}>
//                       {talent.title}
//                     </Typography>
//                   )}
//                   <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
//                     {talent.linkedin && (
//                       <Tooltip title="LinkedIn Profile">
//                         <SocialButton
//                           size="small"
//                           href={talent.linkedin}
//                           target="_blank"
//                           component={motion.button}
//                           whileHover={{ scale: 1.1 }}
//                         >
//                           <LinkedIn fontSize="small" />
//                         </SocialButton>
//                       </Tooltip>
//                     )}
//                     {talent.github && (
//                       <Tooltip title="GitHub Profile">
//                         <SocialButton
//                           size="small"
//                           href={talent.github}
//                           target="_blank"
//                           component={motion.button}
//                           whileHover={{ scale: 1.1 }}
//                         >
//                           <GitHub fontSize="small" />
//                         </SocialButton>
//                       </Tooltip>
//                     )}
//                     {talent.website && (
//                       <Tooltip title="Personal Website">
//                         <SocialButton
//                           size="small"
//                           href={talent.website}
//                           target="_blank"
//                           component={motion.button}
//                           whileHover={{ scale: 1.1 }}
//                         >
//                           <Language fontSize="small" />
//                         </SocialButton>
//                       </Tooltip>
//                     )}
//                   </Box>
//                 </Box>
//               </Box>
//             </Grid>
//             <Grid item xs={12} md={4} sx={{ display: "flex", justifyContent: { xs: "flex-start", md: "flex-end" } }}>
//               <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
//                 <ActionButton
//                   variant="contained"
//                   sx={{
//                     backgroundColor: "#fff",
//                     color: atheistTheme.primary,
//                     "&:hover": {
//                       backgroundColor: "#f8f8f8",
//                     },
//                   }}
//                 >
//                   Contact
//                 </ActionButton>
//                 <ActionButton
//                   variant="contained"
//                   sx={{
//                     backgroundColor: "rgba(255, 255, 255, 0.15)",
//                     backdropFilter: "blur(10px)",
//                     "&:hover": {
//                       backgroundColor: "rgba(255, 255, 255, 0.25)",
//                     },
//                   }}
//                 >
//                   Shortlist
//                 </ActionButton>
//               </Box>
//             </Grid>
//           </Grid>
//         </ProfileHeader>

//         {/* Tabs Navigation */}
//         <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
//           <StyledTabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
//             <Tab icon={<Person sx={{ mr: 1 }} />} label="About" iconPosition="start" />
//             <Tab icon={<Code sx={{ mr: 1 }} />} label="Skills" iconPosition="start" />
//             <Tab icon={<History sx={{ mr: 1 }} />} label="Experience" iconPosition="start" />
//             <Tab icon={<School sx={{ mr: 1 }} />} label="Education" iconPosition="start" />
//           </StyledTabs>
//         </Box>

//         {/* Tab Content */}
//         {tabContent[activeTab]}
//       </Card>

//       <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
//         <ActionButton variant="outlined" onClick={() => navigate(-1)} startIcon={<ArrowBack />}>
//           Back to Talents
//         </ActionButton>
//       </Box>
//     </Container>
//   )
// }

// export default TalentProfile




"use client"

import { useState } from "react"
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Grid,
  Avatar,
  Link,
  useTheme,
  useMediaQuery,
  Container,
  Chip,
  IconButton,
  Tooltip,
  Divider,
  Badge,
  Paper,
  Stack,
  LinearProgress,
  Collapse,
} from "@mui/material"
import {
  LocationOn,
  School,
  Email,
  Phone,
  CalendarToday,
  Download,
  ArrowBack,
  LinkedIn,
  GitHub,
  Language,
  ExpandMore,
  ExpandLess,
  Work,
  AccessTime,
  Bookmark,
  BookmarkBorder,
  Person,
  Code,
} from "@mui/icons-material"
import { motion } from "framer-motion"
import { useNavigate, useLocation } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { getTalentById } from "../../../services/Talents"
import { styled } from "@mui/material/styles"

// Custom color palette with #d43132 as primary
const atheistTheme = {
  primary: "#d43132",
  secondary: "#2d2d2d",
  background: "#ffffff",
  textPrimary: "#1a1a1a",
  textSecondary: "#4a4a4a",
  divider: "#e0e0e0",
  lightBackground: "#f9f9f9",
  accent: "#f5e6e6",
  cardBackground: "#ffffff",
  darkAccent: "#c02829",
  success: "#4caf50",
  warning: "#ff9800",
  info: "#2196f3",
  lightGrey: "#f0f0f0",
}

const ProfileContainer = styled(Box)(({ theme }) => ({
  maxWidth: 1400,
  margin: "0 auto",
  padding: theme.spacing(0),
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(0),
  },
}))

const SidebarContainer = styled(Box)(({ theme }) => ({
  position: "sticky",
  top: theme.spacing(4),
  height: "calc(100vh - 32px)",
  overflowY: "auto",
  padding: theme.spacing(4),
  backgroundColor: atheistTheme.background,
  borderRadius: "24px",
  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.05)",
  display: "flex",
  flexDirection: "column",
  "&::-webkit-scrollbar": {
    width: "6px",
  },
  "&::-webkit-scrollbar-track": {
    background: atheistTheme.lightBackground,
  },
  "&::-webkit-scrollbar-thumb": {
    background: atheistTheme.divider,
    borderRadius: "3px",
  },
  [theme.breakpoints.down("md")]: {
    position: "relative",
    height: "auto",
    top: 0,
    marginBottom: theme.spacing(3),
  },
}))

const ContentContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0, 0, 0, 3),
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(0),
  },
}))

const SectionCard = styled(Paper)(({ theme }) => ({
  borderRadius: "24px",
  overflow: "hidden",
  marginBottom: theme.spacing(3),
  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.05)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    boxShadow: "0 8px 40px rgba(0, 0, 0, 0.08)",
    transform: "translateY(-4px)",
  },
}))

const SectionHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  borderBottom: `1px solid ${atheistTheme.divider}`,
  backgroundColor: atheistTheme.lightBackground,
}))

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  display: "flex",
  alignItems: "center",
  "& svg": {
    marginRight: theme.spacing(1.5),
    color: atheistTheme.primary,
  },
}))

const SectionContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
}))

const ProfileHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  marginBottom: theme.spacing(4),
}))

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 150,
  height: 150,
  border: `4px solid ${atheistTheme.primary}`,
  boxShadow: "0 8px 24px rgba(212, 49, 50, 0.2)",
  marginBottom: theme.spacing(3),
}))

const SocialButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: atheistTheme.lightBackground,
  color: atheistTheme.textSecondary,
  width: 40,
  height: 40,
  "&:hover": {
    backgroundColor: atheistTheme.accent,
    color: atheistTheme.primary,
    transform: "translateY(-3px)",
  },
  margin: theme.spacing(0, 0.5),
  transition: "all 0.3s ease",
}))

const ActionButton = styled(Button)(({ theme, variant }) => ({
  borderRadius: 50,
  padding: theme.spacing(1.2, 3.5),
  fontWeight: 600,
  textTransform: "none",
  boxShadow: variant === "contained" ? "0 4px 14px rgba(212, 49, 50, 0.25)" : "none",
  transition: "all 0.3s ease",
  ...(variant === "contained"
    ? {
        backgroundColor: atheistTheme.primary,
        color: "#fff",
        "&:hover": {
          backgroundColor: atheistTheme.darkAccent,
          boxShadow: "0 6px 20px rgba(212, 49, 50, 0.35)",
          transform: "translateY(-3px)",
        },
      }
    : {
        color: variant === "primary" ? atheistTheme.primary : atheistTheme.textPrimary,
        borderColor: variant === "primary" ? atheistTheme.primary : atheistTheme.divider,
        "&:hover": {
          borderColor: atheistTheme.primary,
          color: atheistTheme.primary,
          backgroundColor: variant === "primary" ? atheistTheme.accent : "rgba(0, 0, 0, 0.03)",
          transform: "translateY(-3px)",
        },
      }),
}))

const SkillChip = styled(Chip)(({ theme, level }) => {
  let backgroundColor, color

  switch (level) {
    case "expert":
      backgroundColor = `${atheistTheme.primary}20`
      color = atheistTheme.primary
      break
    case "advanced":
      backgroundColor = `${atheistTheme.info}20`
      color = atheistTheme.info
      break
    case "intermediate":
      backgroundColor = `${atheistTheme.warning}20`
      color = atheistTheme.warning
      break
    default:
      backgroundColor = `${atheistTheme.textSecondary}15`
      color = atheistTheme.textSecondary
  }

  return {
    margin: theme.spacing(0.5),
    borderRadius: "50px",
    backgroundColor,
    color,
    fontWeight: 500,
    border: `1px solid ${color}40`,
    "&:hover": {
      backgroundColor: `${color}30`,
      transform: "scale(1.05)",
    },
    transition: "all 0.2s ease",
  }
})

const ExperienceCard = styled(Box)(({ theme }) => ({
  position: "relative",
  padding: theme.spacing(3.5),
  marginBottom: theme.spacing(4),
  borderRadius: "16px",
  backgroundColor: atheistTheme.lightBackground,
  transition: "all 0.3s ease",
  border: `1px solid transparent`,
  "&:hover": {
    backgroundColor: atheistTheme.accent,
    transform: "translateX(8px)",
    borderColor: `${atheistTheme.primary}30`,
  },
  "&::before": {
    content: '""',
    position: "absolute",
    left: "-20px",
    top: "50%",
    transform: "translateY(-50%)",
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    backgroundColor: atheistTheme.primary,
    boxShadow: "0 0 0 4px rgba(212, 49, 50, 0.2)",
  },
}))

const EducationCard = styled(Box)(({ theme }) => ({
  display: "flex",
  padding: theme.spacing(3.5),
  marginBottom: theme.spacing(3),
  borderRadius: "16px",
  backgroundColor: atheistTheme.lightBackground,
  transition: "all 0.3s ease",
  border: `1px solid transparent`,
  "&:hover": {
    backgroundColor: atheistTheme.accent,
    transform: "translateY(-4px)",
    borderColor: `${atheistTheme.primary}30`,
  },
}))

const StatusChip = styled(Chip)(({ theme, status }) => {
  let backgroundColor, color

  switch (status) {
    case "current":
      backgroundColor = `${atheistTheme.success}20`
      color = atheistTheme.success
      break
    case "past":
      backgroundColor = `${atheistTheme.textSecondary}15`
      color = atheistTheme.textSecondary
      break
    default:
      backgroundColor = `${atheistTheme.info}20`
      color = atheistTheme.info
  }

  return {
    borderRadius: "50px",
    backgroundColor,
    color,
    fontWeight: 500,
    border: `1px solid ${color}40`,
    height: 24,
    "& .MuiChip-label": {
      padding: "0 10px",
    },
  }
})

const ContactItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(2.5),
  padding: theme.spacing(1.5, 2),
  borderRadius: "12px",
  backgroundColor: atheistTheme.lightBackground,
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: atheistTheme.accent,
    transform: "translateX(4px)",
  },
  "& svg": {
    color: atheistTheme.primary,
    marginRight: theme.spacing(1.5),
  },
}))

const ProgressBar = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 4,
  backgroundColor: `${atheistTheme.primary}20`,
  "& .MuiLinearProgress-bar": {
    backgroundColor: atheistTheme.primary,
    borderRadius: 4,
  },
}))

const parseJSONField = (field) => {
  try {
    return field ? JSON.parse(field) : []
  } catch (e) {
    return []
  }
}

const getSkillLevel = (proficiency) => {
  if (!proficiency) return "beginner"
  if (proficiency >= 90) return "expert"
  if (proficiency >= 70) return "advanced"
  if (proficiency >= 40) return "intermediate"
  return "beginner"
}

const TalentProfile = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const navigate = useNavigate()
  const location = useLocation()
  const talentId = location.state?.talentId
  const [shortlisted, setShortlisted] = useState(false)
  const [expandedExp, setExpandedExp] = useState({})

  const toggleExpanded = (id) => {
    setExpandedExp((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const {
    data: talent,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["talent", talentId],
    queryFn: () => getTalentById(talentId),
    enabled: !!talentId,
  })

  const education = parseJSONField(talent?.education)
  const experience = parseJSONField(talent?.experience)
  const skills = parseJSONField(talent?.skills)

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <CircularProgress size={60} thickness={4} sx={{ color: atheistTheme.primary }} />
        <Typography variant="h6" sx={{ color: atheistTheme.textSecondary }}>
          Loading talent profile...
        </Typography>
      </Box>
    )
  }

  if (isError || !talent) {
    return (
      <Container maxWidth="md" sx={{ textAlign: "center", padding: theme.spacing(8) }}>
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          sx={{
            backgroundColor: atheistTheme.lightBackground,
            p: 6,
            borderRadius: "24px",
            border: `1px solid ${atheistTheme.divider}`,
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ color: atheistTheme.textPrimary, fontWeight: 700 }}>
            {isError ? "Error Loading Profile" : "Profile Not Found"}
          </Typography>
          <Typography variant="body1" sx={{ color: atheistTheme.textSecondary, mb: 4, maxWidth: 500, mx: "auto" }}>
            {isError
              ? error.message
              : "The requested talent profile could not be found. Please check the URL or try again later."}
          </Typography>
          <ActionButton variant="outlined" onClick={() => navigate(-1)} startIcon={<ArrowBack />}>
            Go Back
          </ActionButton>
        </Box>
      </Container>
    )
  }

  return (
    <ProfileContainer>
      <Box sx={{ p: 3, pb: 0 }}>
        <ActionButton
          variant="outlined"
          onClick={() => navigate(-1)}
          startIcon={<ArrowBack />}
          size="small"
          sx={{ mb: 3 }}
        >
          Back to Talents
        </ActionButton>
      </Box>

      <Grid container spacing={3} sx={{ p: 3 }}>
        {/* Left Sidebar */}
        <Grid item xs={12} md={4} lg={3}>
          <SidebarContainer>
            <ProfileHeader>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                badgeContent={
                  <Tooltip title={shortlisted ? "Remove from shortlist" : "Add to shortlist"}>
                    <IconButton
                      size="small"
                      sx={{
                        bgcolor: atheistTheme.background,
                        border: `2px solid ${atheistTheme.primary}`,
                        "&:hover": { bgcolor: atheistTheme.accent },
                      }}
                      onClick={() => setShortlisted(!shortlisted)}
                    >
                      {shortlisted ? (
                        <Bookmark sx={{ color: atheistTheme.primary, fontSize: 16 }} />
                      ) : (
                        <BookmarkBorder sx={{ color: atheistTheme.primary, fontSize: 16 }} />
                      )}
                    </IconButton>
                  </Tooltip>
                }
              >
                <ProfileAvatar src={talent.img} alt={talent.name} />
              </Badge>

              <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5, color: atheistTheme.textPrimary }}>
                {talent.name}
              </Typography>

              {talent.title && (
                <Typography variant="subtitle1" sx={{ color: atheistTheme.primary, fontWeight: 600, mb: 2 }}>
                  {talent.title}
                </Typography>
              )}

              <Box sx={{ display: "flex", mb: 3 }}>
                {talent.linkedin && (
                  <Tooltip title="LinkedIn">
                    <SocialButton
                      href={talent.linkedin}
                      target="_blank"
                      component={motion.button}
                      whileHover={{ scale: 1.1 }}
                    >
                      <LinkedIn fontSize="small" />
                    </SocialButton>
                  </Tooltip>
                )}
                {talent.github && (
                  <Tooltip title="GitHub">
                    <SocialButton
                      href={talent.github}
                      target="_blank"
                      component={motion.button}
                      whileHover={{ scale: 1.1 }}
                    >
                      <GitHub fontSize="small" />
                    </SocialButton>
                  </Tooltip>
                )}
                {talent.website && (
                  <Tooltip title="Website">
                    <SocialButton
                      href={talent.website}
                      target="_blank"
                      component={motion.button}
                      whileHover={{ scale: 1.1 }}
                    >
                      <Language fontSize="small" />
                    </SocialButton>
                  </Tooltip>
                )}
              </Box>

              <Stack direction="row" spacing={1} sx={{ mb: 3, width: "100%" }}>
                <ActionButton
                  variant="contained"
                  fullWidth
                  startIcon={<Bookmark />}
                  onClick={() => setShortlisted(!shortlisted)}
                >
                  {shortlisted ? "Shortlisted" : "Shortlist"}
                </ActionButton>
                {talent.cv && (
                  <ActionButton variant="outlined" href={talent.cv} target="_blank">
                    <Download />
                  </ActionButton>
                )}
              </Stack>
            </ProfileHeader>

            <Divider sx={{ mb: 3 }} />

            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: atheistTheme.textPrimary }}>
              Contact Information
            </Typography>

            {talent.location && (
              <ContactItem>
                <LocationOn fontSize="small" />
                <Typography variant="body2" sx={{ color: atheistTheme.textSecondary }}>
                  {talent.location}
                </Typography>
              </ContactItem>
            )}

            {talent.email && (
              <ContactItem>
                <Email fontSize="small" />
                <Link
                  href={`mailto:${talent.email}`}
                  underline="hover"
                  sx={{
                    color: atheistTheme.textSecondary,
                    "&:hover": { color: atheistTheme.primary },
                  }}
                >
                  <Typography variant="body2">{talent.email}</Typography>
                </Link>
              </ContactItem>
            )}

            {talent.phone_number && (
              <ContactItem>
                <Phone fontSize="small" />
                <Link
                  href={`tel:${talent.phone_number}`}
                  underline="hover"
                  sx={{
                    color: atheistTheme.textSecondary,
                    "&:hover": { color: atheistTheme.primary },
                  }}
                >
                  <Typography variant="body2">{talent.phone_number}</Typography>
                </Link>
              </ContactItem>
            )}

            {talent.dob && (
              <ContactItem>
                <CalendarToday fontSize="small" />
                <Typography variant="body2" sx={{ color: atheistTheme.textSecondary }}>
                  {new Date(talent.dob).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Typography>
              </ContactItem>
            )}

            <Box sx={{ mt: "auto", pt: 3 }}>
              <Typography
                variant="caption"
                sx={{ color: atheistTheme.textSecondary, display: "block", textAlign: "center" }}
              >
                Profile last updated: {new Date().toLocaleDateString()}
              </Typography>
            </Box>
          </SidebarContainer>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={8} lg={9}>
          <ContentContainer>
            {/* Summary Section */}
            {talent.about && (
              <SectionCard
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
              >
                <SectionHeader>
                  <SectionTitle variant="h6">
                    <Person /> Professional Summary
                  </SectionTitle>
                </SectionHeader>
                <SectionContent>
                  <Typography variant="body1" sx={{ lineHeight: 1.8, color: atheistTheme.textSecondary }}>
                    {talent.about}
                  </Typography>
                </SectionContent>
              </SectionCard>
            )}

            {/* Skills Section */}
            {skills.length > 0 && (
              <SectionCard
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                whileHover={{ y: -5 }}
              >
                <SectionHeader>
                  <SectionTitle variant="h6">
                    <Code /> Skills & Expertise
                  </SectionTitle>
                </SectionHeader>
                <SectionContent>
                  <Grid container spacing={3}>
                    {skills.some((skill) => typeof skill === "object" && skill.proficiency) ? (
                      skills.map((skill, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                          <Box sx={{ mb: 3 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: atheistTheme.textPrimary }}>
                                {skill.name || skill}
                              </Typography>
                              {skill.proficiency && (
                                <Typography variant="caption" sx={{ fontWeight: 600, color: atheistTheme.primary }}>
                                  {skill.proficiency}%
                                </Typography>
                              )}
                            </Box>
                            <ProgressBar variant="determinate" value={skill.proficiency || 75} />
                            <Typography
                              variant="caption"
                              sx={{
                                color: atheistTheme.textSecondary,
                                display: "block",
                                textAlign: "right",
                                mt: 0.5,
                              }}
                            >
                              {getSkillLevel(skill.proficiency)}
                            </Typography>
                          </Box>
                        </Grid>
                      ))
                    ) : (
                      <Grid item xs={12}>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                          {skills.map((skill, index) => (
                            <SkillChip
                              key={index}
                              label={skill.name || skill}
                              level={getSkillLevel(skill.proficiency)}
                            />
                          ))}
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </SectionContent>
              </SectionCard>
            )}

            {/* Experience Section */}
            {experience.length > 0 && (
              <SectionCard
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                whileHover={{ y: -5 }}
              >
                <SectionHeader>
                  <SectionTitle variant="h6">
                    <Work /> Work Experience
                  </SectionTitle>
                </SectionHeader>
                <SectionContent sx={{ position: "relative", pl: 5 }}>
                  <Box
                    sx={{
                      position: "absolute",
                      left: 24,
                      top: 0,
                      bottom: 0,
                      width: 2,
                      backgroundColor: atheistTheme.divider,
                    }}
                  />

                  {experience.map((exp, index) => (
                    <ExperienceCard
                      key={index}
                      component={motion.div}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <Box>
                              <Typography variant="h6" sx={{ fontWeight: 700, color: atheistTheme.textPrimary }}>
                                {exp.title}
                              </Typography>
                              <Typography variant="subtitle1" sx={{ color: atheistTheme.primary, fontWeight: 600 }}>
                                {exp.company}
                              </Typography>
                              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                                <LocationOn sx={{ fontSize: 16, color: atheistTheme.textSecondary, mr: 0.5 }} />
                                <Typography variant="body2" sx={{ color: atheistTheme.textSecondary, mr: 2 }}>
                                  {exp.location}
                                </Typography>
                                <AccessTime sx={{ fontSize: 16, color: atheistTheme.textSecondary, mr: 0.5 }} />
                                <Typography variant="body2" sx={{ color: atheistTheme.textSecondary }}>
                                  {exp.startDate} — {exp.endDate || "Present"}
                                </Typography>
                              </Box>
                            </Box>
                            <Box>
                              <StatusChip
                                label={exp.endDate ? "Past" : "Current"}
                                status={exp.endDate ? "past" : "current"}
                                size="small"
                              />
                            </Box>
                          </Box>
                        </Grid>

                        {exp.description && (
                          <Grid item xs={12}>
                            <Box sx={{ mt: 1 }}>
                              <Button
                                variant="text"
                                size="small"
                                onClick={() => toggleExpanded(index)}
                                endIcon={expandedExp[index] ? <ExpandLess /> : <ExpandMore />}
                                sx={{
                                  color: atheistTheme.textSecondary,
                                  textTransform: "none",
                                  p: 0,
                                  "&:hover": { backgroundColor: "transparent", color: atheistTheme.primary },
                                }}
                              >
                                {expandedExp[index] ? "Hide details" : "Show details"}
                              </Button>
                              <Collapse in={expandedExp[index]} timeout="auto" unmountOnExit>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    lineHeight: 1.8,
                                    color: atheistTheme.textSecondary,
                                    mt: 2,
                                    backgroundColor: atheistTheme.background,
                                    p: 2,
                                    borderRadius: 2,
                                  }}
                                >
                                  {exp.description}
                                </Typography>
                              </Collapse>
                            </Box>
                          </Grid>
                        )}
                      </Grid>
                    </ExperienceCard>
                  ))}
                </SectionContent>
              </SectionCard>
            )}

            {/* Education Section */}
            {education.length > 0 && (
              <SectionCard
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ y: -5 }}
              >
                <SectionHeader>
                  <SectionTitle variant="h6">
                    <School /> Education
                  </SectionTitle>
                </SectionHeader>
                <SectionContent>
                  <Grid container spacing={3}>
                    {education.map((edu, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <EducationCard
                          component={motion.div}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Box
                            sx={{
                              backgroundColor: atheistTheme.primary,
                              width: 48,
                              height: 48,
                              borderRadius: 2,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              mr: 2,
                              flexShrink: 0,
                            }}
                          >
                            <School sx={{ color: "#fff" }} />
                          </Box>
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: atheistTheme.textPrimary }}>
                              {edu.degree}
                            </Typography>
                            <Typography
                              variant="subtitle2"
                              sx={{ color: atheistTheme.primary, fontWeight: 600, mb: 1 }}
                            >
                              {edu.school}
                            </Typography>
                            <Typography variant="body2" sx={{ color: atheistTheme.textSecondary }}>
                              {edu.fieldOfStudy}
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                              <AccessTime sx={{ fontSize: 14, color: atheistTheme.textSecondary, mr: 0.5 }} />
                              <Typography variant="caption" sx={{ color: atheistTheme.textSecondary }}>
                                {edu.startDate} — {edu.endDate || "Present"}
                              </Typography>
                            </Box>
                          </Box>
                        </EducationCard>
                      </Grid>
                    ))}
                  </Grid>
                </SectionContent>
              </SectionCard>
            )}
          </ContentContainer>
        </Grid>
      </Grid>
    </ProfileContainer>
  )
}

export default TalentProfile
