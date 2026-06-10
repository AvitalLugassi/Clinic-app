import { useRef, useState } from 'react';
import './AudioPlayer.css';

export default function AudioPlayer({ src, label }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const toggle = () => {
    if (playing) { audioRef.current.pause(); }
    else { audioRef.current.play(); }
    setPlaying(!playing);
  };

  const onTimeUpdate = () => {
    const { currentTime, duration } = audioRef.current;
    setProgress((currentTime / duration) * 100 || 0);
  };

  const onEnded = () => setPlaying(false);

  const seek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = ratio * audioRef.current.duration;
  };

  return (
    <div className="audio-player">
      {label && <span className="audio-label">{label}</span>}
      <audio ref={audioRef} src={src} onTimeUpdate={onTimeUpdate} onEnded={onEnded} />
      <button className="audio-play-btn" onClick={toggle}>
        {playing ? '⏸' : '▶'}
      </button>
      <div className="audio-track" onClick={seek}>
        <div className="audio-fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
