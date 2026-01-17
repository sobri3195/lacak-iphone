import React, { useEffect, useState } from 'react';
import './HackerEffect.css';

const HackerEffect = ({ text, speed = 50 }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let timeout;
    
    if (currentIndex < text.length) {
      timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);
    } else {
      setIsComplete(true);
    }

    return () => clearTimeout(timeout);
  }, [currentIndex, text, speed]);

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';

  const scrambledText = text.split('').map((char, index) => {
    if (index < currentIndex) return char;
    if (index === currentIndex) {
      return chars[Math.floor(Math.random() * chars.length)];
    }
    return '';
  }).join('');

  return (
    <span className={`hacker-text ${isComplete ? 'complete' : ''}`}>
      {displayText}
      {!isComplete && <span className="cursor">_</span>}
    </span>
  );
};

export default HackerEffect;
