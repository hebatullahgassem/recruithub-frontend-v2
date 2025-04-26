import { useQuery } from "@tanstack/react-query";
import { getTalents } from "../../../services/Talents";
import { useContext, useState } from "react";
import { userContext } from "../../../context/UserContext";
import { useNavigate } from "react-router";
import CustomPagination from "../../../components/pagination/pagination";
import { Button, TextField, Box, Card, Typography, CircularProgress, Alert } from "@mui/material";
import TalentCard from "../../../components/talent/TalentCard";
import { motion, AnimatePresence } from "framer-motion";
import '../../../styles/company/talents/talents.css';
import '../../../styles/company/companyteme.css';
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

  if (talentsLoading) return <div className="loading-spinner"></div>
  if (talentsError) return <div className="error-message">Error loading talents</div>
  return (
    <div className="talents-container">
      <div className="talents-header">
        <h1>Find Talent</h1>

        <form
          className="talents-search"
          onSubmit={(e) => {
            e.preventDefault()
            setSearchFilters(filters)
            setPage(1)
            talentsRefetch()
          }}
        >
          {Object.entries(filters).map(([key, value]) => (
            <TextField
              key={key}
              label={key.charAt(0).toUpperCase() + key.slice(1)}
              value={value}
              onChange={(e) => setFilters((prev) => ({ ...prev, [key]: e.target.value }))}
              className="talents-search-field"
            />
          ))}

          <div className="talents-search-buttons">
            <button type="submit" className="talents-button talents-button--primary">
              Search
            </button>
            <button type="button" className="talents-button talents-button--secondary" onClick={handleReset}>
              Reset
            </button>
          </div>
        </form>
      </div>

      <div className="talents-grid">
        {talents?.map((talent) => (
          <motion.div
            key={talent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="talent-card">
              <div className="talent-card__header">
                <img src={talent.img || "/placeholder.svg"} alt={talent.name} className="talent-card__avatar" />
                <div>
                  <h3 className="talent-card__name">{talent.name}</h3>
                  {talent.title && <p className="talent-card__title">{talent.title}</p>}
                </div>
              </div>

              <div className="talent-card__body">
                <p className="talent-card__description">
                  {talent.about?.substring(0, 150)}
                  {talent.about?.length > 150 ? "..." : ""}
                </p>

                <div className="talent-card__info">
                  <span>Experience: {talent.experience}</span>
                </div>

                <div className="talent-card__info">
                  <span>Location: {talent.location}</span>
                </div>

                <div className="talent-card__skills">
                  {talent.skills
                    ?.split(",")
                    .slice(0, 3)
                    .map((skill, index) => (
                      <span key={index} className="talent-card__skill">
                        {skill.trim()}
                      </span>
                    ))}
                  {talent.skills?.split(",").length > 3 && (
                    <span className="talent-card__skill">+{talent.skills.split(",").length - 3}</span>
                  )}
                </div>
              </div>

              <div className="talent-card__footer">
                <button
                  className="talent-card__button"
                  onClick={() =>
                    navigate(`/company/talents/TalentProfile`, {
                      state: { talentId: talent.id },
                    })
                  }
                >
                  View Profile
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="talents-pagination">
        <CustomPagination page={page} setPage={setPage} pageSize={pageSize} setPageSize={setPageSize} total={total} />
      </div>
    </div>
  );
}

export default Talents;