import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Button,
  Grid,
  Paper,
  LinearProgress,
  Divider,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Rating,
  Fade,
  Slide,
  Zoom,
  alpha,
  DashboardIcon,
  PersonAddIcon,
  ScheduleIcon,
  HistoryIcon,
  StarIcon,
  TrendingUpIcon,
  AccessTimeIcon,
  VideoCallIcon,
  MessageIcon,
  CheckIcon,
  CloseIcon,
  AddIcon,
  SearchIcon,
  DownloadIcon,
  VerifiedIcon,
  ExpertIcon,
  OnlineIcon,
  SchoolIcon,
  PsychologyIcon,
  AssessmentIcon
} from '../utils/materialImports';
import '../styles/Mentor.css';

const Mentor = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [mentorRequests, setMentorRequests] = useState([]);
  const [activeSessions, setActiveSessions] = useState([]);
  const [completedSessions, setCompletedSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSessions: 45,
    pendingRequests: 8,
    rating: 4.8,
    responseRate: 95,
    weekSessions: 12,
    responseTime: 2.4
  });

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);

    setMentorRequests([
      {
        id: 1,
        candidateName: 'Pathum Tilakarathne',
        candidateAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face',
        requestType: 'CV Review',
        experience: '2 years',
        field: 'Frontend Development',
        requestDate: '2024-01-15',
        message: 'Looking for help with optimizing my CV for senior frontend roles. I have experience with React, TypeScript, and modern frontend technologies.',
        urgency: 'medium',
        skills: ['React', 'TypeScript', 'CSS']
      },
      {
        id: 2,
        candidateName: 'Sarini wijesinghe',
        candidateAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=60&h=60&fit=crop&crop=face',
        requestType: 'Interview Prep',
        experience: '1 year',
        field: 'UX Design',
        requestDate: '2024-01-14',
        message: 'Need guidance for upcoming Google interview. Looking for tips on design thinking and portfolio presentation.',
        urgency: 'high',
        skills: ['Figma', 'User Research', 'Prototyping']
      },
      {
        id: 3,
        candidateName: 'Milinda Udayanga',
        candidateAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face',
        requestType: 'Career Guidance',
        experience: '3 years',
        field: 'Backend Development',
        requestDate: '2024-01-13',
        message: 'Seeking advice on career transition to cloud technologies. Currently working with Node.js and exploring AWS.',
        urgency: 'low',
        skills: ['Node.js', 'AWS', 'Docker']
      }
    ]);

    setActiveSessions([
      {
        id: 1,
        candidateName: 'Emaya Liyanage',
        candidateAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face',
        sessionType: 'CV Review',
        scheduledTime: '2024-01-16 14:00',
        duration: '60 min',
        status: 'upcoming',
        progress: 0
      },
      {
        id: 2,
        candidateName: 'Danushka Perera',
        candidateAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop&crop=face',
        sessionType: 'Mock Interview',
        scheduledTime: '2024-01-16 16:30',
        duration: '90 min',
        status: 'in-progress',
        progress: 45
      }
    ]);

    setCompletedSessions([
      {
        id: 1,
        candidateName: 'Lisathmi Gunasekara',
        candidateAvatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=60&h=60&fit=crop&crop=face',
        sessionType: 'Interview Prep',
        completedDate: '2024-01-12',
        duration: '75 min',
        rating: 5,
        feedback: 'Excellent guidance, very helpful! The mock interview really boosted my confidence.'
      },
      {
        id: 2,
        candidateName: 'Anushka Silva',
        candidateAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face',
        sessionType: 'CV Review',
        completedDate: '2024-01-10',
        duration: '45 min',
        rating: 4,
        feedback: 'Good insights on CV structure. Helped me reorganize my experience section effectively.'
      }
    ]);
  }, []);

  const handleAcceptRequest = (requestId) => {
    setMentorRequests(prev => prev.filter(req => req.id !== requestId));
  };

  const handleDeclineRequest = (requestId) => {
    setMentorRequests(prev => prev.filter(req => req.id !== requestId));
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return '#ff4757';
      case 'medium': return '#ffa502';
      case 'low': return '#96BEC5';
      default: return '#656565';
    }
  };

  const StatCard = ({ icon, title, value, change, color = '#96BEC5' }) => (
    <Zoom in={!loading} style={{ transitionDelay: '200ms' }}>
      <Card className="stat-card-modern">
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography variant="body2" className="stat-title">
                {title}
              </Typography>
              <Typography variant="h3" className="stat-value" sx={{ color }}>
                {value}
              </Typography>
              <Typography variant="caption" className="stat-change">
                {change}
              </Typography>
            </Box>
            <Box className="stat-icon" sx={{ backgroundColor: alpha(color, 0.1) }}>
              {icon}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Zoom>
  );

  const RequestCard = ({ request, index }) => (
    <Slide in={!loading} direction="up" style={{ transitionDelay: `${index * 100}ms` }}>
      <Card className="request-card-modern">
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar src={request.candidateAvatar} sx={{ width: 56, height: 56 }} />
              <Box>
                <Typography variant="h6" className="candidate-name">
                  {request.candidateName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {request.experience} • {request.field}
                </Typography>
                <Box display="flex" gap={1} mt={1}>
                  {request.skills.map((skill, idx) => (
                    <Chip 
                      key={idx} 
                      label={skill} 
                      size="small" 
                      className="skill-chip"
                    />
                  ))}
                </Box>
              </Box>
            </Box>
            <Box display="flex" flexDirection="column" alignItems="flex-end" gap={1}>
              <Chip 
                label={request.urgency}
                size="small"
                sx={{ 
                  backgroundColor: getUrgencyColor(request.urgency),
                  color: 'white',
                  fontWeight: 'bold'
                }}
              />
              <Typography variant="caption" color="text.secondary">
                {request.requestDate}
              </Typography>
            </Box>
          </Box>

          <Chip 
            label={request.requestType} 
            variant="outlined" 
            className="type-chip"
            sx={{ mb: 2 }}
          />

          <Typography variant="body2" className="request-message" paragraph>
            {request.message}
          </Typography>

          <Box display="flex" gap={1} justifyContent="flex-end">
            <Button
              variant="outlined"
              startIcon={<CloseIcon />}
              onClick={() => handleDeclineRequest(request.id)}
              className="decline-btn"
            >
              Decline
            </Button>
            <Button
              variant="contained"
              startIcon={<CheckIcon />}
              onClick={() => handleAcceptRequest(request.id)}
              className="accept-btn"
            >
              Accept & Schedule
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Slide>
  );

  return (
    <Box className="mentor-dashboard-modern">
      {/* Header */}
      <Paper className="dashboard-header-modern" elevation={0}>
        <Box className="header-content-modern">
          <Box display="flex" alignItems="center" gap={3}>
            <Box position="relative">
              <Avatar 
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop&crop=face"
                sx={{ width: 80, height: 80, border: '3px solid #96BEC5' }}
              />
              <OnlineIcon 
                className="online-indicator"
                sx={{ 
                  position: 'absolute', 
                  bottom: 5, 
                  right: 5,
                  color: '#10b981',
                  backgroundColor: '#0F2445',
                  borderRadius: '50%',
                  fontSize: 16,
                  padding: '2px'
                }}
              />
            </Box>
            <Box>
              <Typography variant="h4" className="welcome-text">
                Welcome back, Mentor!
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                Senior Tech Mentor • 3 years experience
              </Typography>
              <Box display="flex" gap={1} mt={1}>
                <Chip 
                  icon={<VerifiedIcon />} 
                  label="Verified" 
                  size="small" 
                  className="verified-badge"
                />
                <Chip 
                  icon={<ExpertIcon />} 
                  label="Expert" 
                  size="small" 
                  className="expert-badge"
                />
              </Box>
            </Box>
          </Box>

          <Box display="flex" alignItems="center" gap={2}>
            <Grid container spacing={2}>
              <Grid item>
                <StatCard 
                  icon={<TrendingUpIcon />}
                  title="Total Sessions"
                  value={stats.totalSessions}
                  change="+12% this month"
                />
              </Grid>
              <Grid item>
                <StatCard 
                  icon={<StarIcon />}
                  title="Rating"
                  value={stats.rating}
                  change="Excellent feedback"
                  color="#ffa502"
                />
              </Grid>
              <Grid item>
                <StatCard 
                  icon={<AccessTimeIcon />}
                  title="Response Rate"
                  value={`${stats.responseRate}%`}
                  change="Very responsive"
                  color="#10b981"
                />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Paper>

      {/* Navigation */}
      <Paper className="navigation-modern" elevation={0}>
        <Box className="nav-container">
          {[
            {
              id: 'overview',
              label: 'Overview',
              icon: <DashboardIcon />
            },
            {
              id: 'requests',
              label: 'Requests',
              icon: <PersonAddIcon />,
              badge: mentorRequests.length
            },
            {
              id: 'sessions',
              label: 'Sessions',
              icon: <ScheduleIcon />
            },
            {
              id: 'history',
              label: 'History',
              icon: <HistoryIcon />
            }
          ].map((tab) => (
            <Button
              key={tab.id}
              className={`nav-tab-modern ${activeTab === tab.id ? 'active' : ''}`}
              startIcon={tab.icon}
              onClick={() => setActiveTab(tab.id)}
              sx={{ position: 'relative' }}
            >
              {tab.label}
              {tab.badge > 0 && (
                <Chip 
                  label={tab.badge} 
                  size="small" 
                  className="nav-badge"
                />
              )}
            </Button>
          ))}
        </Box>
      </Paper>

      {/* Content */}
      <Box className="content-modern">
        {activeTab === 'overview' && (
          <Fade in={activeTab === 'overview'}>
            <Box>
              <Grid container spacing={3} mb={4}>
                <Grid item xs={12} md={3}>
                  <StatCard 
                    icon={<PersonAddIcon />}
                    title="Pending Requests"
                    value={stats.pendingRequests}
                    change="+2 from yesterday"
                    color="#ff4757"
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <StatCard 
                    icon={<ScheduleIcon />}
                    title="This Week's Sessions"
                    value={stats.weekSessions}
                    change="+4 from last week"
                    color="#96BEC5"
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <StatCard 
                    icon={<StarIcon />}
                    title="Average Rating"
                    value={stats.rating}
                    change="Same as last month"
                    color="#ffa502"
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <StatCard 
                    icon={<AccessTimeIcon />}
                    title="Response Time"
                    value={`${stats.responseTime}h`}
                    change="-0.5h faster"
                    color="#10b981"
                  />
                </Grid>
              </Grid>

              {/* Mentor Functions *}
              <Card className="activity-card-modern" sx={{ mb: 4 }}>
                <CardContent>
                  <Typography variant="h5" className="section-title" gutterBottom>
                    Mentor Functions
                  </Typography>
                  <Grid container spacing={2}>
                    {[
                      {
                        icon: <PersonAddIcon />,
                        title: "Register as Mentor",
                        desc: "Complete profile and get verified"
                      },
                      {
                        icon: <ScheduleIcon />,
                        title: "Schedule Sessions",
                        desc: "Set up mentoring sessions"
                      },
                      {
                        icon: <VideoCallIcon />,
                        title: "Conduct Sessions",
                        desc: "Lead effective mentoring sessions"
                      },
                      {
                        icon: <AssessmentIcon />,
                        title: "Session Logs",
                        desc: "Track and document sessions"
                      },
                      {
                        icon: <HistoryIcon />,
                        title: "View History",
                        desc: "Access candidate history"
                      },
                      {
                        icon: <PsychologyIcon />,
                        title: "Get Recommendations",
                        desc: "AI-powered suggestions"
                      },
                      {
                        icon: <StarIcon />,
                        title: "View Score",
                        desc: "Track performance ratings"
                      },
                      {
                        icon: <SchoolIcon />,
                        title: "Mentor Resources",
                        desc: "Access training materials"
                      }
                    ].map((func, index) => (
                      <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card className="function-card-modern">
                          <CardContent sx={{ textAlign: 'center', p: 2 }}>
                            <Box className="function-icon" sx={{ mb: 2 }}>
                              {func.icon}
                            </Box>
                            <Typography variant="h6" className="function-title" sx={{ mb: 1 }}>
                              {func.title}
                            </Typography>
                            <Typography variant="body2" className="function-desc">
                              {func.desc}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="activity-card-modern">
                <CardContent>
                  <Typography variant="h5" className="section-title" gutterBottom>
                    Recent Activity
                  </Typography>
                  <Box className="activity-list-modern">
                    {[
                      {
                        icon: <CheckIcon className="activity-icon completed" />,
                        title: "Completed CV review session with Lisa Rodriguez",
                        time: "2 hours ago"
                      },
                      {
                        icon: <PersonAddIcon className="activity-icon new" />,
                        title: "New mentoring request from Sarah Johnson",
                        time: "4 hours ago"
                      },
                      {
                        icon: <ScheduleIcon className="activity-icon scheduled" />,
                        title: "Upcoming session with Emily Chen",
                        time: "Tomorrow at 2:00 PM"
                      }
                    ].map((activity, index) => (
                      <Slide key={index} in={!loading} direction="left" style={{ transitionDelay: `${index * 200}ms` }}>
                        <Box className="activity-item-modern">
                          {activity.icon}
                          <Box>
                            <Typography variant="body1" className="activity-title">
                              {activity.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {activity.time}
                            </Typography>
                          </Box>
                        </Box>
                      </Slide>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Fade>
        )}

        {activeTab === 'requests' && (
          <Fade in={activeTab === 'requests'}>
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" className="page-title">
                  Mentoring Requests
                </Typography>
                <Box display="flex" gap={1}>
                  {['All', 'CV Review', 'Interview Prep', 'Career Guidance'].map((filter) => (
                    <Chip 
                      key={filter}
                      label={filter}
                      variant={filter === 'All' ? 'filled' : 'outlined'}
                      className="filter-chip"
                      clickable
                    />
                  ))}
                </Box>
              </Box>

              <Box display="flex" flexDirection="column" gap={2}>
                {mentorRequests.map((request, index) => (
                  <RequestCard key={request.id} request={request} index={index} />
                ))}
              </Box>
            </Box>
          </Fade>
        )}

        {activeTab === 'sessions' && (
          <Fade in={activeTab === 'sessions'}>
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" className="page-title">
                  Active Sessions
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />}
                  className="primary-btn-modern"
                >
                  Schedule New Session
                </Button>
              </Box>

              <Grid container spacing={3}>
                {activeSessions.map((session, index) => (
                  <Grid item xs={12} md={6} key={session.id}>
                    <Zoom in={!loading} style={{ transitionDelay: `${index * 150}ms` }}>
                      <Card className="session-card-modern">
                        <CardContent>
                          <Box display="flex" alignItems="center" gap={2} mb={2}>
                            <Avatar src={session.candidateAvatar} />
                            <Box flex={1}>
                              <Typography variant="h6">{session.candidateName}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                {session.sessionType}
                              </Typography>
                            </Box>
                            <Chip 
                              label={session.status}
                              size="small"
                              className={`status-chip ${session.status}`}
                            />
                          </Box>

                          <Box mb={2}>
                            <Typography variant="caption" color="text.secondary">
                              Progress
                            </Typography>
                            <LinearProgress 
                              variant="determinate" 
                              value={session.progress} 
                              className="progress-bar"
                            />
                          </Box>

                          <Box display="flex" justifyContent="space-between" mb={2}>
                            <Typography variant="body2">📅 {session.scheduledTime}</Typography>
                            <Typography variant="body2">⏱️ {session.duration}</Typography>
                          </Box>

                          <Box display="flex" gap={1}>
                            <Button
                              variant="contained"
                              startIcon={<VideoCallIcon />}
                              size="small"
                              className="join-btn"
                            >
                              Join Call
                            </Button>
                            <Button
                              variant="outlined"
                              startIcon={<MessageIcon />}
                              size="small"
                            >
                              Message
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Zoom>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Fade>
        )}

        {activeTab === 'history' && (
          <Fade in={activeTab === 'history'}>
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" className="page-title">
                  Session History
                </Typography>
                <Box display="flex" gap={2}>
                  <TextField
                    placeholder="Search sessions..."
                    variant="outlined"
                    size="small"
                    InputProps={{
                      startAdornment: <SearchIcon color="action" />
                    }}
                    className="search-field"
                  />
                  <FormControl size="small" className="filter-select">
                    <InputLabel>Filter</InputLabel>
                    <Select value="all" label="Filter">
                      <MenuItem value="all">All Sessions</MenuItem>
                      <MenuItem value="cv">CV Review</MenuItem>
                      <MenuItem value="interview">Interview Prep</MenuItem>
                      <MenuItem value="career">Career Guidance</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              <Box display="flex" flexDirection="column" gap={2}>
                {completedSessions.map((session, index) => (
                  <Slide key={session.id} in={!loading} direction="up" style={{ transitionDelay: `${index * 100}ms` }}>
                    <Card className="history-card-modern">
                      <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                          <Box display="flex" alignItems="center" gap={2}>
                            <Avatar src={session.candidateAvatar} />
                            <Box>
                              <Typography variant="h6">{session.candidateName}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                {session.sessionType}
                              </Typography>
                            </Box>
                          </Box>
                          <Box textAlign="right">
                            <Typography variant="caption" color="text.secondary">
                              {session.completedDate}
                            </Typography>
                            <Typography variant="body2">
                              {session.duration}
                            </Typography>
                          </Box>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Box mb={2}>
                          <Rating value={session.rating} readOnly size="small" />
                          <Typography variant="body2" color="text.secondary" mt={1}>
                            "{session.feedback}"
                          </Typography>
                        </Box>

                        <Box display="flex" gap={1}>
                          <Button variant="outlined" size="small">
                            View Details
                          </Button>
                          <Button variant="outlined" size="small" startIcon={<DownloadIcon />}>
                            Download Report
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Slide>
                ))}
              </Box>
            </Box>
          </Fade>
        )}
      </Box>
    </Box>
  );
};


export default Mentor;
