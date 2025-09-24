import React from 'react';
import PDFViewer from './PDFViewer';
import './CandidateDetail.css';

const CandidateDetail = ({ candidate, viewType, onViewTypeChange }) => {
  return (
    <div className="candidate-detail">
      <div className="candidate-header">
        <div className="candidate-info">
          <img 
            src={candidate.headshot} 
            alt={candidate.name}
            className="detail-headshot"
            onError={(e) => {
              e.target.src = '/images/placeholder-headshot.jpg';
            }}
          />
          <div className="candidate-basic-info">
            <h2>{candidate.name}</h2>
            <p className="contact-info">
              <span>📧 {candidate.contact.email}</span>
              <span>📞 {candidate.contact.phone}</span>
              <span>🔗 {candidate.contact.linkedin}</span>
            </p>
          </div>
        </div>
        
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
  );
};

export default CandidateDetail;
