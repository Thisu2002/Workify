import React from 'react';
import '../../styles/ManagerFeedback.css';

// Sample feedback data with real profile picture URLs
const feedbackData = [
  {
    id: 1,
    source: 'Company Recruiter',
    name: 'Jane Doe',
    company: 'Tech Solutions Inc.',
    feedback: 'The platform is incredibly intuitive and has significantly streamlined our hiring process. We\'ve found some exceptional candidates here.',
    profilePic: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1888&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Professional woman
  },
  {
    id: 2,
    source: 'Job Candidate',
    name: 'John Smith',
    feedback: 'A fantastic resource for job seekers. The application process was straightforward, and the career guidance from mentors was invaluable.',
    profilePic: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Young professional man
  },
  {
    id: 3,
    source: 'Mentor',
    name: 'Alex Johnson',
    feedback: 'I\'m proud to be a mentor on this platform. It\'s rewarding to guide aspiring professionals and see them succeed in their careers.',
    profilePic: 'https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Experienced, friendly man
  },
  {
    id: 4,
    source: 'Company Recruiter',
    name: 'Samuel Green',
    company: 'Innovatech',
    feedback: 'We appreciate the quality of candidates and the ease of connecting with them. The portal has become an essential part of our recruitment strategy.',
    profilePic: 'https://images.unsplash.com/photo-1599244032981-b371c1b21235?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Professional man in office
  },
];

const ManagerFeedback = () => {
  return (
    <div className="feedback-list-container">
      <h1 className="feedback-list-title">Community Feedback</h1>
      <div className="feedback-list-vertical">
        {feedbackData.map((item) => (
          <div key={item.id} className="feedback-item">
            <div className="feedback-item-header">
              <div className="feedback-pfp-wrapper">
                <img src={item.profilePic} alt={`Profile of ${item.name}`} className="feedback-pfp" />
              </div>
              <div className="feedback-author-info">
                <p className="author-name">{item.name}</p>
                <p className="author-role">
                  {item.source}
                  {item.company && <span className="author-company"> at {item.company}</span>}
                </p>
              </div>
            </div>
            <p className="feedback-text-body">"{item.feedback}"</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManagerFeedback;