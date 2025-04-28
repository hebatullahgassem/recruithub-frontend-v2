import React, { useContext, useState, useEffect } from "react";
import { userContext } from "../../../../context/UserContext";
import { 
  Button, 
  TextField, 
  Box, 
  Grid, 
  CircularProgress, 
  Alert, 
  Switch,
  Typography,
  IconButton,
  Paper,
  Container,
  useTheme,
  useMediaQuery,
  styled,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { AxiosApi } from "../../../../services/Api";
import { Delete, Add, Check, Work } from "@mui/icons-material";

// Updated Color Palette
const primaryColor = '#901b26'; // IIT Maroon
const secondaryColor = '#d7323e'; // Complementary Gold
const accentColor = '#a0454e'; // Darker Maroon
const backgroundColor = '#f8f2ec'; // Off-white with warm tint
const textPrimary = '#2d2829'; // Dark Charcoal
const textSecondary = '#5a5252'; // Warm Gray

const ExperienceCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(3),
  borderRadius: '12px',
  backgroundColor: '#fff',
  border: `1px solid ${primaryColor}20`,
  boxShadow: '0 8px 24px rgba(112,43,46,0.08)',
  transition: 'all 0.3s ease',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 28px rgba(112,43,46,0.12)'
  }
}));

const AddButton = styled(Button)(({ theme }) => ({
  padding: `${theme.spacing(1.5)} ${theme.spacing(3)}`,
  borderRadius: '8px',
  fontWeight: 600,
  textTransform: 'none',
  margin: `${theme.spacing(3)} auto`,
  width: 'fit-content',
  borderWidth: 2,
  '&:hover': {
    borderWidth: 2
  }
}));

const SaveButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: '8px',
  fontWeight: 700,
  textTransform: 'none',
  fontSize: '1.1rem',
  minWidth: 200,
  letterSpacing: 0.5,
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
}));

const EditExperience = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  const navigate = useNavigate();
  const locationUserId = location.state?.userId;
  const { user, isLight } = useContext(userContext);
  const userId = locationUserId || user?.id;
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch experience on mount
  useEffect(() => {
    if (!userId) {
      navigate("/applicant/profile", { replace: true });
      return;
    }

    const fetchExperience = async () => {
      try {
        const res = await AxiosApi.get(`user/jobseekers/${userId}/`, {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        });

        const expData = res.data?.experience;

        if (!expData) {
          setExperiences([]);
        } else if (Array.isArray(expData)) {
          setExperiences(expData);
        } else {
          try {
            const parsed = JSON.parse(expData);
            setExperiences(Array.isArray(parsed) ? parsed : [parsed]);
          } catch (err) {
            console.error("Invalid JSON in experience:", err);
            setExperiences([]);
          }
        }
      } catch (err) {
        console.error("Error fetching experience:", err);
        setError("Failed to load experience data.");
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, [userId]);

  const handleAddExperience = () => {
    setExperiences([
      ...experiences,
      {
        title: "",
        company: "",
        location: "",
        description: "",
        employmentType: "",
        startDate: "",
        endDate: "",
      },
    ]);
  };

  const handleChange = (index, key, value) => {
    const updatedExperiences = [...experiences];
    updatedExperiences[index][key] = value;
    setExperiences(updatedExperiences);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("experience", JSON.stringify(experiences));

      await AxiosApi.patch(`user/jobseekers/${userId}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/applicant/profile" );
    } catch (err) {
      console.error("Error saving experience:", err);
      setError("Failed to save experience.");
      setLoading(false);
    }
  };


  
  return (
    <Container sx={{ p: 10, backgroundColor: isLight ? '#fff' : '#121212', minWidth: '100vw' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ 
          fontWeight: 700, 
          color: isLight ? "#901b26" : "#d7323e",
          fontSize: isMobile ? '1.8rem' : '2.125rem',
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <Work fontSize="large" sx={{ color: primaryColor }} />
          Edit Professional Experience
        </Typography>
      </Box>

      <form onSubmit={handleSave}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {experiences.map((exp, index) => (
              <ExperienceCard key={exp.id} style={{backgroundColor: isLight ? '#fff' : '#242424'}}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    position: "absolute",
                    top: theme.spacing(1),
                    right: theme.spacing(1),
                  }}
                >
                  <IconButton
                    onClick={() =>
                      setExperiences(experiences.filter((_, i) => i !== index))
                    }
                    sx={{ color: accentColor, "&:hover": { color: primaryColor } }}
                  >
                    <Delete />
                  </IconButton>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Job Title"
                      value={exp.title}
                      onChange={(e) =>
                        handleChange(index, "title", e.target.value)
                      }
                      fullWidth
                      required
                      variant="outlined"
                      
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          background: isLight ? "#fff" : "#121212",
                          color: isLight ? "black" : "white",
                          "& fieldset": {
                            borderColor: "#901b20",
                          },
                          "&:hover fieldset": {
                            borderColor: "#901b20",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: isLight ? "black" : "white",
                        },
                        "& .MuiInputBase-input": {
                          backgroundColor: isLight
                            ? "rgba(255, 255, 255, 0.95)"
                            : "#121212",
                          color: isLight ? "black" : "white",
                          paddingLeft: 1,
                          borderRadius: "10px",
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Company Name"
                      value={exp.company}
                      onChange={(e) =>
                        handleChange(index, "company", e.target.value)
                      }
                      fullWidth
                      required
                      variant="outlined"
                      InputProps={{
                        sx: { borderRadius: "8px" },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          background: isLight ? "#fff" : "#121212",
                          color: isLight ? "black" : "white",
                          "& fieldset": {
                            borderColor: "#901b20",
                          },
                          "&:hover fieldset": {
                            borderColor: "#901b20",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: isLight ? "black" : "white",
                        },
                        "& .MuiInputBase-input": {
                          backgroundColor: isLight
                            ? "rgba(255, 255, 255, 0.95)"
                            : "#121212",
                          color: isLight ? "black" : "white",
                          paddingLeft: 1,
                          borderRadius: "10px",
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Location"
                      value={exp.location}
                      onChange={(e) =>
                        handleChange(index, "location", e.target.value)
                      }
                      fullWidth
                      variant="outlined"
                      InputProps={{
                        sx: { borderRadius: "8px" },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          background: isLight ? "#fff" : "#121212",
                          color: isLight ? "black" : "white",
                          "& fieldset": {
                            borderColor: "#901b20",
                          },
                          "&:hover fieldset": {
                            borderColor: "#901b20",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: isLight ? "black" : "white",
                        },
                        "& .MuiInputBase-input": {
                          backgroundColor: isLight
                            ? "rgba(255, 255, 255, 0.95)"
                            : "#121212",
                          color: isLight ? "black" : "white",
                          paddingLeft: 1,
                          borderRadius: "10px",
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControl
                      size="large"
                      sx={{
                        width:"100%",
                        minWidth: 140,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          background: isLight ? "#fff" : "#121212",
                          color: isLight ? "black" : "white",
                        },
                        "& .css-lohd6h-MuiSvgIcon-root-MuiSelect-icon": {
                          color: isLight ? "black" : "white",
                        },
                        "& .css-1rju2q6-MuiButtonBase-root-MuiMenuItem-root": {
                          color: isLight ? "black" : "white",
                          background: isLight ? "#fff" : "#121212",
                        },
                      }}
                    >
                      <InputLabel
                        id="page-size-label"
                        style={{ color: isLight ? "black" : "white" }}
                      >
                        Employment Type
                      </InputLabel>
                      <Select
                        labelId="page-size-label"
                        value={exp.employmentType}
                        onChange={(e) =>
                          handleChange(index, "employmentType", e.target.value)
                        }
                        label="Per page"
                      >
                        <MenuItem key="select-type" value="" disabled>
                          Select Type
                        </MenuItem>
                        <MenuItem key="full-time" value="full-time">
                          Full-time
                        </MenuItem>
                        <MenuItem key="part-time" value="part-time">
                          Part-time
                        </MenuItem>
                        <MenuItem key="freelance" value="freelance">
                          Freelance
                        </MenuItem>
                        <MenuItem key="intern" value="intern">
                          Intern
                        </MenuItem>
                      </Select>
                    </FormControl>
                    {/* <TextField
                    select
                    label="Employment Type"
                    value={exp.employmentType}
                    onChange={(e) =>
                      handleChange(index, "employmentType", e.target.value)
                    }
                    fullWidth
                    variant="outlined"
                    SelectProps={{
                      native: true,
                      sx: { borderRadius: "8px", color: "black" , backgroundColor: isLight ? "#fff" : "#121212"},
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        background: isLight ? "#fff" : "#121212",
                        color: isLight ? "black" : "white",
                        "& fieldset": {
                          borderColor: "#901b20",
                        },
                        "&:hover fieldset": {
                          borderColor: "#901b20",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: isLight ? "black" : "white",
                      },
                      "& .MuiInputBase-input": {
                        backgroundColor: isLight
                          ? "rgba(255, 255, 255, 0.95)"
                          : "#121212",
                        color: isLight ? "black" : "white",
                        paddingLeft: 1,
                        borderRadius: "10px",
                      },
                    }}
                  >
                    <option value="">Select Type</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="freelance">Freelance</option>
                    <option value="intern">Intern</option>
                  </TextField> */}
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="Description"
                      value={exp.description}
                      onChange={(e) =>
                        handleChange(index, "description", e.target.value)
                      }
                      fullWidth
                      multiline
                      rows={3}
                      variant="outlined"
                      InputProps={{
                        sx: { borderRadius: "8px" },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          background: isLight ? "#fff" : "#121212",
                          color: isLight ? "black" : "white",
                          "& fieldset": {
                            borderColor: "#901b20",
                          },
                          "&:hover fieldset": {
                            borderColor: "#901b20",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: isLight ? "black" : "white",
                        },
                        "& .MuiInputBase-input": {
                          backgroundColor: isLight
                            ? "rgba(255, 255, 255, 0.95)"
                            : "#121212",
                          color: isLight ? "black" : "white",
                          paddingLeft: 1,
                          borderRadius: "10px",
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Start Date"
                      type="date"
                      value={exp.startDate}
                      onChange={(e) =>
                        handleChange(index, "startDate", e.target.value)
                      }
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      required
                      variant="outlined"
                      InputProps={{
                        sx: { borderRadius: "8px" },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          background: isLight ? "#fff" : "#121212",
                          color: isLight ? "black" : "white",
                          "& fieldset": {
                            borderColor: "#901b20",
                          },
                          "&:hover fieldset": {
                            borderColor: "#901b20",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: isLight ? "black" : "white",
                        },
                        "& .MuiInputBase-input": {
                          backgroundColor: isLight
                            ? "rgba(255, 255, 255, 0.95)"
                            : "#121212",
                          color: isLight ? "black" : "white",
                          paddingLeft: 1,
                          borderRadius: "10px",
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        height: "100%",
                        justifyContent: "flex-end",
                      }}
                    >
                      <TextField
                        label="End Date"
                        type="date"
                        value={exp.endDate}
                        onChange={(e) =>
                          handleChange(index, "endDate", e.target.value)
                        }
                        fullWidth
                        disabled={exp.endDate === "Now"}
                        InputLabelProps={{ shrink: true }}
                        required={exp.startDate && exp.endDate !== "Now"}
                        variant="outlined"
                        InputProps={{
                          sx: { borderRadius: "8px" },
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            background: isLight ? "#fff" : "#121212",
                            color: isLight ? "black" : "white",
                            "& fieldset": {
                              borderColor: "#901b20",
                            },
                            "&:hover fieldset": {
                              borderColor: "#901b20",
                            },
                          },
                          "& .MuiInputLabel-root": {
                            color: isLight ? "black" : "white",
                          },
                          "& .MuiInputBase-input": {
                            backgroundColor: isLight
                              ? "rgba(255, 255, 255, 0.95)"
                              : "#121212",
                            color: isLight ? "black" : "white",
                            paddingLeft: 1,
                            borderRadius: "10px",
                          },
                        }}
                      />

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mt: 1,
                        }}
                      >
                        <Switch
                          checked={exp.endDate === "Now"}
                          onChange={(e) =>
                            handleChange(
                              index,
                              "endDate",
                              e.target.checked ? "Now" : ""
                            )
                          }
                          color="primary"
                        />
                        <Typography
                          variant="body2"
                          sx={{ color: isLight ? "#901b26" : "#d7323e" }}
                        >
                          Currently Working Here
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </ExperienceCard>
            ))}

          <AddButton
            variant="outlined"
            onClick={handleAddExperience}
            startIcon={<Add />}
            sx={{
              borderColor: primaryColor,
              color: primaryColor,
              '&:hover': {
                backgroundColor: 'rgba(42, 92, 125, 0.08)',
                borderColor: secondaryColor
              }
            }}
          >
            Add Another Position
          </AddButton>

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'flex-end',
            mt: 4
          }}>
            <SaveButton
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: primaryColor,
                '&:hover': {
                  backgroundColor: secondaryColor,
                  boxShadow: '0px 4px 12px rgba(244, 162, 97, 0.4)'
                }
              }}
              startIcon={<Check />}
            >
              Save Experience
            </SaveButton>
          </Box>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mt: 2, 
                borderRadius: '12px',
                '& .MuiAlert-message': { color: textPrimary }
              }}
            >
              {error}
            </Alert>
          )}
        </Box>
      </form>
    </Container>
  );
};


export default EditExperience;