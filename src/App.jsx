import React from 'react';
import IPhoneFrame from './components/IPhoneFrame';
import PrivacyShield from './components/PrivacyShield';
import DirectBoard from './components/DirectBoard';
import SiaWidget from './components/SiaWidget';

export default function App() {
  return (
    <PrivacyShield>
      <IPhoneFrame>
        <DirectBoard />
        <SiaWidget />
      </IPhoneFrame>
    </PrivacyShield>
  );
}
