import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, ShieldCheck, HeartHandshake } from 'lucide-react';
import { getFinalMessage } from '../data/questionFlow';

export default function FinalMessage({ answers }) {
  const finalData = getFinalMessage(answers);

  useEffect(() => {
    // Trigger soft celebratory/relief confetti
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#007AFF', '#5856D6', '#34C759', '#E0E7FF']
      });
    } catch (e) {
      // ignore if not supported
    }
  }, []);

  return (
    <div className="final-card">
      <div className="final-card-icon">
        <HeartHandshake size={28} />
      </div>

      <h2 className="final-card-title">{finalData.title}</h2>

      <div className="final-card-body">
        <p>{finalData.body}</p>
      </div>

      <div className="final-card-footer">
        <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
          <ShieldCheck size={14} color="#34C759" />
          <span>{finalData.footer}</span>
        </p>
      </div>
    </div>
  );
}
