import React, { useState } from 'react';
import { candidates } from './data/candidates';
import CandidateList from './components/CandidateList';
import CandidateDetail from './components/CandidateDetail';
import './App.css';

function App() {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [viewType, setViewType] = useState('resume');

  const handleCandidateSelect = (candidate) => {
    setSelectedCandidate(candidate);
    setViewType('resume');
  };

  const handleBackToList = () => {
    setSelectedCandidate(null);
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>📄 Resume & Cover Letter PDF Viewer</h1>
        {selectedCandidate && (
          <button className="back-button" onClick={handleBackToList}>
            ← Back to List
          </button>
        )}
      </header>

      <main className="app-main">
        {!selectedCandidate ? (
          <CandidateList 
            candidates={candidates} 
            onCandidateSelect={handleCandidateSelect} 
          />
        ) : (
          <CandidateDetail 
            candidate={selectedCandidate}
            viewType={viewType}
            onViewTypeChange={setViewType}
          />
        )}
      </main>
      
      <footer className="app-footer">
        <p>PDF Viewer • {candidates.length} Candidates</p>
      </footer>
    </div>
  );
}

export default App;
