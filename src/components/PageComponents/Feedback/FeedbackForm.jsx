import React from 'react';
import QRCode from 'qrcode.react';
import FormHeader from '../../Pages/FormStyles/FormHeader';

export const FeedbackForm = () => {
  const url = 'https://forms.gle/MnwVZA5dAnbgSnWm9';

  return (
    <div>
      <FormHeader />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ border: '1px solid black', padding: '20px', width: 'fit-content', marginTop: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h1>Let us know what you think:</h1>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <p style={{ marginRight: '20px' }}>Scan the QR code to access the feedback form:</p>
            <QRCode value={url} />
          </div>
        </div>
      </div>
    </div>
  );
};