import React, { useState, useEffect, useRef } from 'react';
import { QUESTION_FLOW, getFinalMessage } from '../data/questionFlow';
import { Check, Lock, Sparkles, Shield, ArrowRight, HelpCircle, HeartHandshake, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'upasana_direct_board_v1';

export default function DirectBoard() {
  const [selectedAnswers, setSelectedAnswers] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved).selectedAnswers || {};
      } catch (e) {
        return {};
      }
    }
    return {};
  });

  const [currentStepIndex, setCurrentStepIndex] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved).currentStepIndex || 0;
      } catch (e) {
        return 0;
      }
    }
    return 0;
  });

  const [isCompleted, setIsCompleted] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved).isCompleted || false;
      } catch (e) {
        return false;
      }
    }
    return false;
  });

  const boardEndRef = useRef(null);

  // Sync to local storage for permanent lock-in
  useEffect(() => {
    const data = {
      selectedAnswers,
      currentStepIndex,
      isCompleted,
      deviceToken: getDeviceToken(),
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [selectedAnswers, currentStepIndex, isCompleted]);

  // Scroll smoothly when new question or conclusion appears
  useEffect(() => {
    boardEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentStepIndex, isCompleted]);

  // Helper for unique anonymous device token
  function getDeviceToken() {
    let token = localStorage.getItem('upasana_device_token');
    if (!token) {
      token = 'DEV_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now();
      localStorage.setItem('upasana_device_token', token);
    }
    return token;
  }

  const handleSelectOption = async (question, option) => {
    if (selectedAnswers[question.id] || isCompleted) return;

    const updatedAnswers = {
      ...selectedAnswers,
      [question.id]: {
        questionId: question.id,
        questionText: question.question,
        optionId: option.id,
        optionLetter: option.letter,
        optionText: option.text,
        category: option.category,
        siaResponse: option.siaResponse,
        timestamp: new Date().toISOString()
      }
    };

    setSelectedAnswers(updatedAnswers);

    // Send response immediately to backend logger (ready for Excel/Google Sheets sync)
    try {
      fetch('/api/submit-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceToken: getDeviceToken(),
          stepIndex: currentStepIndex + 1,
          questionId: question.id,
          questionText: question.question,
          selectedOption: option.letter + ': ' + option.text,
          category: option.category,
          timestamp: new Date().toISOString()
        })
      }).catch((e) => console.warn('Sync notice:', e));
    } catch (e) {
      // ignore network log errors
    }

    // Advance step or complete
    if (currentStepIndex + 1 < QUESTION_FLOW.length) {
      setTimeout(() => {
        setCurrentStepIndex(currentStepIndex + 1);
      }, 400);
    } else {
      setTimeout(() => {
        setIsCompleted(true);
        try {
          confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (err) {}
      }, 700);
    }
  };

  const finalOutcome = getFinalMessage(selectedAnswers);
  const totalQuestions = QUESTION_FLOW.length;
  const answeredCount = Object.keys(selectedAnswers).length;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  return (
    <div className="direct-board-container">
      {/* Board Header Card */}
      <div className="board-intro-card">
        <div className="board-badge-row">
          <span className="board-pill-tag">
            <Sparkles size={12} color="#007AFF" />
            <span>Honest Reflection</span>
          </span>
          <span className="board-security-tag">
            <Shield size={12} color="#34C759" />
            <span>One-Time Session</span>
          </span>
        </div>

        <h1 className="board-main-title">Direct Perspective Board</h1>
        <p className="board-main-subtitle">
          Please go through each question honestly. Once you make a choice, your response is locked in and cannot be undone.
        </p>

        {/* Progress Bar */}
        <div className="board-progress-section">
          <div className="progress-labels">
            <span>Progress</span>
            <span>{answeredCount} of {totalQuestions} Completed</span>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question Steps */}
      <div className="board-steps-list">
        {QUESTION_FLOW.slice(0, currentStepIndex + 1).map((q, idx) => {
          const selected = selectedAnswers[q.id];
          const isAnswered = !!selected;
          const isCurrent = idx === currentStepIndex;

          return (
            <div
              key={q.id}
              className={`board-question-card ${isAnswered ? 'answered' : ''} ${isCurrent && !isCompleted ? 'active-step' : ''}`}
            >
              <div className="board-card-top">
                <span className="board-step-badge">{q.badge}</span>
                <span className="board-lock-status">
                  {isAnswered ? (
                    <>
                      <Lock size={12} color="#8E8E93" />
                      <span>Choice Locked</span>
                    </>
                  ) : (
                    <>
                      <HelpCircle size={12} color="#007AFF" />
                      <span>Choose 1 response</span>
                    </>
                  )}
                </span>
              </div>

              <h2 className="board-card-question">{q.question}</h2>

              {/* Options Grid */}
              <div className="board-options-grid">
                {q.options.map((opt) => {
                  const isThisSelected = selected?.optionId === opt.id;
                  const isLockedOut = isAnswered && !isThisSelected;

                  return (
                    <button
                      key={opt.id}
                      className={`board-option-btn ${isThisSelected ? 'selected' : ''} ${isLockedOut ? 'locked-out' : ''}`}
                      onClick={() => handleSelectOption(q, opt)}
                      disabled={isAnswered}
                    >
                      <div className="option-btn-left">
                        <span className="option-badge-letter">{opt.letter}</span>
                        <span className="option-btn-text">{opt.text}</span>
                      </div>
                      {isThisSelected && (
                        <div className="option-selected-check">
                          <Check size={16} strokeWidth={2.5} />
                        </div>
                      )}
                      {isLockedOut && (
                        <div className="option-locked-icon">
                          <Lock size={14} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Grounded Perspective Note (revealed only after selection) */}
              {isAnswered && (
                <div className="perspective-reveal-card">
                  <div className="perspective-header">
                    <Sparkles size={14} color="#007AFF" />
                    <span>Reflection & Context:</span>
                  </div>
                  <p className="perspective-body">{selected.siaResponse}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Final Outcome Card */}
      {isCompleted && (
        <div className="final-board-summary-card">
          <div className="final-summary-icon-wrap">
            <HeartHandshake size={32} color="#007AFF" />
          </div>
          <h2 className="final-summary-heading">{finalOutcome.title}</h2>
          <div className="final-summary-text-box">
            <p>{finalOutcome.body}</p>
          </div>
          <div className="final-summary-footer-note">
            <Shield size={14} color="#34C759" />
            <span>{finalOutcome.footer}</span>
          </div>
        </div>
      )}

      <div ref={boardEndRef} style={{ height: '70px' }} />
    </div>
  );
}
