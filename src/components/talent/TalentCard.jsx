import React from "react";
import { Card, CardContent, CardActions } from "@mui/material";
import { Button, Avatar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
const TalentCard = ({ img, name, description, onClick }) => {

  return (
    <Card  sx={{ 
      width: "50%", 
      boxShadow: 3, 
      borderRadius: 2, 
      display: "flex", 
      alignItems: "center",
      cursor: "pointer",
      transition: "transform 0.2s, box-shadow 0.2s",
      '&:hover': {
        transform: "translateY(-2px)",
        boxShadow: 6,
      }
     }} 
     onClick={onClick}
    >
     <Avatar 
        src={img} 
        alt={name} 
        sx={{ 
          width: 80, 
          height: 80, 
          ml: 2,
          border: "2px solid #f5f5f5"
        }} 
        loading="lazy" 
      />
      <CardContent sx={{ display: "flex", flexDirection: "column" }}>
        <Typography variant="h6" fontWeight={600}>
          {name}
        </Typography>
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{
            display: "-webkit-box",
            overflow: "hidden",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 2,
          }}
        >
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default TalentCard;