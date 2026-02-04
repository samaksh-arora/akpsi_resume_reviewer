import React, { useState } from 'react';
import './CandidateList.css';

const CandidateList = ({ candidates, onCandidateSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCandidates = candidates.filter(candidate =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="candidate-list">
      <h2>Select a Candidate ({candidates.length} total)</h2>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="🔍 Search candidates by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        {searchTerm && (
          <button 
            className="clear-search"
            onClick={() => setSearchTerm('')}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {filteredCandidates.length === 0 && searchTerm && (
        <div className="no-results">
          <p>No candidates found matching "{searchTerm}"</p>
        </div>
      )}

      <div className="candidates-grid">
        {filteredCandidates.map(candidate => (
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
            <p className="view-documents">View</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CandidateList;
