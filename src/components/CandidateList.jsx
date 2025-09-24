import React from 'react';
import './CandidateList.css';

const CandidateList = ({ candidates, onCandidateSelect }) => {
  return (
    <div className="candidate-list">
      <h2>Select a Candidate ({candidates.length} total)</h2>
      <div className="candidates-grid">
        {candidates.map(candidate => (
          <div 
            key={candidate.id} 
            className="candidate-card"
            onClick={() => onCandidateSelect(candidate)}
          >
            <div className="candidate-headshot">
              <img 
                src={candidate.headshot} 
                alt={candidate.name}
                onError={(e) => {
                  e.target.src = '/images/placeholder-headshot.jpg';
                }}
              />
            </div>
            <h3 className="candidate-name">{candidate.name}</h3>
            <p className="view-documents">Click to view PDF documents</p>
            <div className="document-indicators">
              <span className="pdf-indicator">📄 Resume</span>
              <span className="pdf-indicator">📝 Cover Letter</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CandidateList;
