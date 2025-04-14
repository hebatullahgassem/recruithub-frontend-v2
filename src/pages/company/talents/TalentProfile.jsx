import React from "react";
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Chip, 
  Divider, 
  CircularProgress,
  Grid,
  Avatar,
  Link,
  useTheme,
  useMediaQuery
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getTalentById } from "../../../services/Talents";
import { 
  LocationOn, 
  Work, 
  School, 
  Code, 
  Email, 
  Phone,
  CalendarToday,
  Fingerprint,
  Download,
  ArrowBack
} from "@mui/icons-material";
import { styled } from '@mui/material/styles';

const parseJSONField = (field) => {
  try {
    return field ? JSON.parse(field) : [];
  } catch (e) {
    console.error(`Error parsing field: ${field}`, e);
    return [];
  }
};

const StyledPaper = styled(Paper)(({ theme }) => ({
  maxWidth: 1200,
  margin: theme.spacing(4, 'auto'),
  padding: theme.spacing(4),
  borderRadius: '16px',
  boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)',
  background: theme.palette.background.paper,
}));

const SectionHeader = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  '&:after': {
    content: '""',
    flex: 1,
    marginLeft: theme.spacing(2),
    height: '1px',
    backgroundColor: theme.palette.divider,
  }
}));

const InfoItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(1.5),
  padding: theme.spacing(1),
  borderRadius: '8px',
  transition: 'background-color 0.2s',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  }
}));

const ExperienceCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: '12px',
  borderLeft: `4px solid ${theme.palette.primary.main}`,
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
  '&:last-child': {
    marginBottom: 0
  }
}));

const EducationCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2.5),
  marginBottom: theme.spacing(2),
  borderRadius: '12px',
  backgroundColor: theme.palette.background.default,
  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.03)',
}));

const SkillChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  padding: theme.spacing(0.5, 1),
  borderRadius: '6px',
  fontWeight: 500,
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.contrastText,
}));

const TalentProfile = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const talentId = location.state?.talentId;

  const { data: talent, isLoading, isError, error } = useQuery({
    queryKey: ["talent", talentId],
    queryFn: () => getTalentById(talentId),
    enabled: !!talentId
  });

  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '80vh'
      }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ 
        textAlign: 'center', 
        padding: theme.spacing(8),
        maxWidth: 600,
        margin: '0 auto'
      }}>
        <Typography variant="h5" color="error" gutterBottom>
          Error loading talent profile
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {error.message}
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate(-1)} 
          sx={{ mt: 3 }}
          startIcon={<ArrowBack />}
        >
          Go Back
        </Button>
      </Box>
    );
  }

  if (!talent) {
    return (
      <Box sx={{ 
        textAlign: 'center', 
        padding: theme.spacing(8),
        maxWidth: 600,
        margin: '0 auto'
      }}>
        <Typography variant="h5" gutterBottom>
          No talent data found
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          The requested talent profile could not be found.
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate(-1)} 
          sx={{ mt: 3 }}
          startIcon={<ArrowBack />}
        >
          Go Back
        </Button>
      </Box>
    );
  }

  // Parse JSON fields
  const education = parseJSONField(talent.education);
  const experience = parseJSONField(talent.experience);
  const skills = parseJSONField(talent.skills);

  return (
    <StyledPaper>
      <Grid container spacing={4}>
        {/* Left Column - Profile Info */}
        <Grid item xs={12} md={4}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            position: 'sticky',
            top: theme.spacing(4),
          }}>
            <Avatar
              src={talent.img}
              alt={talent.name}
              sx={{ 
                width: 180, 
                height: 180, 
                mb: 3,
                border: `4px solid ${theme.palette.primary.main}`,
                boxShadow: theme.shadows[4]
              }}
            />
            
            <Typography 
              variant="h4" 
              gutterBottom 
              sx={{ 
                fontWeight: 700, 
                textAlign: 'center',
                color: theme.palette.text.primary
              }}
            >
              {talent.name}
            </Typography>
            
            <Box sx={{ width: '100%', mt: 1 }}>
              {talent.location && (
                <InfoItem>
                  <LocationOn color="primary" sx={{ mr: 2, fontSize: 24 }} />
                  <Typography variant="body1">{talent.location}</Typography>
                </InfoItem>
              )}
              
              {talent.email && (
                <InfoItem>
                  <Email color="primary" sx={{ mr: 2, fontSize: 24 }} />
                  <Typography variant="body1">
                    <Link href={`mailto:${talent.email}`} color="inherit" underline="hover">
                      {talent.email}
                    </Link>
                  </Typography>
                </InfoItem>
              )}
              
              {talent.phone_number && (
                <InfoItem>
                  <Phone color="primary" sx={{ mr: 2, fontSize: 24 }} />
                  <Typography variant="body1">
                    <Link href={`tel:${talent.phone_number}`} color="inherit" underline="hover">
                      {talent.phone_number}
                    </Link>
                  </Typography>
                </InfoItem>
              )}

              {talent.dob && (
                <InfoItem>
                  <CalendarToday color="primary" sx={{ mr: 2, fontSize: 24 }} />
                  <Typography variant="body1">
                    {new Date(talent.dob).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Typography>
                </InfoItem>
              )}

              {talent.national_id && (
                <InfoItem>
                  <Fingerprint color="primary" sx={{ mr: 2, fontSize: 24 }} />
                  <Typography variant="body1">ID: {talent.national_id}</Typography>
                </InfoItem>
              )}

              {talent.cv && (
                <Box sx={{ mt: 3 }}>
                  <Button 
                    variant="contained" 
                    component={Link}
                    href={talent.cv + ".pdf"}
                    target="_blank"
                    rel="noopener noreferrer"
                    fullWidth
                    size="large"
                    startIcon={<Download />}
                    sx={{
                      py: 1.5,
                      borderRadius: '8px',
                      fontWeight: 600,
                      textTransform: 'none',
                      letterSpacing: 0.5
                    }}
                  >
                    Download CV
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        </Grid>

        {/* Right Column - Detailed Info */}
        <Grid item xs={12} md={8}>
          {/* About Section */}
          {talent.about && talent.about !== "about" && (
            <Box sx={{ mb: 5 }}>
              <SectionHeader variant="h5">
                About
              </SectionHeader>
              <Typography variant="body1" sx={{ 
                lineHeight: 1.8,
                color: theme.palette.text.secondary
              }}>
                {talent.about}
              </Typography>
            </Box>
          )}

          {/* Skills Section */}
          {skills.length > 0 && (
            <Box sx={{ mb: 5 }}>
              <SectionHeader variant="h5">
                Skills & Expertise
              </SectionHeader>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 2 }}>
                {skills.map((skill, index) => (
                  <SkillChip 
                    key={index} 
                    label={skill} 
                    icon={<Code fontSize="small" />} 
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Experience Section */}
          {experience.length > 0 && (
            <Box sx={{ mb: 5 }}>
              <SectionHeader variant="h5">
                Professional Experience
              </SectionHeader>
              {experience.map((exp, index) => (
                exp.title && (
                  <ExperienceCard key={index}>
                    <Typography variant="h6" sx={{ 
                      fontWeight: 600,
                      mb: 1,
                      color: theme.palette.text.primary
                    }}>
                      {exp.title}
                    </Typography>
                    <Typography variant="subtitle1" color="primary" sx={{ mb: 1 }}>
                      {exp.company} • {exp.location}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {exp.employmentType} • {exp.startDate} — {exp.endDate || 'Present'}
                    </Typography>
                    {exp.description && (
                      <Typography variant="body1" sx={{ 
                        mt: 1,
                        lineHeight: 1.7,
                        color: theme.palette.text.secondary
                      }}>
                        {exp.description}
                      </Typography>
                    )}
                  </ExperienceCard>
                )
              ))}
            </Box>
          )}

          {/* Education Section */}
          {education.length > 0 && (
            <Box sx={{ mb: 5 }}>
              <SectionHeader variant="h5">
                Education
              </SectionHeader>
              {education.map((edu, index) => (
                edu.degree && (
                  <EducationCard key={index}>
                    <Typography variant="h6" sx={{ 
                      fontWeight: 600,
                      mb: 0.5,
                      color: theme.palette.text.primary
                    }}>
                      {edu.degree}
                    </Typography>
                    <Typography variant="subtitle1" color="primary" sx={{ mb: 0.5 }}>
                      {edu.school}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {edu.fieldOfStudy} • {edu.startDate} — {edu.endDate || 'Present'}
                    </Typography>
                  </EducationCard>
                )
              ))}
            </Box>
          )}

          {/* National ID Image */}
          {talent.national_id_img && (
            <Box sx={{ mb: 4 }}>
              <SectionHeader variant="h5">
                Identity Verification
              </SectionHeader>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center',
                backgroundColor: theme.palette.background.default,
                borderRadius: '12px',
                padding: theme.spacing(2),
                border: `1px solid ${theme.palette.divider}`
              }}>
                <img 
                  src={talent.national_id_img} 
                  alt="National ID" 
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '300px',
                    borderRadius: '8px',
                    objectFit: 'contain'
                  }} 
                />
              </Box>
            </Box>
          )}
        </Grid>
      </Grid>

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        mt: 6,
        borderTop: `1px solid ${theme.palette.divider}`,
        pt: 3
      }}>
        <Button 
          variant="outlined" 
          onClick={() => navigate(-1)}
          startIcon={<ArrowBack />}
          sx={{ 
            px: 4, 
            py: 1.5,
            borderRadius: '8px',
            fontWeight: 600,
            textTransform: 'none'
          }}
        >
          Back to Talents
        </Button>
      </Box>
    </StyledPaper>
  );
};

export default TalentProfile;