import React, { useState } from "react";
import { Box, Typography, Avatar, Divider, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const candidates = [
  {
    id: 1,
    name: "Kasun Perera",
    email: "kasun.perera@email.com",
    position: "Frontend Developer",
    avatar: "https://randomuser.me/api/portraits/men/41.jpg",
    cv: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  },
  {
    id: 2,
    name: "Amali Silva",
    email: "amali.silva@email.com",
    position: "Backend Developer",
    avatar: "https://randomuser.me/api/portraits/women/45.jpg",
    cv: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  },
  {
    id: 3,
    name: "Saman Perera",
    email: "saman.perera@email.com",
    position: "QA Analyst",
    avatar: "https://randomuser.me/api/portraits/men/44.jpg",
    cv: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  },
  {
    id: 4,
    name: "Nimali Fernando",
    email: "nimali.fernando@email.com",
    position: "Product Manager",
    avatar: "https://randomuser.me/api/portraits/women/50.jpg",
    cv: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  },
  {
    id: 5,
    name: "Ruwan Jayasinghe",
    email: "ruwan.jayasinghe@email.com",
    position: "Business Analyst",
    avatar: "https://randomuser.me/api/portraits/men/55.jpg",
    cv: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  },
];

const CandidateList = () => {
  const navigate = useNavigate();
  const [openCV, setOpenCV] = useState(null); // candidate id or null

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #F5F7FB 0%, #96BEC5 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: 6,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: 1200,
          width: '100%',
          borderRadius: 5,
          p: 4,
          background: 'rgba(255,255,255,0.7)',
          borderLeft: '8px solid #96BEC5',
          backdropFilter: 'blur(8px)',
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/lead-panelist/assignments')}
          sx={{ mb: 2, color: '#0F2445', fontWeight: 600, textTransform: 'none', background: 'rgba(150,190,197,0.08)', borderRadius: 2, px: 2, boxShadow: 'none', '&:hover': { background: 'rgba(150,190,197,0.18)' } }}
        >
          Back to Assignments
        </Button>
        <Typography
          variant="h4"
          fontWeight={700}
          mb={4}
          color="#0F2445"
          sx={{ letterSpacing: 0.5, textAlign: 'center' }}
        >
          Candidate List
        </Typography>
        <Box>
          {candidates.map((candidate, idx) => (
            <React.Fragment key={candidate.id}>
              <Box
                display="flex"
                alignItems="center"
                gap={3}
                py={2}
                sx={{
                  transition: 'background 0.2s',
                  borderRadius: 3,
                  '&:hover': {
                    background: 'linear-gradient(90deg, #f5f7fb 80%, #e2e8f0 100%)',
                  },
                }}
              >
                <Avatar src={candidate.avatar} sx={{ width: 48, height: 48, border: '2px solid #96BEC5', boxShadow: 1 }} />
                <Box flex={1}>
                  <Typography variant="subtitle1" fontWeight={600} color="#3B5998">
                    {candidate.name}
                  </Typography>
                  <Typography variant="body2" color="#64748b">
                    {candidate.position}
                  </Typography>
                  <Typography variant="body2" color="#96BEC5" sx={{ wordBreak: 'break-all', fontWeight: 500 }}>
                    {candidate.email}
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  sx={{ minWidth: 90, color: '#0F2445', borderColor: '#96BEC5', fontWeight: 600, textTransform: 'none', borderRadius: 2, mr: 1, '&:hover': { borderColor: '#0F2445', background: 'rgba(15,36,69,0.04)' } }}
                  onClick={() => alert(`Profile for ${candidate.name}`)}
                >
                  Profile
                </Button>
                <Button
                  variant="contained"
                  sx={{ minWidth: 140, background: '#3B5998', fontWeight: 600, textTransform: 'none', borderRadius: 2, boxShadow: 'none', '&:hover': { background: '#2c4373' } }}
                  onClick={() => setOpenCV(candidate.id)}
                >
                  View Document
                </Button>
              </Box>
              {idx < candidates.length - 1 && <Divider sx={{ borderColor: '#e2e8f0' }} />}
              {/* CV Modal */}
              <Dialog open={openCV === candidate.id} onClose={() => setOpenCV(null)} maxWidth="md" fullWidth>
                <DialogTitle>CV for {candidate.name}</DialogTitle>
                <DialogContent sx={{ height: 600 }}>
                  <iframe
                    src={candidate.cv}
                    title={`CV for ${candidate.name}`}
                    width="100%"
                    height="100%"
                    style={{ border: 'none' }}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setOpenCV(null)} color="primary" variant="contained">Close</Button>
                </DialogActions>
              </Dialog>
            </React.Fragment>
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default CandidateList; 