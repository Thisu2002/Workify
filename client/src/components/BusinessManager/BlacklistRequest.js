import React, { useState, useEffect } from 'react';
import '../../styles/BlacklistRequest.css'; // Import the corresponding CSS

// MOCK DATA: Represents blacklist requests from recruiters.
const MOCK_REQUESTS = [
  {
    id: 'req_001',
    candidate: {
      id: 'cand_101',
      name: 'John Doe',
      email: 'john.doe@example.com',
      imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2787&auto=format&fit=crop',
    },
    recruiter: {
      id: 'rec_201',
      name: 'Jane Smith (HR at TechCorp)',
    },
    reason: 'Candidate provided false information on his resume regarding his employment history at a previous company. This was discovered during the background check.',
  },
  {
    id: 'req_002',
    candidate: {
      id: 'cand_102',
      name: 'Emily White',
      email: 'emily.white@example.com',
      imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2940&auto=format&fit=crop',
    },
    recruiter: {
      id: 'rec_202',
      name: 'Michael Brown (Lead Recruiter at Innovate Inc.)',
    },
    reason: 'Candidate failed to show up for a scheduled final-round interview without any prior notice or subsequent explanation.',
  },
];

function BlacklistRequest() {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    // In a real app, you would fetch this data from an API.
    setRequests(MOCK_REQUESTS);
  }, []);

  const handleCloseModal = () => {
    setSelectedRequest(null);
  };

  const handleBlacklist = (candidateId, requestId) => {
    // Confirming such a critical action is good practice.
    if (window.confirm(`Are you sure you want to blacklist this candidate? This action is permanent.`)) {
      console.log(`⚫️ BLACKLISTED: Candidate ID ${candidateId}. Request ID: ${requestId}`);
      // API call to your backend would go here to update the candidate's status.
      // fetch(`/api/candidates/${candidateId}/blacklist`, { method: 'POST' });
      
      alert('The candidate has been successfully blacklisted.');
      setRequests(prev => prev.filter(req => req.id !== requestId));
      handleCloseModal();
    }
  };

  const handleDoNotBlacklist = (requestId) => {
    console.log(`⚪️ REJECTED: Blacklist Request ID ${requestId}.`);
    // You might have an API call to simply dismiss the request.
    // fetch(`/api/blacklist-requests/${requestId}/dismiss`, { method: 'POST' });

    alert('The blacklist request has been dismissed.');
    setRequests(prev => prev.filter(req => req.id !== requestId));
    handleCloseModal();
  };

  return (
    <div className="blacklist-container">
      <h1>Blacklist Requests</h1>
      <p>Review and process requests from recruiters to blacklist candidates.</p>
      
      <div className="request-list">
        {requests.length > 0 ? (
          requests.map(request => (
            <div
              key={request.id}
              className="request-item"
              onClick={() => setSelectedRequest(request)}
              role="button"
              tabIndex={0}
            >
              <img src={request.candidate.imageUrl} alt={request.candidate.name} className="request-item-avatar" />
              <div className="request-item-info">
                <h3>{request.candidate.name}</h3>
                <p>Request by: <strong>{request.recruiter.name}</strong></p>
              </div>
            </div>
          ))
        ) : (
          <p>No pending blacklist requests.</p>
        )}
      </div>

      {/* --- Integrated Details Modal --- */}
      {selectedRequest && (
        <div className="modal-backdrop" onClick={handleCloseModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Review Blacklist Request</h2>
              <button onClick={handleCloseModal} className="close-button">×</button>
            </div>
            <div className="modal-body">
              <div className="modal-section candidate-details">
                <h4>Candidate Details</h4>
                <p><strong>Name:</strong> {selectedRequest.candidate.name}</p>
                <p><strong>Email:</strong> {selectedRequest.candidate.email}</p>
              </div>

              <div className="modal-section request-details">
                <h4>Request Details</h4>
                <p><strong>Requested By:</strong> {selectedRequest.recruiter.name}</p>
                <p><strong>Reason for Blacklisting:</strong> {selectedRequest.reason}</p>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => handleDoNotBlacklist(selectedRequest.id)} className="btn btn-do-not-blacklist">
                Do Not Blacklist
              </button>
              <button onClick={() => handleBlacklist(selectedRequest.candidate.id, selectedRequest.id)} className="btn btn-blacklist">
                Blacklist Candidate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BlacklistRequest;