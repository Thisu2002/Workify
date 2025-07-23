import React, { useState } from "react";
import { useLocation, Link as RouterLink } from "react-router-dom"; 
import { Box, Typography, IconButton, Menu, MenuItem, ListItemIcon, Stack } from "@mui/material";
import { AccountCircle, Logout, Person } from "@mui/icons-material";
import NotificationDropdown from "./NotificationDropdown";
import "../styles/Recruiter.css";


const Header = ({ title, onProfileClick, onLogout }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const location = useLocation();
  const isCandidatePage = location.pathname.startsWith('/candidate');
  //const isRecruiterPage = location.pathname.startsWith('/recruiter');

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
      
      <Stack direction="row" spacing={1} alignItems="center">
        {/* Notification Button - Only for Candidates */}
        {isCandidatePage && <NotificationDropdown />}
        
        {/* Profile Button */}
        <IconButton
          className="profile-icon-btn"
          size="large"
          sx={{ ml: 2 }}
          onClick={handleMenuOpen}
        >
          <AccountCircle sx={{ fontSize: 38 }} />
        </IconButton>
      </Stack>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >

        {isCandidatePage && (
          <MenuItem
            component={RouterLink}
            to="/candidate/profile" 
            onClick={handleMenuClose}
          >
            <ListItemIcon>
              <Person fontSize="small" />
            </ListItemIcon>
            My Profile
          </MenuItem>
        )}
        {/*isRecruiterPage && */}

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
