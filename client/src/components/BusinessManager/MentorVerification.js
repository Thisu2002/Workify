import React, { useState, useEffect } from 'react';
import '../../styles/MentorVerification.css'; // Import the corresponding CSS

// MOCK DATA: Added an 'imageUrl' property for each mentor.
// These images are professional, generic placeholders from a free-to-use source.
const MOCK_MENTORS = [
  { 
    id: 1, 
    name: 'Ravibanu peiris', 
    field: 'Data Science', 
    experience: '12 years at Google', 
    bio: 'Expert in machine learning, AI, and big data analytics.', 
    email: 'evelyn.reed@example.com', 
    linkedin: 'https://linkedin.com/in/evelynreed',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2788&auto=format&fit=crop' 
  },
  { 
    id: 2, 
    name: 'Piyum Perera', 
    field: 'Software Engineering', 
    experience: '8 years at Meta', 
    bio: 'Full-stack developer with a focus on scalable web applications.', 
    email: 'marcus.chen@example.com', 
    linkedin: 'https://linkedin.com/in/marcuschen',
    imageUrl: 'https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=2942&auto=format&fit=crop'
  },
  { 
    id: 3, 
    name: 'Mahima Fernando', 
    field: 'UX/UI Design', 
    experience: '10 years at Adobe', 
    bio: 'Specializes in user-centered design and intuitive interfaces.', 
    email: 'aisha.khan@example.com', 
    linkedin: 'https://linkedin.com/in/aishakhan',
    imageUrl: 'https://images.unsplash.com/photo-1542596594-649ed6e66c36?q=80&w=2787&auto=format&fit=crop'
  },
];

function MentorVerification() {
  const [mentors, setMentors] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState(null);

 useEffect(() => {
  fetch('http://localhost:5000/manager/mentors/pending')
    .then(res => res.json())
    .then(data => setMentors(data))
    .catch(err => console.error('Error fetching mentors:', err));
}, []);


  const handleCloseModal = () => {
    setSelectedMentor(null);
  };

 const handleAccept = async (mentorId) => {
  try {
    const res = await fetch(`http://localhost:5000/manager/mentors/accept/${mentorId}`, {
      method: 'POST'
    });
    const data = await res.json();
    alert(data.message);
    setMentors(prev => prev.filter(m => m._id !== mentorId));
    setSelectedMentor(null);
  } catch (err) {
    console.error('Accept error:', err);
  }
};
  
const handleDecline = async (mentorId) => {
  const reason = prompt("Please provide a reason for declining this mentor application:");
  if (!reason || reason.trim() === '') {
    alert('A reason is required to decline a mentor.');
    return;
  }
  try {
    const res = await fetch(`http://localhost:5000/manager/mentors/decline/${mentorId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason })
    });
    const data = await res.json();
    alert(data.message);
    setMentors(prev => prev.filter(m => m._id !== mentorId));
    setSelectedMentor(null);
  } catch (err) {
    console.error('Decline error:', err);
  }
};

  return (
    <div className="mentor-verification-container">
      <h1>Mentor Verification Requests</h1>
      <p>The following mentors are awaiting registration approval.</p>
      
      <div className="mentor-list">
        {mentors.length > 0 ? (
          mentors.map(mentor => (
            // UPDATED: Added image and a container for the text info
            <div 
              key={mentor._id} 
              className="mentor-item" 
              onClick={() => setSelectedMentor(mentor)} 
              role="button" 
              tabIndex={0}
            >
              <img src={mentor.imageUrl || "https://cdn-icons-png.flaticon.com/512/1077/1077012.png"} alt={mentor.name} className="mentor-item-avatar" />
              <div className="mentor-item-info">
                <h3>{mentor.firstName} {mentor.lastName}</h3>
                <p>{mentor.field}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No pending mentor applications.</p>
        )}
      </div>

      {/* --- Integrated Mentor Details Modal --- */}
      {selectedMentor && (
        <div className="modal-backdrop" onClick={handleCloseModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            {/* UPDATED: Added image to the modal header */}
            <div className="modal-header">
              <img src={selectedMentor.imageUrl || "https://cdn-icons-png.flaticon.com/512/1077/1077012.png"} alt={selectedMentor.name} className="modal-avatar" />
              <h2>Mentor Details</h2>
              <button onClick={handleCloseModal} className="close-button">×</button>
            </div>
            <div className="modal-body">
              <p><strong>Name:</strong> {selectedMentor.firstName} {selectedMentor.lastName}</p>
              <p><strong>Field of Expertise:</strong> {selectedMentor.field}</p>
              <p><strong>Professional Experience:</strong> {selectedMentor.experience}</p>
              <p><strong>Biography:</strong> {selectedMentor.bio}</p>
              <p><strong>Email:</strong> <a href={`mailto:${selectedMentor.email}`}>{selectedMentor.email}</a></p>
              <p>
                <strong>LinkedIn Profile:</strong> 
                <a href={selectedMentor.linkedin} target="_blank" rel="noopener noreferrer">
                  View Profile
                </a>
              </p>
            </div>
            <div className="modal-footer">
              <button onClick={() => handleDecline(selectedMentor._id)} className="btn btn-decline">Decline</button>
              <button onClick={() => handleAccept(selectedMentor._id)} className="btn btn-accept">Accept</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MentorVerification;