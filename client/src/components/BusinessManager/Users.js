import React, { useState, useMemo } from 'react';
import "../../styles/users.css";

// --- Sample Data ---
// This is now the initial state; the component will manage changes.
const initialUsers = {
    recruiters: [
        { id: 1, name: 'Eleanor Vance', position: 'Senior Recruiter', company: 'Innovate Inc.', image: 'https://randomuser.me/api/portraits/women/1.jpg', email: 'eleanor@example.com', phone: '123-456-7890' },
        { id: 2, name: 'James Holden', position: 'Talent Acquisition', company: 'Tech Solutions', image: 'https://randomuser.me/api/portraits/men/2.jpg', email: 'james@example.com', phone: '123-456-7890' },
        { id: 3, name: 'Amos Burton', position: 'HR Manager', company: 'Innovate Inc.', image: 'https://randomuser.me/api/portraits/men/3.jpg', email: 'amos@example.com', phone: '123-456-7890' },
        { id: 4, name: 'Carla Monroe', position: 'Recruiting Lead', company: 'Data Systems', image: 'https://randomuser.me/api/portraits/women/4.jpg', email: 'carla@example.com', phone: '123-456-7890' },
    ],
    candidates: [
        { id: 5, name: 'Naomi Nagata', position: 'Software Engineer', image: 'https://randomuser.me/api/portraits/women/5.jpg', email: 'naomi@example.com', skills: ['React', 'Node.js', 'GraphQL'] },
        { id: 6, name: 'Alex Kamal', position: 'Product Manager', image: 'https://randomuser.me/api/portraits/men/6.jpg', email: 'alex@example.com', skills: ['Agile', 'Scrum', 'JIRA'] },
    ],
    mentors: [
        { id: 7, name: 'Chrisjen Avasarala', position: 'Lead Developer', image: 'https://randomuser.me/api/portraits/women/7.jpg', email: 'chrisjen@example.com', expertise: ['System Design', 'Architecture'] },
    ],
    'blocked-candidates': [
        {
            id: 9,
            name: 'Jules-Pierre Mao',
            position: 'UI/UX Designer',
            image: 'https://randomuser.me/api/portraits/men/9.jpg',
            email: 'jp@example.com',
            reason: 'Failed to meet project deadlines and communication standards.',
            blockedDate: '2025-05-15',
            blockedUntil: '2025-11-15',
        },
    ],
};

// --- User Card Component ---
const UserCard = ({ user, onClick }) => (
    <div className="user-card" onClick={() => onClick(user)}>
        <img src={user.image} alt={user.name} className="user-profile-pic" />
        <h3 className="user-name">{user.name}</h3>
        <p className="user-position">{user.position}</p>
    </div>
);

// --- User Details Modal ---
const UserDetailsModal = ({ user, onClose, onUnblock }) => {
    if (!user) return null;

    const handleModalContentClick = (e) => {
        e.stopPropagation();
    };

    // A clear check to see if the user is in the blocked category
    const isBlocked = user.reason && user.blockedUntil;

    // Helper to format dates nicely
    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={handleModalContentClick}>
                <button className="close-modal-btn" onClick={onClose}>×</button>
                <img src={user.image} alt={user.name} className="modal-user-pic" />
                <h2 className="modal-user-name">{user.name}</h2>
                <p className="modal-user-position">{user.position}</p>

                {/* --- Common Details --- */}
                {user.company && <p><strong>Company:</strong> {user.company}</p>}
                {user.email && <p><strong>Email:</strong> <a href={`mailto:${user.email}`}>{user.email}</a></p>}
                {user.phone && <p><strong>Phone:</strong> {user.phone}</p>}
                {user.skills && <p><strong>Skills:</strong> {user.skills.join(', ')}</p>}
                {user.expertise && <p><strong>Expertise:</strong> {user.expertise.join(', ')}</p>}

                {/* --- Conditional Section for Blocked Candidates --- */}
                {isBlocked && (
                    <div className="block-info-container">
                        <h3>Blocking Information</h3>
                        <p><strong>Reason:</strong> {user.reason}</p>
                        <p><strong>Blocked Period:</strong> {formatDate(user.blockedDate)} to {formatDate(user.blockedUntil)}</p>
                        <button className="unblock-btn" onClick={() => onUnblock(user.id)}>
                            Unblock Candidate
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};


// --- Main Page Component ---
const UsersPage = () => {
    const [allUsers, setAllUsers] = useState(initialUsers);
    const [activeActor, setActiveActor] = useState('recruiters');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCompany, setSelectedCompany] = useState('all');
    const [selectedUser, setSelectedUser] = useState(null);

    const actors = ['recruiters', 'candidates', 'mentors', 'blocked-candidates'];

    const uniqueCompanies = useMemo(() => {
        const companies = allUsers.recruiters.map(r => r.company);
        return ['all', ...new Set(companies)];
    }, [allUsers.recruiters]);

    const filteredUsers = useMemo(() => {
        let users = allUsers[activeActor];

        if (searchTerm) {
            users = users.filter(user =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.position.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (activeActor === 'recruiters' && selectedCompany !== 'all') {
            users = users.filter(user => user.company === selectedCompany);
        }

        return users;
    }, [activeActor, searchTerm, selectedCompany, allUsers]);

    const handleUserClick = (user) => {
        setSelectedUser(user);
    };

    const handleCloseModal = () => {
        setSelectedUser(null);
    };

    const handleUnblockUser = (userId) => {
        const userToUnblock = allUsers['blocked-candidates'].find(u => u.id === userId);
        if (!userToUnblock) return;

        // Create a new user object without the blocking properties
        const { reason, blockedDate, blockedUntil, ...unblockedUser } = userToUnblock;

        setAllUsers(currentUsers => {
            const newBlockedCandidates = currentUsers['blocked-candidates'].filter(u => u.id !== userId);
            const newCandidates = [...currentUsers.candidates, unblockedUser];

            return {
                ...currentUsers,
                'blocked-candidates': newBlockedCandidates,
                candidates: newCandidates
            };
        });

        handleCloseModal(); // Close the modal after unblocking
    };

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
                                setSearchTerm('');
                                setSelectedCompany('all');
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
                            placeholder="Search by name, company, position..."
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
                        filteredUsers.map(user => (
                            <UserCard key={user.id} user={user} onClick={handleUserClick} />
                        ))
                    ) : (
                        <p className="no-results-message">No users found.</p>
                    )}
                </div>
            </main>

            <UserDetailsModal user={selectedUser} onClose={handleCloseModal} onUnblock={handleUnblockUser} />
        </div>
    );
};

export default UsersPage;