import React from 'react';
import { Lock, Check, HelpCircle } from 'lucide-react';

export default function QuestionCard({ question, onSelectOption, selectedOption, disabled }) {
  const isLocked = !!selectedOption;

  return (
    <div className="decision-card">
      <div className="decision-card-header">
        <span className="decision-badge">{question.badge || 'Decision'}</span>
        <span className="decision-lock-status">
          {isLocked ? (
            <>
              <Lock size={12} color="#8E8E93" />
              <span>Choice Locked</span>
            </>
          ) : (
            <>
              <HelpCircle size={12} color="#007AFF" />
              <span>Select 1 option</span>
            </>
          )}
        </span>
      </div>

      <h3 className="decision-question">{question.question}</h3>

      <div className="options-grid">
        {question.options.map((option) => {
          const isSelected = selectedOption?.id === option.id;
          const isOtherLocked = isLocked && !isSelected;

          return (
            <button
              key={option.id}
              className={`option-button ${isSelected ? 'selected' : ''} ${isOtherLocked ? 'locked-out' : ''}`}
              onClick={() => !isLocked && onSelectOption(question, option)}
              disabled={isLocked || disabled}
              aria-label={option.text}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="option-letter">{option.letter}</span>
                <span>{option.text}</span>
              </div>
              {isSelected && <Check size={16} color="#007AFF" style={{ flexShrink: 0 }} />}
              {isOtherLocked && <Lock size={14} color="#AEAEB2" style={{ flexShrink: 0 }} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
