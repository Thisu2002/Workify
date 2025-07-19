import React, { useState } from 'react';
import {
  Box, Typography, Chip, Card, CardContent,
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  Grid, Avatar, Stack
} from '@mui/material';
import { PersonAdd, Schedule, Message } from '@mui/icons-material';

const PanelManagement = () => {
  const [panelAssignments, setPanelAssignments] = useState([
    {
      id: 1,
      name: "Technical Interview Panel A",
      members: [
        { name: "Dr. Perera", role: "Senior Tech Lead" },
        { name: "Mr. Silva", role: "System Architect" }
      ],
      activeInterviews: 3,
      status: "active"
    },
    {
      id: 2,
      name: "Design Assessment Panel",
      members: [
        { name: "Ms. Fernando", role: "UX Director" },
        { name: "Mr. Gunawardena", role: "Design Lead" }
      ],
      activeInterviews: 2,
      status: "active"
    }
  ]);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" className="page-title">
          Panel Assignments
        </Typography>
        <Button variant="contained" color="primary">
          Create New Panel
        </Button>
      </Box>

      <Grid container spacing={3}>
        {panelAssignments.map(panel => (
          <Grid item xs={12} md={6} key={panel.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{panel.name}</Typography>
                <Chip 
                  label={panel.status.toUpperCase()} 
                  color={panel.status === 'active' ? 'success' : 'default'}
                  size="small"
                  sx={{ mt: 1 }}
                />
                
                <Box mt={2}>
                  <Typography variant="subtitle2" gutterBottom>Panel Members:</Typography>
                  <Stack direction="row" spacing={1}>
                    {panel.members.map((member, idx) => (
                      <Chip
                        key={idx}
                        avatar={<Avatar>{member.name[0]}</Avatar>}
                        label={member.name}
                        variant="outlined"
                      />
                    ))}
                  </Stack>
                </Box>

                <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2">
                    Active Interviews: {panel.activeInterviews}
                  </Typography>
                  <Button variant="outlined" size="small">Manage Panel</Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PanelManagement;
