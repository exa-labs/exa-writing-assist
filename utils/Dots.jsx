import React, { useState, useEffect } from 'react';

const dotsStyle = {
  display: 'inline-block',
};

const keyframes = `
  @keyframes ellipsis {
    0% { content: ''; }
    25% { content: '.'; }
    50% { content: '..'; }
    75% { content: '...'; }
  }
`;

const Dots = ({ children }) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prevDots => {
        if (prevDots.length >= 3) return '';
        return prevDots + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Insert keyframes animation into the document
    const styleElement = document.createElement('style');
    styleElement.innerHTML = keyframes;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <span 
      style={{
        ...dotsStyle,
        '::after': {
          content: '""',
          animation: 'ellipsis 1.5s infinite',
        }
      }}
    >
      {children}{dots}
    </span>
  );
};

export default Dots;