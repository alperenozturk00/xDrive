import React from 'react';

const XDriveLogo: React.FC<{ className?: string }> = ({ className = "w-40 h-auto" }) => (
  <svg 
    className={className} 
    viewBox="0 0 324 175" 
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="xDrive Logo"
    role="img"
  >
    <path 
      d="M324 0H0V91.6361C37.5 -5.86392 90.5 45.1361 119.5 56.1361C148.5 67.1361 179 31.6361 213 56.1361C247 80.6361 278.5 48.6361 324 64.6361V0Z" 
      fill="#141414"
    />
    <g fill="#E50914">
      <path d="M72.1622 173.5C-13.8378 122 10.1622 24.5 10.1622 24.5H45.1622L30.1622 65.5C87.1622 88 131.662 118.5 204.662 112.5C264.162 107.5 291.662 72.5 291.662 72.5L309.662 50L299.162 96.5L323.162 101L289.662 113L307.162 143.5L278.662 114.5C243.662 147 186.162 170 72.1622 173.5Z"/>
      <path d="M42.6621 140L3.66211 174.5H23.6621L52.6621 140H42.6621Z"/>
      <path d="M26.6621 110H56.1621V127L26.6621 110Z"/>
    </g>
  </svg>
);

export default XDriveLogo;
