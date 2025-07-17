import React, { useState, useMemo } from 'react';
import "../../styles/users.css";

// --- Sample Data ---
// In a real application, you would fetch this data from an API.
const allUsers = {
    recruiters: [
        { id: 1, name: 'Eleanor Vance', position: 'Senior Recruiter', company: 'Innovate Inc.', image: 'https://randomuser.me/api/portraits/women/1.jpg' },
        { id: 2, name: 'James Holden', position: 'Talent Acquisition', company: 'Tech Solutions', image: 'https://randomuser.me/api/portraits/men/2.jpg' },
        { id: 3, name: 'Amos Burton', position: 'HR Manager', company: 'Innovate Inc.', image: 'https://randomuser.me/api/portraits/men/3.jpg' },
        { id: 4, name: 'Carla Monroe', position: 'Recruiting Lead', company: 'Data Systems', image: 'https://randomuser.me/api/portraits/women/4.jpg' },
    ],
    candidates: [
        { id: 5, name: 'Naomi Nagata', position: 'Software Engineer', image: 'https://randomuser.me/api/portraits/women/5.jpg' },
        { id: 6, name: 'Alex Kamal', position: 'Product Manager', image: 'https://randomuser.me/api/portraits/men/6.jpg' },
    ],
    mentors: [
        { id: 7, name: 'Chrisjen Avasarala', position: 'Lead Developer', image: 'https://randomuser.me/api/portraits/women/7.jpg' },
    ],
    'business-managers': [
        { id: 8, name: 'Sadavir Errinwright', position: 'Business Director', image: 'https://randomuser.me/api/portraits/men/8.jpg' },
    ],
    'blocked-candidates': [
        { id: 9, name: 'Jules-Pierre Mao', position: 'UI/UX Designer', image: 'https://randomuser.me/api/portraits/men/9.jpg' },
    ],
};

// --- User Card Component ---
const UserCard = ({ user }) => (
    <div className="user-card">
        <img src={user.image} alt={user.name} className="user-profile-pic" />
        <h3 className="user-name">{user.name}</h3>
        <p className="user-position">{user.position}</p>
    </div>
);


// --- Main Page Component ---
const UsersPage = () => {
    const [activeActor, setActiveActor] = useState('recruiters');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCompany, setSelectedCompany] = useState('all');

    const actors = ['recruiters', 'candidates', 'mentors', 'business-managers', 'blocked-candidates'];

    const uniqueCompanies = useMemo(() => {
        const companies = allUsers.recruiters.map(r => r.company);
        return ['all', ...new Set(companies)];
    }, []);

    const filteredUsers = useMemo(() => {
        let users = allUsers[activeActor];

        // Filter by search term
        if (searchTerm) {
            users = users.filter(user =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.position.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply company filter only for recruiters
        if (activeActor === 'recruiters' && selectedCompany !== 'all') {
            users = users.filter(user => user.company === selectedCompany);
        }

        return users;
    }, [activeActor, searchTerm, selectedCompany]);

    return (
        <div className="user-management-page">
            <header className="page-header">
                <nav className="top-navbar">
                    {actors.map(actor => (
                        <button
                            key={actor}
                            className={`nav-link ${activeActor === actor ? 'active' : ''}`}
                            onClick={() => {
                                setActiveActor(actor);
                                setSearchTerm(''); // Reset search on tab change
                                setSelectedCompany('all'); // Reset filter on tab change
                            }}
                        >
                            {actor.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </button>
                    ))}
                </nav>
            </header>

            <main className="page-content">
                <div className="toolbar">
                    <div className="search-container">
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search by name or position..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {activeActor === 'recruiters' && (
                        <div className="filter-container">
                            <select
                                className="filter-select"
                                value={selectedCompany}
                                onChange={(e) => setSelectedCompany(e.target.value)}
                            >
                                {uniqueCompanies.map(company => (
                                    <option key={company} value={company}>
                                        {company === 'all' ? 'All Companies' : company}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                <div className="user-grid">
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map(user => <UserCard key={user.id} user={user} />)
                    ) : (
                        <p className="no-results-message">No users found.</p>
                    )}
                </div>
            </main>
        </div>
    );
};

export default UsersPage;