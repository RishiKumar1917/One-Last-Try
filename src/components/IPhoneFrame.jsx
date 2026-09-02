import React from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';

export default function IPhoneFrame({ children }) {
  return (
    <div className="app-shell-stage">
      <div className="app-shell-container">
        {/* iOS-Style Web Header */}
        <header className="app-header">
          <div className="header-profile">
            <div className="avatar-wrapper">
              <span style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF' }}>S</span>
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

        {/* Main Content Area */}
        <main className="app-main-viewport">
          {children}
        </main>
      </div>
    </div>
  );
}
