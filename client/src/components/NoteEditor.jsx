import React, { useRef, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

export function NoteEditor({
  title,
  setTitle,
  content,
  setContent,
  tags,
  setTags,
  isArchived
}) {
  const textareaRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [content, isFocused]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div
        style={{
          backgroundColor: '#fff785',
          padding: '20px',
          borderRadius: '2px',
          boxShadow: '4px 4px 12px rgba(0,0,0,0.2)',
          minWidth: '280px',
          maxWidth: '320px',
          width: '300px',
          height: 'auto',
          display: 'flex',
          flexDirection: 'column',
          justify: 'space-between',
          boxSizing: 'border-box',
          opacity: isArchived ? 0.65 : 1
        }}
      >
        <div>
          <input
            type="text"
            value={title}
            disabled={isArchived}
            onChange={e => setTitle(e.target.value)}
            placeholder="Заголовок..."
            style={{
              width: '100%',
              border: 'none',
              background: 'transparent',
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: '16px',
              outline: 'none',
              marginBottom: '15px',
              color: '#222'
            }}
          />

          {isFocused && !isArchived ? (
            <textarea
              ref={textareaRef}
              value={content}
              autoFocus
              disabled={isArchived}
              onChange={e => setContent(e.target.value)}
              onBlur={() => setIsFocused(false)}
              placeholder={isArchived ? 'Заметка в архиве' : 'Текст заметки...'}
              rows={8}
              style={{
                width: '100%',
                border: 'none',
                background: 'transparent',
                fontSize: '13px',
                outline: 'none',
                resize: 'none',
                overflow: 'hidden',
                fontFamily: 'inherit',
                color: '#333'
              }}
            />
          ) : (
            <div
              onClick={() => !isArchived && setIsFocused(true)}
              className="markdown-content"
              style={{
                width: '100%',
                fontSize: '13px',
                color: '#333',
                lineHeight: '1.4',
                cursor: isArchived ? 'default' : 'pointer',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                minHeight: '130px'
              }}
            >
              {content ? (
                <ReactMarkdown>{content}</ReactMarkdown>
              ) : (
                <span style={{ color: '#888', fontStyle: 'italic' }}>
                  {isArchived ? 'Заметка в архиве' : 'Текст заметки...'}
                </span>
              )}
            </div>
          )}
        </div>

        <input
          type="text"
          value={tags}
          disabled={isArchived}
          onChange={e => setTags(e.target.value)}
          placeholder="теги через запятую"
          style={{
            width: '100%',
            border: 'none',
            borderTop: '1px dashed #dcd356',
            background: 'transparent',
            fontSize: '11px',
            outline: 'none',
            paddingTop: '8px',
            color: '#555'
          }}
        />
      </div>
    </div>
  );
}