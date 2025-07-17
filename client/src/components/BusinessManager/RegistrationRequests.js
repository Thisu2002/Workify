import React, { useState } from 'react';
import { FaBuilding, FaEnvelope, FaPhone, FaLink, FaCalendarAlt, FaInfoCircle, FaStar } from 'react-icons/fa';
import '../../styles/RegistrationRequests.css'; // We will create this CSS file next

// --- Sample Data: Now includes subscriptionPlan object ---
const initialRequests = [
    {
        id: 'req1',
        companyName: 'Innovate Solutions Inc.',
        contactPerson: 'Eleanor Vance',
        email: 'eleanor@innovate.com',
        phone: '123-456-7890',
        website: 'https://innovate.com',
        requestDate: '2025-07-15',
        status: 'Pending',
        industry: 'Technology',
        companySize: '50-200 employees',
        address: '123 Tech Park, Silicon Valley, CA 94043',
        description: 'A forward-thinking tech company specializing in AI-driven solutions and cloud computing services.',
        subscriptionPlan: {
            name: 'Premium',
            price: 99,
            term: 'monthly'
        }
    },
    {
        id: 'req2',
        companyName: 'Quantum Dynamics',
        contactPerson: 'James Holden',
        email: 'j.holden@quantum.net',
        phone: '987-654-3210',
        website: 'https://quantum.net',
        requestDate: '2025-07-12',
        status: 'Pending',
        industry: 'Research & Development',
        companySize: '20-50 employees',
        address: '456 Research Blvd, Boston, MA 02110',
        description: 'Pioneering research in quantum computing and material science.',
        subscriptionPlan: {
            name: 'Enterprise',
            price: 249,
            term: 'monthly'
        }
    },
    {
        id: 'req3',
        companyName: 'EcoBuild Constructors',
        contactPerson: 'Carla Monroe',
        email: 'c.monroe@ecobuild.co',
        phone: '555-123-4567',
        website: 'https://ecobuild.co',
        requestDate: '2025-07-10',
        status: 'Pending',
        industry: 'Construction',
        companySize: '200+ employees',
        address: '789 Green Way, Austin, TX 78701',
        description: 'Leaders in sustainable and eco-friendly construction and architecture.',
        subscriptionPlan: {
            name: 'Basic',
            price: 29,
            term: 'monthly'
        }
    },
];

// --- Main Component ---
const RegistrationRequests = () => {
    const [requests, setRequests] = useState(initialRequests);
    const [selectedRequest, setSelectedRequest] = useState(requests[0] || null);

    const handleSelectRequest = (request) => {
        setSelectedRequest(request);
    };

    const handleAccept = (requestId) => {
        console.log(`Accepted request ID: ${requestId}`);
        setRequests(prev => prev.filter(r => r.id !== requestId));
        if (selectedRequest && selectedRequest.id === requestId) {
            const remainingRequests = requests.filter(r => r.id !== requestId);
            setSelectedRequest(remainingRequests[0] || null);
        }
    };

    const handleDecline = (requestId) => {
        console.log(`Declined request ID: ${requestId}`);
        setRequests(prev => prev.filter(r => r.id !== requestId));
        if (selectedRequest && selectedRequest.id === requestId) {
            const remainingRequests = requests.filter(r => r.id !== requestId);
            setSelectedRequest(remainingRequests[0] || null);
        }
    };

    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    return (
        <div className="requests-page-container">
            <header className="requests-header">
                <h1>Company Registration Requests</h1>
                <p>Review and process new company registrations.</p>
            </header>
            <div className="requests-main-content">
                <aside className="requests-list-panel">
                    <h2>Pending ({requests.length})</h2>
                    <div className="requests-list">
                        {requests.length > 0 ? (
                            requests.map(req => (
                                <div
                                    key={req.id}
                                    className={`request-item ${selectedRequest?.id === req.id ? 'active' : ''}`}
                                    onClick={() => handleSelectRequest(req)}
                                >
                                    <h3 className="request-item-company">{req.companyName}</h3>
                                    <p className="request-item-date">
                                        <FaCalendarAlt /> Requested on {formatDate(req.requestDate)}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="no-requests-message">No pending requests.</div>
                        )}
                    </div>
                </aside>

                <main className="request-details-panel">
                    {selectedRequest ? (
                        <>
                            <div className="details-header">
                                <FaBuilding className="company-icon" />
                                <div>
                                    <h2>{selectedRequest.companyName}</h2>
                                    <p>{selectedRequest.industry}</p>
                                </div>
                            </div>

                            {/* --- Subscription Plan Highlight --- */}
                            {selectedRequest.subscriptionPlan && (
                                <div className="subscription-highlight">
                                    <FaStar />
                                    <div>
                                        <div className="plan-name">{selectedRequest.subscriptionPlan.name} Plan</div>
                                        <div className="plan-details">
                                            ${selectedRequest.subscriptionPlan.price} / {selectedRequest.subscriptionPlan.term}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="details-body">
                                <div className="detail-item">
                                    <strong>Contact Person:</strong>
                                    <span>{selectedRequest.contactPerson}</span>
                                </div>
                                <div className="detail-item">
                                    <strong><FaEnvelope /> Email:</strong>
                                    <span><a href={`mailto:${selectedRequest.email}`}>{selectedRequest.email}</a></span>
                                </div>
                                <div className="detail-item">
                                    <strong><FaPhone /> Phone:</strong>
                                    <span>{selectedRequest.phone}</span>
                                </div>
                                <div className="detail-item">
                                    <strong><FaLink /> Website:</strong>
                                    <span><a href={selectedRequest.website} target="_blank" rel="noopener noreferrer">{selectedRequest.website}</a></span>
                                </div>
                                <div className="detail-item">
                                    <strong>Company Size:</strong>
                                    <span>{selectedRequest.companySize}</span>
                                </div>
                                <div className="detail-item">
                                    <strong>Address:</strong>
                                    <span>{selectedRequest.address}</span>
                                </div>
                                <div className="detail-item full-width">
                                    <strong><FaInfoCircle /> About the Company:</strong>
                                    <p>{selectedRequest.description}</p>
                                </div>
                            </div>
                            <div className="details-actions">
                                <button className="btn btn-decline" onClick={() => handleDecline(selectedRequest.id)}>
                                    Decline
                                </button>
                                <button className="btn btn-accept" onClick={() => handleAccept(selectedRequest.id)}>
                                    Accept
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="no-selection-message">
                            <h2>All requests have been processed.</h2>
                            <p>Please select a request from the list to view its details.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default RegistrationRequests;