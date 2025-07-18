import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Modal,
  TextField,
  Typography,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import '../../styles/SubscriptionPlans.css'; // Ensure this path is correct

// Sample data (same as before)
const initialPlans = [
  { id: 1, name: 'Basic Plan', price: '49', features: ['5 Job Postings','Access to Candidate Database','Basic Company Profile'], subscribers: 128, enabled: true },
  { id: 2, name: 'Pro Plan', price: '99', features: ['Unlimited Job Postings','Advanced Candidate Search','Featured Company Profile', 'Email Support'], subscribers: 342, enabled: true },
  { id: 3, name: 'Enterprise Plan', price: '199', features: ['All Pro Plan Features','Dedicated Account Manager','API Access','24/7 Phone Support'], subscribers: 78, enabled: false },
];

const newPlanInitialState = { name: '', price: '', features: '' };

const SubscriptionPlans = () => {
  const [plans, setPlans] = useState(initialPlans);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [newPlan, setNewPlan] = useState(newPlanInitialState);

  // --- EDIT MODAL HANDLERS ---
  const handleEditModalOpen = (plan) => {
    setCurrentPlan(plan);
    setEditModalOpen(true);
  };
  const handleEditModalClose = () => setEditModalOpen(false);
  const handleEditChange = (e) => setCurrentPlan({ ...currentPlan, [e.target.name]: e.target.value });
  const handleEditSave = () => {
    setPlans(plans.map((plan) => (plan.id === currentPlan.id ? currentPlan : plan)));
    handleEditModalClose();
  };

  // --- ADD MODAL HANDLERS ---
  const handleAddModalOpen = () => setAddModalOpen(true);
  const handleAddModalClose = () => {
    setAddModalOpen(false);
    setNewPlan(newPlanInitialState);
  };
  const handleAddChange = (e) => setNewPlan({ ...newPlan, [e.target.name]: e.target.value });
  const handleAddNewPlan = () => {
    if (!newPlan.name || !newPlan.price) return;
    const planToAdd = {
      id: Date.now(),
      ...newPlan,
      features: newPlan.features.split(',').map(f => f.trim()),
      subscribers: 0,
      enabled: true,
    };
    setPlans([...plans, planToAdd]);
    handleAddModalClose();
  };

  // --- STATUS TOGGLE HANDLER ---
  const togglePlanStatus = (id) => {
    setPlans(plans.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p)));
  };

  return (
    <div className="plans-container">
      <header className="page-header">
        <Typography variant="h4" component="h1" className="page-title">
          Subscription Plans
        </Typography>
        <Button
          variant="contained"
          className="add-plan-btn"
          startIcon={<AddCircleOutlineIcon />}
          onClick={handleAddModalOpen}
        >
          Add New Plan
        </Button>
      </header>
      
      <div className="plans-grid">
        {plans.map((plan) => (
          <Card className={`plan-card ${!plan.enabled ? 'disabled' : ''}`} key={plan.id}>
            <CardContent className="plan-card-content">
              <Typography variant="h5" component="h3" className="plan-title">
                {plan.name}
              </Typography>
              <div className="plan-price">
                ${plan.price}
                <span className="period">/month</span>
              </div>
              <ul className="plan-features">
                {plan.features.map((feature, index) => (
                  <li key={index} className="feature-item">{feature}</li>
                ))}
              </ul>
              <div className="plan-subscribers">
                {plan.subscribers} Companies Subscribed
              </div>
            </CardContent>
            <CardActions className="plan-actions">
              <Button variant="contained" className="edit-btn" onClick={() => handleEditModalOpen(plan)}>
                Edit Plan
              </Button>
              <Button variant="outlined" onClick={() => alert(`Viewing companies for ${plan.name}`)}>
                View Companies
              </Button>
              <Button
                variant="contained"
                className={plan.enabled ? 'disable-btn' : 'enable-btn'}
                onClick={() => togglePlanStatus(plan.id)}
              >
                {plan.enabled ? 'Disable' : 'Enable'}
              </Button>
            </CardActions>
          </Card>
        ))}
      </div>

      {/* --- Edit Plan Modal --- */}
      <Modal open={isEditModalOpen} onClose={handleEditModalClose}>
        <Box className="modal-box">
          <Typography variant="h5" className="modal-header">Edit Subscription Plan</Typography>
          {currentPlan && (
            <Box component="form">
              <TextField fullWidth label="Plan Name" name="name" value={currentPlan.name} onChange={handleEditChange} margin="normal"/>
              <TextField fullWidth label="Price" name="price" value={currentPlan.price} onChange={handleEditChange} margin="normal" />
              <div className="modal-actions">
                <Button variant="outlined" onClick={handleEditModalClose}>Cancel</Button>
                <Button variant="contained" className="save-btn" onClick={handleEditSave}>Save Changes</Button>
              </div>
            </Box>
          )}
        </Box>
      </Modal>

      {/* --- Add New Plan Modal --- */}
      <Modal open={isAddModalOpen} onClose={handleAddModalClose}>
        <Box className="modal-box">
          <Typography variant="h5" className="modal-header">Add New Subscription Plan</Typography>
          <Box component="form">
            <TextField fullWidth label="Plan Name" name="name" value={newPlan.name} onChange={handleAddChange} margin="normal" />
            <TextField fullWidth label="Price ($)" name="price" type="number" value={newPlan.price} onChange={handleAddChange} margin="normal" />
            <TextField fullWidth label="Features (comma-separated)" name="features" multiline rows={3} value={newPlan.features} onChange={handleAddChange} margin="normal" />
            <div className="modal-actions">
              <Button variant="outlined" onClick={handleAddModalClose}>Cancel</Button>
              <Button variant="contained" className="save-btn" onClick={handleAddNewPlan}>Create Plan</Button>
            </div>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default SubscriptionPlans;