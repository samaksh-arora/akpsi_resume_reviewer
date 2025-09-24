import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import './PDFViewer.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const PDFViewer = ({ pdfUrl, title, candidateName }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setLoading(false);
    setError(false);
  }

  function onDocumentLoadError(error) {
    console.error('PDF Error:', error);
    setLoading(false);
    setError(true);
  }

  const goToPrevPage = () => setPageNumber(prev => Math.max(1, prev - 1));
  const goToNextPage = () => setPageNumber(prev => Math.min(numPages, prev + 1));

  if (error) {
    return (
      <div className="pdf-error">
        <div className="error-content">
          <h3>📄 {title} - {candidateName}</h3>
          <p>❌ PDF failed to load in viewer, but direct link works:</p>
          <a href={pdfUrl} target="_blank" rel="noopener noreferrer" 
             style={{display: 'inline-block', padding: '10px 20px', background: '#10b981', color: 'white', textDecoration: 'none', borderRadius: '5px', margin: '10px 0'}}>
            📥 View PDF in New Tab
          </a>
          <p><small>PDF Path: {pdfUrl}</small></p>
        </div>
      </div>
    );
  }

  return (
    <div className="pdf-viewer">
      <div className="pdf-header">
        <h3>📄 {title} - {candidateName}</h3>
        <div className="pdf-controls">
          <button onClick={goToPrevPage} disabled={pageNumber <= 1} className="nav-button">
            ← Previous
          </button>
          <span className="page-info">Page {pageNumber} of {numPages || '?'}</span>
          <button onClick={goToNextPage} disabled={pageNumber >= numPages} className="nav-button">
            Next →
          </button>
        </div>
        <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="download-button">
          📥 Open in New Tab
        </a>
      </div>

      {loading && (
        <div className="pdf-loading">
          <div className="loading-spinner"></div>
          <p>Loading PDF...</p>
        </div>
      )}

      <div className="pdf-document">
        <Document
          file={{
            url: pdfUrl,
            httpHeaders: {},
            withCredentials: false
          }}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading=""
          options={{
            cMapUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/cmaps/',
            cMapPacked: true,
            standardFontDataUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/standard_fonts/',
          }}
        >
          <Page 
            pageNumber={pageNumber} 
            width={Math.min(800, window.innerWidth - 100)}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </Document>
      </div>
    </div>
  );
};

export default PDFViewer;
