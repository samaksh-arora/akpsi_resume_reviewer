import React from 'react';
import PDFViewer from './PDFViewer';
import './CandidateDetail.css';

const CandidateDetail = ({ candidate, viewType, onViewTypeChange }) => {
  return (
    <div className="candidate-detail">
      <div className="detail-layout">
        <div className="left-section">
          <img 
            src={candidate.headshot} 
            alt={candidate.name}
            className="detail-headshot"
            onError={(e) => {
              e.target.src = '/images/placeholder-headshot.jpg';
            }}
          />
          <h2 className="candidate-name">{candidate.name}</h2>
        </div>

        <div className="right-section">
          <div className="header-controls">
            <div className="view-toggle">
              <button 
                className={viewType === 'resume' ? 'active' : ''}
                onClick={() => onViewTypeChange('resume')}
              >
                Resume
              </button>
              <button 
                className={viewType === 'coverLetter' ? 'active' : ''}
                onClick={() => onViewTypeChange('coverLetter')}
              >
                Cover Letter
              </button>
            </div>
            
            <a 
              href="https://admin.sli.do/event/7SeF3fRtZGDjwtH9rVUVR8/polls"
              target="_blank"
              rel="noopener noreferrer"
              className="vote-button"
            >
              🗳️ Vote
            </a>
          </div>

          <div className="document-content">
            {viewType === 'resume' ? (
              <PDFViewer 
                pdfUrl={candidate.resumePdf}
                title="Resume"
                candidateName={candidate.name}
              />
            ) : (
              <PDFViewer 
                pdfUrl={candidate.coverLetterPdf}
                title="Cover Letter"
                candidateName={candidate.name}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDetail;
