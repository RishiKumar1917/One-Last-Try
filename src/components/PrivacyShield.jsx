import React, { useState, useEffect } from 'react';
import { ShieldAlert, EyeOff, Lock } from 'lucide-react';

export default function PrivacyShield({ children }) {
  const [isPrivacyActive, setIsPrivacyActive] = useState(false);

  useEffect(() => {
    // 1. Trigger shield on window blur or tab switch
    const handleBlur = () => {
      setIsPrivacyActive(true);
    };

    const handleFocus = () => {
      setIsPrivacyActive(false);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsPrivacyActive(true);
      } else {
        setIsPrivacyActive(false);
      }
    };

    // 2. Deter screenshot shortcuts (PrintScreen, Ctrl+S, Ctrl+P)
    const handleKeyDown = (e) => {
      if (
        e.key === 'PrintScreen' ||
        (e.ctrlKey && (e.key === 'p' || e.key === 's' || e.key === 'u')) ||
        (e.metaKey && (e.key === 'p' || e.key === 's'))
      ) {
        e.preventDefault();
        setIsPrivacyActive(true);
        setTimeout(() => setIsPrivacyActive(false), 2500);
      }
    };

    // 3. Prevent context menu / right click
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {isPrivacyActive && (
        <div className="privacy-shield-overlay" onClick={() => setIsPrivacyActive(false)}>
          <div className="privacy-shield-icon">
            <Lock size={28} />
          </div>
          <h3 className="privacy-shield-title">Private Session</h3>
          <p className="privacy-shield-desc">
            Content is shielded for confidentiality and protection. Tap anywhere to resume.
          </p>
        </div>
      )}
      {children}
    </div>
  );
}
