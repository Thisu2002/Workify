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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
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
  AssessmentIcon,
  VisibilityIcon,
  CalendarIcon,
  EventIcon,
  EditIcon,
  DeleteIcon
} from '../utils/materialImports';
import '../styles/LeadPanelist.css';

const LeadPanelist = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [panelAssignments, setPanelAssignments] = useState([]);
  const [upcomingInterviews, setUpcomingInterviews] = useState([]);
  const [completedInterviews, setCompletedInterviews] = useState([]);
  const [panelMembers, setPanelMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackDialog, setFeedbackDialog] = useState(false);
  const [notificationDialog, setNotificationDialog] = useState(false);
  const [stats, setStats] = useState({
    totalPanels: 12,
    activeInterviews: 8,
    completedInterviews: 45,
    panelRating: 4.9,
    weekInterviews: 15,
    pendingFeedback: 3
  });
  const [activeSessions, setActiveSessions] = useState([]);
  const [feedbackLog, setFeedbackLog] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [availabilityData, setAvailabilityData] = useState({});

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);

    setPanelAssignments([
      {
        id: 1,
        panelName: 'Senior Frontend Developer Panel',
        position: 'Senior React Developer',
        department: 'Engineering',
        interviewDate: '2024-01-18',
        status: 'active',
        candidatesCount: 5,
        panelMembersCount: 4,
        priority: 'high'
      },
      {
        id: 2,
        panelName: 'UX Design Leadership Panel',
        position: 'Design Lead',
        department: 'Design',
        interviewDate: '2024-01-20',
        status: 'scheduled',
        candidatesCount: 3,
        panelMembersCount: 3,
        priority: 'medium'
      },
      {
        id: 3,
        panelName: 'Backend Architecture Panel',
        position: 'Solutions Architect',
        department: 'Engineering',
        interviewDate: '2024-01-22',
        status: 'pending',
        candidatesCount: 4,
        panelMembersCount: 5,
        priority: 'high'
      }
    ]);

    setUpcomingInterviews([
      {
        id: 1,
        candidateName: 'Saman Perera',
        candidateAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face',
        position: 'Senior React Developer',
        scheduledTime: '2024-01-18 10:00',
        duration: '60 min',
        panelId: 1,
        status: 'confirmed',
        interviewType: 'Technical Round',
        meetingLink: 'https://meet.google.com/abc-def-ghi'
      },
      {
        id: 2,
        candidateName: 'Sewwandi Silva',
        candidateAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=60&h=60&fit=crop&crop=face',
        position: 'Design Lead',
        scheduledTime: '2024-01-18 14:00',
        duration: '90 min',
        panelId: 2,
        status: 'pending',
        interviewType: 'Portfolio Review',
        meetingLink: 'https://meet.google.com/xyz-abc-def'
      }
    ]);

    setPanelMembers([
      {
        id: 1,
        name: 'Alice Cooper',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face',
        role: 'Technical Lead',
        department: 'Engineering',
        expertise: 'React, TypeScript',
        status: 'available'
      },
      {
        id: 2,
        name: 'Bob Wilson',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop&crop=face',
        role: 'Senior Developer',
        department: 'Engineering',
        expertise: 'Node.js, AWS',
        status: 'busy'
      }
    ]);

    setCompletedInterviews([
      {
        id: 1,
        candidateName: 'Senura Nanayakkara',
        candidateAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face',
        position: 'Frontend Developer',
        completedDate: '2024-01-15',
        duration: '75 min',
        result: 'passed',
        overallRating: 4.2,
        feedbackSubmitted: true,
        panelFeedback: 'Strong technical skills, good communication',
        interviewType: 'Technical Round',
        panelMembers: ['Alice Cooper', 'Bob Wilson'],
        finalDecision: 'Proceed to next round'
      },
      {
        id: 2,
        candidateName: 'Lakmini silva',
        candidateAvatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=60&h=60&fit=crop&crop=face',
        position: 'UX Designer',
        completedDate: '2024-01-12',
        duration: '60 min',
        result: 'pending',
        overallRating: 3.8,
        feedbackSubmitted: false,
        panelFeedback: 'Good portfolio, needs improvement in user research',
        interviewType: 'Portfolio Review',
        panelMembers: ['Carol Davis', 'Emma Wilson'],
        finalDecision: 'Awaiting feedback'
      },
      {
        id: 3,
        candidateName:  'Malith Abeyrathne',
        candidateAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face',
        position: 'Full Stack Developer',
        completedDate: '2024-01-10',
        duration: '90 min',
        result: 'passed',
        overallRating: 4.7,
        feedbackSubmitted: true,
        panelFeedback: 'Excellent problem-solving skills and system design knowledge',
        interviewType: 'System Design',
        panelMembers: ['David Chen', 'Sarah Kim'],
        finalDecision: 'Strong hire recommendation'
      },
      {
        id: 4,
        candidateName: 'Auththara Ekanayake',
        candidateAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=60&h=60&fit=crop&crop=face',
        position: 'Product Manager',
        completedDate: '2024-01-08',
        duration: '120 min',
        result: 'rejected',
        overallRating: 2.8,
        feedbackSubmitted: true,
        panelFeedback: 'Lacks strategic thinking, insufficient product experience',
        interviewType: 'Case Study',
        panelMembers: ['Mark Johnson', 'Rachel Green'],
        finalDecision: 'Not a fit for current role'
      }
    ]);

    // Add active interview sessions data
    setActiveSessions([
      {
        id: 1,
        candidateName: 'Prasanna Perera',
        candidateAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop&crop=face',
        position: 'Senior React Developer',
        status: 'live',
        startTime: '2024-01-18 10:00',
        duration: '60 min',
        progress: 45,
        interviewType: 'Technical Round',
        panelMembers: ['Alice Cooper', 'Bob Wilson'],
        currentPhase: 'Coding Challenge',
        meetingLink: 'https://meet.google.com/live-abc-123'
      },
      {
        id: 2,
        candidateName: 'Lakmi Fernando',
        candidateAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face',
        position: 'UX Designer',
        status: 'starting-soon',
        startTime: '2024-01-18 14:30',
        duration: '75 min',
        progress: 0,
        interviewType: 'Design Challenge',
        panelMembers: ['Carol Davis', 'Emma Wilson'],
        currentPhase: 'Waiting for candidate',
        meetingLink: 'https://meet.google.com/live-def-456'
      },
      {
        id: 3,
        candidateName: 'Janith Jayasinghe',
        candidateAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face',
        position: 'Backend Engineer',
        status: 'break',
        startTime: '2024-01-18 11:00',
        duration: '90 min',
        progress: 60,
        interviewType: 'System Design',
        panelMembers: ['David Chen', 'Mark Rodriguez'],
        currentPhase: '15-min break',
        meetingLink: 'https://meet.google.com/live-ghi-789'
      }
    ]);

    // Add feedback log data
    setFeedbackLog([
      {
        id: 1,
        candidateName: 'Jeewantha Perera',
        candidateAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face',
        position: 'Frontend Developer',
        interviewDate: '2024-01-15',
        panelMember: 'Alice Cooper',
        technicalRating: 4.5,
        communicationRating: 4.0,
        overallRating: 4.2,
        recommendation: 'hire',
        strengths: ['React expertise', 'Problem-solving', 'Clean code'],
        weaknesses: ['Could improve TypeScript knowledge'],
        detailedFeedback: 'Candidate demonstrated strong frontend skills with React and JavaScript. Solved coding problems efficiently and wrote clean, readable code. Communication was clear when explaining solutions.',
        submittedAt: '2024-01-15 16:30'
      },
      {
        id: 2,
        candidateName: 'Pipuni Jayasinghe',
        candidateAvatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=60&h=60&fit=crop&crop=face',
        position: 'UX Designer',
        interviewDate: '2024-01-12',
        panelMember: 'Carol Davis',
        technicalRating: 3.5,
        communicationRating: 4.2,
        overallRating: 3.8,
        recommendation: 'next-round',
        strengths: ['Design thinking', 'User empathy', 'Portfolio quality'],
        weaknesses: ['Limited user research experience', 'Needs more prototyping skills'],
        detailedFeedback: 'Strong design sense and good understanding of user-centered design principles. Portfolio shows creativity but lacks depth in user research methodology.',
        submittedAt: '2024-01-12 17:45'
      },
      {
        id: 3,
        candidateName: 'Malith Abeyrathne',
        candidateAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face',
        position: 'Full Stack Developer',
        interviewDate: '2024-01-10',
        panelMember: 'David Chen',
        technicalRating: 4.8,
        communicationRating: 4.5,
        overallRating: 4.7,
        recommendation: 'hire',
        strengths: ['System design', 'Full-stack expertise', 'Leadership potential'],
        weaknesses: ['Minor: Could improve DevOps knowledge'],
        detailedFeedback: 'Exceptional candidate with strong technical skills across the full stack. Demonstrated excellent system design thinking and clear communication.',
        submittedAt: '2024-01-10 18:15'
      },
      {
        id: 4,
        candidateName: 'Mariya Ranasinghe',
        candidateAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=60&h=60&fit=crop&crop=face',
        position: 'Product Manager',
        interviewDate: '2024-01-08',
        panelMember: 'Mark Johnson',
        technicalRating: 2.5,
        communicationRating: 3.2,
        overallRating: 2.8,
        recommendation: 'reject',
        strengths: ['Enthusiasm', 'Basic product knowledge'],
        weaknesses: ['Lacks strategic thinking', 'Insufficient experience', 'Poor problem analysis'],
        detailedFeedback: 'Candidate shows enthusiasm but lacks the strategic thinking and experience required for the role. Struggled with case study analysis.',
        submittedAt: '2024-01-08 16:00'
      }
    ]);

    // Add availability data
    setAvailabilityData({
      '2024-01-15': { status: 'busy', reason: 'Interview scheduled' },
      '2024-01-16': { status: 'busy', reason: '3 interviews scheduled' },
      '2024-01-17': { status: 'unavailable', reason: 'Personal leave' },
      '2024-01-18': { status: 'busy', reason: '2 interviews scheduled' },
      '2024-01-19': { status: 'free', reason: 'Available for scheduling' },
      '2024-01-20': { status: 'busy', reason: 'Panel meeting' },
      '2024-01-21': { status: 'free', reason: 'Available for scheduling' },
      '2024-01-22': { status: 'busy', reason: '4 interviews scheduled' },
      '2024-01-23': { status: 'unavailable', reason: 'Training session' },
      '2024-01-24': { status: 'free', reason: 'Available for scheduling' },
      '2024-01-25': { status: 'free', reason: 'Available for scheduling' },
      '2024-01-26': { status: 'busy', reason: '2 interviews scheduled' },
      '2024-01-27': { status: 'free', reason: 'Available for scheduling' },
      '2024-01-28': { status: 'free', reason: 'Available for scheduling' },
      '2024-01-29': { status: 'unavailable', reason: 'Conference attendance' },
      '2024-01-30': { status: 'busy', reason: '3 interviews scheduled' },
      '2024-01-31': { status: 'free', reason: 'Available for scheduling' }
    });
  }, []);

  const handleScheduleSlot = () => {
    console.log('Schedule new slot');
  };

  const handleNotifyMembers = (type) => {
    setNotificationDialog(true);
  };

  const handleStartInterview = (interviewId) => {
    console.log('Start interview:', interviewId);
  };

  const handleSubmitFeedback = () => {
    setFeedbackDialog(false);
    console.log('Submit feedback');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'scheduled': return '#f59e0b';
      case 'pending': return '#ef4444';
      case 'completed': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
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

  const PanelCard = ({ panel, index }) => (
    <Slide in={!loading} direction="up" style={{ transitionDelay: `${index * 100}ms` }}>
      <Card className="panel-card-modern">
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Box>
              <Typography variant="h6" className="panel-name">
                {panel.panelName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {panel.position} • {panel.department}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                📅 {panel.interviewDate}
              </Typography>
            </Box>
            <Box display="flex" flexDirection="column" alignItems="flex-end" gap={1}>
              <Chip 
                label={panel.status}
                size="small"
                sx={{ 
                  backgroundColor: getStatusColor(panel.status),
                  color: 'white',
                  fontWeight: 'bold'
                }}
              />
              <Chip 
                label={panel.priority}
                size="small"
                sx={{ 
                  backgroundColor: getPriorityColor(panel.priority),
                  color: 'white',
                  fontWeight: 'bold'
                }}
              />
            </Box>
          </Box>

          <Box display="flex" gap={2} mb={2}>
            <Typography variant="caption">
              👥 {panel.candidatesCount} Candidates
            </Typography>
            <Typography variant="caption">
              🎯 {panel.panelMembersCount} Panel Members
            </Typography>
          </Box>

          <Box display="flex" gap={1} justifyContent="flex-end">
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleNotifyMembers('panel')}
            >
              Notify Panel
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleNotifyMembers('candidates')}
            >
              Notify Candidates
            </Button>
            <Button
              variant="contained"
              size="small"
              className="primary-btn-modern"
            >
              Manage Panel
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Slide>
  );

  const CalendarWidget = () => {
    const getDaysInMonth = (date) => {
      const year = date.getFullYear();
      const month = date.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();
      const startingDayOfWeek = firstDay.getDay();

      const days = [];
      
      // Add empty cells for days before the first day of the month
      for (let i = 0; i < startingDayOfWeek; i++) {
        days.push(null);
      }
      
      // Add days of the month
      for (let day = 1; day <= daysInMonth; day++) {
        days.push(day);
      }
      
      return days;
    };

    const formatDateKey = (day) => {
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const dayStr = String(day).padStart(2, '0');
      return `${year}-${month}-${dayStr}`;
    };

    const getStatusColor = (status) => {
      switch (status) {
        case 'free': return '#10b981';
        case 'busy': return '#f59e0b';
        case 'unavailable': return '#ef4444';
        default: return '#e5e7eb';
      }
    };

    const getStatusIcon = (status) => {
      switch (status) {
        case 'free': return <CheckIcon fontSize="small" />;
        case 'busy': return <ScheduleIcon fontSize="small" />;
        case 'unavailable': return <CloseIcon fontSize="small" />;
        default: return null;
      }
    };

    const navigateMonth = (direction) => {
      const newDate = new Date(currentDate);
      newDate.setMonth(currentDate.getMonth() + direction);
      setCurrentDate(newDate);
    };

    const days = getDaysInMonth(currentDate);
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <Card className="calendar-widget">
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" className="section-title">
              Availability Calendar
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <IconButton size="small" onClick={() => navigateMonth(-1)}>
                <TrendingUpIcon sx={{ transform: 'rotate(180deg)' }} />
              </IconButton>
              <Typography variant="subtitle1" sx={{ minWidth: 120, textAlign: 'center' }}>
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </Typography>
              <IconButton size="small" onClick={() => navigateMonth(1)}>
                <TrendingUpIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Legend */}
          <Box display="flex" gap={2} mb={2} flexWrap="wrap">
            <Box display="flex" alignItems="center" gap={1}>
              <Box 
                sx={{ 
                  width: 12, 
                  height: 12, 
                  backgroundColor: '#10b981', 
                  borderRadius: 1 
                }} 
              />
              <Typography variant="caption">Available</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Box 
                sx={{ 
                  width: 12, 
                  height: 12, 
                  backgroundColor: '#f59e0b', 
                  borderRadius: 1 
                }} 
              />
              <Typography variant="caption">Busy</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Box 
                sx={{ 
                  width: 12, 
                  height: 12, 
                  backgroundColor: '#ef4444', 
                  borderRadius: 1 
                }} 
              />
              <Typography variant="caption">Unavailable</Typography>
            </Box>
          </Box>

          {/* Calendar Grid */}
          <Box className="calendar-grid">
            {/* Day headers */}
            {dayNames.map((dayName) => (
              <Box key={dayName} className="calendar-day-header">
                <Typography variant="caption" fontWeight="600">
                  {dayName}
                </Typography>
              </Box>
            ))}
            
            {/* Calendar days */}
            {days.map((day, index) => {
              if (day === null) {
                return <Box key={index} className="calendar-empty-cell" />;
              }

              const dateKey = formatDateKey(day);
              const dayData = availabilityData[dateKey];
              const status = dayData?.status || 'free';
              const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();

              return (
                <Box 
                  key={day} 
                  className={`calendar-day ${isToday ? 'today' : ''}`}
                  sx={{
                    backgroundColor: alpha(getStatusColor(status), 0.1),
                    border: `1px solid ${alpha(getStatusColor(status), 0.3)}`,
                    '&:hover': {
                      backgroundColor: alpha(getStatusColor(status), 0.2),
                      transform: 'scale(1.05)',
                      cursor: 'pointer'
                    }
                  }}
                  title={dayData?.reason || 'Available'}
                >
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: getStatusColor(status),
                      fontWeight: isToday ? 'bold' : 'normal'
                    }}
                  >
                    {day}
                  </Typography>
                  {dayData && (
                    <Box sx={{ color: getStatusColor(status) }}>
                      {getStatusIcon(status)}
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Quick stats */}
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Box textAlign="center">
                <Typography variant="h6" sx={{ color: '#10b981' }}>
                  {Object.values(availabilityData).filter(d => d.status === 'free').length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Free Days
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box textAlign="center">
                <Typography variant="h6" sx={{ color: '#f59e0b' }}>
                  {Object.values(availabilityData).filter(d => d.status === 'busy').length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Busy Days
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box textAlign="center">
                <Typography variant="h6" sx={{ color: '#ef4444' }}>
                  {Object.values(availabilityData).filter(d => d.status === 'unavailable').length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Unavailable
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box className="panelist-dashboard-modern">
      {/* Header */}
      <Paper className="dashboard-header-modern" elevation={0}>
        <Box className="header-content-modern">
          <Box display="flex" alignItems="center" gap={3}>
            <Box position="relative">
              <Avatar 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face"
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
                Welcome back, Lead Panelist!
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                Interview Panel Lead • 5 years experience
              </Typography>
              <Box display="flex" gap={1} mt={1}>
                <Chip 
                  icon={<VerifiedIcon />} 
                  label="Lead Certified" 
                  size="small" 
                  className="verified-badge"
                />
                <Chip 
                  icon={<ExpertIcon />} 
                  label="Expert Interviewer" 
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
                  icon={<AssessmentIcon />}
                  title="Active Panels"
                  value={stats.totalPanels}
                  change="+3 this month"
                />
              </Grid>
              <Grid item>
                <StatCard 
                  icon={<StarIcon />}
                  title="Panel Rating"
                  value={stats.panelRating}
                  change="Excellent leadership"
                  color="#ffa502"
                />
              </Grid>
              <Grid item>
                <StatCard 
                  icon={<CheckIcon />}
                  title="Success Rate"
                  value="94%"
                  change="Outstanding performance"
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
              id: 'panels',
              label: 'Panel Assignments',
              icon: <PersonAddIcon />,
              badge: panelAssignments.length
            },
            {
              id: 'schedule',
              label: 'Interview Schedule',
              icon: <ScheduleIcon />
            },
            {
              id: 'interviews',
              label: 'Active Interviews',
              icon: <VideoCallIcon />
            },
            {
              id: 'feedback',
              label: 'Feedback Log',
              icon: <AssessmentIcon />
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
              {/* Stats Cards Row */}
              <Grid container spacing={4} mb={4}>
                <Grid item xs={12} md={3}>
                  <StatCard 
                    icon={<PersonAddIcon />}
                    title="Total Panels"
                    value={stats.totalPanels}
                    change="+2 from last month"
                    color="#96BEC5"
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <StatCard 
                    icon={<ScheduleIcon />}
                    title="Active Interviews"
                    value={stats.activeInterviews}
                    change="+5 this week"
                    color="#10b981"
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <StatCard 
                    icon={<CheckIcon />}
                    title="Completed"
                    value={stats.completedInterviews}
                    change="15 this month"
                    color="#0F2445"
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <StatCard 
                    icon={<MessageIcon />}
                    title="Pending Feedback"
                    value={stats.pendingFeedback}
                    change="Need attention"
                    color="#ef4444"
                  />
                </Grid>
              </Grid>

              {/* Quick Actions, Today's Interviews, and Calendar Row */}
              <Grid container spacing={3} mb={4}>
                <Grid item xs={12} md={4}>
                  <Card className="quick-actions-card">
                    <CardContent>
                      <Typography variant="h6" className="section-title" gutterBottom>
                        Quick Actions
                      </Typography>
                      <Box display="flex" flexDirection="column" gap={2}>
                        <Button
                          variant="contained"
                          startIcon={<AddIcon />}
                          className="primary-btn-modern"
                          onClick={handleScheduleSlot}
                          fullWidth
                        >
                          Schedule New Interview Slot
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<MessageIcon />}
                          onClick={() => handleNotifyMembers('all')}
                          fullWidth
                        >
                          Send Panel Notification
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<AssessmentIcon />}
                          onClick={() => setFeedbackDialog(true)}
                          fullWidth
                        >
                          Submit Panel Feedback
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card className="upcoming-interviews-card">
                    <CardContent>
                      <Typography variant="h6" className="section-title" gutterBottom>
                        Today's Interviews
                      </Typography>
                      <Box display="flex" flexDirection="column" gap={2}>
                        {upcomingInterviews.slice(0, 3).map((interview) => (
                          <Box key={interview.id} className="interview-item">
                            <Box display="flex" alignItems="center" gap={2}>
                              <Avatar src={interview.candidateAvatar} size="small" />
                              <Box flex={1}>
                                <Typography variant="body2" fontWeight="600">
                                  {interview.candidateName}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {interview.scheduledTime} • {interview.interviewType}
                                </Typography>
                              </Box>
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => handleStartInterview(interview.id)}
                              >
                                Join
                              </Button>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <CalendarWidget />
                </Grid>
              </Grid>
            </Box>
          </Fade>
        )}

        {activeTab === 'panels' && (
          <Fade in={activeTab === 'panels'}>
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" className="page-title">
                  Panel Assignments
                </Typography>
                <Box display="flex" gap={1}>
                  {['All', 'Active', 'Scheduled', 'Pending'].map((filter) => (
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
                {panelAssignments.map((panel, index) => (
                  <PanelCard key={panel.id} panel={panel} index={index} />
                ))}
              </Box>
            </Box>
          </Fade>
        )}

        {activeTab === 'schedule' && (
          <Fade in={activeTab === 'schedule'}>
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" className="page-title">
                  Interview Schedule
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />}
                  className="primary-btn-modern"
                  onClick={handleScheduleSlot}
                >
                  Schedule New Slot
                </Button>
              </Box>

              <TableContainer component={Paper} className="schedule-table">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Candidate</TableCell>
                      <TableCell>Position</TableCell>
                      <TableCell>Date & Time</TableCell>
                      <TableCell>Duration</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {upcomingInterviews.map((interview) => (
                      <TableRow key={interview.id}>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={2}>
                            <Avatar src={interview.candidateAvatar} />
                            <Typography>{interview.candidateName}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{interview.position}</TableCell>
                        <TableCell>{interview.scheduledTime}</TableCell>
                        <TableCell>{interview.duration}</TableCell>
                        <TableCell>{interview.interviewType}</TableCell>
                        <TableCell>
                          <Chip 
                            label={interview.status}
                            size="small"
                            color={interview.status === 'confirmed' ? 'success' : 'warning'}
                          />
                        </TableCell>
                        <TableCell>
                          <Box display="flex" gap={1}>
                            <IconButton 
                              size="small"
                              onClick={() => handleStartInterview(interview.id)}
                            >
                              <VideoCallIcon />
                            </IconButton>
                            <IconButton size="small">
                              <MessageIcon />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Fade>
        )}

        {activeTab === 'interviews' && (
          <Fade in={activeTab === 'interviews'}>
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" className="page-title">
                  Active Interviews
                </Typography>
                <Box display="flex" gap={1}>
                  {['All', 'Live', 'Starting Soon', 'On Break'].map((filter) => (
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

              <Grid container spacing={3}>
                {activeSessions.map((session, index) => (
                  <Grid item xs={12} md={6} lg={4} key={session.id}>
                    <Zoom in={!loading} style={{ transitionDelay: `${index * 150}ms` }}>
                      <Card className="session-card-modern">
                        <CardContent>
                          <Box display="flex" alignItems="center" gap={2} mb={2}>
                            <Avatar src={session.candidateAvatar} />
                            <Box flex={1}>
                              <Typography variant="h6">{session.candidateName}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                {session.position}
                              </Typography>
                            </Box>
                            <Chip 
                              label={session.status}
                              size="small"
                              sx={{
                                backgroundColor: 
                                  session.status === 'live' ? '#10b981' :
                                  session.status === 'starting-soon' ? '#f59e0b' :
                                  session.status === 'break' ? '#6b7280' : '#ef4444',
                                color: 'white',
                                fontWeight: 'bold'
                              }}
                            />
                          </Box>

                          <Box mb={2}>
                            <Typography variant="caption" color="text.secondary">
                              Progress - {session.currentPhase}
                            </Typography>
                            <LinearProgress 
                              variant="determinate" 
                              value={session.progress} 
                              className="progress-bar"
                              sx={{ mt: 1 }}
                            />
                            <Typography variant="caption" color="text.secondary">
                              {session.progress}% complete
                            </Typography>
                          </Box>

                          <Box mb={2}>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              📅 {session.startTime} • ⏱️ {session.duration}
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              🎯 {session.interviewType}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Panel: {session.panelMembers.join(', ')}
                            </Typography>
                          </Box>

                          <Box display="flex" gap={1}>
                            <Button
                              variant="contained"
                              startIcon={<VideoCallIcon />}
                              size="small"
                              className="join-btn"
                              onClick={() => window.open(session.meetingLink, '_blank')}
                              fullWidth
                            >
                              {session.status === 'live' ? 'Join Live' : 'Join Session'}
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

        {activeTab === 'feedback' && (
          <Fade in={activeTab === 'feedback'}>
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" className="page-title">
                  Panel Feedback Log
                </Typography>
                <Box display="flex" gap={2}>
                  <TextField
                    placeholder="Search feedback..."
                    variant="outlined"
                    size="small"
                    InputProps={{
                      startAdornment: <SearchIcon color="action" />
                    }}
                    className="search-field"
                  />
                  <FormControl size="small" className="filter-select">
                    <InputLabel>Filter by Rating</InputLabel>
                    <Select value="" label="Filter by Rating">
                      <MenuItem value="">All Ratings</MenuItem>
                      <MenuItem value="5">5 Stars</MenuItem>
                      <MenuItem value="4">4+ Stars</MenuItem>
                      <MenuItem value="3">3+ Stars</MenuItem>
                      <MenuItem value="2">Below 3 Stars</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              <Box display="flex" flexDirection="column" gap={2}>
                {feedbackLog.map((feedback, index) => (
                  <Slide key={feedback.id} in={!loading} direction="up" style={{ transitionDelay: `${index * 100}ms` }}>
                    <Card className="feedback-card-modern">
                      <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
                          <Box display="flex" alignItems="center" gap={2}>
                            <Avatar src={feedback.candidateAvatar} sx={{ width: 56, height: 56 }} />
                            <Box>
                              <Typography variant="h6" className="candidate-name">
                                {feedback.candidateName}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {feedback.position} • {feedback.interviewDate}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Feedback by: {feedback.panelMember}
                              </Typography>
                            </Box>
                          </Box>
                          <Box display="flex" flexDirection="column" alignItems="flex-end" gap={1}>
                            <Chip 
                              label={feedback.recommendation}
                              size="small"
                              sx={{ 
                                backgroundColor: 
                                  feedback.recommendation === 'hire' ? '#10b981' :
                                  feedback.recommendation === 'next-round' ? '#f59e0b' : '#ef4444',
                                color: 'white',
                                fontWeight: 'bold'
                              }}
                            />
                            <Typography variant="caption" color="text.secondary">
                              Submitted: {feedback.submittedAt}
                            </Typography>
                          </Box>
                        </Box>

                        <Grid container spacing={3} mb={3}>
                          <Grid item xs={12} sm={4}>
                            <Box textAlign="center">
                              <Typography variant="caption" color="text.secondary">
                                Technical Skills
                              </Typography>
                              <Rating value={feedback.technicalRating} readOnly size="small" />
                              <Typography variant="h6" color="primary">
                                {feedback.technicalRating}/5
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Box textAlign="center">
                              <Typography variant="caption" color="text.secondary">
                                Communication
                              </Typography>
                              <Rating value={feedback.communicationRating} readOnly size="small" />
                              <Typography variant="h6" color="primary">
                                {feedback.communicationRating}/5
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Box textAlign="center">
                              <Typography variant="caption" color="text.secondary">
                                Overall Rating
                              </Typography>
                              <Rating value={feedback.overallRating} readOnly size="small" />
                              <Typography variant="h6" color="primary">
                                {feedback.overallRating}/5
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>

                        <Box mb={3}>
                          <Typography variant="subtitle2" gutterBottom>
                            Strengths:
                          </Typography>
                          <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                            {feedback.strengths.map((strength, idx) => (
                              <Chip 
                                key={idx} 
                                label={strength} 
                                size="small" 
                                sx={{ 
                                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                  color: '#047857'
                                }}
                              />
                            ))}
                          </Box>
                          
                          <Typography variant="subtitle2" gutterBottom>
                            Areas for Improvement:
                          </Typography>
                          <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                            {feedback.weaknesses.map((weakness, idx) => (
                              <Chip 
                                key={idx} 
                                label={weakness} 
                                size="small" 
                                sx={{ 
                                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                  color: '#dc2626'
                                }}
                              />
                            ))}
                          </Box>
                        </Box>

                        <Typography variant="body2" className="feedback-text" paragraph>
                          <strong>Detailed Feedback:</strong> {feedback.detailedFeedback}
                        </Typography>

                        <Box display="flex" gap={1} justifyContent="flex-end">
                          <Button variant="outlined" size="small">
                            View Full Report
                          </Button>
                          <Button variant="outlined" size="small" startIcon={<DownloadIcon />}>
                            Export PDF
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

        {activeTab === 'history' && (
          <Fade in={activeTab === 'history'}>
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" className="page-title">
                  Interview History
                </Typography>
                <Box display="flex" gap={2}>
                  <TextField
                    placeholder="Search history..."
                    variant="outlined"
                    size="small"
                    InputProps={{
                      startAdornment: <SearchIcon color="action" />
                    }}
                    className="search-field"
                  />
                  <FormControl size="small" className="filter-select">
                    <InputLabel>Filter by Result</InputLabel>
                    <Select value="" label="Filter by Result">
                      <MenuItem value="">All Results</MenuItem>
                      <MenuItem value="passed">Passed</MenuItem>
                      <MenuItem value="rejected">Rejected</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              <TableContainer component={Paper} className="history-table">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Candidate</TableCell>
                      <TableCell>Position</TableCell>
                      <TableCell>Interview Type</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Duration</TableCell>
                      <TableCell>Panel Members</TableCell>
                      <TableCell>Rating</TableCell>
                      <TableCell>Result</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {completedInterviews.map((interview) => (
                      <TableRow key={interview.id}>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={2}>
                            <Avatar src={interview.candidateAvatar} />
                            <Typography>{interview.candidateName}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{interview.position}</TableCell>
                        <TableCell>{interview.interviewType}</TableCell>
                        <TableCell>{interview.completedDate}</TableCell>
                        <TableCell>{interview.duration}</TableCell>
                        <TableCell>
                          <Typography variant="caption">
                            {interview.panelMembers.join(', ')}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Rating value={interview.overallRating} readOnly size="small" />
                            <Typography variant="caption">
                              ({interview.overallRating})
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={interview.result}
                            size="small"
                            sx={{
                              backgroundColor: 
                                interview.result === 'passed' ? '#10b981' :
                                interview.result === 'rejected' ? '#ef4444' : '#f59e0b',
                              color: 'white',
                              fontWeight: 'bold'
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box display="flex" gap={1}>
                            <IconButton size="small" title="View Details">
                              <VisibilityIcon />
                            </IconButton>
                            <IconButton size="small" title="Download Report">
                              <DownloadIcon />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Fade>
        )}
      </Box>

      {/* Feedback Dialog */}
      <Dialog open={feedbackDialog} onClose={() => setFeedbackDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Submit Panel Feedback</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={3} pt={2}>
            <TextField
              label="Candidate Name"
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Interview Rating"
              type="number"
              inputProps={{ min: 1, max: 5 }}
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Feedback Comments"
              multiline
              rows={4}
              fullWidth
              variant="outlined"
            />
            <FormControl fullWidth>
              <InputLabel>Recommendation</InputLabel>
              <Select label="Recommendation">
                <MenuItem value="hire">Hire</MenuItem>
                <MenuItem value="reject">Reject</MenuItem>
                <MenuItem value="next-round">Next Round</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFeedbackDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmitFeedback}>
            Submit Feedback
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Dialog */}
      <Dialog open={notificationDialog} onClose={() => setNotificationDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Send Notification</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={3} pt={2}>
            <TextField
              label="Subject"
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Message"
              multiline
              rows={4}
              fullWidth
              variant="outlined"
            />
            <FormControl fullWidth>
              <InputLabel>Recipients</InputLabel>
              <Select label="Recipients">
                <MenuItem value="panel">Panel Members</MenuItem>
                <MenuItem value="candidates">Candidates</MenuItem>
                <MenuItem value="all">All</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNotificationDialog(false)}>Cancel</Button>
          <Button variant="contained">
            Send Notification
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LeadPanelist;

