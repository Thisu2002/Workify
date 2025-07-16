import React from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from "@mui/material";
import { AccessTime, CheckCircle, Cancel } from "@mui/icons-material";

const ApplicationTracker = ({
  trackerTab,
  setTrackerTab,
  getFilteredApplications,
}) => (
  <Box
    sx={{
      mt: 4,
      mb: 2,
      maxWidth: 1300,
      mx: "auto",
      p: 3,
      borderRadius: 3,
      boxShadow: 2,
      background: "rgba(240,245,255,0.7)",
    }}
  >
    <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, textAlign: "center" }}>
      Application Tracker
    </Typography>
    <Tabs
      value={trackerTab}
      onChange={(_, newValue) => setTrackerTab(newValue)}
      indicatorColor="primary"
      textColor="primary"
      variant="fullWidth"
      sx={{
        mb: 3,
        '& .MuiTab-root': { fontWeight: 500, fontSize: 16 },
      }}
    >
      <Tab icon={<AccessTime color="warning" />} iconPosition="start" label="Pending" />
      <Tab icon={<CheckCircle color="success" />} iconPosition="start" label="Accepted" />
      <Tab icon={<Cancel color="error" />} iconPosition="start" label="Rejected" />
    </Tabs>
    <List>
      {(trackerTab === 0 ? getFilteredApplications("pending")
        : trackerTab === 1 ? getFilteredApplications("accepted")
        : getFilteredApplications("rejected")
      ).map((app) => (
        <ListItem
          key={app.id}
          divider
          sx={{
            bgcolor: trackerTab === 0
              ? 'warning.50'
              : trackerTab === 1
              ? 'success.50'
              : 'error.50',
            borderRadius: 2,
            mb: 1,
            boxShadow: 1,
          }}
          secondaryAction={
            <Chip
              label={app.status.charAt(0).toUpperCase() + app.status.slice(1)}
              color={
                trackerTab === 0
                  ? "warning"
                  : trackerTab === 1
                  ? "success"
                  : "error"
              }
              size="small"
              sx={{ fontWeight: 500 }}
            />
          }
        >
          <ListItemIcon>
            {trackerTab === 0 && <AccessTime color="warning" />}
            {trackerTab === 1 && <CheckCircle color="success" />}
            {trackerTab === 2 && <Cancel color="error" />}
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography variant="subtitle1" fontWeight={600}>
                {app.name}
              </Typography>
            }
            secondary={
              <Typography variant="body2" color="text.secondary">
                {app.position}
              </Typography>
            }
          />
        </ListItem>
      ))}
      {(
        (trackerTab === 0 && getFilteredApplications("pending").length === 0) ||
        (trackerTab === 1 && getFilteredApplications("accepted").length === 0) ||
        (trackerTab === 2 && getFilteredApplications("rejected").length === 0)
      ) && (
        <ListItem>
          <ListItemText
            primary={
              <Typography variant="body2" color="text.secondary" textAlign="center">
                No applications in this category.
              </Typography>
            }
          />
        </ListItem>
      )}
    </List>
  </Box>
);

export default ApplicationTracker;