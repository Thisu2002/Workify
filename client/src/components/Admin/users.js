import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import "../../styles/users.css";

const UserCard = ({ user, onClick }) => (
  <div className="user-card" onClick={() => onClick(user)}>
    <img src={user.image || ""} alt={user.name} className="user-profile-pic" />
    <h3 className="user-name">{user.name}</h3>
    <p className="user-position">{user.position}{user.status ? `(${user.status})` : ''}</p>
  </div>
);

const UserDetailsModal = ({ user, onClose, onUnblock }) => {
  if (!user) return null;
  const handleModalContentClick = (e) => e.stopPropagation();
  const isBlocked = user.reason && user.blockedUntil;
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={handleModalContentClick}>
        <button className="close-modal-btn" onClick={onClose}>×</button>
        <img src={user.image || ""} alt={user.name} className="modal-user-pic" />
        <h2 className="modal-user-name">{user.name}</h2>
        <p className="modal-user-position">{user.position}</p>
        {user.company && <p><strong>Company:</strong> {user.company}</p>}
        {user.email && <p><strong>Email:</strong> <a href={`mailto:${user.email}`}>{user.email}</a></p>}
        {user.phone && <p><strong>Phone:</strong> {user.phone}</p>}
        {user.skills && <p><strong>Skills:</strong> {user.skills.join(', ')}</p>}
        {isBlocked && (
          <div className="block-info-container">
            <h3>Blocking Information</h3>
            <p><strong>Reason:</strong> {user.reason}</p>
            <p><strong>Blocked Period:</strong> {formatDate(user.blockedDate)} to {formatDate(user.blockedUntil)}</p>
            <button className="unblock-btn" onClick={() => onUnblock(user.id)}>Unblock Candidate</button>
          </div>
        )}
      </div>
    </div>
  );
};

const UsersPage = () => {
  const [allUsers, setAllUsers] = useState({
    recruiters: [],
    candidates: [],
    mentors: [],
    business_managers: []
  });
  const [activeActor, setActiveActor] = useState('recruiters');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const location = useLocation();
  const selectedUserIdFromState = location.state?.selectedUserId;

  const actors = ['recruiters', 'candidates', 'mentors', 'business_managers'];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/admin/users');
        setAllUsers(res.data);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };
    fetchUsers();
  }, []);

    useEffect(() => {
    if (selectedUserIdFromState && allUsers) {
      // flatten all users
      const all = [
        ...allUsers.recruiters,
        ...allUsers.candidates,
        ...allUsers.mentors,
        ...allUsers.business_managers
      ];
      const user = all.find(u => u.id === selectedUserIdFromState);
      if (user) setSelectedUser(user);
    }
  }, [selectedUserIdFromState, allUsers]);

  const uniqueCompanies = useMemo(() => {
    const companies = allUsers.recruiters.map((r) => r.company);
    return ['all', ...new Set(companies)];
  }, [allUsers.recruiters]);

  const filteredUsers = useMemo(() => {
    let users = allUsers[activeActor];
    if (searchTerm) {
      users = users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.position.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (activeActor === 'recruiters' && selectedCompany !== 'all') {
      users = users.filter((user) => user.company === selectedCompany);
    }
    return users;
  }, [activeActor, searchTerm, selectedCompany, allUsers]);

  return (
    <div className="user-management-page">
      <header className="page-header">
        <nav className="top-navbar">
          {actors.map((actor) => (
            <button
              key={actor}
              className={`nav-link ${activeActor === actor ? 'active' : ''}`}
              onClick={() => {
                setActiveActor(actor);
                setSearchTerm('');
                setSelectedCompany('all');
              }}
            >
              {actor.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
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
                {uniqueCompanies.map((company) => (
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
            filteredUsers.map((user) => (
              <UserCard key={user.id} user={user} onClick={setSelectedUser} />
            ))
          ) : (
            <p className="no-results-message">No users found.</p>
          )}
        </div>
      </main>

      <UserDetailsModal
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
        onUnblock={(id) => console.log("Unblock:", id)}
      />
    </div>
  );
};

export default UsersPage;
