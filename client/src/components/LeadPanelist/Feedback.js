import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Rating,
  Button,
  Stack,
  Divider,
  Grid
} from '@mui/material';
import { Download, VisibilityOutlined } from '@mui/icons-material';

const feedbackData = [
  {
    id: 1,
    candidateName: "Nimal Dissanayake",
    position: "Senior Software Engineer",
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
    interviewDate: "2024-01-15",
    technicalRating: 4.5,
    communicationRating: 4.2,
    overallRating: 4.3,
    strengths: ["Problem Solving", "System Design", "Code Quality"],
    improvements: ["Communication could be clearer"],
    feedback: "Strong technical candidate with excellent problem-solving skills. Shows great potential for senior role.",
    interviewer: "Dr. Jayawardena",
    status: "Positive"
  },
  {
    id: 2,
    candidateName: "Chamari Fernando",
    position: "Product Designer",
    avatar: "https://randomuser.me/api/portraits/women/6.jpg",
    interviewDate: "2024-01-14",
    technicalRating: 4.8,
    communicationRating: 4.6,
    overallRating: 4.7,
    strengths: ["Design Thinking", "User Research", "Prototyping"],
    improvements: ["Could improve presentation skills"],
    feedback: "Outstanding portfolio and excellent understanding of user-centered design principles.",
    interviewer: "Ms. Perera",
    status: "Highly Positive"
  },
  
];

const Feedback = () => {
  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>Panel Feedback Log</Typography>
      
      <Stack spacing={3}>
        {feedbackData.map((feedback) => (
          <Card key={feedback.id} className="feedback-card-modern">
            <CardContent>
              <Box display="flex" justifyContent="space-between" mb={3}>
                <Box display="flex" gap={2}>
                  <Avatar src={feedback.avatar} sx={{ width: 56, height: 56 }} />
                  <Box>
                    <Typography variant="h6">{feedback.candidateName}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feedback.position}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Interviewed on {feedback.interviewDate}
                    </Typography>
                  </Box>
                </Box>
                <Chip 
                  label={feedback.status}
                  color={feedback.status.includes('Highly') ? 'success' : 'primary'}
                />
              </Box>

              <Grid container spacing={3} mb={3}>
                <Grid item xs={4}>
                  <Box textAlign="center">
                    <Typography variant="caption" color="text.secondary">
                      Technical Skills
                    </Typography>
                    <Rating value={feedback.technicalRating} precision={0.5} readOnly />
                    <Typography variant="h6" color="primary">
                      {feedback.technicalRating}/5
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box textAlign="center">
                    <Typography variant="caption" color="text.secondary">
                      Communication
                    </Typography>
                    <Rating value={feedback.communicationRating} precision={0.5} readOnly />
                    <Typography variant="h6" color="primary">
                      {feedback.communicationRating}/5
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box textAlign="center">
                    <Typography variant="caption" color="text.secondary">
                      Overall Rating
                    </Typography>
                    <Rating value={feedback.overallRating} precision={0.5} readOnly />
                    <Typography variant="h6" color="primary">
                      {feedback.overallRating}/5
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Box mb={2}>
                <Typography variant="subtitle2">Strengths:</Typography>
                <Box display="flex" gap={1} mb={1}>
                  {feedback.strengths.map((strength, idx) => (
                    <Chip 
                      key={idx}
                      label={strength}
                      size="small"
                      color="success"
                      variant="outlined"
                    />
                  ))}
                </Box>

                <Typography variant="subtitle2">Areas for Improvement:</Typography>
                <Box display="flex" gap={1}>
                  {feedback.improvements.map((improvement, idx) => (
                    <Chip 
                      key={idx}
                      label={improvement}
                      size="small"
                      color="warning"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body2" className="feedback-text" paragraph>
                {feedback.feedback}
              </Typography>

              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  Feedback provided by: {feedback.interviewer}
                </Typography>
                <Box display="flex" gap={1}>
                  <Button
                    variant="outlined"
                    startIcon={<VisibilityOutlined />}
                    size="small"
                  >
                    View Full Report
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Download />}
                    size="small"
                  >
                    Download PDF
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
};

export default Feedback;
