import React, { useState } from 'react';
import {
  ResponsiveContainer, LineChart, BarChart, PieChart, FunnelChart, Funnel,
  Line, Bar, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, LabelList
} from 'recharts';
import { FiFilter, FiUsers, FiBriefcase, FiDollarSign, FiBarChart2 } from 'react-icons/fi';

// Import the stylesheet
import "../../styles/Analytics.css";

const mockData = {
  recruiter: {
    engagement: [
      { name: 'Jan', 'New Sign-ups': 30, 'Active Recruiters': 120 },
      { name: 'Feb', 'New Sign-ups': 45, 'Active Recruiters': 130 },
      { name: 'Mar', 'New Sign-ups': 28, 'Active Recruiters': 145 },
      { name: 'Apr', 'New Sign-ups': 55, 'Active Recruiters': 150 },
    ],
    jobPostings: [
      { month: 'Jan', 'Jobs Posted': 150, 'Applications': 2200 },
      { month: 'Feb', 'Jobs Posted': 180, 'Applications': 2500 },
      { month: 'Mar', 'Jobs Posted': 210, 'Applications': 3100 },
      { month: 'Apr', 'Jobs Posted': 190, 'Applications': 2800 },
    ],
    timeToFill: [
      { month: 'Jan', 'Days': 35 },
      { month: 'Feb', 'Days': 32 },
      { month: 'Mar', 'Days': 28 },
      { month: 'Apr', 'Days': 30 },
    ],
    candidateFunnel: [
      { value: 500, name: 'Applications', fill: '#8884d8' },
      { value: 250, name: 'Screened', fill: '#83a6ed' },
      { value: 100, name: 'Interviewed', fill: '#8dd1e1' },
      { value: 20, name: 'Hired', fill: '#82ca9d' },
    ],
    sourcingChannels: [
      { name: 'Direct Search', value: 45 },
      { name: 'Referrals', value: 25 },
      { name: 'Job Alerts', value: 20 },
      { name: 'External', value: 10 },
    ],
  },
  mentor: {
    activity: [
        { name: 'Jan', 'New Mentors': 10, 'Active Mentors': 50 },
        { name: 'Feb', 'New Mentors': 15, 'Active Mentors': 55 },
        { name: 'Mar', 'New Mentors': 8, 'Active Mentors': 60 },
        { name: 'Apr', 'New Mentors': 12, 'Active Mentors': 62 },
    ],
    sessions: [
        { month: 'Jan', 'Requested': 80, 'Completed': 60 },
        { month: 'Feb', 'Requested': 95, 'Completed': 75 },
        { month: 'Mar', 'Requested': 110, 'Completed': 90 },
        { month: 'Apr', 'Requested': 100, 'Completed': 85 },
    ],
    mentorPopularity: [
        { name: 'Alice Smith', sessions: 42 },
        { name: 'John Doe', sessions: 36 },
        { name: 'Priya Patel', sessions: 50 },
        { name: 'James Lee', sessions: 27 },
    ]

  },
  business: {
      subscriptions: [
        { month: 'Jan', 'New Subscriptions': 20, 'Cancellations': 5 },
        { month: 'Feb', 'New Subscriptions': 25, 'Cancellations': 3 },
        { month: 'Mar', 'New Subscriptions': 30, 'Cancellations': 8 },
        { month: 'Apr', 'New Subscriptions': 28, 'Cancellations': 4 },
      ],
      cacClv: [
        { month: 'Jan', 'CAC': 300, 'CLV': 1500 },
        { month: 'Feb', 'CAC': 320, 'CLV': 1600 },
        { month: 'Mar', 'CAC': 280, 'CLV': 1550 },
        { month: 'Apr', 'CAC': 310, 'CLV': 1700 },
      ],
      companyRegistrations: [
        { month: 'Jan', companies: 20 },
        { month: 'Feb', companies: 30 },
        { month: 'Mar', companies: 25 },
        { month: 'Apr', companies: 35 },
      ],
      companyUnsubscriptions: [
        { month: 'Jan', unsubscribed: 5 },
        { month: 'Feb', unsubscribed: 8 },
        { month: 'Mar', unsubscribed: 6 },
        { month: 'Apr', unsubscribed: 10 },
      ],

  },
  candidate: {
    acquisition: [
        { source: 'Organic', 'New Sign-ups': 1200 },
        { source: 'Referrals', 'New Sign-ups': 800 },
        { source: 'Social Media', 'New Sign-ups': 950 },
        { source: 'Paid Ads', 'New Sign-ups': 500 },
    ],
    engagement: [
        { month: 'Jan', 'Applications Sent': 10000, 'Avg per Candidate': 5 },
        { month: 'Feb', 'Applications Sent': 12000, 'Avg per Candidate': 6 },
        { month: 'Mar', 'Applications Sent': 15000, 'Avg per Candidate': 7 },
        { month: 'Apr', 'Applications Sent': 13000, 'Avg per Candidate': 6 },
    ],
    interviewFunnel: [
        { value: 10000, name: 'Applications', fill: '#8884d8' },
        { value: 1500, name: 'Interviews', fill: '#83a6ed' },
        { value: 500, name: 'Offers', fill: '#8dd1e1' },
    ]
  }
};

const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// ===================================================================================
// 2. REUSABLE COMPONENTS
// ===================================================================================

const ChartCard = ({ title, children, filterFields }) => {
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would handle the form data here
    alert("Filtering data... (functionality to be implemented)");
  };
    
  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3 className="chart-title">{title}</h3>
        {filterFields && (
          <form className="filter-form" onSubmit={handleFilterSubmit}>
            <FiFilter />
            {filterFields.map(field => (
              <input key={field.name} name={field.name} type={field.type} placeholder={field.placeholder} className="filter-input" />
            ))}
            <button type="submit" className="filter-button">Apply</button>
          </form>
        )}
      </div>
      {children}
    </div>
  );
};

const DataTable = ({ data, columns }) => (
  <table className="data-table">
    <thead>
      <tr>
        {columns.map(col => <th key={col.key}>{col.header}</th>)}
      </tr>
    </thead>
    <tbody>
      {data.map((row, rowIndex) => (
        <tr key={rowIndex}>
          {columns.map(col => <td key={col.key}>{row[col.key]}</td>)}
        </tr>
      ))}
    </tbody>
  </table>
);

const Gauge = ({ value, label, maxValue }) => (
    <div className="gauge-container">
        {/* Dynamic inline style is kept for the color, as it depends on props */}
        <div className="stat-number" style={{ color: value > 7 ? '#34C759' : '#FF9500' }}>
            {value} / {maxValue}
        </div>
        <p>{label}</p>
    </div>
);


// ===================================================================================
// 3. ACTOR-SPECIFIC DASHBOARDS
// ===================================================================================

const RecruiterAnalytics = () => (
  <div className="grid">
    <ChartCard title="Recruiter Engagement" filterFields={[{name: 'date_range', type: 'date', placeholder: 'Date Range'}]}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={mockData.recruiter.engagement}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="New Sign-ups" fill="#8884d8" />
          <Bar dataKey="Active Recruiters" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
      <DataTable 
        data={mockData.recruiter.engagement}
        columns={[{key: 'name', header: 'Month'}, {key: 'New Sign-ups', header: 'New'}, {key: 'Active Recruiters', header: 'Active'}]}
      />
    </ChartCard>

    <ChartCard title="Job Posting Analytics" filterFields={[{name: 'company', type: 'text', placeholder: 'Company Name'}]}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={mockData.recruiter.jobPostings}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Jobs Posted" stroke="#8884d8" />
          <Line type="monotone" dataKey="Applications" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>

    <ChartCard title="Average Time-to-Fill (Days)">
        <p className="stat-number">29</p>
         <ResponsiveContainer width="100%" height={100}>
            <LineChart data={mockData.recruiter.timeToFill}>
                <Tooltip />
                <Line type="monotone" dataKey="Days" stroke="#ffc658" strokeWidth={3} />
            </LineChart>
        </ResponsiveContainer>
    </ChartCard>

     <ChartCard title="Candidate Funnel" filterFields={[{name: 'recruiter', type: 'text', placeholder: 'Recruiter Name'}]}>
      <ResponsiveContainer width="100%" height={300}>
        <FunnelChart>
          <Tooltip />
          <Funnel dataKey="value" data={mockData.recruiter.candidateFunnel} isAnimationActive>
            <LabelList position="right" fill="#000" stroke="none" dataKey="name" />
          </Funnel>
        </FunnelChart>
      </ResponsiveContainer>
    </ChartCard>
  </div>
);

const MentorAnalytics = () => (
    <div className="grid">
        <ChartCard title="Mentor Activity" filterFields={[{name: 'date_range', type: 'date', placeholder: ''}]}>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockData.mentor.activity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="New Mentors" fill="#8884d8" />
                    <Bar dataKey="Active Mentors" fill="#82ca9d" />
                </BarChart>
            </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Mentorship Sessions" filterFields={[{name: 'mentor_name', type: 'text', placeholder: 'Mentor Name'}]}>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockData.mentor.sessions}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Requested" stroke="#ff7300" />
                    <Line type="monotone" dataKey="Completed" stroke="#387908" />
                </LineChart>
            </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Mentor Satisfaction (CSAT)">
            <Gauge value={8.9} label="Average Rating" maxValue={10} />
        </ChartCard>

        <ChartCard title="Mentor Popularity (By Session Count)">
            <ResponsiveContainer width="100%" height={300}>
                <BarChart layout="vertical" data={mockData.mentor.mentorPopularity}>
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={140} />
                    <Tooltip />
                    <Bar dataKey="sessions" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </ChartCard>

    </div>
);

const BusinessManagerAnalytics = () => (
    <div className="grid">
        <ChartCard title="Subscription & Sales Performance" filterFields={[{name: 'tier', type: 'text', placeholder: 'Subscription Tier'}]}>
            <ResponsiveContainer width="100%" height={300}>
                 <LineChart data={mockData.business.subscriptions}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="New Subscriptions" stroke="#34C759" />
                    <Line type="monotone" dataKey="Cancellations" stroke="#FF3B30" />
                </LineChart>
            </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Customer Acquisition Cost (CAC) vs. Lifetime Value (CLV)">
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockData.business.cacClv}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="CAC" stroke="#FF9500" name="CAC ($)" />
                    <Line type="monotone" dataKey="CLV" stroke="#007AFF" name="CLV ($)" />
                </LineChart>
            </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="New Companies Registered Over Time" filterFields={[{ name: 'date_range', type: 'date', placeholder: 'Select Date' }]}>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockData.business.companyRegistrations}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="companies" stroke="#34C759" name="New Companies" />
                </LineChart>
            </ResponsiveContainer>
        </ChartCard>

<ChartCard title="Unsubscribed Companies Over Time" filterFields={[{ name: 'date_range', type: 'date', placeholder: 'Select Date' }]}>
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={mockData.business.companyUnsubscriptions}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="unsubscribed" stroke="#FF3B30" name="Unsubscribed" />
    </LineChart>
  </ResponsiveContainer>
</ChartCard>

    </div>
);

const CandidateAnalytics = () => (
    <div className="grid">
        <ChartCard title="Candidate Acquisition Source" filterFields={[{name: 'location', type: 'text', placeholder: 'Location'}]}>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockData.candidate.acquisition}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="source" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="New Sign-ups" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </ChartCard>
        
        <ChartCard title="Profile Completion Rate">
            <Gauge value={78} label="Profiles Fully Completed" maxValue={"100%"} />
        </ChartCard>
        
        <ChartCard title="Application & Engagement Metrics" filterFields={[{name: 'date_range', type: 'date', placeholder: ''}]}>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockData.candidate.engagement}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="Applications Sent" stroke="#8884d8" />
                    <Line yAxisId="right" type="monotone" dataKey="Avg per Candidate" stroke="#82ca9d" />
                </LineChart>
            </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Interview & Offer Funnel">
            <ResponsiveContainer width="100%" height={300}>
                <FunnelChart>
                    <Tooltip />
                    <Funnel dataKey="value" data={mockData.candidate.interviewFunnel} isAnimationActive>
                         <LabelList position="right" fill="#000" stroke="none" dataKey="name" />
                    </Funnel>
                </FunnelChart>
            </ResponsiveContainer>
        </ChartCard>
    </div>
);

// ===================================================================================
// 4. MAIN PAGE COMPONENT
// ===================================================================================

const Analytics = () => {
  const [activeActor, setActiveActor] = useState('recruiter');

  const renderContent = () => {
    switch (activeActor) {
      case 'recruiter':
        return <RecruiterAnalytics />;
      case 'mentor':
        return <MentorAnalytics />;
      case 'business':
        return <BusinessManagerAnalytics />;
      case 'candidate':
        return <CandidateAnalytics />;
      default:
        return <div>Select an actor</div>;
    }
  };

  const ActorTab = ({ actor, children }) => {
    // A common pattern for conditional classes
    const tabClassName = `tab-button ${activeActor === actor ? 'active-tab' : ''}`;
    return (
     <button className={tabClassName} onClick={() => setActiveActor(actor)}>
        {children}
    </button>
  )};

  return (
    <div className="page-container">
      <header className="header">
        <h2 className="subtitle">Deep dive into the performance of your key user groups.</h2>
      </header>

      <nav className="tabs">
        <ActorTab actor="recruiter"><FiBriefcase /> Recruiters</ActorTab>
        <ActorTab actor="mentor"><FiUsers /> Mentors</ActorTab>
        <ActorTab actor="business"><FiDollarSign /> Business Managers</ActorTab>
        <ActorTab actor="candidate"><FiBarChart2 /> Candidates</ActorTab>
      </nav>

      <main>
        {renderContent()}
      </main>
    </div>
  );
};

export default Analytics;