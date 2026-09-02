import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Sparkles, ShieldCheck } from 'lucide-react';

export default function IPhoneFrame({ children, isTyping }) {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="device-stage">
      <div className="iphone-frame">
        {/* iOS Dynamic Island */}
        <div className="dynamic-island-container">
          <div className={`dynamic-island ${isTyping ? 'active' : ''}`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={13} color="#007AFF" />
              <span style={{ fontSize: '11px', fontWeight: 600 }}>Sia</span>
            </div>
            {isTyping && (
              <span style={{ fontSize: '10px', color: '#8E8E93', animation: 'fadeIn 0.2s' }}>
                Typing...
              </span>
            )}
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34C759' }}></div>
          </div>
        </div>

        {/* iOS Status Bar */}
        <div className="ios-status-bar">
          <span>{currentTime || '19:45'}</span>
          <div className="status-icons">
            <span style={{ fontSize: '11px', fontWeight: 700, marginRight: '2px' }}>5G</span>
            <Wifi size={14} strokeWidth={2.5} />
            <Battery size={16} strokeWidth={2.5} />
          </div>
        </div>

        {/* Header */}
        <header className="app-header">
          <div className="header-profile">
            <div className="avatar-wrapper">
              <span style={{ fontSize: '17px', fontWeight: 700, color: '#4F46E5' }}>S</span>
              <div className="online-dot" />
            </div>
            <div className="header-info">
              <h2>
                Sia
                <span className="verified-badge" title="Verified Assistant">
                  <Sparkles size={13} />
                </span>
              </h2>
              <p>For Upasana • Confidential</p>
            </div>
          </div>

          <div className="security-pill">
            <ShieldCheck size={13} />
            <span>Encrypted</span>
          </div>
        </header>

        {/* App Content */}
        {children}

        {/* iOS Home Indicator */}
        <div className="ios-home-indicator-container">
          <div className="ios-home-indicator"></div>
        </div>
      </div>
    </div>
  );
}
