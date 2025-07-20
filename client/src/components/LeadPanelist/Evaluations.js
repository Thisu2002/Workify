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
  Grid,
  Stack,
} from '@mui/material';
import { AssessmentOutlined, Download } from '@mui/icons-material';

const evaluationData = [
  {
    id: 1,
    candidateName: "Saman Kumara",
    position: "Senior React Developer",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    interviewDate: "2024-01-15",
    technicalScore: 4.5,
    communicationScore: 4.0,
    overallRating: 4.2,
    panelFeedback: "Strong technical skills, excellent problem-solving abilities",
    status: "Recommended",
    interviewer: "Dr. Perera"
  },
  {
    id: 2,
    candidateName: "Amali Silva",
    position: "UX Designer",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    interviewDate: "2024-01-14",
    technicalScore: 4.8,
    communicationScore: 4.5,
    overallRating: 4.6,
    panelFeedback: "Outstanding portfolio and design thinking process",
    status: "Highly Recommended",
    interviewer: "Ms. Fernando"
  },
  
];

const Evaluations = () => {
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>Interview Evaluations</Typography>
      
      <Grid container spacing={3}>
        {evaluationData.map((evaluation) => (
          <Grid item xs={12} md={6} key={evaluation.id}>
            <Card className="evaluation-card">
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Avatar src={evaluation.avatar} sx={{ width: 56, height: 56 }} />
                  <Box flex={1}>
                    <Typography variant="h6">{evaluation.candidateName}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {evaluation.position}
                    </Typography>
                  </Box>
                  <Chip 
                    label={evaluation.status} 
                    color={evaluation.status.includes('Highly') ? 'success' : 'primary'}
                  />
                </Box>

                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Technical Skills</Typography>
                    <Rating value={evaluation.technicalScore} precision={0.5} readOnly />
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary">Communication</Typography>
                    <Rating value={evaluation.communicationScore} precision={0.5} readOnly />
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary">Panel Feedback</Typography>
                    <Typography variant="body2">{evaluation.panelFeedback}</Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Evaluated by {evaluation.interviewer} • {evaluation.interviewDate}
                    </Typography>
                  </Box>
                </Stack>

                <Box display="flex" gap={1} mt={2}>
                  <Button
                    variant="outlined"
                    startIcon={<AssessmentOutlined />}
                    size="small"
                  >
                    View Details
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Download />}
                    size="small"
                  >
                    Download Report
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Evaluations;
