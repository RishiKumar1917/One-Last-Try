import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, ShieldCheck } from 'lucide-react';

export default function SiaWidget({ activeContext }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      id: 'welcome',
      sender: 'sia',
      text: "Hi Upasana! I'm Sia, your virtual assistant. If you have any questions or need help understanding any part of this reflection, feel free to ask me.",
      time: 'Just now'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isOpen, isTyping]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isTyping) return;

    const userText = inputMessage.trim();
    setInputMessage('');

    const userMsg = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: chatMessages
        })
      });

      if (res.ok) {
        const data = await res.json();
        const siaMsg = {
          id: `sia_${Date.now()}`,
          sender: 'sia',
          text: data.response,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChatMessages((prev) => [...prev, siaMsg]);
      } else {
        throw new Error('Network error');
      }
    } catch (err) {
      // Grounded fallback response
      setTimeout(() => {
        const fallbackMsg = {
          id: `sia_${Date.now()}`,
          sender: 'sia',
          text: "I'm here to help bring clarity and peace. Take your time answering the questions on the board—your choices help shape an honest understanding.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChatMessages((prev) => [...prev, fallbackMsg]);
      }, 800);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Bottom Right Button */}
      <div className="sia-floating-container">
        <button
          className="sia-fab-button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open Sia Assistant"
        >
          {isOpen ? <X size={20} /> : <MessageCircle size={22} />}
          <span className="sia-fab-badge">Sia</span>
        </button>
      </div>

      {/* Floating Chat Sheet / Popover */}
      {isOpen && (
        <div className="sia-popover-sheet">
          <div className="sia-sheet-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className="sia-mini-avatar">
                <Sparkles size={14} color="#007AFF" />
              </div>
              <div>
                <h4 style={{ fontSize: '13.5px', fontWeight: 700, color: '#1C1C1E', margin: 0 }}>
                  Sia Assistant
                </h4>
                <p style={{ fontSize: '10.5px', color: '#8E8E93', margin: 0 }}>
                  Virtual Assistant • Confidential
                </p>
              </div>
            </div>
            <button className="sia-close-btn" onClick={() => setIsOpen(false)}>
              <X size={16} />
            </button>
          </div>

          <div className="sia-sheet-body">
            {chatMessages.map((msg) => (
              <div key={msg.id} className={`sia-widget-msg ${msg.sender}`}>
                <div className="sia-widget-bubble">{msg.text}</div>
                <span className="sia-widget-time">{msg.time}</span>
              </div>
            ))}

            {isTyping && (
              <div className="sia-widget-msg sia">
                <div className="typing-bubble" style={{ padding: '8px 12px' }}>
                  <div className="typing-dot" style={{ width: '5px', height: '5px' }}></div>
                  <div className="typing-dot" style={{ width: '5px', height: '5px' }}></div>
                  <div className="typing-dot" style={{ width: '5px', height: '5px' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="sia-sheet-footer" onSubmit={handleSendMessage}>
            <input
              type="text"
              placeholder="Ask Sia a question..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="sia-input-field"
            />
            <button
              type="submit"
              className="sia-send-btn"
              disabled={!inputMessage.trim() || isTyping}
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
