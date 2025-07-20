import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  TextField,
  InputAdornment,
  IconButton,
  Fade,
  Slide,
  Zoom,
  useScrollTrigger
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowForwardIcon,
  PlayArrow as PlayArrowIcon,
  Menu as MenuIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon
} from '@mui/icons-material';
import '../styles/Home.css';
import logo from '../images/logo.png';

const Home = () => {
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const trigger = useScrollTrigger({ threshold: 100 });

  const features = [
    {
      icon: <SearchIcon />,
      title: "Smart Job Matching",
      description: "AI-powered algorithm matches candidates with perfect job opportunities based on skills and preferences.",
      background: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&w=600&h=300"
    },
    {
      icon: <PeopleIcon />,
      title: "Expert Mentorship",
      description: "Connect with industry mentors for CV reviews, interview prep, and career guidance.",
      background: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&h=300"
    },
    {
      icon: <TrendingUpIcon />,
      title: "Career Growth",
      description: "Track your progress and get personalized recommendations for skill development,career guidance.",
      background: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&h=300"
    },
    {
      icon: <BusinessIcon />,
      title: "Top Companies",
      description: "Access exclusive opportunities from leading companies across various industries.",
      background: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&h=300"
    }
  ];

  const stats = [
    { number: "50K+", label: "Opportunities Available", icon: <WorkIcon />, description: "Active job listings across industries" },
    { number: "25K+", label: "Professional Talent", icon: <PeopleIcon />, description: "Skilled candidates in our network" },
    { number: "1K+", label: "Partner Organizations", icon: <BusinessIcon />, description: "From startups to Fortune 500" },
    { number: "95%", label: "Placement Success", icon: <CheckCircleIcon />, description: "Candidates matched to ideal roles" }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Engineer at Google",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=60&h=60&fit=crop&crop=face",
      comment: "Found my dream job within 2 weeks! The mentorship program was incredibly helpful.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Product Manager at Microsoft",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face",
      comment: "The interview preparation with expert mentors boosted my confidence significantly.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "UX Designer at Adobe",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face",
      comment: "Excellent platform with personalized job recommendations that actually match my skills.",
      rating: 5
    }
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSignup = () => {
    navigate('/signup');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <Box className="home-page">
      {/* Navigation */}
      <Box className={`navbar ${trigger ? 'navbar-scrolled' : ''}`}>
        <Box className="navbar-container">
          <Box className="navbar-brand">
            <img src={logo} alt="Workify" className="nav-logo" />
            <Typography variant="h4" className="logo">
              Workify
            </Typography>
          </Box>

          <Box 
            display="flex" 
            gap={3} 
            alignItems="center" 
            sx={{ display: { xs: 'none', md: 'flex' } }}
          >
            <Button className="nav-link">Jobs</Button>
            <Button className="nav-link">Companies</Button>
            <Button className="nav-link">Mentors</Button>
            <Button className="nav-link">About</Button>
            <Button variant="outlined" className="nav-btn-outlined" onClick={handleLogin}>
              Sign In
            </Button>
            <Button variant="contained" className="nav-btn-contained" onClick={handleSignup}>
              Get Started
            </Button>
          </Box>
          <IconButton sx={{ display: { md: 'none' } }}>
            <MenuIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Hero Section */}
      <Box className="hero-section">
        <Container maxWidth="xl" className="container">
          <Grid container spacing={4} alignItems="center" minHeight="85vh">
            <Grid item xs={12} md={6}>
              <Fade in={isVisible} timeout={1000}>
                <Box sx={{ paddingLeft: { xs: 2, md: 12 } }}>
                  <Typography variant="h1" className="hero-title">
                    Find Your
                    <span className="hero-title-dream"> Dream Job</span>
                    <br />
                    With Expert Guidance
                  </Typography>
                  <Typography variant="h6" className="hero-subtitle">
                    Connect with top companies and industry mentors. Get personalized job recommendations, 
                    professional guidance, and land your perfect role faster than ever.
                  </Typography>
                  
                  {/* Search Bar */}
                  <Box className="hero-search" mt={4} mb={3}>
                    <Grid container spacing={1}>
                      <Grid item xs={12} sm={5}>
                        <TextField
                          fullWidth
                          placeholder="Job title or keywords"
                          variant="outlined"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <SearchIcon />
                              </InputAdornment>
                            ),
                          }}
                          className="search-input"
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          placeholder="Location"
                          variant="outlined"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LocationIcon />
                              </InputAdornment>
                            ),
                          }}
                          className="search-input"
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Button 
                          fullWidth 
                          variant="contained" 
                          className="search-btn"
                          size="large"
                        >
                          Search Jobs
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>

                  <Box display="flex" gap={2} flexWrap="wrap">
                    <Button 
                      variant="contained" 
                      size="large" 
                      className="cta-primary"
                      endIcon={<ArrowForwardIcon />}
                      onClick={handleSignup}
                    >
                      Start Job Search
                    </Button>
                    <Button 
                      variant="outlined" 
                      size="large" 
                      className="cta-secondary"
                      startIcon={<PlayArrowIcon />}
                    >
                      Watch Demo
                    </Button>
                  </Box>
                </Box>
              </Fade>
            </Grid>
            <Grid item xs={12} md={6}>
              <Slide in={isVisible} direction="left" timeout={1200}>
                <Box className="hero-image">
                  <img 
                    src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&h=400&fit=crop" 
                    alt="Team collaboration" 
                    style={{ width: '100%', borderRadius: '20px' }}
                  />
                </Box>
              </Slide>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box className="stats-section">
        <Container maxWidth="lg">
          {/* Stats Title */}
          <Box textAlign="center" mb={6}>
            <Typography variant="h2" className="stats-title">
              Empowering Your Career Journey
            </Typography>
            <Typography variant="h6" className="stats-subtitle">
              Join thousands of professionals who trust us with their career journey
            </Typography>
          </Box>
          
          <Box className="stats-container">
            {stats.map((stat, index) => (
              <Fade in={isVisible} timeout={800 + index * 200} key={index}>
                <Card className="stat-card" elevation={0}>
                  <CardContent className="stat-content">
                    <Box className="stat-icon">
                      {stat.icon}
                    </Box>
                    <Typography variant="h3" className="stat-number">
                      {stat.number}
                    </Typography>
                    <Typography variant="h6" className="stat-label">
                      {stat.label}
                    </Typography>
                    <Typography variant="body2" className="stat-description">
                      {stat.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Fade>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Box className="features-section">
        <Container maxWidth="xl">
          <Box textAlign="center" mb={8} sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h2" className="section-title">
              Why Choose Workify?
            </Typography>
            <Typography variant="h6" className="section-subtitle">
              Everything you need to accelerate your career journey
            </Typography>
          </Box
          >
          <Box className="features-container">
            {features.map((feature, index) => (
              <Zoom in={isVisible} timeout={600 + index * 200} key={index}>
                <Card 
                  className={`feature-card ${activeFeature === index ? 'active' : ''}`}
                  onMouseEnter={() => setActiveFeature(index)}
                >
                  <CardContent className="feature-content">
                    <Box className="feature-icon-wrapper">
                      <img 
                        src={feature.background} 
                        alt={feature.title}
                        className="feature-background"
                      />
                      <Box className="feature-icon">
                        {feature.icon}
                      </Box>
                    </Box>
                    <Typography variant="h6" className="feature-title">
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" className="feature-description">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Zoom>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box className="testimonials-section">
        <Container maxWidth="xl">
          <Box textAlign="center" mb={8} sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h2" className="section-title">
              Success Stories
            </Typography>
            <Typography variant="h6" className="section-subtitle">
              Hear from professionals who found their dream jobs
            </Typography>
          </Box>

          <Box className="testimonials-container">
            {testimonials.map((testimonial, index) => (
              <Fade in={isVisible} timeout={800 + index * 200} key={index}>
                <Card className="testimonial-card">
                  <CardContent>
                    <Box display="flex" gap={1} mb={2}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <StarIcon key={i} className="rating-star" />
                      ))}
                    </Box>
                    <Typography variant="body1" className="testimonial-text" paragraph>
                      "{testimonial.comment}"
                    </Typography>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar src={testimonial.avatar} />
                      <Box>
                        <Typography variant="subtitle2" className="testimonial-name">
                          {testimonial.name}
                        </Typography>
                        <Typography variant="caption" className="testimonial-role">
                          {testimonial.role}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Fade>
            ))}
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box className="cta-section">
        <Container maxWidth="md">
          <Box textAlign="center">
            <Typography variant="h2" className="cta-title">
              Ready to Find Your Next Opportunity?
            </Typography>
            <Typography variant="h6" className="cta-subtitle" paragraph>
              Join thousands of professionals who have accelerated their careers with Workify
            </Typography>
            <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap" mt={4}>
              <Button 
                variant="contained" 
                size="large" 
                className="cta-btn-primary"
                endIcon={<ArrowForwardIcon />}
                onClick={handleSignup}
              >
                Get Started Free
              </Button>
              <Button 
                variant="outlined" 
                size="large" 
                className="cta-btn-secondary"
              >
                Learn More
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box className="footer">
        <Container maxWidth="xl">
          <Grid container spacing={4} justifyContent="space-between" alignItems="flex-start">
            <Grid item xs={12} md={4}>
              <Box display="flex" alignItems="center" gap={1}>
                <img src={logo} alt="Workify" className="footer-logo-img" />
                <Typography variant="h5" className="footer-logo" gutterBottom>
                  Workify
                </Typography>
              </Box>
              <Typography variant="body2" className="footer-description">
                Connecting talent with opportunity through intelligent matching and expert mentorship.
              </Typography>
              
              {/* Social Media Icons */}
              <Box display="flex" gap={2} mt={3}>
                <IconButton className="social-icon" aria-label="Facebook">
                  <FacebookIcon />
                </IconButton>
                <IconButton className="social-icon" aria-label="Twitter">
                  <TwitterIcon />
                </IconButton>
                <IconButton className="social-icon" aria-label="Instagram">
                  <InstagramIcon />
                </IconButton>
              </Box>
            </Grid>
            <Grid item xs={12} md={8}>
              <Grid container spacing={4} justifyContent="flex-start">
                <Grid item xs={6} sm={3} md={3} display="flex" flexDirection="column" alignItems="center">
                  <Typography variant="h6" className="footer-heading" gutterBottom style={{ color: '#ffffff !important' }}>
                    Job Seekers
                  </Typography>
                  <Box className="footer-links">
                    <Button className="footer-link">Browse Jobs</Button>
                    <Button className="footer-link">Career Advice</Button>
                    <Button className="footer-link">Resume Builder</Button>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3} md={3} display="flex" flexDirection="column" alignItems="center">
                  <Typography variant="h6" className="footer-heading" gutterBottom style={{ color: '#ffffff !important' }}>
                    Employers
                  </Typography>
                  <Box className="footer-links">
                    <Button className="footer-link">Post Jobs</Button>
                    <Button className="footer-link">Find Talent</Button>
                    <Button className="footer-link">Pricing</Button>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3} md={3} display="flex" flexDirection="column" alignItems="center">
                  <Typography variant="h6" className="footer-heading" gutterBottom style={{ color: '#ffffff !important' }}>
                    Mentors
                  </Typography>
                  <Box className="footer-links">
                    <Button className="footer-link">Become Mentor</Button>
                    <Button className="footer-link">Mentor Guide</Button>
                    <Button className="footer-link">Success Stories</Button>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3} md={3} display="flex" flexDirection="column" alignItems="center">
                  <Typography variant="h6" className="footer-heading" gutterBottom style={{ color: '#ffffff !important' }}>
                    Company
                  </Typography>
                  <Box className="footer-links">
                    <Button className="footer-link">About Us</Button>
                    <Button className="footer-link">Contact</Button>
                    <Button className="footer-link">Privacy</Button>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Box className="footer-bottom" mt={4} pt={3}>
            <Typography variant="body2" textAlign="center">
              © 2024 Workify. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};


export default Home;
