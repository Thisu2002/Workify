import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { NavLink } from "react-router-dom"; // <-- import NavLink
import logo from "../images/Group 3.png";
import "../styles/Recruiter.css";

const Sidebar = ({
  menuTabs,
  isRecruiter = false,
  isMentor = false,
  setShowJobForm,
  setShowSessionForm,
}) => {
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
          <NavLink
            key={tab.id}
            to={tab.path}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            {({ isActive }) => (
              <ListItem
                button
                className={`sidebar-tab ${isActive ? "active" : ""}`}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>{tab.icon}</ListItemIcon>
                <ListItemText primary={tab.label} />
              </ListItem>
            )}
          </NavLink>
        ))}
      </List>

      {isRecruiter && (
        <NavLink
          to="/recruiter/job-posts"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Button
            className="nav-short-btn"
            variant="contained"
            startIcon={<Add sx={{ fontSize: 28, fontWeight: 700 }} />}
            sx={{ mt: 4, width: "90%", alignSelf: "center" }}
            onClick={() => setShowJobForm(true)}
          >
            New Job Post
          </Button>
        </NavLink>
      )}

      {isMentor && (
        <NavLink
          to="/mentor/sessions"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Button
            className="nav-short-btn"
            variant="contained"
            startIcon={<Add sx={{ fontSize: 28, fontWeight: 700 }} />}
            sx={{ mt: 4, width: "90%", alignSelf: "center" }}
            onClick={() => setShowSessionForm(true)}
          >
            New Session
          </Button>
        </NavLink>
      )}
    </Box>
  );
};

export default Sidebar;
