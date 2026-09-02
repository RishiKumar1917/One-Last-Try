import React, { useState, useEffect, useRef } from 'react';
import { INITIAL_GREETING, QUESTION_FLOW } from '../data/questionFlow';
import QuestionCard from './QuestionCard';
import FinalMessage from './FinalMessage';

const STORAGE_KEY = 'sia_upasana_session_v1';

export default function ChatInterface({ setIsTypingParent }) {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.messages || [INITIAL_GREETING];
      } catch (e) {
        return [INITIAL_GREETING];
      }
    }
    return [INITIAL_GREETING];
  });

  const [currentStepIndex, setCurrentStepIndex] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.currentStepIndex || 0;
      } catch (e) {
        return 0;
      }
    }
    return 0;
  });

  const [selectedAnswers, setSelectedAnswers] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.selectedAnswers || {};
      } catch (e) {
        return {};
      }
    }
    return {};
  });

  const [isTyping, setIsTyping] = useState(false);
  const [isFinished, setIsFinished] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.isFinished || false;
      } catch (e) {
        return false;
      }
    }
    return false;
  });

  const scrollBottomRef = useRef(null);

  // Sync state to localStorage to guarantee one-way lock persistence
  useEffect(() => {
    const stateToSave = {
      messages,
      currentStepIndex,
      selectedAnswers,
      isFinished
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  }, [messages, currentStepIndex, selectedAnswers, isFinished]);

  useEffect(() => {
    setIsTypingParent(isTyping);
  }, [isTyping, setIsTypingParent]);

  useEffect(() => {
    scrollBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, currentStepIndex, isFinished]);

  const handleSelectOption = (question, option) => {
    if (selectedAnswers[question.id]) return; // Already locked

    // 1. Lock selection immediately
    const updatedAnswers = {
      ...selectedAnswers,
      [question.id]: option
    };
    setSelectedAnswers(updatedAnswers);

    // 2. Add Upasana's choice as a user message bubble
    const userMsg = {
      id: `user_${question.id}`,
      sender: 'user',
      text: option.text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);

    // 3. Show Sia typing and then reply with grounded insight
    setIsTyping(true);

    setTimeout(() => {
      const siaMsg = {
        id: `sia_reply_${question.id}`,
        sender: 'sia',
        text: option.siaResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, siaMsg]);
      setIsTyping(false);

      // Move to next step or finish
      if (currentStepIndex + 1 < QUESTION_FLOW.length) {
        setCurrentStepIndex(currentStepIndex + 1);
      } else {
        setTimeout(() => {
          setIsFinished(true);
        }, 1200);
      }
    }, 1400);
  };

  return (
    <div className="app-content">
      {/* Message history */}
      {messages.map((msg) => (
        <div key={msg.id} className={`message-row ${msg.sender}`}>
          <div className={`bubble ${msg.sender}`}>
            {msg.text}
          </div>
          <span className="bubble-timestamp">{msg.timestamp}</span>
        </div>
      ))}

      {/* Typing Indicator */}
      {isTyping && (
        <div className="message-row sia">
          <div className="typing-bubble">
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
          </div>
        </div>
      )}

      {/* Active Question Cards up to currentStepIndex */}
      {!isFinished && QUESTION_FLOW.slice(0, currentStepIndex + 1).map((q, idx) => {
        const isAnswered = !!selectedAnswers[q.id];
        // Only show if it's answered or it is the current active question
        if (idx < currentStepIndex && isAnswered) {
          return null; // Keep completed questions tidy in chat or show summary
        }

        return (
          <QuestionCard
            key={q.id}
            question={q}
            onSelectOption={handleSelectOption}
            selectedOption={selectedAnswers[q.id]}
            disabled={isTyping || (idx !== currentStepIndex)}
          />
        );
      })}

      {/* Final Outcome Screen */}
      {isFinished && <FinalMessage answers={selectedAnswers} />}

      <div ref={scrollBottomRef} style={{ height: '8px' }} />
    </div>
  );
}
