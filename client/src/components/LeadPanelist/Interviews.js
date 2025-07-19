import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  LinearProgress
} from '@mui/material';
import { VideoCall as VideoCallIcon } from '@mui/icons-material';

const Interviews = () => {
  const activeInterviews = [
    {
      id: 1,
      candidateName: "Kasun Perera",
      position: "Senior Developer",
      time: "10:00 AM - 11:00 AM",
      panel: "Technical Panel A",
      status: "in-progress",
      progress: 45
    },
    {
      id: 2,
      candidateName: "Malini Silva",
      position: "UX Designer",
      time: "11:30 AM - 12:30 PM",
      panel: "Design Panel",
      status: "upcoming",
      progress: 0
    }
  ];

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Active Interviews</Typography>
      
      <Grid container spacing={3}>
        {activeInterviews.map(interview => (
          <Grid item xs={12} md={6} key={interview.id}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar>{interview.candidateName[0]}</Avatar>
                  <Box flex={1}>
                    <Typography variant="h6">{interview.candidateName}</Typography>
                    <Typography color="textSecondary">{interview.position}</Typography>
                  </Box>
                  <Chip 
                    label={interview.status === 'in-progress' ? 'In Progress' : 'Upcoming'}
                    color={interview.status === 'in-progress' ? 'success' : 'primary'}
                  />
                </Box>

                {interview.status === 'in-progress' && (
                  <Box mt={2}>
                    <Typography variant="body2" gutterBottom>Progress</Typography>
                    <LinearProgress variant="determinate" value={interview.progress} />
                  </Box>
                )}

                <Box mt={2}>
                  <Typography variant="body2">Time: {interview.time}</Typography>
                  <Typography variant="body2">Panel: {interview.panel}</Typography>
                </Box>

                <Box mt={2} display="flex" gap={1}>
                  <Button
                    variant="contained"
                    startIcon={<VideoCallIcon />}
                  >
                    Join Interview
                  </Button>
                  <Button variant="outlined">View Details</Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Interviews;
