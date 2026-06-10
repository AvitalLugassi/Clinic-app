import { useRef, useState } from 'react';
import './FileUploader.css';

export default function FileUploader({ accept, onFileSelect, label = 'גרור קובץ או לחץ לבחירה' }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleFile = (file) => {
    if (!file) return;
    setFileName(file.name);
    onFileSelect(file);
  };

  const onChange = (e) => handleFile(e.target.files[0]);
  const onDrop = (e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); };

  return (
    <div
      className={`upload-zone ${dragging ? 'upload-dragging' : ''}`}
      onClick={() => inputRef.current.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
    >
      <input ref={inputRef} type="file" accept={accept} onChange={onChange} hidden />
      <span className="upload-icon">📎</span>
      <span className="upload-text">{fileName || label}</span>
    </div>
  );
}
