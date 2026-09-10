import React, { useRef, useEffect } from 'react';

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

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [content]);

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
          minHeight: '280px',
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

          <textarea
            ref={textareaRef}
            value={content}
            disabled={isArchived}
            onChange={e => setContent(e.target.value)}
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