import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../../styles/CompanyProfiles.css"; // Keep your existing CSS for other elements
import {
  Search,
  ArrowLeft,
} from "lucide-react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider, // Import Divider for better separation
  Chip,    // Import Chip for a nicer "status" display
} from "@mui/material";

// Re-using cardColors from JobPostings for consistency if you like
const cardColors = [
  "#e3eaf7",  "#e5f3e5",  "#f7e7d7",  "#f0e3f0",  "#d7f7f3",  "#f7e5e5",
];

// professional default company icon (SVG data URL)
const DEFAULT_COMPANY_LOGO = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><rect fill='%230d6efd' rx='20' width='120' height='120'/><g fill='%23fff' transform='translate(20,24)'><rect x='0' y='0' width='80' height='12' rx='3'/><rect x='0' y='20' width='80' height='12' rx='3'/><rect x='0' y='40' width='80' height='12' rx='3'/><rect x='8' y='64' width='24' height='28' rx='3'/><rect x='36' y='64' width='24' height='28' rx='3'/><rect x='64' y='64' width='16' height='28' rx='3'/></g></svg>";

const CompanyGridView = ({ companies, searchTerm, onSearchChange, onSelectCompany }) => (
  <div className="company-grid-view">
    <div className="toolbar">
      <div className="search-container">
        <Search className="search-icon" size={20} />
        <input
          type="text"
          placeholder="Search companies by name..."
          className="search-input"
          value={searchTerm}
          onChange={onSearchChange}
        />
      </div>
    </div>
    <div className="profiles-grid">
      {companies.map((company) => (
        <div
          key={company._id}
          className="profile-card"
          onClick={() => onSelectCompany(company)}
        >
          <img
            src={
              company.logo || DEFAULT_COMPANY_LOGO
            }
            alt={`${company.name} logo`}
            className="profile-logo"
          />
          <h3 className="profile-name">{company.name}</h3>
          <p className="profile-location">{company.location}</p>
        </div>
      ))}
    </div>
  </div>
);

const CompanyDetailView = ({ company, onBack }) => {
  const [recruiters, setRecruiters] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [jobDialogOpen, setJobDialogOpen] = useState(false);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        // If the company object already includes recruiters/jobs (from /companies/:id/details), use them
        if (company.recruiters && Array.isArray(company.recruiters)) {
          setRecruiters(company.recruiters);
        } else {
          // fallback: fetch recruiters from users endpoint and filter by company name
          const resUsers = await axios.get("http://localhost:5000/manager/users");
          const allRecruiters = resUsers.data.recruiters.filter(r => r.company === company.name);
          setRecruiters(allRecruiters);
        }

        if (company.jobs && Array.isArray(company.jobs)) {
          setJobs(company.jobs);
        } else {
          // fallback: fetch all jobs and filter by company_id
          const resJobs = await axios.get("http://localhost:5000/manager/jobPosts");
          const companyJobs = resJobs.data.filter(j => String(j.company_id) === String(company._id));
          setJobs(companyJobs);
        }

        // Subscription: if populated on the company, use it; otherwise fetch plans list and match id
        const planRef = company.currentSubscription?.plan;
        if (planRef) {
          if (typeof planRef === 'object' && planRef.name) {
            setSubscription(planRef);
          } else {
            // planRef is likely an ObjectId string -> fetch plans and find
            try {
              const resPlans = await axios.get("http://localhost:5000/manager/subscriptionPlans");
              const plan = Array.isArray(resPlans.data)
                ? resPlans.data.find(p => String(p._id) === String(planRef))
                : null;
              setSubscription(plan || null);
            } catch (err) {
              console.error("Error fetching subscription plan list:", err);
              setSubscription(null);
            }
          }
        } else {
          setSubscription(null);
        }
      } catch (err) {
        console.error("Error fetching company details:", err);
      }
    };
    fetchCompanyDetails();
  }, [company]);

  const openJobsCount = jobs.filter(j => j.status === "Open").length;
  const closedJobsCount = jobs.filter(j => j.status === "Closed").length;

  return (
    <Box className="company-detail-view" sx={{ p: 3 }}> {/* Added padding to the main Box */}
      <Button
        onClick={onBack}
        className="back-button"
        startIcon={<ArrowLeft size={20} />}
        sx={{ mb: 4, color: 'text.secondary', '&:hover': { bgcolor: 'action.hover' } }}
      >
        Back to All Companies
      </Button>

      <Box
        className="detail-header"
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 4,
          pb: 2,
          borderBottom: '1px solid #e0e0e0', // Subtle separator
        }}
      >
        <img
          src={
            company.logo || DEFAULT_COMPANY_LOGO
          }
          alt={`${company.name} logo`}
          className="detail-header-logo"
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            objectFit: 'cover',
            marginRight: 24,
            border: '2px solid #ddd',
          }}
        />
        <Box className="detail-header-info">
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 0.5 }}>
            {company.name}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
            {company.location}
          </Typography>
          {company.website && (
            <Button
              variant="text"
              href={company.website.startsWith("http") ? company.website : `http://${company.website}`}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ p: 0, textTransform: 'none', justifyContent: 'flex-start' }}
            >
              {company.website}
            </Button>
          )}
        </Box>
      </Box>

      <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.7 }}>
        {company.description}
      </Typography>

      <Grid container spacing={4} sx={{ mt: 3 }}> {/* Increased spacing */}
        {/* Subscription Plan */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: 3, // More prominent shadow
              borderRadius: 2, // Slightly more rounded corners
              transition: 'transform 0.2s ease-in-out',
              '&:hover': { transform: 'translateY(-5px)' },
              backgroundColor: cardColors[0], // Apply a consistent color
            }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                Subscription Plan
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body1" sx={{ mb: 1 }}>
                <Typography component="span" fontWeight={600}>Plan:</Typography> {subscription?.name || "N/A"}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography component="span" fontWeight={600} mr={1}>Status:</Typography>
                <Chip
                  label={company.currentSubscription?.status || "Unknown"}
                  size="small"
                  color={company.currentSubscription?.status === "Active" ? "success" : "default"}
                  sx={{ fontWeight: 500 }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                Started: {company.currentSubscription?.startDate ? new Date(company.currentSubscription.startDate).toLocaleDateString() : "N/A"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ends: {company.currentSubscription?.endDate ? new Date(company.currentSubscription.endDate).toLocaleDateString() : "N/A"}
              </Typography>
              {/* Add more subscription details if available in your model */}
              {subscription?.price && (
                <Typography variant="body2" color="text.secondary">
                  Price: ${subscription.price} / {subscription.duration}
                </Typography>
              )}
              {subscription?.features && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" fontWeight={600} mb={1}>Features:</Typography>
                  <List dense disablePadding>
                    {subscription.features.map((feature, idx) => (
                      <ListItem key={idx} disablePadding sx={{ py: 0.2 }}>
                        <ListItemText primary={`• ${feature}`} sx={{ '& .MuiListItemText-primary': { fontSize: '0.875rem' } }} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recruiters */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: 3,
              borderRadius: 2,
              transition: 'transform 0.2s ease-in-out',
              '&:hover': { transform: 'translateY(-5px)' },
              backgroundColor: cardColors[1], // Apply a consistent color
            }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                Recruiters ({recruiters.length})
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {recruiters.length > 0 ? (
                <List dense disablePadding sx={{ maxHeight: 200, overflowY: 'auto' }}>
                  {recruiters.map(r => (
                    <ListItem key={r._id || r.id} disablePadding sx={{ py: 0.5 }}>
                      <ListItemText
                        primary={<Typography variant="body1" fontWeight={500}>{r.name}</Typography>}
                        secondary={r.email}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">No recruiters found for this company.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Job Posts */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: 3,
              borderRadius: 2,
              transition: 'transform 0.2s ease-in-out',
              '&:hover': { transform: 'translateY(-5px)' },
              backgroundColor: cardColors[2], // Apply a consistent color
            }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                Job Posts
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body1" sx={{ mb: 1 }}>Open: <Typography component="span" fontWeight={600} color="success.main">{openJobsCount}</Typography></Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>Closed: <Typography component="span" fontWeight={600} color="error.main">{closedJobsCount}</Typography></Typography>
              <Button
                variant="contained"
                size="medium"
                sx={{
                  mt: 'auto', // Pushes the button to the bottom if content is dynamic
                  alignSelf: 'flex-start',
                  bgcolor: 'primary.main',
                  '&:hover': { bgcolor: 'primary.dark' },
                  borderRadius: 1,
                }}
                onClick={() => setJobDialogOpen(true)}
              >
                View All Jobs ({jobs.length})
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Jobs Dialog */}
      <Dialog open={jobDialogOpen} onClose={() => setJobDialogOpen(false)} fullWidth maxWidth="md">
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', py: 2 }}>
          Jobs Posted by {company.name}
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          {jobs.length === 0 && <Typography variant="body1" color="text.secondary" sx={{ py: 2 }}>No jobs posted by this company.</Typography>}
          {jobs.map(job => (
            <Card
              key={job._id}
              variant="outlined" // Gives a clear border
              sx={{
                mb: 2,
                p: 2,
                borderRadius: 2,
                transition: 'box-shadow 0.2s ease-in-out',
                '&:hover': { boxShadow: 2 },
              }}
            >
              <Typography fontWeight={600} variant="h6" gutterBottom>{job.title}</Typography>
              <Grid container spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <Grid item>
                  <Chip
                    label={job.status}
                    size="small"
                    color={job.status === "Open" ? "success" : "default"}
                    sx={{ fontWeight: 500 }}
                  />
                </Grid>
                <Grid item>
                  <Typography variant="body2" color="text.secondary">
                    • {job.location}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body2" color="text.secondary">
                    • {job.salary || "N/A"}
                  </Typography>
                </Grid>
              </Grid>
              <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                Posted on: {job.date_posted ? new Date(job.date_posted).toLocaleDateString() : 'N/A'}
              </Typography>
              {job.skills && job.skills.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>Skills:</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {job.skills.map((skill, idx) => (
                      <Chip key={idx} label={skill} size="small" variant="outlined" />
                    ))}
                  </Box>
                </Box>
              )}
            </Card>
          ))}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setJobDialogOpen(false)} variant="outlined">Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const CompanyProfilesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  const { companyId } = useParams();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get("http://localhost:5000/manager/companies");
        setCompanies(res.data);
        setLoading(false);

        if (companyId) {
          const selected = res.data.find(c => String(c._id) === String(companyId));
          if (selected) {
            // load full details for the selected company
            const details = await axios.get(`http://localhost:5000/manager/companies/${selected._id}/details`);
            setSelectedCompany(details.data);
          }
        }
      } catch (err) {
        console.error("Error fetching companies:", err);
        setLoading(false);
      }
    };
    fetchCompanies();
  }, [companyId]);

  // NEW: when user clicks a company card, fetch its full details before showing detail view
  const handleSelectCompany = async (company) => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/manager/companies/${company._id}/details`);
      setSelectedCompany(res.data); // res.data includes recruiters, jobs, jobCounts and populated currentSubscription
    } catch (err) {
      console.error('Error fetching company details:', err);
      alert('Failed to load company details');
    } finally {
      setLoading(false);
    }
  };

  const filteredCompanies = useMemo(
    () =>
      companies.filter((company) =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [companies, searchTerm]
  );

  if (loading) return <p style={{ textAlign: "center", marginTop: 20 }}>Loading companies...</p>;

  return (
    <div className="company-profiles-container">
      {selectedCompany ? (
        <CompanyDetailView
          company={selectedCompany}
          onBack={() => setSelectedCompany(null)}
        />
      ) : (
        <CompanyGridView
          companies={filteredCompanies}
          searchTerm={searchTerm}
          onSearchChange={(e) => setSearchTerm(e.target.value)}
          onSelectCompany={handleSelectCompany}
        />
      )}
    </div>
  );
};

export default CompanyProfilesPage;