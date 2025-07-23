import React, { useState, useEffect, useRef } from 'react';
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
  const jobPostsRef = useRef(null);
  const companiesRef = useRef(null); // Add ref for companies section
  const mentorRef = useRef(null); // Add ref for mentor section
  const featuresRef = useRef(null); // Add ref for features section

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

  // Sample job vacancies
  const jobVacancies = [
    {
      title: "Frontend Developer",
      company: "Google",
      location: "San Francisco, CA",
      description: "React/JS developer for SaaS platform. 2+ years experience.",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg"
    },
    {
      title: "UI/UX Designer",
      company: "Apple",
      location: "Remote",
      description: "Design user interfaces for mobile/web apps. Figma/Sketch.",
      // Use Apple logo (PNG, works well in Avatar)
      logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
    },
    {
      title: "Backend Engineer",
      company: "Microsoft",
      location: "New York, NY",
      description: "Node.js/Express developer for cloud APIs. 3+ years experience.",
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
    },
    {
      title: "Product Manager",
      company: "Amazon",
      location: "Austin, TX",
      description: "Lead product teams, define roadmap, agile experience required.",
      logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
    },
  ];

  // Sample companies data
  const companies = [
    {
      name: "Google",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
      industry: "Technology",
      description: "Innovating the future with AI, cloud, and search.",
      featured: true,
      website: "https://careers.google.com/",
      jobs: 120
    },
    {
      name: "Apple",
      logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
      industry: "Consumer Electronics",
      description: "Designing world-class devices and experiences.",
      featured: false,
      website: "https://jobs.apple.com/",
      jobs: 80
    },
    {
      name: "Microsoft",
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
      industry: "Software & Cloud",
      description: "Empowering every person and organization on the planet.",
      featured: false, // remove featured
      website: "https://careers.microsoft.com/",
      jobs: 100
    },
    {
      name: "Amazon",
      logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
      industry: "E-commerce & Cloud",
      description: "Delivering everything, everywhere, with innovation.",
      featured: true, // add featured label to Amazon
      website: "https://www.amazon.jobs/",
      jobs: 95
    },
    {
      name: "Meta",
      logo: "https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png",
      industry: "Social Media & VR",
      description: "Building the future of social connection.",
      featured: false, // remove featured label from Meta
      website: "https://www.metacareers.com/",
      jobs: 70
    },
    {
      name: "Tesla",
      logo: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png",
      industry: "Automotive & Energy",
      description: "Accelerating the world's transition to sustainable energy.",
      featured: false,
      website: "https://www.tesla.com/careers",
      jobs: 60
    },
    {
      name: "Netflix",
      logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
      industry: "Entertainment",
      description: "Streaming the best stories worldwide.",
      featured: false,
      website: "https://jobs.netflix.com/",
      jobs: 40
    },
    {
      name: "IBM",
      logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg",
      industry: "IT & Consulting",
      description: "Solving complex problems with technology.",
      featured: false,
      website: "https://www.ibm.com/employment/",
      jobs: 50
    },
    {
      name: "Oracle",
      logo: "https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg",
      industry: "Database & Cloud",
      description: "Integrated cloud applications and platform services.",
      featured: true, // add featured
      website: "https://www.oracle.com/corporate/careers/",
      jobs: 45
    },
    {
      name: "Spotify",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg",
      industry: "Music Streaming",
      description: "Listening is everything.",
      featured: false,
      website: "https://www.spotifyjobs.com/",
      jobs: 30
    },
    {
      name: "PayPal",
      logo: "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg",
      industry: "Fintech & Payments",
      description: "Making payments simple and secure.",
      featured: false,
      website: "https://www.paypal.com/jobs",
      jobs: 28
    },
    {
      name: "LinkedIn",
      logo: "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png",
      industry: "Professional Networking",
      description: "Connect the world’s professionals.",
      featured: false,
      website: "https://careers.linkedin.com/",
      jobs: 35
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
            <Button className="nav-link" onClick={() => jobPostsRef.current?.scrollIntoView({ behavior: 'smooth' })}>
              Jobs
            </Button>
            <Button className="nav-link" onClick={() => companiesRef.current?.scrollIntoView({ behavior: 'smooth' })}>
              Companies
            </Button>
            <Button className="nav-link" onClick={() => mentorRef.current?.scrollIntoView({ behavior: 'smooth' })}>Mentors</Button>
            <Button className="nav-link" onClick={() => featuresRef.current?.scrollIntoView({ behavior: 'smooth' })}>About</Button>
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

      {/* Job Posts Section */}
      <Box ref={jobPostsRef} className="job-posts-section" sx={{ py: 8, background: "#f8fafc" }}>
        <Container maxWidth="xl">

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', justifyContent: 'center', minHeight: '520px', gap: { xs: 6, md: 0 } }}>
            {/* Left: Kanban Board */}
            <Box sx={{ flex: 1.2, display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
              <Box sx={{ display: 'flex', gap: 3, background: 'transparent', p: 2 }}>
                {/* Kanban Columns */}
                {[
                  {
                    title: 'Applied',
                    cards: [
                      { name: 'Ronald Richards', role: 'Mobile Developer', company: '@Hello Ince', percent: 80, color: '#22c55e', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
                      { name: 'Kathryn Murphy', role: 'Product Designer', company: '@Shop Fun', percent: 50, color: '#fbbf24', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
                      { name: 'Ralph Edwards', role: 'Graphic Designer', company: '@Job Match', percent: 40, color: '#f87171', avatar: 'https://randomuser.me/api/portraits/men/45.jpg' },
                      { name: 'Esther Howard', role: 'IT Support', company: '@MagicPayment', percent: 90, color: '#22c55e', avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
                    ]
                  },
                  {
                    title: 'Shortlisted',
                    cards: [
                      { name: 'Marvin McKinney', role: 'UX/UI Designer', company: '@Zipper', percent: 80, color: '#22c55e', avatar: 'https://randomuser.me/api/portraits/men/36.jpg' },
                      { name: 'Dianne Russell', role: 'Network engineer', company: '@Manbun', percent: 70, color: '#fbbf24', avatar: 'https://randomuser.me/api/portraits/women/65.jpg' },
                      { name: 'Courtney Henry', role: 'Computer programmer', company: '@Mango', percent: 100, color: '#22c55e', avatar: 'https://randomuser.me/api/portraits/women/43.jpg' },
                      { name: 'Jacob Jones', role: 'Java Developer', company: '', percent: null, color: '', avatar: 'https://randomuser.me/api/portraits/men/41.jpg' },
                    ]
                  },
                  {
                    title: 'Phone Screening',
                    cards: [
                      { name: 'Guy Hawkins', role: 'Support specialist', company: '@Microsite', percent: 100, color: '#22c55e', avatar: 'https://randomuser.me/api/portraits/men/38.jpg' },
                      { name: 'Bessie Cooper', role: 'QA tester', company: '@Astra', percent: 90, color: '#22c55e', avatar: 'https://randomuser.me/api/portraits/women/50.jpg' },
                      { name: 'Jane Cooper', role: 'Graphic Designer', company: '@DrKong', percent: 93, color: '#22c55e', avatar: 'https://randomuser.me/api/portraits/women/52.jpg' },
                      { name: 'Jenny Wilson', role: 'Computer programmer', company: '@Mango', percent: 89, color: '#22c55e', avatar: 'https://randomuser.me/api/portraits/women/54.jpg' },
                      { name: 'Eleanor Pena', role: 'Graphic Designer', company: '@Mango', percent: 89, color: '#22c55e', avatar: 'https://randomuser.me/api/portraits/women/55.jpg' },
                    ]
                  }
                ].map((col, colIdx) => (
                  <Box key={col.title} sx={{ background: '#fff', borderRadius: 2, boxShadow: '0 2px 12px rgba(15,36,69,0.06)', minWidth: 170, maxWidth: 190, p: 1.2, display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                    <Typography fontWeight={700} color="#0F2445" sx={{ mb: 0.5, fontSize: '1rem', borderBottom: '2px solid #e2e8f0', pb: 0.5 }}>{col.title}</Typography>
                    {col.cards.map((card, idx) => (
                      <Box key={card.name} sx={{ display: 'flex', alignItems: 'center', gap: 1, background: '#f8fafc', borderRadius: 1.5, p: 0.7, boxShadow: '0 1px 2px rgba(59,130,246,0.04)' }}>
                        <Avatar src={card.avatar} alt={card.name} sx={{ width: 28, height: 28 }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography fontWeight={600} fontSize="0.95rem" color="#0F2445" sx={{ lineHeight: 1.1 }}>{card.name}</Typography>
                          <Typography fontSize="0.82rem" color="#64748b" sx={{ lineHeight: 1 }}>{card.role}</Typography>
                          <Typography fontSize="0.75rem" color="#94a3b8" sx={{ lineHeight: 1 }}>{card.company}</Typography>
                        </Box>
                        {card.percent && (
                          <Box sx={{ minWidth: 28, textAlign: 'center' }}>
                            <Box sx={{ fontWeight: 700, fontSize: '0.85rem', color: card.color }}>{card.percent}%</Box>
                          </Box>
                        )}
                      </Box>
                    ))}
                  </Box>
                ))}
              </Box>
            </Box>
            {/* Right: Headline, Description, Features, CTA */}
            <Box sx={{ flex: 1, pl: { md: 8, xs: 0 }, pr: { md: 2, xs: 0 }, display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' }, justifyContent: 'center' }}>
              <Typography variant="h2" fontWeight={800} color="#0F2445" sx={{ fontSize: { xs: '2rem', md: '2.8rem' }, mb: 2, textAlign: { xs: 'center', md: 'left' } }}>
                Thousands of Jobs from Top Employers
              </Typography>
              <Typography color="#475569" fontSize="1.18rem" sx={{ mb: 3, textAlign: { xs: 'center', md: 'left' } }}>
                Access fresh and relevant job opportunities from trusted companies worldwide. Our platform is designed to help you find the right job, faster and easier.
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box display="flex" alignItems="flex-start" gap={1}>
                  <CheckCircleIcon sx={{ color: '#22c55e', mt: '2px' }} />
                  <Box>
                    <Typography fontWeight={700} color="#0F2445" component="span">Smart Job Filters:</Typography>{' '}
                    <Typography color="#475569" component="span">Easily filter jobs by location, company, industry, and experience level to find your perfect match.</Typography>
                  </Box>
                </Box>
                <Box display="flex" alignItems="flex-start" gap={1}>
                  <CheckCircleIcon sx={{ color: '#22c55e', mt: '2px' }} />
                  <Box>
                    <Typography fontWeight={700} color="#0F2445" component="span">Real-Time Listings:</Typography>{' '}
                    <Typography color="#475569" component="span">Stay updated with the latest openings—new jobs added daily from verified employers.</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Companies List Section */}
      <Box ref={companiesRef} className="companies-section" sx={{ py: 8, background: "#eef2f7" }}>
        <Container maxWidth="xl">
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '500px',
              width: '100%',
              gap: { xs: 6, md: 0 }
            }}
          >
            {/* Left: Headline & Description */}
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: { xs: 'center', md: 'flex-start' },
                pr: { md: 6 },
                mb: { xs: 6, md: 0 },
                pl: { md: 8, xs: 2 }
              }}
            >
              <Typography variant="h2" className="section-title" textAlign={{ xs: 'center', md: 'left' }}>
                Trusted by 1,000+ Top Companies
              </Typography>
              <Typography variant="h6" className="section-subtitle" textAlign={{ xs: 'center', md: 'left' }} mt={2} mb={3}>
                Join a growing network of leading local and global employers.<br />
                Our platform features job listings from 1,000+ verified companies, including industry giants, innovative startups, and trusted local businesses. From tech to hospitality, connect with reputable employers actively hiring across all major sectors.
              </Typography>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <CheckCircleIcon sx={{ color: '#22c55e' }} />
                <Typography fontWeight={700} color="#0F2445" component="span">Verified Employers:</Typography>
                <Typography color="#475569" component="span">Work with companies known for strong employer branding and high employee satisfaction.</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <CheckCircleIcon sx={{ color: '#22c55e' }} />
                <Typography fontWeight={700} color="#0F2445" component="span">Diverse Industries:</Typography>
                <Typography color="#475569" component="span">Find opportunities across IT, healthcare, finance, retail, logistics, and more—all in one place.</Typography>
              </Box>
              <Button variant="text" sx={{ mt: 4, fontWeight: 700, fontSize: '1.2rem' }} endIcon={<ArrowForwardIcon />}>
                Try it For Free
              </Button>
            </Box>
            {/* Right: Radial Logos */}
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%'
              }}
            >
              <Box className="companies-radial-wrapper" sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box className="companies-radial">
                  {/* Central logo */}
                  <Box className="companies-radial-center">
                    <Box className="companies-radial-center-logo">M</Box>
                  </Box>
                  {/* Radial company logos */}
                  {companies.slice(0, 12).map((company, idx) => (
                    <Box
                      key={company.name}
                      className={`companies-radial-logo companies-radial-logo-${idx}`}
                      title={company.name}
                    >
                      <Avatar
                        src={company.logo}
                        alt={company.name + ' logo'}
                        sx={{ width: 56, height: 56, bgcolor: '#fff', boxShadow: '0 2px 8px rgba(59,130,246,0.10)', border: '2px solid #e2e8f0', objectFit: 'contain' }}
                        imgProps={{ style: { objectFit: 'contain', background: '#fff' } }}
                      />
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Mentor Section */}
      <Box ref={mentorRef} className="mentor-section">
        <Container maxWidth="xl">
          <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} alignItems="center" justifyContent="center" gap={6}>
            {/* Mentor Card */}
            <Card sx={{ borderRadius: 4, boxShadow: 3, p: 3, maxWidth: 350, minWidth: 280, mx: { xs: 'auto', md: 0 }, position: 'relative', flex: '0 0 340px' }}>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Avatar src="https://randomuser.me/api/portraits/men/32.jpg" alt="Manson Ng" sx={{ width: 56, height: 56 }} />
                <Box>
                  <Typography variant="h6" fontWeight={700} color="#0F2445">Manson Ng</Typography>
                  <Typography variant="body2" color="#64748b">Principal Software Engi...</Typography>
                </Box>
              </Box>
              <Box mb={2}>
                <Button fullWidth variant="outlined" sx={{ justifyContent: 'space-between', borderRadius: 2, mb: 1, fontWeight: 700, color: '#0F2445', borderColor: '#e2e8f0' }}>
                  Mentorship
                  <span style={{ color: '#22c55e', fontWeight: 700, marginLeft: 8 }}>LKR 340<span style={{ fontWeight: 400, color: '#64748b', fontSize: '0.95em' }}>/month</span></span>
                </Button>
                <Button fullWidth variant="outlined" sx={{ justifyContent: 'space-between', borderRadius: 2, mb: 1, fontWeight: 700, color: '#0F2445', borderColor: '#e2e8f0' }}>
                  Intro Session
                  <span style={{ color: '#3b82f6', fontWeight: 700, marginLeft: 8 }}>LKR 49<span style={{ fontWeight: 400, color: '#64748b', fontSize: '0.95em' }}>/session</span></span>
                </Button>
                <Button fullWidth variant="outlined" sx={{ justifyContent: 'space-between', borderRadius: 2, mb: 1, fontWeight: 700, color: '#0F2445', borderColor: '#e2e8f0' }}>
                  CV Review
                  <span style={{ color: '#3b82f6', fontWeight: 700, marginLeft: 8 }}>LKR 59<span style={{ fontWeight: 400, color: '#64748b', fontSize: '0.95em' }}>/review</span></span>
                </Button>
                <Button fullWidth variant="outlined" sx={{ justifyContent: 'space-between', borderRadius: 2, fontWeight: 700, color: '#0F2445', borderColor: '#e2e8f0' }}>
                  Expert Session
                  <span style={{ color: '#3b82f6', fontWeight: 700, marginLeft: 8 }}>LKR 99<span style={{ fontWeight: 400, color: '#64748b', fontSize: '0.95em' }}>/session</span></span>
                </Button>
              </Box>
            </Card>
            {/* Mentor Info & CTA */}
            <Box flex={1} pl={{ md: 6 }}>
              <Typography variant="h2" fontWeight={800} color="#0F2445" sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, mb: 2 }}>
                At your fingertips: a dedicated <br /> Interview mentor
              </Typography>
              <Typography color="#475569" fontSize="1.18rem" sx={{ mb: 3 }}>
                Want to start a new dream career? Successfully build your startup? Itching to learn high-demand skills? Work smart with an online mentor by your side to offer expert advice and guidance to match your zeal. Become unstoppable using Workify.
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={4} mb={3}>
                <Box minWidth={220}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}><CheckCircleIcon sx={{ color: '#22c55e' }} /> Thousands of mentors available</Box>
                  <Box display="flex" alignItems="center" gap={1} mb={1}><CheckCircleIcon sx={{ color: '#22c55e' }} /> Free trial</Box>
                  <Box display="flex" alignItems="center" gap={1}><CheckCircleIcon sx={{ color: '#22c55e' }} /> 1-on-1 calls</Box>
                </Box>
                <Box minWidth={220}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}><CheckCircleIcon sx={{ color: '#22c55e' }} /> Flexible program structures</Box>
                  <Box display="flex" alignItems="center" gap={1} mb={1}><CheckCircleIcon sx={{ color: '#22c55e' }} /> Personal chats</Box>
                  <Box display="flex" alignItems="center" gap={1}><CheckCircleIcon sx={{ color: '#22c55e' }} /> 97% satisfaction rate</Box>
                </Box>
              </Box>
              <Button variant="text" size="large" className="mentor-cta-btn-text" endIcon={<ArrowForwardIcon />}>
                Find a Interview mentor
              </Button>
            </Box>
          </Box>
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
      <Box ref={featuresRef} className="features-section">
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
                <img
                  src={logo}
                  alt="Workify"
                  className="footer-logo-img"
                  style={{ filter: "none", height: "70px", width: "auto" }}
                />
                <Typography variant="h5" className="footer-logo" gutterBottom>
                  Workify
                </Typography>
              </Box>
              <Typography variant="body2" className="footer-description">
                Connecting talent with opportunity through intelligent matching and expert mentorship.
              </Typography>
              <Box display="flex" gap={2} mt={3}>
                <IconButton
                  className="social-icon"
                  aria-label="Facebook"
                  sx={{
                    background: "linear-gradient(135deg, #1877f2 0%, #3b5998 100%)",
                    color: "#fff",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    boxShadow: "0 2px 8px rgba(24,119,242,0.15)",
                    "&:hover": {
                      transform: "scale(1.15) rotate(-8deg)",
                      boxShadow: "0 6px 18px rgba(24,119,242,0.25)",
                      background: "linear-gradient(135deg, #3b5998 0%, #1877f2 100%)"
                    }
                  }}
                >
                  <FacebookIcon />
                </IconButton>
                <IconButton
                  className="social-icon"
                  aria-label="Twitter"
                  sx={{
                    background: "linear-gradient(135deg, #1da1f2 0%, #0f2445 100%)",
                    color: "#fff",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    boxShadow: "0 2px 8px rgba(29,161,242,0.15)",
                    "&:hover": {
                      transform: "scale(1.15) rotate(8deg)",
                      boxShadow: "0 6px 18px rgba(29,161,242,0.25)",
                      background: "linear-gradient(135deg, #0f2445 0%, #1da1f2 100%)"
                    }
                  }}
                >
                  <TwitterIcon />
                </IconButton>
                <IconButton
                  className="social-icon"
                  aria-label="Instagram"
                  sx={{
                    background: "linear-gradient(135deg, #fd1d1d 0%, #fcb045 50%, #833ab4 100%)",
                    color: "#fff",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    boxShadow: "0 2px 8px rgba(253,29,29,0.15)",
                    "&:hover": {
                      transform: "scale(1.15) rotate(-8deg)",
                      boxShadow: "0 6px 18px rgba(253,29,29,0.25)",
                      background: "linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)"
                    }
                  }}
                >
                  <InstagramIcon />
                </IconButton>
              </Box>
            </Grid>
            <Grid item xs={12} md={8}>
              <Grid container spacing={4} justifyContent="flex-start">
                <Grid item xs={6} sm={3} md={3} display="flex" flexDirection="column" alignItems="center">
                  <Typography
                    variant="h6"
                    className="footer-heading"
                    gutterBottom
                    sx={{
                      color: "#fff !important",
                      background: "linear-gradient(90deg, #4a90e2 0%, #64b5f6 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      fontWeight: 700,
                      fontSize: "1.2rem",
                      letterSpacing: "0.02em",
                      mb: "20px"
                    }}
                  >
                    Job Seekers
                  </Typography>
                  <Box className="footer-links">
                    <Button className="footer-link">Browse Jobs</Button>
                    <Button className="footer-link">Career Advice</Button>
                    <Button className="footer-link">Resume Builder</Button>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3} md={3} display="flex" flexDirection="column" alignItems="center">
                  <Typography
                    variant="h6"
                    className="footer-heading"
                    gutterBottom
                    sx={{
                      color: "#fff !important",
                      background: "linear-gradient(90deg, #4a90e2 0%, #64b5f6 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      fontWeight: 700,
                      fontSize: "1.2rem",
                      letterSpacing: "0.02em",
                      mb: "20px"
                    }}
                  >
                    Employers
                  </Typography>
                  <Box className="footer-links">
                    <Button className="footer-link">Post Jobs</Button>
                    <Button className="footer-link">Find Talent</Button>
                    <Button className="footer-link">Pricing</Button>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3} md={3} display="flex" flexDirection="column" alignItems="center">
                  <Typography
                    variant="h6"
                    className="footer-heading"
                    gutterBottom
                    sx={{
                      color: "#fff !important",
                      background: "linear-gradient(90deg, #4a90e2 0%, #64b5f6 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      fontWeight: 700,
                      fontSize: "1.2rem",
                      letterSpacing: "0.02em",
                      mb: "20px"
                    }}
                  >
                    Mentors
                  </Typography>
                  <Box className="footer-links">
                    <Button className="footer-link">Become Mentor</Button>
                    <Button className="footer-link">Mentor Guide</Button>
                    <Button className="footer-link">Success Stories</Button>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3} md={3} display="flex" flexDirection="column" alignItems="center">
                  <Typography
                    variant="h6"
                    className="footer-heading"
                    gutterBottom
                    sx={{
                      color: "#fff !important",
                      background: "linear-gradient(90deg, #4a90e2 0%, #64b5f6 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      fontWeight: 700,
                      fontSize: "1.2rem",
                      letterSpacing: "0.02em",
                      mb: "20px"
                    }}
                  >
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
