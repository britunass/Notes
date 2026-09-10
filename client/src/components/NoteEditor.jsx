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

  useEffect(() => {
    if (isFocused && textareaRef.current) {
      const el = textareaRef.current;
      el.style.height = 'auto';
      el.style.height = `${Math.max(150, el.scrollHeight)}px`;
    }
  }, [content, isFocused]);

  useEffect(() => {
    if (isFocused && textareaRef.current) {
      const el = textareaRef.current;
      const length = el.value.length;
      el.setSelectionRange(length, length);
    }
  }, [isFocused]);

  const sharedTypographyStyle = {
    width: '100%',
    fontSize: '13px',
    lineHeight: '1.5',
    fontFamily: 'inherit',
    color: '#333',
    textAlign: 'left',
    padding: 0,
    margin: 0,
    boxSizing: 'border-box',
    minHeight: '150px'
  };

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
          justifyContent: 'space-between',
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
              onChange={e => setContent(e.target.value)}
              onBlur={() => setIsFocused(false)}
              placeholder="Текст заметки..."
              style={{
                ...sharedTypographyStyle,
                border: 'none',
                background: 'transparent',
                outline: 'none',
                resize: 'none',
                overflow: 'hidden'
              }}
            />
          ) : (
            <div
              onClick={() => !isArchived && setIsFocused(true)}
              style={{
                ...sharedTypographyStyle,
                cursor: isArchived ? 'default' : 'pointer',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}
            >
              {content ? (
                <ReactMarkdown>
                  {content}
                </ReactMarkdown>
              ) : (
                <span style={{ color: '#888', fontStyle: 'normal' }}>
                  Текст заметки...
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
            marginTop: '15px',
            color: '#555'
          }}
        />
      </div>
    </div>
  );
}