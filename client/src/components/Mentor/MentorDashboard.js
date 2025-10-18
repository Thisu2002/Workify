import React, { useState } from 'react';
import {
  Box,
  Container,
  Tab,
  Tabs,
  Paper
} from '@mui/material';
import Requests from './Requests';
import Sessions from './Sessions';
import { SnackbarProvider } from 'notistack';

const MentorDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [showSessionForm, setShowSessionForm] = useState(false);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    // Reset session form when changing tabs
    setShowSessionForm(false);
  };

  return (
    <SnackbarProvider maxSnack={3}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Pending Requests" />
            <Tab label="Scheduled Sessions" />
          </Tabs>
          
          <Box sx={{ mt: 2 }}>
            {activeTab === 0 && <Requests />}
            {activeTab === 1 && (
              <Sessions 
                showSessionForm={showSessionForm} 
                setShowSessionForm={setShowSessionForm} 
              />
            )}
          </Box>
        </Paper>
      </Container>
    </SnackbarProvider>
  );
};

export default MentorDashboard;
