import React from 'react';
import ReactMarkdown from 'react-markdown';

export function NoteCard({ note, isSelected, onSelect }) {
  const hasTags = note.tags && note.tags.length > 0;

  return (
    <div
      onClick={() => onSelect(note.id)}
      style={{
        backgroundColor: '#fff785',
        padding: '12px',
        borderRadius: '2px',
        boxShadow: isSelected ? '0 0 0 2px #4d90fe' : '2px 2px 5px rgba(0,0,0,0.2)',
        cursor: 'pointer',
        opacity: note.isArchived ? 0.5 : 1,
        transition: 'all 0.15s ease',
        height: '110px',            
        width: '350px',
        minWidth: 0,
        maxWidth: '100%',
        flexShrink: 0,              
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden'          
      }}
    >
      <div style={{ overflow: 'hidden' }}>
        <div 
          style={{ 
            fontWeight: 'bold', 
            textAlign: 'center', 
            fontSize: '13px', 
            marginBottom: '6px', 
            color: '#222',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {note.title}
        </div>

        <div
          style={{
            fontSize: '12px',
            color: '#444',
            height: '18px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',    
            wordBreak: 'break-all'   
          }}
        >
          <ReactMarkdown
            components={{
              p: ({ node, ...props }) => <span {...props} />,
              h1: ({ node, ...props }) => <span style={{ fontWeight: 'bold' }} {...props} />,
              h2: ({ node, ...props }) => <span style={{ fontWeight: 'bold' }} {...props} />,
              h3: ({ node, ...props }) => <span style={{ fontWeight: 'bold' }} {...props} />,
              ul: ({ node, ...props }) => <span {...props} />,
              ol: ({ node, ...props }) => <span {...props} />,
              li: ({ node, ...props }) => <span style={{ marginRight: '6px' }} {...props} />
            }}
          >
            {note.content}
          </ReactMarkdown>
        </div>
      </div>

      <div style={{ fontSize: '10px', color: '#666', marginTop: '6px', minHeight: '15px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {hasTags ? note.tags.map(t => `#${t}`).join(' ') : ''}
      </div>
    </div>
  );
}