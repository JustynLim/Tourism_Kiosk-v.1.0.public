import React from 'react';
import Minigame from '../PageComponents/Minigame/Minigame';
import FormHeader from './FormStyles/FormHeader';

const Minigamepage = () => {
  return (
    <div>
      <FormHeader/>
      <div style={{ backgroundColor: '#f5f5f5', padding: '20px', minHeight: '100vh' }}>
        <h1 style={{ textAlign: 'center', fontSize: '2em', marginBottom: '20px', color: '#333' }}>Penang Quiz Minigame</h1>
        <Minigame />
      </div>
    </div>
  );
};

export default Minigamepage;