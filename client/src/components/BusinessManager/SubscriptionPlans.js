import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Modal,
  TextField,
  Typography,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import '../../styles/SubscriptionPlans.css';

const newPlanInitialState = { name: '', price: '', features: '', billingCycle: 'quarterly', description: '', trialDays: 0 };

const SubscriptionPlans = () => {
  const [plans, setPlans] = useState([]);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [newPlan, setNewPlan] = useState(newPlanInitialState);
  const [saving, setSaving] = useState(false);
  const [companiesModalOpen, setCompaniesModalOpen] = useState(false);
  const [subscribedCompanies, setSubscribedCompanies] = useState([]);
  const [selectedPlanName, setSelectedPlanName] = useState('');

  const navigate = useNavigate();

  // --- FETCH PLANS ---
  const fetchPlans = async () => {
    try {
      const res = await axios.get("http://localhost:5000/manager/subscriptionPlans");
      setPlans(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  // --- EDIT MODAL ---
  const handleEditModalOpen = (plan) => {
    setCurrentPlan(plan);
    setEditModalOpen(true);
  };
  const handleEditModalClose = () => setEditModalOpen(false);
  const handleEditChange = (e) => {
    if (e.target.name === 'features') {
      setCurrentPlan({ ...currentPlan, features: e.target.value.split(',').map(f => f.trim()) });
    } else {
      setCurrentPlan({ ...currentPlan, [e.target.name]: e.target.value });
    }
  };
  const handleEditSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...currentPlan,
        // ensure features is an array of strings
        features: Array.isArray(currentPlan.features)
          ? currentPlan.features.map(f => String(f).trim())
          : (typeof currentPlan.features === 'string'
             ? currentPlan.features.split(',').map(f => f.trim()).filter(Boolean)
             : []),
        // coerce price/trialDays to numbers if possible
        price: currentPlan.price === '' ? currentPlan.price : Number(currentPlan.price),
        trialDays: Number(currentPlan.trialDays || 0),
      };

      const res = await axios.put(`http://localhost:5000/manager/subscriptionPlans/${currentPlan._id}`, payload);
      fetchPlans();
      handleEditModalClose();
    } catch (err) {
      // show server response if present
      console.error('Update plan error:', err.response?.status, err.response?.data || err.message);
      alert('Failed to update plan: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  // --- ADD MODAL ---
  const handleAddModalOpen = () => setAddModalOpen(true);
  const handleAddModalClose = () => {
    setAddModalOpen(false);
    setNewPlan(newPlanInitialState);
  };
  const handleAddChange = (e) => setNewPlan({ ...newPlan, [e.target.name]: e.target.value });
  const handleAddNewPlan = async () => {
    try {
      const planToAdd = { ...newPlan, features: newPlan.features ? newPlan.features.split(',').map(f => f.trim()) : [] };
      await axios.post("http://localhost:5000/manager/subscriptionPlans", planToAdd);
      fetchPlans();
      handleAddModalClose();
    } catch (err) { console.error(err); }
  };

  // --- TOGGLE STATUS ---
  const togglePlanStatus = async (plan) => {
    try {
      await axios.patch(`http://localhost:5000/manager/subscriptionPlans/${plan._id}/toggle`);
      fetchPlans();
    } catch (err) { console.error(err); }
  };

  // --- VIEW COMPANIES ---
  const handleViewCompanies = async (plan) => {
  try {
    const res = await axios.get(`http://localhost:5000/manager/subscriptionPlans/${plan._id}/companies`);
    setSubscribedCompanies(res.data);
    setSelectedPlanName(plan.name);
    setCompaniesModalOpen(true);
  } catch (err) {
    console.error(err);
  }
};

  const handleCloseCompaniesModal = () => {
    setCompaniesModalOpen(false);
    setSubscribedCompanies([]);
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
        {plans.map(plan => (
          <Card key={plan._id} className={`plan-card ${!plan.isActive ? 'disabled' : ''}`}>
            <CardContent className="plan-card-content">
              <Typography variant="h5" component="h3" className="plan-title">{plan.name}</Typography>
              <div className="plan-price">
                LKR {plan.price}
                <span className="period">/month</span>
              </div>
              <ul className="plan-features">
                {plan.features.map((f, i) => <li key={i} className="feature-item">{f}</li>)}
              </ul>
              <div className="plan-subscribers">
                {plan.subscribers} Companies Subscribed
              </div>
            </CardContent>
            <CardActions className="plan-actions">
              <Button variant="contained" className="edit-btn" onClick={() => handleEditModalOpen(plan)}>Edit Plan</Button>
              <Button variant="outlined" onClick={() => handleViewCompanies(plan)}>View Companies</Button>
              <Button
                variant="contained"
                className={plan.isActive ? 'disable-btn' : 'enable-btn'}
                onClick={() => togglePlanStatus(plan)}
              >
                {plan.isActive ? 'Disable' : 'Enable'}
              </Button>
            </CardActions>
          </Card>
        ))}
      </div>

      {/* --- Edit Modal --- */}
      <Modal open={isEditModalOpen} onClose={handleEditModalClose}>
        <Box className="modal-box">
          <Typography variant="h5" className="modal-header">Edit Subscription Plan</Typography>
          {currentPlan && (
            <Box component="form">
              <TextField fullWidth label="Plan Name" name="name" value={currentPlan.name} onChange={handleEditChange} margin="normal"/>
              <TextField fullWidth label="Price (LKR)" name="price" value={currentPlan.price} onChange={handleEditChange} margin="normal"/>
              <TextField fullWidth select label="Billing Cycle" name="billingCycle" value={currentPlan.billingCycle} onChange={handleEditChange} margin="normal" SelectProps={{ native: true }}>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </TextField>
              <TextField fullWidth label="Features (comma-separated)" name="features" value={currentPlan.features.join(',')} onChange={handleEditChange} margin="normal"/>
              <div className="modal-actions">
                <Button variant="outlined" onClick={handleEditModalClose}>Cancel</Button>
                <Button variant="contained" className="save-btn" onClick={handleEditSave} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </Box>
          )}
        </Box>
      </Modal>

      {/* --- Add Modal --- */}
      <Modal open={isAddModalOpen} onClose={handleAddModalClose}>
        <Box className="modal-box">
          <Typography variant="h5" className="modal-header">Add New Subscription Plan</Typography>
          <Box component="form">
            <TextField fullWidth label="Plan Name" name="name" value={newPlan.name} onChange={handleAddChange} margin="normal"/>
            <TextField fullWidth label="Price (LKR)" name="price" value={newPlan.price} onChange={handleAddChange} margin="normal"/>
            <TextField fullWidth label="Features (comma-separated)" name="features" value={newPlan.features} onChange={handleAddChange} margin="normal"/>
            <TextField fullWidth label="Billing Cycle" name="billingCycle" value={newPlan.billingCycle} onChange={handleAddChange} margin="normal"/>
            <div className="modal-actions">
              <Button variant="outlined" onClick={handleAddModalClose}>Cancel</Button>
              <Button variant="contained" className="save-btn" onClick={handleAddNewPlan}>Create Plan</Button>
            </div>
          </Box>
        </Box>
      </Modal>

      {/* --- Subscribed Companies Modal --- */}
      <Modal open={companiesModalOpen} onClose={handleCloseCompaniesModal}>
  <Box className="modal-box">
    <Typography variant="h5" className="modal-header">
      Companies subscribed to {selectedPlanName}
    </Typography>
    <Box>
      {subscribedCompanies.length === 0 ? (
        <Typography>No companies subscribed.</Typography>
      ) : (
        <ul>
  {subscribedCompanies.map((c) => (
    <li
      key={c._id}
      className="clickable-company"
      onClick={() => {
        setCompaniesModalOpen(false); // close modal
        navigate(`/manager/company-profiles/${c._id}`);
      }}
      style={{ cursor: "pointer", textDecoration: "underline" }}
    >
      <strong>{c.name}</strong> - {c.location}
    </li>
  ))}
</ul>

      )}
    </Box>
    <Box className="modal-actions">
      <Button variant="outlined" onClick={handleCloseCompaniesModal}>Close</Button>
    </Box>
  </Box>
</Modal>


    </div>
  );
};

export default SubscriptionPlans;
