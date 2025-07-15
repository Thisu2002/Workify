import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import "../styles/Recruiter.css"; // or a shared header CSS file

const Header = ({ title, onProfileClick }) => {
  return (
    <Box
      className="recruiter-header"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
    >
      <Typography variant="h5" fontWeight="bold" className="page-title">
        {title}
      </Typography>
      <IconButton
        className="profile-icon-btn"
        size="large"
        sx={{ ml: 2 }}
        onClick={onProfileClick}
      >
        <AccountCircle sx={{ fontSize: 38 }} />
      </IconButton>
    </Box>
  );
};

export default Header;
