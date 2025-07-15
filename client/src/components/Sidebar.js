import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import logo from "../images/Group 3.png";
import "../styles/Recruiter.css";

const Sidebar = ({menuTabs, activeTab, setActiveTab, isRecruiter = false, setShowJobForm = false}) => {
  return (
    <Box className="recruiter-sidebar">
      <Box
        className="sidebar-logo"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mb: 3,
          mt: 2,
        }}
      >
        <img
          src={logo}
          alt="Workify Logo"
          style={{ width: 80, height: 80, objectFit: "contain" }}
        />
      </Box>
      <List>
        {menuTabs.map((tab) => (
          <ListItem
            button
            key={tab.id}
            selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`sidebar-tab ${activeTab === tab.id ? "active" : ""}`}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>{tab.icon}</ListItemIcon>
            <ListItemText primary={tab.label} />
          </ListItem>
        ))}
      </List>
      {isRecruiter && (
        <Button
          className="new-button nav-short-btn"
          variant="contained"
          startIcon={<Add sx={{ fontSize: 28, fontWeight: 700 }} />}
          sx={{ mt: 4, width: "90%", alignSelf: "center" }}
          onClick={() => {
            setShowJobForm(true);
            setActiveTab('jobs');
          }}
        >
          New Job Post
        </Button>
      )}
    </Box>
  );
};

export default Sidebar;
