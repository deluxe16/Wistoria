import React from 'react';

export default function AnnouncementBar({ text }) {
  return (
    <div className="announcement-bar">
      <div className="announcement-text">
        {text || "Free shipping for orders over $300"}
      </div>
    </div>
  );
}
