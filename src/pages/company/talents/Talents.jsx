import { useQuery } from "@tanstack/react-query";
import { getTalents } from "../../../services/Talents";
import { useContext, useState } from "react";
import { userContext } from "../../../context/UserContext";
import { useNavigate } from "react-router";
import CustomPagination from "../../../components/pagination/pagination";
import { Button, TextField, Box, Card, Typography, CircularProgress, Alert } from "@mui/material";
import TalentCard from "../../../components/talent/TalentCard";
import { motion, AnimatePresence } from "framer-motion";

const primaryColor = "#901b26";
const hoverColor = "#6a1320";

function Talents() {
  const { user } = useContext(userContext);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
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

  const buttonStyle = {
    backgroundColor: primaryColor,
    color: "#fff",
    "&:hover": {
      backgroundColor: hoverColor,
      transform: "translateY(-2px)",
      boxShadow: `0 4px 12px ${primaryColor}33`
    },
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    px: 3,
    py: 1
  };

  if (talentsLoading) return <CircularProgress sx={{ color: primaryColor, mt: 4 }} />;
  if (talentsError) return <Alert severity="error" sx={{ mt: 2 }}>Error loading talents</Alert>;

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: "0 auto" }}>
      <Card sx={{
        p: 3,
        mb: 3,
        borderRadius: 3,
        boxShadow: 3,
        background: "linear-gradient(to bottom right, #fff 0%, #f8f0f2 100%)"
      }}>
        <Typography variant="h4" sx={{ 
          color: primaryColor,
          fontWeight: 700,
          mb: 3,
          textAlign: "center"
        }}>
          Find Talent
        </Typography>

        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            setSearchFilters(filters);
          }}
          sx={{ display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "center" }}
        >
          {Object.entries(filters).map(([key, value]) => (
            <TextField
              key={key}
              label={key.charAt(0).toUpperCase() + key.slice(1)}
              value={value}
              onChange={(e) => setFilters(prev => ({ ...prev, [key]: e.target.value }))}
              sx={{
                flex: "1 1 200px",
                '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: `${primaryColor} !important`
                }
              }}
            />
          ))}

          <Box sx={{ display: "flex", gap: 2, width: "100%", justifyContent: "center", mt: 2 }}>
            <Button type="submit" sx={buttonStyle}>
              Search
            </Button>
            <Button
              onClick={handleReset}
              sx={{
                ...buttonStyle,
                backgroundColor: "#fff",
                color: primaryColor,
                border: `2px solid ${primaryColor}`,
                "&:hover": {
                  backgroundColor: "#f8f0f2"
                }
              }}
            >
              Reset
            </Button>
          </Box>
        </Box>
      </Card>
      <Box sx={{
          display: "grid",
          gridTemplateColumns: "1fr", // Single column layout
          marginLeft: "-24px", // Counteract parent padding
          gap: 3,
          p: 3,
          width: "100vw",
          marginLeft: "-24px", // Counteract default padding
          minHeight: "100vh"
        }}>
          <AnimatePresence>
            {talents?.map((talent) => (
              <motion.div
                key={talent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                style={{ width: "100%" }}
              >
                <TalentCard
                  img={talent.img}
                  name={talent.name}
                  description={talent.about}
                  experience={talent.experience}
                  location={talent.location}
                  skills={talent.skills}
                  onClick={() => navigate(`/company/talents/TalentProfile`, { state: { talentId: talent.id }})}                  sx={{
                    width: "95vw", // 95% of viewport width
                    maxWidth: "1800px", // Maximum card width
                    height: 400,
                    mx: "auto", // Center card horizontally
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: `0 8px 16px ${primaryColor}20`
                    }
                  }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
      </Box>
      <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
        <CustomPagination
          page={page}
          setPage={setPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
          total={total}
          color={primaryColor}
        />
      </Box>
    </Box>
  );
}

export default Talents;