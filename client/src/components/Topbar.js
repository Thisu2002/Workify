import React, { useState } from "react";
import { Box, Typography, IconButton, Menu, MenuItem, ListItemIcon } from "@mui/material";
import { AccountCircle, Logout, Settings } from "@mui/icons-material";
import "../styles/Recruiter.css";

const Header = ({ title, onProfileClick, onLogout }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

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
        onClick={handleMenuOpen}
      >
        <AccountCircle sx={{ fontSize: 38 }} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem
          onClick={() => {
            handleMenuClose();
            if (onProfileClick) onProfileClick();
          }}
        >
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Profile Settings
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            if (onLogout) onLogout();
          }}
        >
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Header;
