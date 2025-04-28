import { useQuery } from "@tanstack/react-query";
import { getTalents } from "../../../services/Talents";
import { useContext, useState } from "react";
import { userContext } from "../../../context/UserContext";
import { useNavigate } from "react-router";
import CustomPagination from "../../../components/pagination/pagination";
import {
  TextField,
  Typography,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Chip,
  Avatar,
  Tooltip,
  Box,
  Paper,
  Button,
} from "@mui/material"
import {
  Search,
  LocationOn,
  Work,
  School,
  Mail,
  Phone,
  Visibility,
  BookmarkBorder,
  PersonAdd,
  CheckCircle,
} from "@mui/icons-material"
import { motion, AnimatePresence } from "framer-motion"
import TalentCard from "../../../components/talent/TalentCard";
import '../../../styles/company/talents/talents.css';
import '../../../styles/company/companyteme.css';

function Talents() {
  const { user, isLight } = useContext(userContext);
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const navigate = useNavigate();
  const isTablet = useMediaQuery(theme.breakpoints.down("md"))
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"))
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const primaryColor = "#e53946"
  const backgroundColor = isLight ? "#ffffff" : "#121212"
  const textColor = isLight ? "#2d3748" : "#e2e8f0"
  const borderColor = isLight ? "#e3cdcd" : "#2d3748"
  const cardBackground = isLight ? "#ffffff" : "#1e1e1e"
  const sectionBackground = isLight ? "#f9f9f9" : "#242424"

  const [filters, setFilters] = useState({
    name: "",
    experience: "",
    location: "",
    skills: "",
  });
  const [searchFilters, setSearchFilters] = useState({
    name: "",
    experience: "",
    location: "",
    skills: "",
  });

  const handleReset = () => {
    setFilters({
      name: "",
      experience: "",
      location: "",
      skills: "",
    });
    setSearchFilters({
      name: "",
      experience: "",
      location: "",
      skills: "",
    });
    setPage(1);
    talentsRefetch();
  };

  const { data: talents, error: talentsError, isLoading: talentsLoading, refetch: talentsRefetch } = useQuery({
    queryKey: ["talents", page, pageSize, searchFilters],
    queryFn: async () => {
      const res = await getTalents({ filters: searchFilters, page, pageSize });
      setTotal(res.count);
      return res.results;
    },
    keepPreviousData: true,
  });

  

  // if (talentsLoading) return <div className="loading-spinner"></div>
  // if (talentsError) return <div className="error-message">Error loading talents</div>
  return (
    <div className={`talents-container ${isLight ? "light-mode" : "dark-mode"}`}>
    <div className="talents-content">
      <div className="talents-header">
        <div className="talents-header-top">
          <h1 className="talents-title" style={{ color: textColor }}>
            ITI Talents 
          </h1>
          <div className="talents-stats">
            <div className="stat-item" style={{ backgroundColor: cardBackground, borderColor }}>
              <div className="stat-icon" style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}>
                <PersonAdd />
              </div>
              <div className="stat-content">
                <span className="stat-value" style={{ color: textColor }}>
                {total}
                </span>
                <span className="stat-label" style={{ color: isLight ? "#718096" : "#a0aec0" }}>
                  Applicants
                </span>
              </div>
            </div>

            {/* <div className="stat-item" style={{ backgroundColor: cardBackground, borderColor }}>
              <div className="stat-icon" style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}>
                <CheckCircle />
              </div>
              <div className="stat-content">
                <span className="stat-value" style={{ color: textColor }}>
                  {talents?.filter((talent) => talent.status === '6').length}
                </span>
                <span className="stat-label" style={{ color: isLight ? "#718096" : "#a0aec0" }}>
                  Hired
                </span>
              </div>
            </div> */}
          </div>
        </div>

        <Paper
          className="search-container"
          sx={{
            backgroundColor: cardBackground,
            borderColor: borderColor,
            border: `1px solid ${borderColor}`,
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "24px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
          }}
        >
          <Box className="search-row">
            <Box className="search-field-wrapper" sx={{ position: "relative", flex: 1 }}>
              <Search
                sx={{
                  position: "absolute",
                  left: "12px",
                  padding: "8px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: primaryColor,
                }}
              />
              <TextField
                placeholder="Search applicants by name..."
                value={filters.name}
                onChange={(e) => setFilters((prev) => ({ ...prev, name: e.target.value }))}
                fullWidth
                variant="outlined"
                size="small"
                InputProps={{
                  sx: {
                    pl: 4,
                    borderRadius: "8px",
                    backgroundColor: sectionBackground,
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: borderColor,
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: primaryColor,
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: primaryColor,
                    },
                    color: textColor,
                  },
                }}
              />
            </Box>
            <Box sx={{ display: "flex", gap: 1, ml: 2  , paddingTop: "8px",}}>
              <Button
                variant="contained"
                onClick={() => {
                  setSearchFilters(filters)
                  setPage(1)
                  talentsRefetch()
                }}
                sx={{
                  backgroundColor: primaryColor,
                  color: "#ffffff",
                  "&:hover": {
                    backgroundColor: "#c62a37",
                    transform: "translateY(-3px)",
                    boxShadow: `0 4px 12px ${primaryColor}33`,
                  },
                  borderRadius: "8px",
                  fontWeight: 600,
                  textTransform: "none",
                }}
              >
                Search
              </Button>
              <Button
                variant="outlined"
                onClick={handleReset}
                sx={{
                  borderColor: borderColor,
                  color: textColor,
                 
                  "&:hover": {
                    borderColor: primaryColor,
                    backgroundColor: `${primaryColor}10`,
                    transform: "translateY(-3px)",
                  },
                  borderRadius: "8px",
                  fontWeight: 600,
                  textTransform: "none",
                }}
              >
                Reset
              </Button>
            </Box>
          </Box>

          <Box className="filter-row" sx={{ display: "flex", gap: 2, mt: 2, flexWrap: "wrap" }}>
            <Box className="filter-field-wrapper" sx={{ position: "relative", flex: 1, minWidth: "200px" }}>
              <Work
                sx={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: primaryColor,
                  fontSize: "20px",
                }}
              />
              <TextField
                label="Experience"
                value={filters.experience}
                onChange={(e) => setFilters((prev) => ({ ...prev, experience: e.target.value }))}
                fullWidth
                variant="outlined"
                size="small"
                InputProps={{
                  sx: {
                    pl: 4,
                    borderRadius: "8px",
                    backgroundColor: sectionBackground,
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: borderColor,
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: primaryColor,
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: primaryColor,
                    },
                    color: textColor,
                  },
                }}
                InputLabelProps={{
                  sx: {
                    color: isLight ? "#718096" : "#a0aec0",
                  },
                }}
              />
            </Box>

            {/* <Box className="filter-field-wrapper" sx={{ position: "relative", flex: 1, minWidth: "200px" }}>
              <LocationOn
                sx={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: primaryColor,
                  fontSize: "20px",
                }}
              />
              <TextField
                label="Location"
                value={filters.location}
                onChange={(e) => setFilters((prev) => ({ ...prev, location: e.target.value }))}
                fullWidth
                variant="outlined"
                size="small"
                InputProps={{
                  sx: {
                    pl: 4,
                    borderRadius: "8px",
                    backgroundColor: sectionBackground,
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: borderColor,
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: primaryColor,
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: primaryColor,
                    },
                    color: textColor,
                  },
                }}
                InputLabelProps={{
                  sx: {
                    color: isLight ? "#718096" : "#a0aec0",
                  },
                }}
              />
            </Box> */}

            <Box className="filter-field-wrapper" sx={{ position: "relative", flex: 1, minWidth: "200px" }}>
              <School
                sx={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: primaryColor,
                  fontSize: "20px",
                }}
              />
              <TextField
                label="Skills"
                value={filters.skills}
                onChange={(e) => setFilters((prev) => ({ ...prev, skills: e.target.value }))}
                fullWidth
                variant="outlined"
                size="small"
                InputProps={{
                  sx: {
                    pl: 4,
                    borderRadius: "8px",
                    backgroundColor: sectionBackground,
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: borderColor,
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: primaryColor,
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: primaryColor,
                    },
                    color: textColor,
                  },
                }}
                InputLabelProps={{
                  sx: {
                    color: isLight ? "#718096" : "#a0aec0",
                  },
                }}
              />
            </Box>
          </Box>
        </Paper>
      </div>

      {talentsLoading ? (
        <div className="talents-loading">
          <CircularProgress size={60} thickness={4} sx={{ color: primaryColor }} />
          <Typography sx={{ mt: 2, color: textColor }}>Loading applicants...</Typography>
        </div>
      ) : talentsError ? (
        <div
          className="talents-error"
          style={{
            backgroundColor: cardBackground,
            borderColor: borderColor,
          }}
        >
          <Typography variant="h5" sx={{ color: primaryColor, fontWeight: 600 }}>
            Error loading applicants
          </Typography>
          <Typography sx={{ color: textColor }}>Please try again later or contact support.</Typography>
        </div>
      ) : (
        <>
          <div className="talents-grid">
            <AnimatePresence>
              {talents?.map((talent) => (
                <motion.div
                  key={talent.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="applicant-card-wrapper"
                >
                  <Paper
                    className="applicant-card"
                    sx={{
                      backgroundColor: cardBackground,
                      borderColor: borderColor,
                      border: `1px solid ${borderColor}`,
                      borderRadius: "12px",
                      overflow: "hidden",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0 12px 24px rgba(0, 0, 0, 0.1)",
                      },
                    }}
                  >
                    <Box className="applicant-card__header" sx={{ p: 2.5, display: "flex", alignItems: "center" }}>
                      <Avatar
                        src={talent.img || "/placeholder.svg"}
                        alt={talent.name}
                        sx={{
                          width: 70,
                          height: 70,
                          border: `2px solid ${primaryColor}`,
                          mr: 2,
                        }}
                      />
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: textColor, mb: 0.5 }}>
                          {talent.name}
                        </Typography>
                        {talent.title && (
                          <Typography variant="body2" sx={{ color: primaryColor, fontWeight: 500, mb: 1 }}>
                            {talent.title}
                          </Typography>
                        )}
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                          {/* {talent.location && (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                color: isLight ? "#718096" : "#a0aec0",
                                fontSize: "13px",
                              }}
                            >
                              <LocationOn sx={{ fontSize: 16, mr: 0.5 }} />
                              <span>{talent.location}</span>
                            </Box> 
                          )} */}
                          {/* {talent.experience && (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                color: isLight ? "#718096" : "#a0aec0",
                                fontSize: "13px",
                              }}
                            >
                              <Work sx={{ fontSize: 16, mr: 0.5 }} />
                              <span>{talent.experience} yrs</span>
                            </Box>
                          )} */}
                        </Box>
                      </Box>
                    </Box>

                    <Box
                      className="applicant-card__body"
                      sx={{ p: "0 20px 20px", flex: 1, display: "flex", flexDirection: "column" }}
                    >
                      <Box className="applicant-skills" sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                        {talent.skills
                          ?.split(",")
                          .slice(0, 5)
                          .map((skill, index) => (
                            <Chip
                              key={index}
                              label={skill.trim()}
                              size="small"
                              sx={{
                                backgroundColor: `${primaryColor}15`,
                                color: primaryColor,
                                borderRadius: "50px",
                                fontWeight: 500,
                                "&:hover": {
                                  backgroundColor: `${primaryColor}25`,
                                  transform: "translateY(-2px)",
                                },
                                transition: "all 0.2s ease",
                              }}
                            />
                          ))}
                        {talent.skills?.split(",").length > 5 && (
                          <Chip
                            label={`+${talent.skills.split(",").length - 5}`}
                            size="small"
                            sx={{
                              backgroundColor: isLight ? "#f8f9fa" : "#2d3748",
                              color: isLight ? "#718096" : "#a0aec0",
                              borderRadius: "50px",
                              fontWeight: 500,
                            }}
                          />
                        )}
                      </Box>

                      <Typography
                        variant="body2"
                        sx={{
                          color: isLight ? "#4a5568" : "#cbd5e0",
                          mb: 2,
                          flex: 1,
                          lineHeight: 1.6,
                        }}
                      >
                        {talent.about
                          ? `${talent.about.substring(0, 120)}${talent.about.length > 120 ? "..." : ""}`
                          : "No summary available for this applicant."}
                      </Typography>

                      <Box sx={{ display: "flex", gap: 1 }}>
                        {talent.email && (
                          <Tooltip title={talent.email}>
                            <Box
                              component="a"
                              href={`mailto:${talent.email}`}
                              sx={{
                                width: 32,
                                height: 32,
                                borderRadius: 1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: isLight ? "#f8f9fa" : "#2d3748",
                                color: isLight ? "#718096" : "#a0aec0",
                                transition: "all 0.2s ease",
                                "&:hover": {
                                  transform: "translateY(-3px)",
                                },
                              }}
                            >
                              <Mail fontSize="small" />
                            </Box>
                          </Tooltip>
                        )}
                        {talent.phone_number && (
                          <Tooltip title={talent.phone_number}>
                            <Box
                              component="a"
                              href={`tel:${talent.phone_number}`}
                              sx={{
                                width: 32,
                                height: 32,
                                borderRadius: 1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: isLight ? "#f8f9fa" : "#2d3748",
                                color: isLight ? "#718096" : "#a0aec0",
                                transition: "all 0.2s ease",
                                "&:hover": {
                                  transform: "translateY(-3px)",
                                },
                              }}
                            >
                              <Phone fontSize="small" />
                            </Box>
                          </Tooltip>
                        )}
                        {talent.cv && (
                          <Tooltip title="SHOW CV">
                            <Box
                              component="a"
                              href={talent.cv+".pdf"}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{
                                width: 32,
                                height: 32,
                                borderRadius: 1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: `${primaryColor}15`,
                                color: primaryColor,
                                transition: "all 0.2s ease",
                                "&:hover": {
                                  transform: "translateY(-3px)",
                                },
                              }}
                            >
                              <BookmarkBorder fontSize="small" />
                            </Box>
                          </Tooltip>
                        )}
                      </Box>
                    </Box>

                    <Box
                      className="applicant-card__footer"
                      sx={{
                        p: 2,
                        borderTop: `1px solid ${borderColor}`,
                        textAlign: "center",
                      }}
                    >
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() =>
                          navigate(`/company/talents/TalentProfile`, {
                            state: { talentId: talent.id },
                          })
                        }
                        startIcon={<Visibility />}
                        sx={{
                          backgroundColor: primaryColor,
                          color: "#ffffff",
                          "&:hover": {
                            backgroundColor: "#c62a37",
                            transform: "translateY(-3px)",
                            boxShadow: `0 4px 12px ${primaryColor}33`,
                          },
                          borderRadius: "8px",
                          fontWeight: 600,
                          textTransform: "none",
                        }}
                      >
                        View Full Profile
                      </Button>
                    </Box>
                  </Paper>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="talents-pagination">
            <CustomPagination
              page={page}
              setPage={setPage}
              pageSize={pageSize}
              setPageSize={setPageSize}
              total={total}
            />
          </div>
        </>
      )}
    </div>
  </div>
  );
}

export default Talents;