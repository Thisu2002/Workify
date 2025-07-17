import React, { useState, useMemo } from 'react';
import "../../styles/CompanyProfiles.css"; // Make sure to use the new CSS below
import { Search, Briefcase, Users, UserCheck, Star, Calendar, Shield, ArrowLeft } from 'lucide-react';

// --- MOCK DATA (no changes) ---
const mockCompanies = [
    {
        id: 1,
        name: 'Innovate Inc.',
        logo: 'https://cdn-icons-png.flaticon.com/512/888/888859.png',
        location: 'San Francisco, CA',
        website: 'innovateinc.com',
        description: 'A leading tech company focused on AI-driven solutions to solve complex business problems.',
        recruiters: [
            { id: 101, name: 'Eleanor Vance', position: 'Senior Recruiter' },
            { id: 102, name: 'Amos Burton', position: 'HR Manager' },
        ],
        leadPanelists: [{ id: 201, name: 'James Holden', position: 'Engineering Lead' }],
        mentors: [{ id: 301, name: 'Carla Monroe', position: 'Principal Engineer' }],
        subscription: { plan: 'Premium Annual', status: 'Paid', nextPayment: 'July 15, 2026' }
    },
    // ... other companies from previous example
    {
        id: 2,
        name: 'Tech Solutions',
        logo: 'https://cdn-icons-png.flaticon.com/512/888/888863.png',
        location: 'New York, NY',
        website: 'techsolutions.io',
        description: 'Providing robust software and hardware solutions for enterprise clients worldwide.',
        recruiters: [{ id: 103, name: 'Bobbie Draper', position: 'Talent Acquisition' }],
        leadPanelists: [],
        mentors: [
            { id: 302, name: 'Chrisjen Avasarala', position: 'Executive Mentor' },
            { id: 303, name: 'Sadavir Errinwright', position: 'Product Lead' },
        ],
        subscription: { plan: 'Standard Monthly', status: 'Payment Due', nextPayment: 'July 25, 2025' }
    },
    {
        id: 3,
        name: 'Data Systems',
        logo: 'https://cdn-icons-png.flaticon.com/512/888/888879.png',
        location: 'Austin, TX',
        website: 'datasystems.com',
        description: 'Pioneers in big data analytics and cloud computing infrastructure.',
        recruiters: [{ id: 104, name: 'Fred Johnson', position: 'Hiring Manager' }],
        leadPanelists: [{ id: 202, name: 'Naomi Nagata', position: 'Lead Architect' }],
        mentors: [],
        subscription: { plan: 'Free Trial', status: 'Pending Payment', nextPayment: 'August 1, 2025' }
    },
    {
    id: 4,
    name: 'QuantumLeap',
    logo: 'https://cdn-icons-png.flaticon.com/512/3242/3242421.png', // Placeholder logo for QuantumLeap
    location: 'Boston, MA',
    website: 'quantumleap.ai',
    description: 'Pioneering quantum computing technologies to revolutionize data processing and scientific research.',
    recruiters: [
        { id: 105, name: 'Grace Hopper', position: 'Technical Recruiter' },
        { id: 106, name: 'Alan Turing', position: 'Recruitment Coordinator' }
    ],
    leadPanelists: [
        { id: 203, name: 'Richard Feynman', position: 'Quantum Engineering Lead' }
    ],
    mentors: [],
    subscription: { plan: 'Enterprise Annual', status: 'Paid', nextPayment: 'September 1, 2026' }
},
{
    id: 5,
    name: 'NextGen Health',
    logo: 'https://cdn-icons-png.flaticon.com/512/10059/10059795.png', // Placeholder logo for NextGen Health
    location: 'Chicago, IL',
    website: 'nextgen.health',
    description: 'Developing next-generation digital health platforms to improve patient outcomes and streamline hospital operations.',
    recruiters: [
        { id: 107, name: 'Florence Nightingale', position: 'Healthcare IT Recruiter' }
    ],
    leadPanelists: [],
    mentors: [
        { id: 304, name: 'Marie Curie', position: 'Senior Medical Advisor' }
    ],
    subscription: { plan: 'Standard Monthly', status: 'Payment Due', nextPayment: 'July 19, 2025' }
},
{
    id: 6,
    name: 'GreenScape',
    logo: 'https://cdn-icons-png.flaticon.com/512/4201/4201479.png', // Placeholder logo for GreenScape
    location: 'Portland, OR',
    website: 'greenscape.eco',
    description: 'Sustainable solutions for urban planning and renewable energy, committed to a greener future.',
    recruiters: [
        { id: 108, name: 'Rachel Carson', position: 'Eco-Talent Specialist' }
    ],
    leadPanelists: [
        { id: 204, name: 'David Attenborough', position: 'Chief Sustainability Officer' }
    ],
    mentors: [
        { id: 305, name: 'Jane Goodall', position: 'Environmental Mentor' }
    ],
    subscription: { plan: 'Free Trial', status: 'Pending Payment', nextPayment: 'August 5, 2025' }
},
{
    id: 7,
    name: 'CyberSecure',
    logo: 'https://cdn-icons-png.flaticon.com/512/10795/10795496.png', // Placeholder logo for CyberSecure
    location: 'Arlington, VA',
    website: 'cybersecure.net',
    description: 'Providing state-of-the-art cybersecurity and threat intelligence services for government and private sectors.',
    recruiters: [
        { id: 109, name: 'Kevin Mitnick', position: 'Security Recruitment Lead' }
    ],
    leadPanelists: [
        { id: 205, name: 'Ada Lovelace', position: 'Head of Threat Analysis' }
    ],
    mentors: [],
    subscription: { plan: 'Premium Monthly', status: 'Paid', nextPayment: 'August 10, 2025' }
},
];

// --- View 1: Grid of All Companies ---
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
            {companies.map(company => (
                <div key={company.id} className="profile-card" onClick={() => onSelectCompany(company)}>
                    <img src={company.logo} alt={`${company.name} logo`} className="profile-logo" />
                    <h3 className="profile-name">{company.name}</h3>
                    <p className="profile-position">{company.location}</p>
                </div>
            ))}
        </div>
    </div>
);

// --- View 2: Detailed View of a Single Company ---
const CompanyDetailView = ({ company, onBack }) => (
    <div className="company-detail-view">
        <button onClick={onBack} className="back-button">
            <ArrowLeft size={20} /> Back to All Companies
        </button>
        <div className="detail-header">
            <img src={company.logo} alt={`${company.name} logo`} className="detail-header-logo" />
            <div className="detail-header-info">
                <h1 className="detail-company-name">{company.name}</h1>
                <p className="detail-company-location">{company.location}</p>
                <a href={`http://${company.website}`} target="_blank" rel="noopener noreferrer" className="detail-company-website">
                    {company.website}
                </a>
            </div>
        </div>
        <p className="detail-company-description">{company.description}</p>
        <div className="details-grid">
            <DetailSection title="Recruiters" icon={<Briefcase size={18} />}>
                {company.recruiters.length > 0 ? company.recruiters.map(r => <TeamMember key={r.id} member={r} />) : <p className="no-data-text">No recruiters assigned.</p>}
            </DetailSection>
            <DetailSection title="Lead Panelists" icon={<UserCheck size={18} />}>
                {company.leadPanelists.length > 0 ? company.leadPanelists.map(p => <TeamMember key={p.id} member={p} />) : <p className="no-data-text">No lead panelists assigned.</p>}
            </DetailSection>
            <DetailSection title="Mentors" icon={<Users size={18} />}>
                {company.mentors.length > 0 ? company.mentors.map(m => <TeamMember key={m.id} member={m} />) : <p className="no-data-text">No mentors assigned.</p>}
            </DetailSection>
            <DetailSection title="Subscription Plan" icon={<Star size={18} />}>
                <SubscriptionStatus sub={company.subscription} />
            </DetailSection>
        </div>
    </div>
);

// --- Reusable Sub-Components (for detail view) ---
const DetailSection = ({ title, icon, children }) => (<div className="detail-section"><h3 className="detail-section-title">{icon}{title}</h3><div className="detail-section-content">{children}</div></div>);
const TeamMember = ({ member }) => (<div className="team-member-card"><p className="team-member-name">{member.name}</p><p className="team-member-position">{member.position}</p></div>);
const SubscriptionStatus = ({ sub }) => {
    const statusClass = sub.status.toLowerCase().replace(' ', '-');
    return (<div className="subscription-card"><h4 className="subscription-plan">{sub.plan}</h4><div className={`subscription-status ${statusClass}`}><Shield size={16} /> <span>{sub.status}</span></div><div className="subscription-next-payment"><Calendar size={14} /><span>Next Payment: {sub.nextPayment}</span></div></div>);
};

// --- Main Page Component ---
const CompanyProfilesPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCompany, setSelectedCompany] = useState(null);

    const filteredCompanies = useMemo(() =>
        mockCompanies.filter(company =>
            company.name.toLowerCase().includes(searchTerm.toLowerCase())
        ), [searchTerm]);

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
                    onSelectCompany={setSelectedCompany}
                />
            )}
        </div>
    );
};

export default CompanyProfilesPage;